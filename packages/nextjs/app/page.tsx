"use client";

import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-6xl font-bold mb-4">🌾 Umay</span>
            <span className="block text-2xl mb-2">Agricultural Investment Platform</span>
            <span className="block text-xl text-center max-w-2xl mx-auto text-base-content/70">
              Connecting crypto investors with agricultural opportunities in Kyrgyzstan
            </span>
          </h1>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row max-w-6xl mx-auto">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-xl">
              <span className="text-5xl mb-4">💰</span>
              <h3 className="text-xl font-bold mb-4">For Investors</h3>
              <p className="mb-6">Browse agricultural projects, invest with stablecoins, and earn returns</p>
              <Link
                href="/projects"
                className="btn btn-primary"
              >
                Explore Projects
              </Link>
            </div>

            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-xl">
              <span className="text-5xl mb-4">🚜</span>
              <h3 className="text-xl font-bold mb-4">For Farmers</h3>
              <p className="mb-6">Raise funds for your agricultural projects quickly and transparently</p>
              <Link
                href="/create-project"
                className="btn btn-secondary"
              >
                Create Project
              </Link>
            </div>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary text-primary-content w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h4 className="font-bold mb-2">Create or Browse</h4>
                <p className="text-sm">Farmers create projects, investors browse opportunities</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-primary-content w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h4 className="font-bold mb-2">Invest with Stablecoins</h4>
                <p className="text-sm">Investors fund projects using USDT or other stablecoins</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-primary-content w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h4 className="font-bold mb-2">Earn Returns</h4>
                <p className="text-sm">Project completes, returns distributed to investors</p>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-base-100 rounded-3xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Why Umay?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-bold">Transparent</h4>
                  <p className="text-sm">All transactions recorded on blockchain</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-bold">Fast Funding</h4>
                  <p className="text-sm">Quick access to capital for farmers</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h4 className="font-bold">Secure</h4>
                  <p className="text-sm">Smart contract-based protection</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🌍</span>
                <div>
                  <h4 className="font-bold">Global Access</h4>
                  <p className="text-sm">Connect investors worldwide with Kyrgyz agriculture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
