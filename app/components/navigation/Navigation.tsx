'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ROUTES } from '../../constants/routes';
import { LanguageSwitch } from '@/app/shared/LanguageSwitch';
import { buildLocalePath } from '@/app/shared/utils/routing';

const NAVIGATION_ITEMS = [
  { key: 'home', route: ROUTES.HOME },
  { key: 'media', route: ROUTES.MEDIA },
  { key: 'rsvp', route: ROUTES.RSVP },
] as const;

const NAV_STYLES = {
  container: 'fixed top-0 left-0 right-0 z-50 bg-nav-background backdrop-blur-sm  flex justify-between items-center',
  navList: 'mx-auto max-w-4xl px-6 py-4',
  linkBase: 'transition-colors duration-200 font-primary',
  linkActive: 'text-nav-text-active font-semibold',
  linkInactive: 'text-nav-text-inactive hover:text-nav-text-hover',
} as const;

function NavigationLink({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`${NAV_STYLES.linkBase} ${isActive ? NAV_STYLES.linkActive : NAV_STYLES.linkInactive}`}
    >
      {children}
    </Link>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('navigation');

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
                  {t(item.key)}
                </NavigationLink>
              </li>
            );
          })}
        </ul>
      </div>
      <LanguageSwitch />
    </nav>
  );
}
