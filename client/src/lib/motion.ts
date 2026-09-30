import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion tokens. Keep every animated component on these values so the
 * whole site moves with one rhythm.
 */
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.76, 0, 0.24, 1] as const,
  soft: [0.25, 0.1, 0.25, 1] as const
};

export const duration = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1
};

export const spring = {
  magnetic: { stiffness: 220, damping: 18, mass: 0.4 },
  tilt: { stiffness: 180, damping: 20, mass: 0.5 },
  pointer: { stiffness: 90, damping: 22, mass: 0.6 }
} as const;

export const viewportOnce = {
  once: true,
  margin: "0px 0px -12% 0px"
} as const;

export const baseTransition: Transition = {
  duration: duration.base,
  ease: ease.out
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: baseTransition }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: baseTransition }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: baseTransition }
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren
    }
  }
});

export const INTRO_STORAGE_KEY = "shawon:intro-played";
export const INTRO_DONE_EVENT = "shawon:intro-done";
