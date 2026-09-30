import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const iconTileVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden text-brand",
  {
    variants: {
      size: {
        sm: "h-10 w-10 rounded-xl",
        md: "h-12 w-12 rounded-2xl",
        lg: "h-14 w-14 rounded-2xl"
      },
      tone: {
        soft: "border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10",
        glass: "glass"
      }
    },
    defaultVariants: {
      size: "md",
      tone: "soft"
    }
  }
);

type TIconTileProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof iconTileVariants>;

/** The rounded icon container used on cards across the site. */
export function IconTile({ className, size, tone, ...props }: TIconTileProps) {
  return <div className={cn(iconTileVariants({ size, tone }), className)} {...props} />;
}
