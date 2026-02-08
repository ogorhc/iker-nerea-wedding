import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export const HamburgerButton = () => {
  const { isNavigationOpen, toggleNavigation } = useUIStore();

  return (
    <button
      onClick={toggleNavigation}
      className={cn('transition-colors duration-200 cursor-pointer z-51 mx-2', isNavigationOpen ? 'text-nav-foreground' : 'text-nav-background')}
      aria-label={isNavigationOpen ? 'Close navigation' : 'Open navigation'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isNavigationOpen ? 90 : 0 }}
        transition={{ duration: 0.3 }}
        className='relative w-6 h-6'
      >
        {isNavigationOpen ? (
          <svg width='24px' height='24px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C17.6834 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z'
              fill='currentColor'
            />
          </svg>
        ) : (
          <svg width='24px' height='24px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z'
              fill='currentColor'
            />
          </svg>
        )}
      </motion.div>
    </button>
  );
};
