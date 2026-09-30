import { BrandMark } from "@/components/brand/brand-mark";

/**
 * Route-level loading screen (shown while server data streams in). Mirrors the
 * intro loader's layout so the hand-off into it is seamless.
 */
export default function Loading() {
  return (
    <main
      role="status"
      aria-label="Loading"
      className="noise fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-ink"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-2),transparent_60%)]" />
      </div>

      <div className="relative flex flex-col items-center">
        <BrandMark animated className="h-16 w-16 sm:h-20 sm:w-20" />
      </div>

      <div className="absolute inset-x-6 bottom-8 mx-auto flex max-w-xl items-center gap-4 sm:bottom-12">
        <div className="relative h-px flex-1 overflow-hidden bg-line">
          <div className="bg-gradient-brand absolute inset-y-0 left-0 w-1/3 animate-shimmer" />
        </div>
        <span className="w-10 text-right font-mono text-xs text-muted">···</span>
      </div>
    </main>
  );
}
