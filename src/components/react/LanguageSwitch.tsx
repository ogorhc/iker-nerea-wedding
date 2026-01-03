import { locales } from '../../i18n/config';
import { buildLocalePath, getPathWithoutLocale } from '../../utils/routing';
import type { Locale } from '../../i18n/config';

const BUTTON_STYLES = {
  base: 'transition-colors duration-200 font-primary',
  active: 'text-nav-text-active font-semibold',
  inactive: 'text-nav-text-inactive hover:text-nav-text-hover cursor-pointer',
} as const;

interface LanguageSwitchProps {
  currentLocale: Locale;
  currentPath: string;
}

export function LanguageSwitch({ currentLocale, currentPath }: LanguageSwitchProps) {
  const pathnameWithoutLocale = getPathWithoutLocale(currentPath, currentLocale);

  return (
    <div className='flex items-center gap-2 px-6'>
      {locales.map((locale) => {
        const isActive = currentLocale === locale;
        const newPath = buildLocalePath(locale, pathnameWithoutLocale);
        return (
          <a
            key={locale}
            href={newPath}
            className={`${BUTTON_STYLES.base} ${isActive ? BUTTON_STYLES.active : BUTTON_STYLES.inactive}`}
          >
            {locale.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}

