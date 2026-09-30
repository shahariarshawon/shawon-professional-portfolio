"use client";

import { MotionConfig } from "framer-motion";

import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

type TAppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: TAppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {/* Honour the OS reduced-motion setting: transforms are dropped, fades kept. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </ThemeProvider>
    </QueryProvider>
  );
}
