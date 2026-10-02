"use client";

import { ImageOff } from "lucide-react";
import type { ImgHTMLAttributes, ReactNode } from "react";

import { useResilientImage } from "@/hooks/use-resilient-image";
import { cn } from "@/lib/utils";

type TSafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  /** Largest rendered width in CSS px; used to size the Cloudinary derivative. */
  maxWidth?: number;
  /** Rendered instead of the image when it is missing or fails to load. */
  fallback?: ReactNode;
};

/**
 * <img> that never leaves a broken-image icon behind: it retries the original
 * URL if the optimized one fails, then swaps in a fallback. Plain <img> (not
 * next/image) keeps it working with any remote host without proxying.
 */
export function SafeImage({
  src,
  alt,
  maxWidth = 1200,
  fallback,
  className,
  loading = "lazy",
  ...props
}: TSafeImageProps) {
  const { imgRef, currentSrc, failed, onError } = useResilientImage(src, maxWidth);

  if (failed) {
    return (
      <>
        {fallback !== undefined ? (
          fallback
        ) : (
          <div
            role="img"
            aria-label={alt}
            className={cn("flex items-center justify-center bg-surface text-muted", className)}
          >
            <ImageOff className="h-1/3 max-h-8 w-1/3 max-w-8 opacity-60" aria-hidden="true" />
          </div>
        )}
      </>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={currentSrc ?? undefined}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={onError}
      className={className}
      {...props}
    />
  );
}
