"use client"

import { useState } from "react"
import { Card } from "../../app/components/ui/card"
import { ethers, MaxUint256 } from "ethers"
import ERC20Abi from "../../app/lib/abis/ERC20.json"
import { getWriteContract } from "../../app/lib/eth"

interface Farm {
  id: number
  status: string
  name: string
  region: string
  projected: string
  riskLevel: string
  term: string
}

interface FarmCardProps {
  farm: Farm
  walletConnected: boolean
}

export function FarmCard({ farm, walletConnected }: FarmCardProps) {
  const [isInvesting, setIsInvesting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [amount, setAmount] = useState<string>("")
  const [isInvestingOnChain, setIsInvestingOnChain] = useState(false)
  const [isRefunding, setIsRefunding] = useState(false)

  const handleInvest = () => {
    setIsInvesting(true)
    setTimeout(() => {
      alert(`Investment in project "${farm.name}" completed successfully!`)
      setIsInvesting(false)
    }, 1500)
  }

  // Mapping: for demo/local we use MockUSDT -> AgriProject deployed addresses from hardhat deployments (localhost)
  const CONTRACT_ADDRESSES: Record<string, string> = {
    mockUSDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    agriProject: "0x7e84e7da2C074A631E607b698f026C899Fc6E611",
  }

  async function handleApprove() {
    try {
      setIsApproving(true)
      // choose token/spender per card — here first two cards use mockUSDT -> agriProject
      const tokenAddress = CONTRACT_ADDRESSES.mockUSDT
      const spender = CONTRACT_ADDRESSES.agriProject

      const token = await getWriteContract(tokenAddress, ERC20Abi)
  const tx = await token.approve(spender, MaxUint256)
      await tx.wait()
      alert("Approve successful — you can now invest.")
      // If user already entered amount, trigger on-chain invest automatically
      if (amount && Number(amount) > 0) {
        await handleInvestOnChain()
      }
    } catch (err: any) {
      console.error("approve error", err)
      alert(`Approve failed: ${err?.message || err}`)
    } finally {
      setIsApproving(false)
    }
  }

  // Minimal AgriProject ABI for invest(projectId, amount)
  const AgriProjectAbi = [
    { "type": "function", "name": "invest", "stateMutability": "nonpayable", "inputs": [{ "type": "uint256", "name": "_projectId" }, { "type": "uint256", "name": "_amount" }], "outputs": [] }
  ]

  // Minimal Pool ABI for refund()
  const PoolAbi = [
    { "type": "function", "name": "refund", "stateMutability": "nonpayable", "inputs": [], "outputs": [] }
  ]

  async function handleInvestOnChain() {
    try {
      setIsInvestingOnChain(true)
      // USDT decimals = 6 in this project
      const decimals = 6
      const amountUnits = ethers.parseUnits(amount.replace(',', '.'), decimals)

      const agri = await getWriteContract(CONTRACT_ADDRESSES.agriProject, AgriProjectAbi)
      const tx = await agri.invest(farm.id, amountUnits)
      await tx.wait()
      alert("Invest transaction confirmed ✅")
    } catch (err: any) {
      console.error("invest error", err)
      alert(`Invest failed: ${err?.message || err}`)
    } finally {
      setIsInvestingOnChain(false)
    }
  }

  async function handleRefund() {
    try {
      setIsRefunding(true)
      // Call refund on pool (placeholder uses agriProject address)
      const pool = await getWriteContract(CONTRACT_ADDRESSES.agriProject, PoolAbi)
      const tx = await pool.refund()
      await tx.wait()
      alert("Refund executed (if available on contract)")
    } catch (err: any) {
      console.error("refund error", err)
      alert(`Refund failed: ${err?.message || err}`)
    } finally {
      setIsRefunding(false)
    }
  }


  return (
      <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-xl">{farm.icon}</span>
          </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
           {farm.status}
          </span>
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
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <span className="text-primary text-sm">✔</span>
                    <span className="text-xs text-muted-foreground">Insurance</span>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
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
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={!walletConnected}
                    />
                  </div>
                  <button
                    onClick={handleInvestOnChain}
                    disabled={!walletConnected || isInvestingOnChain || !amount || Number(amount) <= 0}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isInvestingOnChain ? "Investing..." : "Invest"}
                  </button>
                </div>
              </div>
  )
}
