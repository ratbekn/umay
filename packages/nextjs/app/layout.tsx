import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Umay - Agricultural Investment Platform",
  description: "Decentralized agricultural investment platform for Kyrgyzstan",
  icons: "/logo.svg",
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
