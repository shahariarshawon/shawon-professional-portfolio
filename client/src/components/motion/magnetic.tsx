"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

import { useFinePointer } from "@/hooks/use-fine-pointer";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TMagneticProps = {
  children: React.ReactNode;
  /** Fraction of the pointer offset the element follows. */
  strength?: number;
  className?: string;
};

/**
 * Pulls its child toward the cursor while hovered. Inert on touch devices and
 * with reduced motion. Uses motion values only, so it never re-renders.
 */
export function Magnetic({ children, strength = 0.3, className }: TMagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isEnabled = useFinePointer();

  const x = useSpring(useMotionValue(0), spring.magnetic);
  const y = useSpring(useMotionValue(0), spring.magnetic);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isEnabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}
