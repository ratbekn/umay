"use client";

import { ReactNode } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider = ({ children, enableSystem }: { children: ReactNode; enableSystem?: boolean }) => {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="light" enableSystem={enableSystem}>
      {children}
    </NextThemesProvider>
  );
};
