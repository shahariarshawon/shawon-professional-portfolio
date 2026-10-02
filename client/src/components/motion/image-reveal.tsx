"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useResilientImage } from "@/hooks/use-resilient-image";
import { ease, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Reveal on mount (gated by `play`) instead of when scrolled into view. */
  immediate?: boolean;
  play?: boolean;
  delay?: number;
  loading?: "eager" | "lazy";
  /** Largest rendered width in CSS px; sizes the Cloudinary derivative. */
  maxWidth?: number;
  /** Shown if the image is missing or cannot be loaded. */
  fallback?: ReactNode;
};

/**
 * Wipes an image in with a clip-path curtain while it settles from a slight
 * zoom. Plain <img> keeps it working with any remote host (Cloudinary etc.);
 * a broken URL falls back instead of leaving a broken-image icon.
 */
export function ImageReveal({
  src,
  alt,
  className,
  imgClassName,
  immediate = false,
  play = true,
  delay = 0,
  loading = "lazy",
  maxWidth = 1200,
  fallback
}: TImageRevealProps) {
  const { imgRef, currentSrc, failed, onError } = useResilientImage(src, maxWidth);

  if (failed && fallback !== undefined) {
    return <div className={cn("relative overflow-hidden", className)}>{fallback}</div>;
  }

  const trigger = immediate
    ? { animate: play ? "visible" : "hidden" }
    : { whileInView: "visible", viewport: viewportOnce };

  return (
    <motion.div
      data-reveal=""
      className={cn("relative overflow-hidden", className)}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: { clipPath: "inset(100% 0% 0% 0%)" },
        visible: {
          clipPath: "inset(0% 0% 0% 0%)",
          transition: { duration: 1.1, ease: ease.inOut, delay }
        }
      }}
    >
      {failed ? (
        <div role="img" aria-label={alt} className="h-full w-full bg-surface" />
      ) : (
        <motion.img
          ref={imgRef}
          data-reveal=""
          src={currentSrc ?? undefined}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={onError}
          className={cn("h-full w-full object-cover", imgClassName)}
          variants={{
            hidden: { scale: 1.18 },
            visible: { scale: 1, transition: { duration: 1.4, ease: ease.out, delay } }
          }}
        />
      )}
    </motion.div>
  );
}
