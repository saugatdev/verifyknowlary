/**
 * Smart API endpoint selector
 * - Development: uses relative /api (proxied to localhost:4000 by Vite)
 * - Production: uses full Vercel backend URL
 */
export const getApiEndpoint = (): string => {
  // In production, use the environment variable
  if (import.meta.env.PROD) {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.warn('VITE_API_URL not set in .env.production');
      return '/api'; // Fallback
    }
    return apiUrl;
  }

  // In development, use relative path (Vite proxy handles it)
  return '/api';
};
