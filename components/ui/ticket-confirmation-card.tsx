
import * as React from "react";
import { cn } from "../../lib/utils";

const KnowlaryLogo = ({ className, layout = "vertical" }: { className?: string, layout?: "horizontal" | "vertical" }) => {
  if (layout === "horizontal") {
    return (
      <div className={cn("flex items-center space-x-4", className)}>
        <img 
          src="https://www.knowlary.com/knowlary.svg" 
          alt="Knowlary" 
          className="h-8 w-auto"
          crossOrigin="anonymous"
        />
        <div className="h-4 w-[0.5px] bg-slate-300" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-black whitespace-nowrap">Registry of Accreditation</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <img 
        src="https://www.knowlary.com/knowlary.svg" 
        alt="Knowlary" 
        className="h-12 w-auto mb-2"
        crossOrigin="anonymous"
      />
      <div className="h-[0.5px] w-32 bg-slate-100" />
      <span className="text-[7px] uppercase tracking-[0.5em] text-slate-400 font-bold mt-2">Registry of Accreditation</span>
    </div>
  );
};

const SignatureField = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center w-64">
    <div className="relative h-14 w-full flex flex-col items-center justify-end pb-1">
      <svg className="absolute bottom-2 opacity-90" width="140" height="40" viewBox="0 0 180 60">
        <path d="M20 45 C50 35, 80 15, 100 35 S 150 55, 175 25" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        <path d="M60 20 L65 48" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M110 25 L115 42" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="w-full h-[0.5px] bg-slate-200" />
    </div>
    <div className="mt-2 text-center">
      <p className="text-sm font-serif font-medium text-slate-800 italic leading-tight">{name}</p>
    </div>
  </div>
);

export interface CertificateProps extends React.HTMLAttributes<HTMLDivElement> {
  certificateId: string;
  studentName: string;
  issueDate: Date;
  courseName: string;
  grade: string;
  instructor: string;
  verificationCode: string;
}

const AnimatedTicket = React.forwardRef<HTMLDivElement, CertificateProps>(
  (
    {
      className,
      certificateId,
      studentName,
      issueDate,
      courseName,
      grade,
      instructor,
      verificationCode,
      ...props
    },
    ref
  ) => {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(issueDate);

    return (
      <div className="w-full flex justify-center overflow-x-auto py-4">
        <div
          ref={ref}
          className="relative bg-white rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden"
          style={{ width: '850px', height: '1202px' }}
        >
          {/* Main Document for Export */}
          <div id="certificate-body" className="absolute inset-0 bg-white">
            <div className="h-full w-full bg-white relative flex flex-col items-center p-12 overflow-hidden">
              
              {/* Abstract White Background Patterns */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
                <div className="absolute -top-[15%] -left-[10%] w-[60%] h-[60%] rounded-full bg-slate-50 blur-[120px]" />
                <div className="absolute top-[25%] -right-[15%] w-[50%] h-[70%] rounded-full bg-slate-100/50 blur-[130px]" />
                <div className="absolute -bottom-[10%] left-[20%] w-[70%] h-[50%] rounded-full bg-slate-50 blur-[140px]" />
                
                <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 700 L1000 0 M0 350 L500 0 M500 700 L1000 350" stroke="currentColor" strokeWidth="1" fill="none" />
                  <circle cx="500" cy="350" r="300" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <circle cx="500" cy="350" r="450" stroke="currentColor" strokeWidth="0.5" fill="none" />
                </svg>
              </div>

              {/* Header: ID | LOGO | DATE */}
              <div className="w-full flex justify-between items-start z-10 px-6">
                <div className="flex flex-col items-start min-w-[120px] pt-2">
                   <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-200 mb-1">Serial ID</span>
                   <span className="text-[10px] font-mono text-slate-400">{certificateId}</span>
                </div>
                
                <KnowlaryLogo layout="vertical" />

                <div className="flex flex-col items-end min-w-[120px] pt-2">
                   <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-200 mb-1">Issue Date</span>
                   <span className="text-[10px] font-serif text-slate-400">{formattedDate}</span>
                </div>
              </div>

              {/* Main Content Body - Shifting overall content down slightly as requested */}
              <div className="flex flex-col items-center justify-center z-10 w-full px-12 py-16 text-center min-h-0">
                
                <div className="mb-8">
                   <h1 className="text-[10px] font-sans font-black uppercase tracking-[1em] text-slate-300 translate-x-[0.5em] mb-4">
                      Accreditation of Achievement
                   </h1>
                   <p className="text-slate-400 font-serif italic text-base opacity-70">
                    This official certificate is awarded to
                  </p>
                </div>

                {/* Name Section */}
                <div className="w-full mb-6">
                   <h2 className="text-5xl font-serif italic font-normal text-slate-900 tracking-tight leading-tight">
                    {studentName}
                   </h2>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                  <p className="text-slate-400 font-serif text-base leading-relaxed italic px-12">
                    In recognition of the successful completion of all academic requirements and institutional standards for the program
                  </p>
                  
                  <h3 className="text-3xl font-serif text-[#008080] tracking-tight leading-snug pt-2">
                    {courseName}
                  </h3>

                  {/* Awarded With Section */}
                  <div className="flex items-center justify-center space-x-6 pt-6 pb-4">
                    <div className="h-[0.5px] w-24 bg-slate-100" />
                    <div className="flex items-center space-x-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Awarded With</span>
                       <span className="text-brand font-serif italic text-2xl">{grade}</span>
                    </div>
                    <div className="h-[0.5px] w-24 bg-slate-100" />
                  </div>
                </div>
              </div>

              {/* Security Microprint */}
              <div className="absolute bottom-8 left-0 right-0 text-center opacity-[0.2] select-none pointer-events-none">
                <p className="text-[6px] font-mono tracking-[1em] uppercase text-slate-400">
                  AUTHENTICATED RECORD • REGISTRY HASH: {verificationCode} • KNOWLARY SECURE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AnimatedTicket.displayName = "KnowlaryProfessionalCertificate";
export { AnimatedTicket, KnowlaryLogo };
