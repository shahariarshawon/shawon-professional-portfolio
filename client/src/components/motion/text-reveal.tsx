"use client";

import { motion } from "framer-motion";

import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TTextRevealProps = {
  text: string;
  /** Start the animation (e.g. after the intro finishes). */
  play?: boolean;
  /** Animate when scrolled into view instead of on `play`. */
  inView?: boolean;
  delay?: number;
  stagger?: number;
  className?: string;
  wordClassName?: string;
  /** Render the last N words with the brand gradient. */
  highlightLast?: number;
};

/**
 * Masked word-by-word reveal: each word slides up from behind a clipping line.
 * Screen readers get the full string once via an sr-only copy.
 */
export function TextReveal({
  text,
  play = true,
  inView = false,
  delay = 0,
  stagger = 0.06,
  className,
  wordClassName,
  highlightLast = 0
}: TTextRevealProps) {
  const words = text.split(/\s+/).filter(Boolean);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } }
  };

  const word = {
    hidden: { y: "110%" },
    visible: { y: "0%", transition: { duration: 0.9, ease: ease.out } }
  };

  const trigger = inView
    ? { whileInView: "visible", viewport: { once: true, margin: "0px 0px -10% 0px" } }
    : { animate: play ? "visible" : "hidden" };

  return (
    <motion.span
      className={cn("inline", className)}
      variants={container}
      initial="hidden"
      {...trigger}
    >
      <span className="sr-only">{text}</span>
      {words.map((w, index) => (
        <span
          key={`${w}-${index}`}
          aria-hidden="true"
          className="inline-flex overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span
            variants={word}
            data-reveal=""
            className={cn(
              "inline-block",
              wordClassName,
              index >= words.length - highlightLast && "text-gradient"
            )}
          >
            {w}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
