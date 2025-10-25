"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isConnected && address && !isRedirecting) {
      setIsRedirecting(true);
      setTimeout(() => {
        router.push("/app");
      }, 500);
    }
  }, [isConnected, address, router, isRedirecting]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-cover bg-center rounded-3xl mx-4 mt-4" style={{backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200')"}}>
        <div className="absolute inset-0 bg-black/40 rounded-3xl" />
        <div className="relative h-full flex flex-col justify-center px-8 text-white">
          <h1 className="text-5xl font-bold mb-4">Part of future<br/>Agriculture</h1>
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl inline-block w-fit">
            <div className="text-sm font-semibold">200+</div>
            <div className="text-xs">FARMERS</div>
          </div>
        </div>
      </section>

      {/* Business Overview */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold text-green-600 mb-6">🌾 UMAY<br/>Business Overview</h2>
          <div className="space-y-4 text-gray-700">
            <p>Umay is a decentralized platform that connects crypto investors with agricultural opportunities in Kyrgyzstan.</p>
            <p>Our platform enables transparent, secure, and efficient investment in agricultural projects using blockchain technology and stablecoins.</p>
            <p>We make it a complete solution for both farmers seeking funding and investors looking for agricultural investment opportunities.</p>
            <p>With Umay, you can invest in real agricultural projects, track your returns, and support sustainable farming practices in Kyrgyzstan.</p>
          </div>
        </div>
        <div className="bg-gray-900 rounded-3xl h-80"></div>
      </section>

      {/* Our Mission */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-green-600 mb-8">Our mission</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">DECENTRALIZED FUNDING</h3>
            <p className="text-sm text-gray-300">Connect farmers directly with global investors through blockchain technology</p>
          </div>
          <div className="bg-gray-900 text-white p-6 rounded-2xl">
            <h3 className="text-green-500 text-xl font-bold mb-3">TRANSPARENT ECOSYSTEM</h3>
            <p className="text-sm text-gray-300">All transactions and project progress recorded on-chain for complete transparency</p>
          </div>
          <div className="bg-gray-900 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">SUSTAINABLE GROWTH</h3>
            <p className="text-sm text-gray-300">Support agricultural development while earning returns on your investment</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-green-600 text-center mb-12">Our products</h2>
        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-3xl flex items-center gap-6">
            <div className="text-6xl">🌾</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Barley</h3>
              <p className="text-sm text-gray-300">Invest in barley production projects with transparent tracking from seed to harvest. Our farmers use sustainable practices to ensure high-quality yields and consistent returns for investors.</p>
            </div>
          </div>
          <div className="bg-gray-900 text-white p-8 rounded-3xl flex items-center gap-6">
            <div className="text-6xl">🐑</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Sheep</h3>
              <p className="text-sm text-gray-300">Support sheep farming projects in Kyrgyzstan's highland regions. Invest in wool and meat production with full traceability and fair returns for both farmers and investors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-cover bg-center rounded-3xl p-12 relative h-96" style={{backgroundImage: "url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200')"}}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent rounded-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-green-500 mb-8">Статистика</h2>
            <div className="space-y-3 text-white">
              <div className="text-xl"><span className="font-bold text-2xl">2019</span> - Founded</div>
              <div className="text-xl"><span className="font-bold text-2xl">+128K</span> - Active Users</div>
              <div className="text-xl"><span className="font-bold text-2xl">245K</span> - Projects Funded</div>
              <div className="text-xl"><span className="font-bold text-2xl">+33K</span> - Total Investments</div>
              <div className="text-xl"><span className="font-bold text-2xl">+14%</span> - Average Returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-green-500 py-24 my-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Как это работает? (Схема)</h2>
          <p className="text-xl opacity-90">Simple and transparent investment process</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-green-600 text-center mb-8">FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "Question 1", a: "Q1" },
            { q: "question 2", a: "Q2" },
            { q: "question 3", a: "Q3" },
            { q: "question 4", a: "Q4" }
          ].map((item, i) => (
            <div key={i} className="bg-white border-2 border-green-500 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{item.q}</h3>
                <span className="text-green-500 font-bold">{item.a}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-cover bg-center rounded-3xl h-96 flex items-center justify-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1589395937772-9c0d0d6e593b?w=1200')"}}>
          <div className="bg-black/50 px-12 py-6 rounded-2xl text-white text-center">
            <div className="text-6xl mb-4">▶️</div>
            <p className="text-2xl font-bold">intro for us</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-cover bg-center rounded-3xl p-16 relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200')"}}>
          <div className="absolute inset-0 bg-black/40 rounded-3xl" />
          <div className="relative text-center text-white">
            <h2 className="text-4xl font-bold mb-2">Top model for agriculture</h2>
            <p className="text-2xl mb-8">Ready, Steady, Go</p>
            <div className="flex gap-4 justify-center">
              <input type="email" placeholder="Email" className="px-6 py-3 rounded-full w-64" />
              <button className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-green-500 font-bold text-xl mb-4">🌾 UMAY</h3>
            <p className="text-sm text-gray-400 mb-4">Decentralized agricultural investment platform for Kyrgyzstan</p>
            <div className="flex gap-3">
              {["📘", "🐦", "📷", "💼", "📺"].map((icon, i) => (
                <div key={i} className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs">{icon}</div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>About Us</li>
              <li>Our Blog</li>
              <li>Contact Us</li>
              <li>Invest Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Where to Buy</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Buy the direct</li>
              <li>Go for dealer</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Popular Products</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Sheep</li>
              <li>Barley</li>
              <li>Wheat</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400 text-center">
          Copyright 2025 Umay
        </div>
      </footer>
    </div>
  );
};

export default Home;
