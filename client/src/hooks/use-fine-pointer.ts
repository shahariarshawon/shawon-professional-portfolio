"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * True on devices with a precise hovering pointer (mouse / trackpad) and no
 * reduced-motion preference. Pointer-driven effects (magnetic, tilt,
 * spotlight, parallax) are enabled only when this is true.
 */
export function useFinePointer() {
  const prefersReducedMotion = useReducedMotion();
  const [isFine, setIsFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsFine(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isFine && !prefersReducedMotion;
}
