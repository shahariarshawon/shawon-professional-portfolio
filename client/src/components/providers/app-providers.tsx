"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";

type TAppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: TAppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
