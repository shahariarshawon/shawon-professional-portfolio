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
        className={cn("glass h-10 w-10 rounded-full")}
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