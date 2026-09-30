"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

import { baseTransition, fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

type TRevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
};

/** Fades + lifts its children in once, when scrolled into view. */
export function Reveal({ delay = 0, y = 28, children, ...props }: TRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...baseTransition, delay }}
      data-reveal=""
      {...props}
    >
      {children}
    </motion.div>
  );
}

type TRevealGroupProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delay?: number;
};

/** Staggers the entrance of direct <RevealItem> children. */
export function RevealGroup({
  stagger = 0.08,
  delay = 0,
  children,
  ...props
}: TRevealGroupProps) {
  return (
    <motion.div
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type TRevealItemProps = HTMLMotionProps<"div"> & {
  variants?: Variants;
};

export function RevealItem({ variants = fadeUp, children, ...props }: TRevealItemProps) {
  return (
    <motion.div variants={variants} data-reveal="" {...props}>
      {children}
    </motion.div>
  );
}
