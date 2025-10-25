"use client";

import { useEffect } from "react";

import type { NextPage } from "next";
import { useRouter } from "next/navigation";

import { useAccount } from "wagmi";

const AppPage: NextPage = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-4xl font-bold mb-4">Welcome to Umay</span>
          <span className="block text-xl text-center max-w-2xl mx-auto text-base-content/70">
            Connected as: {address}
          </span>
        </h1>
      </div>

      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-base-100 p-8 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">📊 Dashboard</h2>
              <p className="text-base-content/70">View your investments and portfolio performance</p>
            </div>

            <div className="bg-base-100 p-8 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">🌾 My Projects</h2>
              <p className="text-base-content/70">Manage your agricultural projects</p>
            </div>

            <div className="bg-base-100 p-8 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">💰 Browse Projects</h2>
              <p className="text-base-content/70">Discover new investment opportunities</p>
            </div>

            <div className="bg-base-100 p-8 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">➕ Create Project</h2>
              <p className="text-base-content/70">Start fundraising for your farm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
