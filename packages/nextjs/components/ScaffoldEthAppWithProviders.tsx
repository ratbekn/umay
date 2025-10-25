"use client";

import { WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";

import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";

import { wagmiConfig } from "../services/web3/wagmiConfig";
import { Header } from "./Header";
import { ProgressBar } from "./scaffold-eth/ProgressBar";

const queryClient = new QueryClient();

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar />
        <RainbowKitProvider theme={isDarkMode ? darkTheme() : lightTheme()} avatar={() => <div />}>
          <div className="flex flex-col min-h-screen">
            <main className="relative flex flex-col flex-1">{children}</main>
          </div>
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
