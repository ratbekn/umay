"use client";

import { FarmCard } from "../app/components/FormCard"
import { CustomConnectButton } from "../app/components/CustomButton"
import { HeroCarousel } from "../app/components/HeroCoursel"
import { useAccount } from "wagmi"
import Image from "next/image"

const farms = [
  {
    id: 1,
    name: "Wheat Harvest 2025",
    region: "Naryn Valley, Kyrgyz Republic",
    term: "12 months",
    projected: "18%",
    riskLevel: "Low",
    status:"active"
  },
  {
    id: 2,
    name: "Organic Honey Expansion",
    region: "Organic Honey Expansion",
    term: "10 months",
    projected: "22%",
    riskLevel: "Medium",
    status:"active"
  },
  {
    id: 3,
    name: "Pasture-Fed Cattle Breeding",
    region: "Talas Valley",
    term: "14 months",
    projected: "20%",
    riskLevel: "Medium",
    status:"active"
  },
]

export default function App() {
  const { isConnected } = useAccount()

   return (
    <div className="h-auto min-h-0">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg" 
              alt="Logo"
              width={100}
              height={100}
              className="rounded-md"
            />
          </div>
         <div className="flex items-center gap-3">
          <CustomConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <HeroCarousel />

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 text-balance">
            Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <FarmCard key={farm.id} farm={farm} walletConnected={isConnected} />
          ))}
        </div>
      </main>
    </div>
  )
}
