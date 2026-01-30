import { motion } from 'framer-motion';

interface ChevronRightProps {
  className?: string;
  animate?: {
    opacity: number;
    x: number;
    scale?: number;
  };
  transition?: {
    duration: number;
    ease: [number, number, number, number];
  };
}

export const ChevronRight = ({ className = '', animate, transition }: ChevronRightProps) => {
  return (
    <motion.svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      animate={animate}
      transition={transition}
      aria-hidden='true'
    >
      <path d='M9 18L15 12L9 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </motion.svg>
  );
};
