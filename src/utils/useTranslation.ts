import { useMemo } from 'react';
import { getTranslation } from '../i18n/translations';
import type { Locale } from '../i18n/config';

/**
 * React hook for translations (client-side)
 */
export function useTranslation(locale: Locale) {
  return useMemo(
    () => ({
      t: (key: string) => getTranslation(locale, key),
      locale,
    }),
    [locale]
  );
}

