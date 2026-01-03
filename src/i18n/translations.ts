import es from '../../messages/es.json';
import eus from '../../messages/eus.json';
import type { Locale } from './config';

export const translations = {
  es,
  eus,
} as const;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback to default locale
      value = translations.es;
      for (const fallbackKey of keys) {
        value = value?.[fallbackKey];
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

