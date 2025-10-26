"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Invest in the Future of Agriculture",
    description: "Earn stable income from verified farming projects",
    image: "/organic-vegetable-farm-field.jpg",
  },
  {
    id: 2,
    title: "Transparency and Reliability",
    description: "All projects undergo a thorough review before being listed",
    image: "/wheat-farm-golden-field.jpg",
  },
  {
    id: 3,
    title: "High Profitability",
    description: "Earn up to 24% APY from real agricultural ventures",
    image: "/fruit-orchard-apple-trees.jpg",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-card mb-12">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-12 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">{slide.title}</h2>
            <p className="text-xl text-white/90 text-pretty">{slide.description}</p>
          </div>
        </div>
      ))}

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
        onClick={prevSlide}
      ></button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
        onClick={nextSlide}
      ></button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-primary w-8" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
