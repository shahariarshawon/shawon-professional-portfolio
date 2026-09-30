import * as React from "react";

import { cn } from "@/lib/utils";

type TMarqueeProps = {
  children: React.ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * Infinite CSS marquee (transform-only, pauses on hover, stops under
 * reduced motion). Content is duplicated once; the copy is hidden from
 * assistive tech.
 */
export function Marquee({ children, duration = 40, reverse = false, className }: TMarqueeProps) {
  return (
    <div className={cn("mask-fade-x flex overflow-hidden", className)}>
      <div
        className="marquee-track flex w-max shrink-0 animate-marquee"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal"
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
