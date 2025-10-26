"use client";

import { BrowserProvider, Contract, Eip1193Provider, JsonRpcSigner } from "ethers";

let externalProvider: Eip1193Provider | null = null;

export function setExternalProvider(p: Eip1193Provider | null) {
  externalProvider = p;
}

export function getExternalProvider(): Eip1193Provider | null {
  return externalProvider;
}

export async function disconnectWallet() {
  const p: any = externalProvider;
  try {
    if (p?.disconnect) {
      await p.disconnect();
    }
  } catch {
    // ignore
  } finally {
    externalProvider = null;
  }
}

export function getWindowEthereum(): Eip1193Provider {
  const eth = (externalProvider || (globalThis as any).ethereum) as Eip1193Provider | undefined;
  if (!eth) throw new Error("Web3 provider не найден. Установи кошелёк или используй WalletConnect");
  return eth;
}

export async function getProvider(): Promise<BrowserProvider> {
  const eth = getWindowEthereum();
  const provider = new BrowserProvider(eth, "any");
  return provider;
}

export async function getSigner(): Promise<JsonRpcSigner> {
  const provider = await getProvider();
  await provider.send("eth_requestAccounts", []);
  return await provider.getSigner();
}

export function getReadContract(address: string, abi: any) {
  return new Contract(address, abi);
}

export async function getWriteContract(address: string, abi: any) {
  const signer = await getSigner();
  return new Contract(address, abi, signer);
}

export async function ensureChain(expectedChainIdDec: number) {
  const provider = await getProvider();
  const { chainId } = await provider.getNetwork();
  if (Number(chainId) !== expectedChainIdDec) {
    throw new Error(`Неверная сеть. Ожидается chainId=${expectedChainIdDec}, сейчас=${chainId}`);
  }
}

export async function addTokenToWallet(tokenAddress: string, symbol: string, decimals: number) {
  const eth = getWindowEthereum();
  await eth.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: { address: tokenAddress, symbol, decimals },
    },
  });
}

export async function switchToPolygon() {
  // Switch wallet to Polygon PoS (default chainId 137)
  const eth = getWindowEthereum() as any;
  const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "137");
  const hex = "0x" + CHAIN_ID.toString(16);
  try {
    await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hex }] });
  } catch (e: any) {
    if (e?.code === 4902 || /Unrecognized chain ID/i.test(e?.message || "")) {
      // Try to add Polygon to the wallet if missing
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: hex,
            chainName: "Polygon PoS",
            nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
            rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || "https://polygon-rpc.com"],
            blockExplorerUrls: ["https://polygonscan.com"],
          },
        ],
      });
    } else {
      throw e;
    }
  }
}
