"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export const ThemeProvider = ({ children, enableSystem }: { children: ReactNode; enableSystem?: boolean }) => {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="light" enableSystem={enableSystem}>
      {children}
    </NextThemesProvider>
  );
};
