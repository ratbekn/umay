"use client";

import Image from "next/image";

import { useAccount } from "wagmi";

import { FarmCard } from "../app/components/FormCard";
import { HeroCarousel } from "../app/components/HeroCoursel";

const farms = [
  {
    id: 1,
    name: "Wheat Harvest 2025",
    region: "Naryn Valley, Kyrgyz Republic",
    term: "12 months",
    projected: "18%",
    riskLevel: "Low",
    status: "✓ Live",
    icon: "🌾",
  },
  {
    id: 2,
    name: "Organic Honey Expansion",
    region: "Issyk-Kul Highlands",
    term: "10 months",
    projected: "22%",
    riskLevel: "Medium",
    status: "✓ Live",
    icon: "🍯",
  },
  {
    id: 3,
    name: "Pasture-Fed Cattle Breeding",
    region: "Talas Valley",
    term: "14 months",
    projected: "20%",
    riskLevel: "Medium",
    status: "✓ Live",
    icon: "🐄",
  },
];

export default function App() {
  const { isConnected } = useAccount();

  return (
    <div className="h-auto min-h-0">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="logo" width={96} height={96} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <HeroCarousel />

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 text-balance">Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FarmCard key={farms[0].id} farm={farms[0]} walletConnected={isConnected} />
          <FarmCard key={farms[1].id} farm={farms[1]} walletConnected={isConnected} />
          <FarmCard key={farms[2].id} farm={farms[2]} walletConnected={isConnected} />
        </div>
      </main>
    </div>
  );
}
