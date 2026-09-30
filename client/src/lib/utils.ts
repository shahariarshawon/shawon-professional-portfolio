import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * Teach tailwind-merge about the design-system tokens in globals.css.
 * Without this, custom `text-h2`-style size utilities are mistaken for text
 * colours and silently remove classes like `text-fg` when merged.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h1", "h2", "h3", "lead", "eyebrow"] }],
      "text-color": [
        { text: ["fg", "muted", "brand", "brand-bright", "brand-2", "on-brand", "ink", "surface"] }
      ]
    }
  }
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
