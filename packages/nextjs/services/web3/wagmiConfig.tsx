import { createConfig, http } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";

// Only initialize connectors on client side to avoid SSR issues
const getConnectors = () => {
  if (typeof window === "undefined") {
    return [];
  }

  return connectorsForWallets(
    [
      {
        groupName: "Recommended",
        wallets: [metaMaskWallet],
      },
    ],
    {
      appName: "Umay",
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "DEFAULT_PROJECT_ID",
    },
  );
};

export const wagmiConfig = createConfig({
  connectors: getConnectors(),
  chains: [hardhat, sepolia],
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});
