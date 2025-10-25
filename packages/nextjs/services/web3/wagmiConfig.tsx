import { hardhat, sepolia } from "wagmi/chains";
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from "wagmi";

// Only initialize connectors on client side to avoid SSR issues
const getConnectors = () => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  return connectorsForWallets(
    [
      {
        groupName: "Recommended",
        wallets: [metaMaskWallet],
      }
    ],
    {
      appName: "Umay",
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "DEFAULT_PROJECT_ID",
    }
  );
};

export const wagmiConfig = createConfig({
  connectors: getConnectors(),
  chains: [hardhat, sepolia],
  ssr: true,
});
