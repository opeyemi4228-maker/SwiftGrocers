"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

// Hero slides data
const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=800&fit=crop",
    alt: "Fresh fruits and vegetables",
    headline: "Farm-Fresh Groceries Delivered to Your Door",
    subheadline:
      "Quality produce, pantry staples, and more. Free delivery on orders over ₦10,000",
    ctaPrimary: { text: "Shop Fresh Now", href: "#products" },
    ctaSecondary: { text: "See How It Works", href: "#how-it-works" },
    theme: "light",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1200&h=800&fit=crop",
    alt: "Delivery person handing groceries to customer",
    headline: "Get Your Groceries in 2 Hours or Less",
    subheadline:
      "Same-day delivery across Lagos, Abuja, and Port Harcourt. Schedule delivery at your convenience",
    ctaPrimary: { text: "Order Now", href: "#products" },
    badge: "FREE DELIVERY",
    theme: "light",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1200&h=800&fit=crop",
    alt: "Happy family unpacking groceries",
    headline: "Save ₦2,000 on Your First Order",
    subheadline:
      "New to Swift Grocers? Get instant savings on your first grocery delivery",
    ctaPrimary: { text: "Claim Your Offer", href: "#signup" },
    promoCode: "Use code: FRESH2000",
    theme: "light",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=800&fit=crop",
    alt: "Local vendor with produce",
    headline: "Sell Your Products to Thousands of Customers",
    subheadline:
      "Join our marketplace and grow your business. Low fees, powerful tools, and marketing support",
    ctaPrimary: { text: "Become a Vendor", href: "#vendor" },
    trustIndicator: "2,000+ Vendors Trust Swift Grocers",
    theme: "light",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=1200&h=800&fit=crop",
    alt: "Shopping cart with discounts",
    headline: "Flash Sale: Up to 50% Off This Week",
    subheadline:
      "Limited-time offers on your favorite brands. Save big on essentials and treats",
    ctaPrimary: { text: "Shop Deals", href: "#deals" },
    countdown: true,
    theme: "light",
  },
];

// Single slide
function Slide({ slide, isActive }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const defaultMs = 2 * 3600 * 1000 + 15 * 60 * 1000 + 30 * 1000;
    const endTs = slide.countdownEnd
      ? new Date(slide.countdownEnd).getTime()
      : Date.now() + defaultMs;
    return Math.max(0, endTs - Date.now());
  });

  useEffect(() => {
    if (!slide.countdown) return;
    const endTs = slide.countdownEnd
      ? new Date(slide.countdownEnd).getTime()
      : Date.now() + timeLeft;

    const tick = () => {
      const remaining = Math.max(0, endTs - Date.now());
      setTimeLeft(remaining);
    };

    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [slide.countdown, slide.countdownEnd, timeLeft]);

  const formatTime = (ms) => {
    const total = Math.floor(ms / 1000);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const ended = timeLeft <= 0;

  return (
    <motion.div
      className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isActive ? { opacity: 1 } : { opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      aria-hidden={!isActive}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt={slide.alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content Container with proper padding for navbar */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 w-full">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left max-w-xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {slide.headline}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 leading-relaxed">
            {slide.subheadline}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href={slide.ctaPrimary.href}
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg transition-colors font-semibold text-base sm:text-lg"
            >
              {slide.ctaPrimary.text}
            </a>

            {slide.ctaSecondary && (
              <a
                href={slide.ctaSecondary.href}
                className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-colors font-semibold text-base sm:text-lg"
              >
                {slide.ctaSecondary.text}
              </a>
            )}
          </div>

          {/* Badges and indicators */}
          <div className="mt-4 flex flex-wrap gap-2">
            {slide.badge && (
              <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 font-semibold rounded-full text-sm">
                {slide.badge}
              </span>
            )}
            {slide.promoCode && (
              <span className="inline-block px-3 py-1 bg-white/90 text-gray-900 font-semibold rounded-full text-sm">
                {slide.promoCode}
              </span>
            )}
            {slide.trustIndicator && (
              <span className="inline-block px-3 py-1 bg-white/90 text-gray-900 font-semibold rounded-full text-sm">
                {slide.trustIndicator}
              </span>
            )}

            {/* Countdown (dynamic) */}
            {slide.countdown && (
              <span
                aria-live="polite"
                className="inline-block px-3 py-1 bg-red-500 text-white font-semibold rounded-full text-sm"
              >
                {ended ? "Deal ended" : `Ends in: ${formatTime(timeLeft)}`}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Carousel dots
function CarouselDots({ total, current, onChange }) {
  return (
    <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all ${
            current === i ? "bg-white w-6 md:w-8" : "bg-white/50 hover:bg-white/75"
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

// Controls
function CarouselControls({ onPrev, onNext }) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Previous slide"
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
      </button>
      <button
        onClick={onNext}
        aria-label="Next slide"
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
      </button>
    </>
  );
}

// Hero Carousel
export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const total = heroSlides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total]
  );
  const goTo = useCallback((index) => setCurrent((index + total) % total), [
    total,
  ]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, isAutoPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === " ") {
        e.preventDefault();
        setIsAutoPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  return (
    <section className="hero relative w-full overflow-hidden mt-16 md:mt-20">
      <AnimatePresence mode="wait">
        {heroSlides.map(
          (slide, idx) =>
            idx === current && <Slide key={slide.id} slide={slide} isActive />
        )}
      </AnimatePresence>

      <CarouselControls onPrev={prev} onNext={next} />
      <CarouselDots total={total} current={current} onChange={goTo} />

      {/* Play/Pause */}
      <button
        onClick={() => setIsAutoPlaying((p) => !p)}
        className="absolute bottom-6 md:bottom-8 right-4 md:right-8 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
        aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isAutoPlaying ? (
          <Pause className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
        ) : (
          <Play className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
        )}
      </button>
    </section>
  );
}