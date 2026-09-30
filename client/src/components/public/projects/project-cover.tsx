import { cn } from "@/lib/utils";

type TProjectCoverProps = {
  name: string;
  techStack: string[];
  seed: number;
  className?: string;
};

const LAYOUTS = [
  "radial-gradient(circle at 18% 20%, var(--glow-1), transparent 55%), radial-gradient(circle at 85% 85%, var(--glow-2), transparent 55%)",
  "radial-gradient(circle at 80% 15%, var(--glow-2), transparent 55%), radial-gradient(circle at 15% 90%, var(--glow-1), transparent 55%)",
  "radial-gradient(circle at 50% 0%, var(--glow-3), transparent 55%), radial-gradient(circle at 10% 70%, var(--glow-2), transparent 50%), radial-gradient(circle at 90% 80%, var(--glow-1), transparent 50%)"
];

/**
 * Typographic cover for projects without screenshots: layered brand glows,
 * a blueprint grid and the project name set large, plus a terminal-style
 * stack line. Deterministic per project so it doesn't change between renders.
 */
export function ProjectCover({ name, techStack, seed, className }: TProjectCoverProps) {
  const title = name.split(/\s[–—-]\s/)[0];

  return (
    <div
      aria-hidden="true"
      className={cn("relative flex h-full w-full flex-col justify-between overflow-hidden bg-surface p-6 sm:p-8", className)}
      style={{ backgroundImage: LAYOUTS[seed % LAYOUTS.length] }}
    >
      <div className="bg-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />

      <div className="relative mt-8 flex items-center gap-2 font-mono text-[11px] text-muted">
        <span className="h-2 w-2 rounded-full bg-brand-bright/80" />
        ~/projects/{title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
      </div>

      <p className="relative font-display text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-fg/90 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1">
        {title}
        <span className="text-brand-bright">.</span>
      </p>

      {techStack.length ? (
        <p className="relative truncate font-mono text-[11px] text-muted">
          <span className="text-brand">$</span> stack --list{" "}
          <span className="text-fg/70">{techStack.slice(0, 4).join(" · ")}</span>
        </p>
      ) : null}
    </div>
  );
}
