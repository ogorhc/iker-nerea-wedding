import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from '../components/ChevronRight';

const transitionSpeed = 0.15;

const LINK_CLASSES = {
  base: 'uppercase relative inline-block leading-none inline-flex items-center gap-4 sm:gap-6 min-w-0 text-5xl sm:text-6xl font-extrabold rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-nav-background',
  active: 'text-nav-text-active',
  inactive: '',
} as const;

export function getItemVariants(shouldReduceMotion: boolean) {
  return {
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
  };
}

export interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  shouldReduceMotion?: boolean;
}

export function NavigationLink({
  href,
  children,
  isActive = false,
  onClick,
  shouldReduceMotion = false,
}: NavigationLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const itemVariants = getItemVariants(shouldReduceMotion);

  const linkClassName = `${LINK_CLASSES.base} ${isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive}`;

  return (
    <motion.li variants={itemVariants}>
      <motion.a
        href={href}
        onClick={onClick}
        className={linkClassName}
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
        <span className="whitespace-nowrap">{children}</span>
        <ChevronRight
          className="text-nav-text-hover shrink-0 w-8 h-8 sm:w-12 sm:h-12"
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered && !shouldReduceMotion ? 0 : -50,
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
