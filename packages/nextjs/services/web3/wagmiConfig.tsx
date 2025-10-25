import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, mainnet, sepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Umay Agricultural Investment Platform",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "DEFAULT_PROJECT_ID",
  chains: [hardhat, mainnet, sepolia],
  ssr: true,
});
