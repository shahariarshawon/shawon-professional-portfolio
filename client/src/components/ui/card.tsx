import * as React from "react";

import { cn } from "@/lib/utils";

type TCardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: TCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-site bg-card shadow-sm transition hover:border-[(--color-accent)/60",
        className
      )}
      {...props}
    />
  );
}