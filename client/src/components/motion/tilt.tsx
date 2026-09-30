"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";
import { useRef } from "react";

import { useFinePointer } from "@/hooks/use-fine-pointer";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TTiltProps = {
  children: React.ReactNode;
  /** Max rotation in degrees. */
  max?: number;
  /** Show a soft glare that follows the pointer. */
  glare?: boolean;
  className?: string;
};

/**
 * 3D pointer tilt with an optional glare highlight. Disabled on touch devices
 * and with reduced motion.
 */
export function Tilt({ children, max = 6, glare = true, className }: TTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isEnabled = useFinePointer();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring.tilt);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring.tilt);

  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glareOpacity = useSpring(0, spring.tilt);
  const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, color-mix(in oklab, var(--color-accent-bright) 18%, transparent), transparent 60%)`;

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isEnabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
    glareOpacity.set(1);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={
        isEnabled
          ? { rotateX, rotateY, transformPerspective: 1100 }
          : undefined
      }
      className={cn("relative", className)}
    >
      {children}
      {glare && isEnabled ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{ background: glareBackground, opacity: glareOpacity }}
        />
      ) : null}
    </motion.div>
  );
}
