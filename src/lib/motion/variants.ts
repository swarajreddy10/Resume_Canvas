/**
 * Motion animation variants following Next.js 16 best practices
 * Centralized, reusable, type-safe animation configurations
 */

import type { Variants, Transition } from 'motion/react';

// Smooth spring transition
export const spring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: spring },
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: spring },
};

// Slide animations
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: spring },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: spring },
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

// Card hover effect
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: spring },
};

// Button tap effect
export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

// ── NEW: Futuristic variants ──────────────────────────────────

// Cinematic hero reveal (blur + slide + fade)
export const heroReveal: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 190, damping: 26 },
  },
};

// Word cycling via AnimatePresence
export const wordCycle: Variants = {
  enter: { opacity: 0, y: 14, filter: 'blur(4px)' },
  center: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: 'blur(4px)',
    transition: { duration: 0.28, ease: 'easeIn' },
  },
};

// Bento grid card (scale + fade + slight Y travel)
export const bentoCard: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 22 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 240, damping: 27 },
  },
};

// Bento card hover
export const bentoCardHover = {
  scale: 1.025,
  y: -6,
  transition: { type: 'spring', stiffness: 380, damping: 22 },
};

// Faster stagger for dense grids
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

// Auth split-screen panels
export const splitRevealLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 170, damping: 26 },
  },
};

export const splitRevealRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 170, damping: 26 },
  },
};

// Continuous float for decorative elements
export const floatLoop = {
  animate: { y: [0, -18, 0] as number[] },
  transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' as const },
};

// Gentle spring config
export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 150,
  damping: 22,
};

// Bouncy spring config
export const bouncySpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 18,
};
