'use client';

import { useTranslations } from 'next-intl';
import { PageContent } from './PageContent';

type ClientPageContentProps = {
  namespace: string;
};

/**
 * Client component that renders page content with translations
 */
export function ClientPageContent({ namespace }: ClientPageContentProps) {
  const t = useTranslations(namespace);

  return <PageContent title={t('title')} subtitle={t('subtitle')} />;
}
