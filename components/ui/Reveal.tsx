'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

export const EXPO = [0.16, 1, 0.3, 1] as const;

type Props = HTMLMotionProps<'div'> & { delay?: number; y?: number };

/** Apariție la scroll: opacity + translateY, easing expo. Respectă prefers-reduced-motion. */
export function Reveal({ delay = 0, y = 24, children, ...rest }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1, ease: EXPO, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
