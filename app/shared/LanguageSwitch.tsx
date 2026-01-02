'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales } from '@/i18n';
import { buildLocalePath, getPathWithoutLocale } from '@/app/shared/utils/routing';

const BUTTON_STYLES = {
  base: 'transition-colors duration-200 font-primary',
  active: 'text-nav-text-active font-semibold',
  inactive: 'text-nav-text-inactive hover:text-nav-text-hover',
} as const;

export function LanguageSwitch() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const pathnameWithoutLocale = getPathWithoutLocale(pathname, currentLocale);

  const handleLocaleChange = (locale: string) => {
    const newPath = buildLocalePath(locale, pathnameWithoutLocale);
    router.push(newPath);
  };

  return (
    <div className='flex items-center gap-2 px-6'>
      {locales.map((locale) => {
        const isActive = currentLocale === locale;
        return (
          <button
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`${BUTTON_STYLES.base} ${isActive ? BUTTON_STYLES.active : BUTTON_STYLES.inactive}`}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
