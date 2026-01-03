import { useEffect, useState } from 'react';
import { useTranslation } from '../../utils/useTranslation';
import { ROUTES } from '../../constants/routes';
import { buildLocalePath } from '../../utils/routing';
import { LanguageSwitch } from './LanguageSwitch';
import type { Locale } from '../../i18n/config';

const NAVIGATION_ITEMS = [
  { key: 'home', route: ROUTES.HOME },
  { key: 'media', route: ROUTES.MEDIA },
  { key: 'rsvp', route: ROUTES.RSVP },
] as const;

const NAV_STYLES = {
  container:
    'fixed top-0 left-0 right-0 z-50 bg-nav-background backdrop-blur-sm border-b border-nav-border flex justify-between items-center',
  navList: 'mx-auto max-w-4xl px-6 py-4',
  linkBase: 'transition-colors duration-200 font-primary',
  linkActive: 'text-nav-text-active font-semibold',
  linkInactive: 'text-nav-text-inactive hover:text-nav-text-hover',
} as const;

function NavigationLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`${NAV_STYLES.linkBase} ${isActive ? NAV_STYLES.linkActive : NAV_STYLES.linkInactive}`}
    >
      {children}
    </a>
  );
}

interface NavigationProps {
  locale: Locale;
  currentPath: string;
}

export function Navigation({ locale, currentPath }: NavigationProps) {
  const [pathname, setPathname] = useState(currentPath);
  const { t } = useTranslation(locale);

  useEffect(() => {
    // Update pathname on client-side navigation
    setPathname(window.location.pathname);
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPath]);

  const isActiveRoute = (route: string, href: string) => {
    return pathname === href || (route === ROUTES.HOME && pathname === `/${locale}`);
  };

  return (
    <nav className={NAV_STYLES.container}>
      <div className={NAV_STYLES.navList}>
        <ul className='flex items-center justify-center gap-8'>
          {NAVIGATION_ITEMS.map((item) => {
            const href = buildLocalePath(locale, item.route);
            const isActive = isActiveRoute(item.route, href);
            return (
              <li key={item.route}>
                <NavigationLink href={href} isActive={isActive}>
                  {t(`navigation.${item.key}`)}
                </NavigationLink>
              </li>
            );
          })}
        </ul>
      </div>
      <LanguageSwitch currentLocale={locale} currentPath={currentPath} />
    </nav>
  );
}

