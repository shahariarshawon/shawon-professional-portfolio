"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  fallbackInitials?: string;
}

const ImageWrapper = React.forwardRef<HTMLDivElement, ImageWrapperProps>(
  ({ className, src, alt, fallbackInitials = "AS", ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "relative overflow-hidden rounded-full border-4 border-site bg-card shadow-xl",
          className
        )}
        {...(props as any)}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent)]/20 to-transparent mix-blend-overlay z-10 pointer-events-none rounded-full" />
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-accent)]/10 text-4xl font-bold text-[var(--color-accent)]">
            {fallbackInitials}
          </div>
        )}
      </motion.div>
    );
  }
);
ImageWrapper.displayName = "ImageWrapper";

export { ImageWrapper };
