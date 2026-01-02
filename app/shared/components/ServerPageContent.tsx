import { getTranslations } from 'next-intl/server';
import { PageContent } from './PageContent';

type ServerPageContentProps = {
  locale: string;
  namespace: string;
};

/**
 * Server component that renders page content with translations
 */
export async function ServerPageContent({ locale, namespace }: ServerPageContentProps) {
  const t = await getTranslations({ locale, namespace });

  return <PageContent title={t('title')} subtitle={t('subtitle')} />;
}
