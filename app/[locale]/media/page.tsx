import { generatePageMetadata } from '@/app/shared/utils/metadata';
import { ServerPageContent } from '@/app/shared/components/ServerPageContent';
import { LocaleParams } from '@/app/shared/types';

export const runtime = 'edge';

const NAMESPACE = 'media';

export async function generateMetadata({ params }: LocaleParams) {
  const { locale } = await params;
  return generatePageMetadata(locale, NAMESPACE);
}

export default async function MediaPage({ params }: LocaleParams) {
  const { locale } = await params;
  return <ServerPageContent locale={locale} namespace={NAMESPACE} />;
}
