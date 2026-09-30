import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-3xl", {
  variants: {
    variant: {
      /* Original look — used throughout the admin dashboard. */
      default: "border border-site bg-card shadow-sm transition",
      /* Frosted panel for content over gradients / imagery. */
      glass: "glass shadow-soft",
      /* Solid raised surface. */
      elevated: "border border-line bg-glass-strong shadow-lift",
      /* Glass with a 1px brand-gradient hairline. */
      gradient: "glass border-gradient relative shadow-soft"
    },
    interactive: {
      true: "transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-lift",
      false: ""
    }
  },
  defaultVariants: {
    variant: "default",
    interactive: false
  }
});

type TCardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({ className, variant, interactive, ...props }: TCardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, interactive }), className)}
      {...props}
    />
  );
}

export { cardVariants };
