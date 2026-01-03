
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Minimal polyfill for clsx/tailwind-merge behavior if libraries aren't explicitly imported
// However, since we use CDN tailwind, we can rely on standard string manipulation for this demo.
