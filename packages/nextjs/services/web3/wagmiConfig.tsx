import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, sepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Umay",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "DEFAULT_PROJECT_ID",
  chains: [hardhat, sepolia],
  ssr: true,
});
