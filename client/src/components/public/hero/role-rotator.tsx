"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TRoleRotatorProps = {
  roles: string[];
  play?: boolean;
  interval?: number;
  className?: string;
};

/**
 * Cycles through positioning statements with a vertical masked swap. All
 * roles are exposed to assistive tech once; the animated copy is hidden.
 */
export function RoleRotator({ roles, play = true, interval = 2600, className }: TRoleRotatorProps) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!play || roles.length < 2) return;

    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % roles.length),
      prefersReducedMotion ? interval * 1.5 : interval
    );

    return () => window.clearInterval(id);
  }, [interval, play, prefersReducedMotion, roles.length]);

  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      <span className="sr-only">{roles.join(", ")}</span>
      {/* Invisible sizer keeps the width of the longest role to avoid layout shift. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {roles.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roles[index]}
          aria-hidden="true"
          className="text-gradient col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.7, ease: ease.out }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
