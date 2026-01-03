/**
 * Smart API endpoint selector
 * - Development: uses relative /api (proxied to localhost:4000 by Vite)
 * - Production: uses full Vercel backend URL
 */
export const getApiEndpoint = (): string => {
  // Prefer explicit API URL when provided (needed on Vercel/Next.js)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl && apiUrl.trim()) return apiUrl;

  // Fallback to relative API route
  return '/api';
};
