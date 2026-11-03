/**
 * Motion animation variants used by the dashboard.
 *
 * Public pages do not use these: content that starts at opacity 0 stays invisible until
 * hydration, which delayed the landing page's LCP. The landing page uses CSS reveals
 * (src/components/landing/Reveal.tsx) instead.
 */

import type { Variants, Transition } from 'motion/react';

// Smooth spring transition
export const spring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: spring },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
