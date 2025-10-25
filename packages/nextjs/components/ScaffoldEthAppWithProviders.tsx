"use client";

import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { Header } from "~~/components/Header";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const queryClient = new QueryClient();

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar />
        <RainbowKitProvider
          theme={isDarkMode ? darkTheme() : lightTheme()}
          avatar={() => <div />}
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="relative flex flex-col flex-1">{children}</main>
          </div>
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
