"use client"

import React from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { switchToPolygon } from "../lib/eth"
import { Button } from "../../app/components/ui/button"
import { Wallet, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../app/components/ui/dropdown"

export const CustomConnectButton = () => {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Ensure wallet is on local Hardhat (31337) after connecting
  React.useEffect(() => {
    if (isConnected) {
      // call helper that uses window.ethereum to switch/add the Hardhat chain
      switchToPolygon().catch((e) => console.warn("Failed to switch/add Hardhat chain", e))
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2 bg-[#64BF43] text-white hover:bg-[#57a63b] transition-colors">
            <Wallet className="w-4 h-4 text-white" />
            Connect Wallet
            <ChevronDown className="w-4 h-4 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {connectors.map((connector) => (
            <DropdownMenuItem
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              {connector.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-xs text-muted-foreground">Connected</span>
        <span className="text-sm font-mono text-foreground">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
      <Button
        onClick={() => disconnect()}
        size="sm"
        className="bg-[#64BF43] text-white hover:bg-[#57a63b] transition-colors"
      >
        Disconnect
      </Button>
    </div>
  )
}
