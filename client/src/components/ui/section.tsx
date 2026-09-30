import * as React from "react";

import { cn } from "@/lib/utils";

type TSectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Alternate tonal background to separate adjacent sections. */
  tone?: "default" | "surface";
  /** Render children inside the standard page container. */
  contained?: boolean;
  containerClassName?: string;
};

/**
 * Standard page section: consistent vertical rhythm, optional surface tone
 * and the shared container. Every homepage section is built on this.
 */
export function Section({
  tone = "default",
  contained = true,
  className,
  containerClassName,
  children,
  ...props
}: TSectionProps) {
  return (
    <section
      className={cn(
        "section-padding relative isolate",
        tone === "surface" && "bg-surface",
        className
      )}
      {...props}
    >
      {contained ? (
        <div className={cn("container-custom relative", containerClassName)}>{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
