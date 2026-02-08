import { useEffect, useState } from 'react';
import { useTranslation } from '../../../utils/useTranslation';
import { ROUTES } from '../../../constants/routes';
import { buildLocalePath } from '../../../utils/routing';
import type { INavigationProps } from './types/INavigationProps';
import { LanguageSwitch } from '../LanguageSwitch';
import { useUIStore } from '@/stores/uiStore';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { NavigationLink, getItemVariants } from './NavigationLink';

const transitionSpeed = 0.15;

const NAVIGATION_ITEMS = [
  { key: 'home', route: ROUTES.HOME },
  { key: 'media', route: ROUTES.MEDIA },
  { key: 'rsvp', route: ROUTES.RSVP },
] as const;

const NAV_STYLES = {
  container:
    'fixed inset-0 z-40 bg-nav-background px-6 sm:px-10 py-8 h-[100dvh] w-screen overflow-y-auto overscroll-contain',
  navList:
    'min-h-[100dvh] flex flex-col justify-center items-start lg:items-center',
} as const;


// Animation variants respecting reduced motion
const getContainerVariants = (shouldReduceMotion: boolean) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: shouldReduceMotion ? 0 : transitionSpeed,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: shouldReduceMotion ? 0 : 0.2,
      ease: 'easeIn' as const,
    },
  },
});

const getListVariants = (shouldReduceMotion: boolean) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: shouldReduceMotion ? 0 : 0.2,
      staggerChildren: shouldReduceMotion ? 0 : 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: shouldReduceMotion ? 0 : 0.05,
      staggerDirection: -1,
    },
  },
});

export function Navigation({ locale, currentPath }: INavigationProps) {
  const [pathname, setPathname] = useState(currentPath);
  const { t } = useTranslation(locale);
  const { isNavigationOpen, closeNavigation } = useUIStore();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Update pathname on client-side navigation
    setPathname(window.location.pathname);
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPath]);

  // Prevent body scroll when navigation is open
  useEffect(() => {
    if (isNavigationOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isNavigationOpen]);

  const isActiveRoute = (route: string, href: string) => {
    return pathname === href || (route === ROUTES.HOME && pathname === `/${locale}`);
  };

  const containerVariants = getContainerVariants(shouldReduceMotion ?? false);
  const listVariants = getListVariants(shouldReduceMotion ?? false);

  return (
    <AnimatePresence>
      {isNavigationOpen && (
        <motion.nav
          className={NAV_STYLES.container}
          variants={containerVariants}
          initial='initial'
          animate='animate'
          exit='exit'
        >
          <div className={NAV_STYLES.navList}>
            <motion.ul
              className="flex flex-col items-start gap-6 sm:gap-8 font-extrabold w-full max-w-xl "
              variants={listVariants}
              initial='initial'
              animate='animate'
              exit='exit'
            >
              <motion.li variants={getItemVariants(shouldReduceMotion ?? false)}>
                <LanguageSwitch currentLocale={locale} currentPath={currentPath} />
              </motion.li>

              {NAVIGATION_ITEMS.map((item) => {
                const href = buildLocalePath(locale, item.route);
                const isActive = isActiveRoute(item.route, href);
                return (
                  <NavigationLink
                    key={item.route}
                    href={href}
                    isActive={isActive}
                    onClick={closeNavigation}
                    shouldReduceMotion={shouldReduceMotion ?? false}
                  >
                    {t(`navigation.${item.key}`)}
                  </NavigationLink>
                );
              })}
            </motion.ul>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
