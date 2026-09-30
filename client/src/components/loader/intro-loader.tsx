"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform
} from "framer-motion";
import { useCallback, useEffect } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ParticleField } from "@/components/effects/particle-field";
import { markIntroComplete, useIntroComplete } from "@/hooks/use-intro-complete";
import { INTRO_STORAGE_KEY, ease } from "@/lib/motion";

type TIntroLoaderProps = {
  name: string;
  tagline: string;
};

/**
 * Cinematic first-visit intro: the brand mark draws itself over a particle
 * constellation while a progress counter runs, then the panel lifts away to
 * reveal the homepage. Plays once per browser session; click or press Escape
 * to skip. The server renders it visible; <IntroGate> hides it before paint
 * when it has already played.
 */
export function IntroLoader({ name, tagline }: TIntroLoaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const isComplete = useIntroComplete();

  const progress = useMotionValue(0);
  const progressLabel = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const progressScale = useTransform(progress, [0, 100], [0, 1]);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      // Storage can be unavailable (private mode); the intro just replays.
    }

    // Flips the shared store: the overlay exits and the hero starts its
    // entrance while the curtain lifts.
    markIntroComplete();
  }, []);

  useEffect(() => {
    if (isComplete) return;

    const root = document.documentElement;
    root.style.overflow = "hidden";

    const controls = animate(progress, 100, {
      duration: prefersReducedMotion ? 0.5 : 1.9,
      ease: ease.inOut,
      onComplete: () => window.setTimeout(finish, prefersReducedMotion ? 0 : 250)
    });

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      controls.stop();
      window.removeEventListener("keydown", handleKey);
      root.style.overflow = "";
    };
  }, [finish, isComplete, prefersReducedMotion, progress]);

  const handleExitComplete = () => {
    document.documentElement.setAttribute("data-intro-seen", "");
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isComplete ? (
        <motion.div
          key="intro"
          role="status"
          aria-live="polite"
          aria-label={`Loading ${name}'s portfolio`}
          onClick={finish}
          className="intro-loader noise fixed inset-0 z-[100] flex cursor-pointer items-center justify-center overflow-hidden bg-ink"
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.3 } }
              : { y: "-100%", transition: { duration: 0.95, ease: ease.inOut, delay: 0.15 } }
          }
        >
          {/* Ambient glow */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-2),transparent_60%)]" />
            <div className="absolute left-[30%] top-[35%] h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-1),transparent_60%)]" />
          </div>

          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.2 } }}
          >
            <ParticleField density={0.5} />
          </motion.div>

          <motion.div
            className="relative flex flex-col items-center px-6 text-center"
            exit={{ opacity: 0, y: -24, transition: { duration: 0.4, ease: ease.out } }}
          >
            <BrandMark animated className="h-16 w-16 sm:h-20 sm:w-20" />

            <div className="mt-7 overflow-hidden">
              <motion.p
                className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl"
                initial={{ y: "110%" }}
                animate={{ y: "0%", transition: { duration: 0.9, ease: ease.out, delay: 0.5 } }}
              >
                {name}
              </motion.p>
            </div>

            <motion.p
              className="mt-3 text-eyebrow text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.8 } }}
            >
              {tagline}
            </motion.p>
          </motion.div>

          {/* Progress */}
          <motion.div
            className="absolute inset-x-6 bottom-8 mx-auto flex max-w-xl items-center gap-4 sm:bottom-12"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="relative h-px flex-1 overflow-hidden bg-line">
              <motion.div
                className="bg-gradient-brand absolute inset-0 origin-left"
                style={{ scaleX: progressScale }}
              />
            </div>
            <motion.span className="w-10 text-right font-mono text-xs tabular-nums text-muted">
              {progressLabel}
            </motion.span>
          </motion.div>

          <p className="absolute right-6 top-6 hidden font-mono text-[11px] uppercase tracking-[0.2em] text-muted/70 sm:block">
            Click to skip
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
