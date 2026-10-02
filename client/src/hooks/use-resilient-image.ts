"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { optimizeImageUrl } from "@/lib/cloudinary";

/**
 * Drives an <img> through a fallback chain: optimized URL, then the original
 * URL, then `failed` so the caller can render a placeholder. Also catches
 * images that already errored before React hydrated (no onError event fires
 * for those).
 */
export function useResilientImage(src: string | null | undefined, maxWidth = 1200) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [failure, setFailure] = useState<{ src: string | null | undefined; stage: number }>({
    src,
    stage: 0
  });

  const optimized = src ? optimizeImageUrl(src, maxWidth) : "";
  const candidates = src ? (optimized !== src ? [optimized, src] : [src]) : [];

  // A new src starts over from the first candidate.
  const stage = failure.src === src ? failure.stage : 0;
  const currentSrc = candidates[stage] ?? null;

  const onError = useCallback(() => {
    setFailure((prev) => ({ src, stage: (prev.src === src ? prev.stage : 0) + 1 }));
  }, [src]);

  useEffect(() => {
    const img = imgRef.current;
    if (currentSrc && img?.complete && img.naturalWidth === 0) onError();
  }, [currentSrc, onError]);

  return { imgRef, currentSrc, failed: currentSrc === null, onError };
}
