import { cn } from "@/lib/utils";

type TBrandMarkProps = {
  className?: string;
  /** Draw the strokes in on mount (CSS only, safe in Server Components). */
  animated?: boolean;
  title?: string;
};

/**
 * Personal mark: a hexagon (a nod to Node.js / systems) framing a geometric S.
 * Colors come from currentColor so it follows the theme; no gradient ids,
 * which break when an instance lives inside a display:none subtree.
 */
export function BrandMark({ className, animated = false, title }: TBrandMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("h-9 w-9", animated && "brand-draw", className)}
    >
      <path
        d="M24 3 L42.2 13.5 L42.2 34.5 L24 45 L5.8 34.5 L5.8 13.5 Z"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
        className="text-brand-bright"
      />
      <path
        d="M30 15 H21 a4.5 4.5 0 0 0 0 9 h6 a4.5 4.5 0 0 1 0 9 H18"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-2"
      />
    </svg>
  );
}
