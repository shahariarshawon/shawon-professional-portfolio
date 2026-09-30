import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-full text-sm font-medium transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-300 ease-out-expo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        /* Solid accent — admin-safe default (white text on accent). */
        primary:
          "bg-[var(--color-accent)] px-5 py-2.5 text-white shadow-sm hover:opacity-90",
        /* Gradient hero CTA with a light sweep on hover. */
        brand:
          "bg-gradient-brand gap-2 overflow-hidden whitespace-nowrap text-on-brand font-semibold shadow-[0_10px_40px_-10px_var(--glow-2)] hover:shadow-[0_18px_50px_-12px_var(--glow-1)] before:absolute before:inset-0 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/35 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
        glass:
          "glass gap-2 whitespace-nowrap text-fg hover:border-line-strong hover:bg-glass-strong",
        outline:
          "border border-site bg-transparent px-5 py-2.5 text-highlight hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
        ghost:
          "px-4 py-2 text-highlight hover:bg-card hover:text-[var(--color-accent)]",
        link:
          "h-auto rounded-none px-0 text-fg underline-offset-8 hover:text-brand hover:underline"
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6",
        xl: "h-14 px-7 text-base"
      }
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export type TButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: TButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
