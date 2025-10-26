"use client";

import { useEffect, useState } from "react";

import { MaxUint256, ethers } from "ethers";

import { Card } from "../../app/components/ui/card";
import ERC20Abi from "../../app/lib/abis/ERC20.json";
import PoolAbi from "../../app/lib/abis/Pool.json";
import {
  addTokenToWallet,
  ensureChain,
  getReadContract,
  getSigner,
  getWriteContract,
  switchToPolygon,
} from "../../app/lib/eth";

interface Farm {
  id: number;
  status: string;
  name: string;
  region: string;
  projected: string;
  riskLevel: string;
  term: string;
  icon: string;
  poolAddress?: string;
  chainId?: number;
}

interface FarmCardProps {
  farm: Farm;
  walletConnected: boolean;
}

export function FarmCard({ farm, walletConnected }: FarmCardProps) {
  const [isInvesting, setIsInvesting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [isInvestingOnChain, setIsInvestingOnChain] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

  const [tokenSymbol, setTokenSymbol] = useState<string>("SHARE");
  const [tokenDecimals, setTokenDecimals] = useState<number>(6);
  const [shareBalance, setShareBalance] = useState<string>("0");
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);

  const [successActive, setSuccessActive] = useState<boolean>(false);
  const [failActive, setFailActive] = useState<boolean>(false);
  const [refundAvailable, setRefundAvailable] = useState<boolean>(false);

  const handleInvest = () => {
    setIsInvesting(true);
    setTimeout(() => {
      alert(`Investment in project "${farm.name}" completed successfully!`);
      setIsInvesting(false);
    }, 1500);
  };

  // USDT per chain helper (extend as needed)
  const USDT_BY_CHAIN: Record<number, string> = {
    137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // Polygon
  };

  async function handleApprove() {
    try {
      setIsApproving(true);
      const chainId = farm.chainId ?? 137;
      const poolAddress = farm.poolAddress;
      if (!poolAddress) throw new Error("Pool address not set for this project");
      const tokenAddress = USDT_BY_CHAIN[chainId];
      if (!tokenAddress) throw new Error(`USDT not configured for chain ${chainId}`);
      const spender = poolAddress;

      const token = await getWriteContract(tokenAddress, ERC20Abi);
      const tx = await token.approve(spender, MaxUint256);
      await tx.wait();
      alert("Approve successful — you can now invest.");
      if (amount && Number(amount) > 0) {
        await handleInvestOnChain();
      }
    } catch (err: any) {
      console.error("approve error", err);
      alert(`Approve failed: ${err?.message || err}`);
    } finally {
      setIsApproving(false);
    }
  }

  // Minimal Pool ABI for refund() is imported; invest(amount) exists in PoolAbi JSON

  async function loadInvestorBalance() {
    try {
      if (!walletConnected || !farm.poolAddress) return;
      setLoadingBalance(true);
      const chainId = farm.chainId ?? 137;
      await ensureChain(chainId);
      const pool = await getWriteContract(farm.poolAddress, PoolAbi);
      const signer = await getSigner();
      const owner = await signer.getAddress();
      const [tokenAddr, bal] = await Promise.all([
        (pool as any).shareToken(),
        (pool as any).investorTokenBalance(owner),
      ]);
      const token = await getWriteContract(tokenAddr, ERC20Abi);
      const [symbol, decimals] = await Promise.all([(token as any).symbol(), (token as any).decimals()]);
      setTokenSymbol(String(symbol));
      setTokenDecimals(Number(decimals));
      setShareBalance(ethers.formatUnits(bal, Number(decimals)));
    } catch (e) {
      // ignore UI errors
    } finally {
      setLoadingBalance(false);
    }
  }

  async function loadScenarioStatus() {
    try {
      if (!farm.poolAddress) return;
      const chainId = farm.chainId ?? 137;
      await ensureChain(chainId);
      const pool = await getWriteContract(farm.poolAddress, PoolAbi);
      const [sActive, fActive, canRef] = await Promise.all([
        (pool as any).successPayoutActive(),
        (pool as any).failPayoutActive(),
        (pool as any).canRefund(),
      ]);
      setSuccessActive(Boolean(sActive));
      setFailActive(Boolean(fActive));
      setRefundAvailable(Boolean(canRef));
    } catch (e) {
      // ignore UI errors
    }
  }

  async function handleBurnScenario(s: number) {
    try {
      if (!farm.poolAddress) throw new Error("Pool address not set for this project");
      setIsInvestingOnChain(true);
      const chainId = farm.chainId ?? 137;
      await switchToPolygon();
      await ensureChain(chainId);
      const pool = await getWriteContract(farm.poolAddress, PoolAbi);
      const tx = await (pool as any).burnByScenario(s);
      await tx.wait();
      alert("Finalize executed");
      await Promise.all([loadInvestorBalance(), loadScenarioStatus()]);
    } catch (err: any) {
      alert(err?.message || String(err));
    } finally {
      setIsInvestingOnChain(false);
    }
  }

  async function handleInvestOnChain() {
    try {
      setIsInvestingOnChain(true);
      // Ensure Polygon network
      await switchToPolygon();
      const chainId = farm.chainId ?? 137;
      await ensureChain(chainId);

      // USDT decimals = 6 on Polygon
      const decimals = 6;
      const amountUnits = ethers.parseUnits(amount.replace(",", "."), decimals);

      // Check allowance and approve if needed
      const tokenAddress = USDT_BY_CHAIN[chainId];
      if (!tokenAddress) throw new Error(`USDT not configured for chain ${chainId}`);
      const token = await getWriteContract(tokenAddress, ERC20Abi);
      const signer = await getSigner();
      const owner = await signer.getAddress();
      const poolAddress = farm.poolAddress;
      if (!poolAddress) throw new Error("Pool address not set for this project");
      const current = await (token as any).allowance(owner, poolAddress);
      if (current < amountUnits) {
        const approveTx = await (token as any).approve(poolAddress, MaxUint256);
        await approveTx.wait();
      }

      // Call invest(amount) on Pool
      const pool = await getWriteContract(poolAddress, PoolAbi);
      const tx = await (pool as any).invest(amountUnits);
      await tx.wait();
      alert("Invest transaction confirmed ✅");
      await Promise.all([loadInvestorBalance(), loadScenarioStatus()]);
    } catch (err: any) {
      console.error("invest error", err);
      alert(`Invest failed: ${err?.message || err}`);
    } finally {
      setIsInvestingOnChain(false);
    }
  }

  async function handleRefund() {
    try {
      setIsRefunding(true);
      const poolAddress = farm.poolAddress;
      if (!poolAddress) throw new Error("Pool address not set for this project");
      const pool = await getWriteContract(poolAddress, PoolAbi);
      const tx = await (pool as any).refund();
      await tx.wait();
      alert("Refund executed (if available on contract)");
      await Promise.all([loadInvestorBalance(), loadScenarioStatus()]);
    } catch (err: any) {
      console.error("refund error", err);
      alert(`Refund failed: ${err?.message || err}`);
    } finally {
      setIsRefunding(false);
    }
  }

  useEffect(() => {
    loadInvestorBalance();
    loadScenarioStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletConnected, farm.poolAddress]);

  const finalize = successActive
    ? {
        scenario: 1,
        label: "Finalize: Success (distribute success payout)",
        className: "bg-emerald-600 text-white hover:bg-emerald-700",
      }
    : failActive
      ? {
          scenario: 2,
          label: "Finalize: Failure (refund per fail rules)",
          className: "bg-amber-600 text-white hover:bg-amber-700",
        }
      : refundAvailable
        ? {
            scenario: 0,
            label: "Finalize: Not funded (cancel & burn)",
            className: "bg-rose-600 text-white hover:bg-rose-700",
          }
        : null;

  return (
    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-primary text-xl">{farm.icon}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{farm.status}</span>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{farm.name}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Region:</span>
          <span className="text-foreground font-medium">{farm.region}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Term:</span>
          <span className="text-foreground font-medium">{farm.term}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Projected Return:</span>
          <span className="text-primary font-semibold">{farm.projected}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Risk Level:</span>
          <span className="text-accent font-medium">{farm.riskLevel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pool:</span>
          <span className="text-foreground font-mono text-xs">
            {farm.poolAddress ? `${farm.poolAddress.slice(0, 6)}...${farm.poolAddress.slice(-4)}` : "TBA"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1">
          <span className="text-primary text-sm">✔</span>
          <span className="text-xs text-muted-foreground">Insurance</span>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-muted-foreground">Your {tokenSymbol} Balance</div>
            <div className="font-semibold">{loadingBalance ? "Loading..." : `${shareBalance} ${tokenSymbol}`}</div>
          </div>
          <button
            onClick={loadInvestorBalance}
            className="px-3 py-1 text-xs rounded-md border border-border hover:bg-muted"
            disabled={!walletConnected || !farm.poolAddress || loadingBalance}
          >
            Refresh
          </button>
        </div>
        <div>
          <label htmlFor={`amount-${farm.id}`} className="block text-sm font-medium text-muted-foreground mb-2">
            Investment Amount (USDT)
          </label>
          <input
            id={`amount-${farm.id}`}
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={!walletConnected || !farm.poolAddress}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleInvestOnChain}
            disabled={!walletConnected || isInvestingOnChain || !amount || Number(amount) <= 0 || !farm.poolAddress}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isInvestingOnChain ? "Investing..." : "Invest"}
          </button>
          <button
            onClick={async () => {
              try {
                if (!farm.poolAddress) throw new Error("Pool address not set");
                await switchToPolygon();
                const pool = await getWriteContract(farm.poolAddress, PoolAbi);
                const tokenAddr = await (pool as any).shareToken();
                const token = await getWriteContract(tokenAddr, ERC20Abi);
                const [symbol, decimals] = await Promise.all([(token as any).symbol(), (token as any).decimals()]);
                await addTokenToWallet(tokenAddr, String(symbol), Number(decimals));
                alert("Token added (or request sent) to your wallet");
              } catch (e: any) {
                alert(e?.message || String(e));
              }
            }}
            disabled={!walletConnected || !farm.poolAddress}
            className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Token to Wallet
          </button>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Finalize outcome (burn investor shares according to outcome)
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span
              className={`px-2 py-1 rounded-full border ${successActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground"}`}
            >
              Success active: {String(successActive)}
            </span>
            <span
              className={`px-2 py-1 rounded-full border ${failActive ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-muted text-muted-foreground"}`}
            >
              Failure active: {String(failActive)}
            </span>
            <span
              className={`px-2 py-1 rounded-full border ${refundAvailable ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-muted text-muted-foreground"}`}
            >
              Refund available: {String(refundAvailable)}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {finalize && (
              <button
                aria-label={finalize.label}
                onClick={() => handleBurnScenario(finalize.scenario)}
                disabled={!walletConnected || !farm.poolAddress}
                className={`w-full px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${finalize.className}`}
              >
                {finalize.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
