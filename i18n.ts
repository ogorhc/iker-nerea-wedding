import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['es', 'eus'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export default getRequestConfig(async ({ locale }) => {
  // locale is provided by next-intl based on the [locale] route segment
  // It can be undefined during build time or in certain server contexts
  // Use default locale if invalid or undefined
  const validLocale = locale && locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
