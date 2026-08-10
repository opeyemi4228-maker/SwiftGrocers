"use client";

import React from "react";
import Link from "next/link";
import { Clock, Star, Truck } from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { categoryIcon } from "@/lib/categoryIcons";
import { formatPrice } from "@/lib/utils";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/commerce";
import SmartImage from "@/components/ui/SmartImage";
import SearchBox from "@/components/layout/SearchBox";

const QUICK_PICKS = CATEGORIES.slice(0, 6);

/**
 * Hero.
 *
 * Search-first. On a grocery marketplace people arrive with a list, not a
 * browsing mood, so the primary action is the search field rather than a pair
 * of generic CTAs. The quick picks underneath give the undecided a one-tap
 * route in without adding a second competing headline.
 *
 * Imagery is a single anchored photograph with one offset detail shot — a
 * collage of equal-weight tiles reads as clutter and gives the eye nowhere to
 * land first.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Soft brand wash, kept behind everything so type contrast never depends on it. */}
      <div className="absolute inset-0 -z-10 bg-brand-mesh" aria-hidden="true" />
      <div
        className="absolute -right-32 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-brand-200/35 blur-3xl dark:bg-brand-800/20"
        aria-hidden="true"
      />

      <div className="container-page grid items-center gap-14 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
        {/* --- Copy + search --- */}
        <div className="lg:col-span-7 xl:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-brand-800 backdrop-blur dark:border-brand-800 dark:text-brand-200">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
            </span>
            Delivering now in Lagos, Abuja &amp; Port Harcourt
          </span>

          <h1 className="mt-6 text-[2.75rem] font-bold leading-[1.02] tracking-tight text-content-strong sm:text-6xl xl:text-[4.25rem]">
            Fresh food.
            <br />
            <span className="text-brand-700 dark:text-brand-400">Two hours.</span> Done.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-content-muted">
            Type what you need. We pick it from farms and vendors this morning and hand it to you
            before dinner.
          </p>

          {/* The primary action. */}
          <div className="mt-8 max-w-xl">
            <SearchBox size="lg" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-content-muted">Popular:</span>
            {QUICK_PICKS.map((category) => {
              const Icon = categoryIcon(category.slug);
              return (
                <Link
                  key={category.slug}
                  href={`/shop?category=${category.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-xs font-medium text-content backdrop-blur transition-colors duration-fast hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800 dark:hover:bg-brand-950 dark:hover:text-brand-200"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  {category.label}
                </Link>
              );
            })}
          </div>

          {/* Trust, stated inline rather than boxed into a stat grid. */}
          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-content-muted">
            <li className="inline-flex items-center gap-2">
              <Star className="h-4 w-4 shrink-0 text-accent-400" fill="currentColor" strokeWidth={0} aria-hidden="true" />
              <span>
                <span className="font-semibold text-content-strong">4.8</span> from 12,400 orders
              </span>
            </li>
            <li className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <span>
                Free over{" "}
                <span className="tabular font-semibold text-content-strong">
                  {formatPrice(FREE_DELIVERY_THRESHOLD)}
                </span>
              </span>
            </li>
            <li className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <span>Refunded if it is not fresh</span>
            </li>
          </ul>
        </div>

        {/* --- Imagery --- */}
        <div className="relative pb-14 lg:col-span-5 lg:col-start-8 lg:pb-0 xl:col-span-6 xl:col-start-7">
          <figure className="relative ml-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-surface-sunken shadow-xl xl:max-w-lg">
            <SmartImage
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=75&w=1000"
              alt="A basket of freshly picked vegetables"
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </figure>

          {/*
            The delivery card sits on the page, overlapping the frame's edge,
            rather than floating on the photograph. Translucent panels over
            imagery are a legibility trap: contrast then depends on whatever
            pixels happen to be underneath, which no token can guarantee.
          */}
          <div className="absolute bottom-0 left-0 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 pr-5 shadow-xl lg:-bottom-6 lg:left-2">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-neutral-0">
              <Truck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-content-strong">
                Next slot: today, 2:40 PM
              </span>
              <span className="block text-xs text-content-muted">
                Order within 40 minutes to make it
              </span>
            </span>
          </div>

          {/* One offset detail shot for depth. Hidden where it would crowd. */}
          <figure className="absolute -left-4 top-10 hidden h-36 w-36 overflow-hidden rounded-3xl border-4 border-canvas bg-surface-sunken shadow-xl xl:block xl:h-44 xl:w-44">
            <SmartImage
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=75&w=500"
              alt="A loaf of bread fresh from the oven"
              sizes="176px"
              className="object-cover"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
