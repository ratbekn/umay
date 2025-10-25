"use client"

import { useState } from "react"
import { Card } from "../../app/components/ui/card"
import { Button } from "../../app/components/ui/button"
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
    mockUSDT: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    agriProject: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
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
    if (!amount || Number(amount) <= 0) {
      alert("Введите сумму для инвестирования")
      return
    }

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
    <Card className="p-6 rounded-xl border border-border bg-card hover:shadow-xl transition-shadow space-y-5">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-primary text-2xl">🌾</span>
        </div>
        <div className="flex items-center gap-2"> <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            {farm.status}</span>
        </div>
      </div>

      <h3 className="text-xl md:text-2xl font-semibold text-foreground">{farm.name}</h3>

      <div className="space-y-3 text-sm md:text-base">
        <div className="flex justify-between pb-5">
          <span className="text-muted-foreground font-medium">Region:</span>
          <span className="text-foreground font-medium">{farm.region}</span>
        </div>
        <div className="flex justify-between pb-5">
          <span className="text-muted-foreground font-medium">Term:</span>
          <span className="text-foreground font-medium">{farm.term}</span>
        </div>
        <div className="flex justify-between pb-5">
          <span className="text-muted-foreground font-medium">Projected Return:</span>
          <span className="text-primary font-semibold">{farm.projected}</span>
        </div>
        <div className="flex justify-between pb-5">
          <span className="text-muted-foreground font-medium">Risk Level:</span>
          <span className="text-foreground font-medium">{farm.riskLevel}</span>
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-sm text-muted-foreground mb-1">Amount (USDT)</label>
        <input
          type="number"
          step="any"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground"
          placeholder="0.00"
        />
      </div>

      {/* Approve token (calls ERC20.approve) */}
      <Button
        className="w-full mt-5 px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
        onClick={handleApprove}
        disabled={!walletConnected || isApproving}
      >
        {!walletConnected ? "Connect Wallet" : isApproving ? "Approving..." : "Approve USDT"}
      </Button>
      <Button
        className="w-full mt-3 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        onClick={handleInvestOnChain}
        disabled={!walletConnected || isInvestingOnChain}
      >
        {!walletConnected ? "Connect Wallet" : isInvestingOnChain ? "Investing..." : "Invest Now"}
      </Button>

      <Button
        className="w-full mt-3 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        onClick={handleRefund}
        disabled={!walletConnected || isRefunding}
      >
        {!walletConnected ? "Connect Wallet" : isRefunding ? "Refunding..." : "Request Refund"}
      </Button>
    </Card>
  )
}
