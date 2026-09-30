"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type TSpotlightCardProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Glass card with a soft radial glow that tracks the pointer. Position is
 * written to CSS variables directly (no React state), so hover is free.
 */
export function SpotlightCard({ className, children, onPointerMove, ...props }: TSpotlightCardProps) {
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    onPointerMove?.(event);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className={cn(
        "group/spot glass relative overflow-hidden rounded-3xl shadow-soft transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-lift",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in oklab, var(--color-accent-bright) 14%, transparent), transparent 65%)"
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
