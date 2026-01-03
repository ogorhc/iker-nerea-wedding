import { ROUTES } from '../constants/routes';
import type { Locale } from '../i18n/config';

/**
 * Builds a locale-aware URL path
 * @param locale - The current locale (e.g., 'es', 'eus')
 * @param route - The route path (e.g., ROUTES.HOME, ROUTES.MEDIA)
 * @returns The full locale-aware path (e.g., '/es/media')
 */
export function buildLocalePath(locale: Locale, route: string): string {
  if (route === ROUTES.HOME) {
    return `/${locale}`;
  }
  return `/${locale}${route}`;
}

/**
 * Extracts the path without the locale prefix
 * @param pathname - Full pathname (e.g., '/es/media')
 * @param locale - Current locale (e.g., 'es')
 * @returns Path without locale prefix (e.g., '/media')
 */
export function getPathWithoutLocale(pathname: string, locale: Locale): string {
  return pathname.replace(`/${locale}`, '') || ROUTES.HOME;
}

