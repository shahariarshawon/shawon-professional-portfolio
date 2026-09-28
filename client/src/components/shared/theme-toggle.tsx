"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

const ThemeToggleClient = dynamic(
  () =>
    import("@/components/shared/theme-toggle-client").then(
      (mod) => mod.ThemeToggleClient
    ),
  {
    ssr: false,
    loading: () => (
      <button
        type="button"
        aria-label="Toggle theme"
        className={cn(
          "h-10 w-10 rounded-full border border-white/10 bg-white/5",
          "light:border-slate-200 light:bg-white"
        )}
      />
    )
  }
);

type TThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: TThemeToggleProps) {
  return <ThemeToggleClient className={className} />;
}