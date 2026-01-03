'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatedTicket, KnowlaryLogo } from '@/components/ui/ticket-confirmation-card';
import { verifyCertificate, ExtendedCertificate } from '@/services/data';
import { VerificationStatus } from '@/types';
import * as htmlToImage from 'html-to-image';

// --- Icons ---

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
);

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [certificate, setCertificate] = useState<ExtendedCertificate | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const getCanonicalUrl = (id?: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (!id && !certificate) return origin;
    const certId = id || certificate?.id;
    return `${origin}/certificate/${encodeURIComponent(certId || '')}`;
  };

  const safePushState = (id?: string) => {
    try {
      if (typeof window === 'undefined' || window.location.protocol.startsWith('blob')) return;
      const url = new URL(window.location.origin);
      url.pathname = id ? `/certificate/${id}` : '/';
      window.history.pushState(null, '', url.toString());
    } catch (e) {
      console.warn('URL History update skipped:', e);
    }
  };

  useEffect(() => {
    const initializeFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const idFromQuery = params.get('id');

        if (idFromQuery) {
          const decodedId = decodeURIComponent(idFromQuery);
          setInputValue(decodedId);
          triggerVerification(decodedId);
        }
      } catch (e) {
        console.error('URL Initialization Error:', e);
      }
    };

    initializeFromUrl();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerVerification = async (id: string) => {
    if (!id.trim()) return;
    setStatus('loading');
    setCertificate(null);
    try {
      const result = await verifyCertificate(id);
      if (result) {
        setCertificate(result);
        setStatus('success');
        safePushState(id);
      } else {
        setStatus('not_found');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setStatus('not_found');
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    triggerVerification(inputValue);
  };

  const handleDownload = async () => {
    const element = document.getElementById('certificate-body');
    if (!element || !certificate) return;

    setIsExporting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const options = {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 4,
      };
      const dataUrl = await htmlToImage.toPng(element, options);
      const link = document.createElement('a');
      link.download = 'Knowlary-Accredited-' + certificate.studentName.replace(/\s+/g, '-') + '.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    const url = getCanonicalUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      setShowShareMenu(false);
    });
  };

  const handleShare = (platform: 'linkedin' | 'x' | 'whatsapp' | 'email') => {
    if (!certificate) return;
    const url = encodeURIComponent(getCanonicalUrl());
    const shareText = 'I am proud to share that I have completed the ' + certificate.courseName + ' program at Knowlary! View my verified credential here:';
    const text = encodeURIComponent(shareText);

    let shareUrl = '';
    switch (platform) {
      case 'linkedin':
        shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url + '&summary=' + text;
        break;
      case 'x':
        shareUrl = 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url;
        break;
      case 'whatsapp':
        shareUrl = 'https://wa.me/?text=' + text + '%20' + url;
        break;
      case 'email':
        shareUrl = 'mailto:?subject=' + encodeURIComponent('Verified Credential - ' + certificate.studentName) + '&body=' + text + '%20' + url;
        break;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const reset = () => {
    setStatus('idle');
    setCertificate(null);
    setInputValue('');
    safePushState();
  };

  const isIdleView = status === 'idle' || status === 'loading' || status === 'not_found';

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col selection:bg-brand selection:text-white overflow-x-hidden text-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-slate-200/50 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center group cursor-pointer" onClick={reset}>
            <KnowlaryLogo layout="horizontal" className="transition-transform group-hover:scale-[1.01]" />
          </div>
          <div className="hidden md:flex items-center space-x-10">
            <a href="https://knowlary.com" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand transition-colors">Knowlary Home</a>
            <div className="h-4 w-px bg-slate-200" />
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">Institutional Registry</a>
          </div>
        </div>
      </nav>

      {copySuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl animate-slide-up flex items-center space-x-3">
          <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
          <span>Credential Link Copied</span>
        </div>
      )}

      <main className="flex-1 pt-40 pb-20 px-6 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto text-center flex flex-col items-center">
          {isIdleView ? (
            <div className="animate-slide-up max-w-3xl mx-auto w-full">
              <div className="inline-flex items-center px-4 py-1.5 bg-brand/5 rounded-full text-brand text-[10px] font-black uppercase tracking-[0.25em] mb-8 border border-brand/10 shadow-sm">
                Accredited Students Registry
              </div>
              <h1 className="text-6xl md:text-8xl font-serif text-slate-900 leading-[0.95] mb-8 tracking-tighter">
                Verify, <br /> <span className="text-brand italic">Certificate</span>.
              </h1>
              <p className="text-lg text-slate-500 mb-14 max-w-xl mx-auto leading-relaxed font-serif italic opacity-80">
                The official verification portal for <span className="text-slate-900 font-semibold not-italic">accredited students of Knowlary</span>. Enter a Credential ID to validate academic excellence.
              </p>

              <form onSubmit={handleVerify} className="max-w-xl mx-auto relative group w-full transition-all duration-500">
                <div className="relative flex items-center">
                  <div className="absolute left-7 text-slate-300 group-focus-within:text-brand transition-colors duration-300">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Credential ID (e.g. KNL-GRAD-2025)"
                    className="w-full pl-16 pr-40 py-6 rounded-full border border-slate-200 focus:border-brand focus:ring-[12px] focus:ring-brand/5 transition-all outline-none bg-white text-lg shadow-[0_8px_30px_rgba(0,0,0,0.04)] placeholder:text-slate-300"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="absolute right-2.5 top-2.5 bottom-2.5 bg-brand text-white px-10 rounded-full font-black uppercase tracking-[0.15em] text-[10px] hover:bg-brand-600 transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px] active:scale-95"
                  >
                    {status === 'loading' ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : 'Validate'}
                  </button>
                </div>
                {status === 'not_found' && (
                  <p className="text-red-500 mt-8 text-[11px] font-black uppercase tracking-widest animate-fade-in flex items-center justify-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    <span>No record found in the Knowlary Registry.</span>
                  </p>
                )}
              </form>
            </div>
          ) : (
            <div className="w-full animate-slide-up max-w-md mx-auto">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-6 text-left">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <ShieldCheckIcon />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-black">Status</p>
                      <p className="text-sm font-semibold text-emerald-600">Verified</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">{certificate?.id}</span>
                </div>

                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 whitespace-nowrap">Student</span>
                    <span className="font-semibold text-slate-900 text-right break-words">{certificate?.studentName}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 whitespace-nowrap">Program</span>
                    <span className="font-semibold text-slate-900 text-right break-words">{certificate?.courseName}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 whitespace-nowrap">Awarded</span>
                    <span className="font-semibold text-slate-900">{certificate?.grade}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 whitespace-nowrap">Instructor</span>
                    <span className="font-semibold text-slate-900">{certificate?.instructor}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 whitespace-nowrap">Issue Date</span>
                    <span className="font-semibold text-slate-900">{certificate?.issueDate}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 whitespace-nowrap">Verification</span>
                    <span className="font-mono text-xs text-slate-900 break-all">{certificate?.verificationCode}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-5 space-y-3 mt-6">
                {/* Download PNG button - commented out for now
                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="w-full inline-flex items-center justify-center space-x-3 bg-brand text-white px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-brand-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                >
                  <DownloadIcon />
                  <span>{isExporting ? 'Preparing PNG…' : 'Download PNG'}</span>
                </button>
                */}

                <div className="relative" ref={shareMenuRef}>
                  <button
                    onClick={() => setShowShareMenu((prev) => !prev)}
                    className="w-full inline-flex items-center justify-center space-x-3 bg-slate-900 text-white px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95"
                  >
                    <ShareIcon />
                    <span>Share Credential</span>
                  </button>

                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-50">
                      <button onClick={() => handleShare('linkedin')} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50">Share on LinkedIn</button>
                      <button onClick={() => handleShare('x')} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50">Share on X</button>
                      <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50">Share on WhatsApp</button>
                      <button onClick={() => handleShare('email')} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50">Share via Email</button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCopyLink}
                  className="w-full inline-flex items-center justify-center space-x-3 border border-slate-200 text-slate-800 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95"
                >
                  <CopyIcon />
                  <span>Copy Verification Link</span>
                </button>

                <button
                  onClick={reset}
                  className="w-full inline-flex items-center justify-center space-x-3 border border-transparent text-slate-500 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:text-slate-800 transition-all active:scale-95"
                >
                  <span>Verify Another ID</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
