import { getTranslations } from 'next-intl/server';

/**
 * Generates metadata for a page using translations
 * @param locale - The current locale
 * @param namespace - The translation namespace (e.g., 'media', 'rsvp')
 * @returns Metadata object with title and description
 */
export async function generatePageMetadata(
  locale: string,
  namespace: string
): Promise<{ title: string; description: string }> {
  const t = await getTranslations({ locale, namespace });
  return {
    title: t('title'),
    description: t('description'),
  };
}

