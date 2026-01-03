// Supported locales
export const locales = ['es', 'eus'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

// Helper to get locale from URL
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  
  return defaultLocale;
}

// Helper to get path without locale
export function getPathWithoutLocale(pathname: string, locale: Locale): string {
  return pathname.replace(`/${locale}`, '') || '/';
}

// Helper to build locale path
export function buildLocalePath(locale: Locale, path: string): string {
  if (path === '/') {
    return `/${locale}`;
  }
  return `/${locale}${path}`;
}

