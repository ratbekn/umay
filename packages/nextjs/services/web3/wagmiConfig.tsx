import { createConfig, http } from "wagmi";
import { polygon } from "wagmi/chains";

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
  chains: [polygon],
  transports: {
    [polygon.id]: http(),
  },
  ssr: true,
});
