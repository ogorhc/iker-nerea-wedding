import { useEffect, useState } from 'react';
import { useTranslation } from '../../../utils/useTranslation';
import { ROUTES } from '../../../constants/routes';
import { buildLocalePath } from '../../../utils/routing';
import type { INavigationProps } from './types/INavigationProps';
import { LanguageSwitch } from '../LanguageSwitch';
import { useUIStore } from '@/stores/uiStore';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronRight } from '../components/ChevronRight';

const transitionSpeed = 0.15;

const NAVIGATION_ITEMS = [
  { key: 'home', route: ROUTES.HOME },
  { key: 'media', route: ROUTES.MEDIA },
  { key: 'rsvp', route: ROUTES.RSVP },
] as const;

const NAV_STYLES = {
  container: 'fixed top-0 left-0 right-0 z-40 bg-nav-background p-6 h-screen w-screen overflow-hidden',
  navList: 'h-screen flex flex-col items-center justify-center relative z-10',
  linkBase: 'font-primary text-6xl uppercase relative inline-block',
  linkActive: 'text-nav-text-active font-semibold',
  linkInactive: 'text-outline',
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

const getItemVariants = (shouldReduceMotion: boolean) => ({
  initial: {
    opacity: 0,
    y: shouldReduceMotion ? 0 : 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: shouldReduceMotion ? 0 : 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: shouldReduceMotion ? 0 : 8,
    transition: {
      duration: shouldReduceMotion ? 0 : transitionSpeed,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
});

function NavigationLink({
  href,
  isActive,
  children,
  shouldReduceMotion,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
  shouldReduceMotion: boolean;
}) {
  const { closeNavigation } = useUIStore();
  const [isHovered, setIsHovered] = useState(false);

  const itemVariants = getItemVariants(shouldReduceMotion);

  return (
    <motion.li variants={itemVariants} className='relative'>
      <motion.a
        href={href}
        onClick={closeNavigation}
        className={`${NAV_STYLES.linkBase} ${NAV_STYLES.linkInactive} inline-flex items-center gap-6 min-w-0`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        animate={{
          x: isHovered && !shouldReduceMotion ? -16 : 0,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : transitionSpeed,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <span className='whitespace-nowrap text-outline'>{children}</span>

        <ChevronRight
          className='text-nav-text-hover shrink-0 w-12 h-12 '
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered && !shouldReduceMotion ? 0 : -50,
            // scale: isHovered && !shouldReduceMotion ? 1 : 0.8,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : transitionSpeed,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
          }}
        />
      </motion.a>
    </motion.li>
  );
}

export function Navigation({ locale, currentPath }: INavigationProps) {
  const [pathname, setPathname] = useState(currentPath);
  const { t } = useTranslation(locale);
  const { isNavigationOpen } = useUIStore();
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
              className='flex flex-col items-start justify-start gap-8 font-extrabold'
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
