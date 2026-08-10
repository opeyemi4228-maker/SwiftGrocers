"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import SmartImage from "@/components/ui/SmartImage";

const SLIDES = [
  {
    id: "weekly",
    eyebrow: "Every Thursday",
    title: "Best-loved staples, up to 25% off",
    body: "Rotating vendor discounts on the things that actually run out — rice, oil, eggs, bread.",
    cta: { label: "Shop this week's deals", href: "/deals" },
    surface: "bg-accent-400 text-neutral-950",
    onSurface: "bg-neutral-950 text-neutral-0 hover:bg-neutral-800",
    images: [
      "1546094096-0df4bcaaa337",
      "1509440159596-0249088772ff",
      "1582722872445-44dc5f7e3c8f",
      "1474979266404-7eaacbcd87c5",
    ],
  },
  {
    id: "organic",
    eyebrow: "Certified organic",
    title: "The organic aisle, without the organic markup",
    body: "Buying direct from 42 audited farms means the certificate does not land on your receipt twice.",
    cta: { label: "Shop organic", href: "/organic-healthy" },
    surface: "bg-brand-700 text-neutral-0",
    onSurface: "bg-neutral-0 text-brand-800 hover:bg-neutral-100",
    images: [
      "1576045057995-568f588f82fb",
      "1490818387583-1baba5e638af",
      "1568702846914-96b305d2aaeb",
      "1587049352846-4a222e784d38",
    ],
  },
  {
    id: "first-order",
    eyebrow: "New here",
    title: "₦2,000 off your first basket",
    body: "No card needed until checkout, and you can still pay the driver at the door if you prefer.",
    cta: { label: "Create an account", href: "/auth" },
    surface: "bg-neutral-900 text-neutral-0",
    onSurface: "bg-accent-400 text-neutral-950 hover:bg-accent-300",
    images: [
      "1519708227418-c8fd9a32b7a2",
      "1555507036-ab1f4038808a",
      "1586201375761-83865001e31c",
      "1511381939415-e44015466834",
    ],
  },
];

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=400`;
const INTERVAL = 7000;

/**
 * Promotional carousel.
 *
 * Auto-advance is a hazard for anyone who reads slowly, uses a screen reader,
 * or is mid-tap, so it stops on hover, on focus anywhere inside, when the tab
 * is hidden, and permanently once the user touches any control. The pause
 * button is real and exposes its state — WCAG 2.2.2 asks for exactly that.
 */
export default function PromoCarousel() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const regionRef = useRef(null);

  const go = useCallback((next) => {
    setIndex((current) => (next + SLIDES.length) % SLIDES.length);
  }, []);

  const stopAuto = () => {
    setPlaying(false);
    setInteracted(true);
  };

  useEffect(() => {
    if (!playing || interacted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => go(index + 1), INTERVAL);
    return () => clearInterval(timer);
  }, [playing, interacted, index, go]);

  // Pause while the tab is in the background — advancing unseen is pointless.
  useEffect(() => {
    const onVisibility = () => setPlaying(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      stopAuto();
      go(index - 1);
    } else if (event.key === "ArrowRight") {
      stopAuto();
      go(index + 1);
    }
  };

  const slide = SLIDES[index];

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label="Promotions"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => !interacted && setPlaying(true)}
      onFocusCapture={() => setPlaying(false)}
      className="container-page"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl transition-colors duration-slow ease-out-quart",
          slide.surface
        )}
      >
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${SLIDES.length}: ${slide.title}`}
          className="grid gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-6"
        >
          <div key={slide.id} className="animate-fade-up lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-75">
              {slide.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
              {slide.title}
            </h2>
            <p className="mt-4 max-w-md text-base opacity-80">{slide.body}</p>

            <Link
              href={slide.cta.href}
              className={cn(
                "mt-7 inline-flex h-12 items-center rounded-full px-7 text-sm font-bold",
                "transition-[background-color,transform] duration-fast active:scale-[0.98]",
                slide.onSurface
              )}
            >
              {slide.cta.label}
            </Link>
          </div>

          <div className="lg:col-span-6">
            <ul className="grid grid-cols-4 gap-3 sm:gap-4">
              {slide.images.map((photo, position) => (
                <li
                  key={photo}
                  className="animate-fade-up"
                  style={{ animationDelay: `${position * 60}ms` }}
                >
                  <span className="relative block aspect-square overflow-hidden rounded-2xl bg-white/15">
                    <SmartImage
                      src={img(photo)}
                      alt=""
                      sizes="(max-width: 1024px) 22vw, 11vw"
                      className="object-cover"
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 px-8 pb-6 sm:px-12">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose promotion">
            {SLIDES.map((entry, position) => (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={position === index}
                aria-label={`Promotion ${position + 1}: ${entry.title}`}
                onClick={() => {
                  stopAuto();
                  go(position);
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-base ease-out-quart",
                  position === index
                    ? "w-8 bg-current opacity-100"
                    : "w-2 bg-current opacity-40 hover:opacity-70"
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setInteracted(true);
                setPlaying((value) => !value);
              }}
              aria-pressed={!playing}
              aria-label={playing ? "Pause promotions" : "Play promotions"}
              className="grid h-9 w-9 place-items-center rounded-full border border-current/25 transition-colors hover:bg-current/10"
            >
              {playing ? (
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                stopAuto();
                go(index - 1);
              }}
              aria-label="Previous promotion"
              className="grid h-9 w-9 place-items-center rounded-full border border-current/25 transition-colors hover:bg-current/10"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                stopAuto();
                go(index + 1);
              }}
              aria-label="Next promotion"
              className="grid h-9 w-9 place-items-center rounded-full border border-current/25 transition-colors hover:bg-current/10"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Announce slide changes without moving focus. */}
      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {SLIDES.length}: {slide.title}
      </p>
    </section>
  );
}
