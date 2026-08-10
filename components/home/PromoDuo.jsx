import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";

const PROMOS = [
  {
    href: "/organic-healthy",
    eyebrow: "Certified organic",
    title: "The organic aisle, without the organic price",
    body: "Vegetables, grains and pantry staples from farms we audit ourselves.",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=70&w=1200",
    span: "lg:col-span-7",
  },
  {
    href: "/seasonal-specials",
    eyebrow: "In season now",
    title: "What's good this month",
    body: "Peak-season produce at its cheapest and best.",
    image:
      "https://images.unsplash.com/photo-1476124369491-f7addf5dd2f8?auto=format&fit=crop&q=70&w=1000",
    span: "lg:col-span-5",
  },
];

/**
 * Two editorial promos at a 7/5 split. The gradient runs from the text side
 * only, so the photography stays visible instead of being flattened by a scrim.
 */
export default function PromoDuo() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {PROMOS.map((promo) => (
        <Link
          key={promo.href}
          href={promo.href}
          className={`group relative flex min-h-[19rem] flex-col justify-end overflow-hidden rounded-3xl p-7 sm:min-h-[22rem] sm:p-9 ${promo.span}`}
        >
          <SmartImage
            src={promo.image}
            alt=""
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-slow ease-out-quart group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/45 to-transparent"
            aria-hidden="true"
          />

          <div className="relative max-w-md">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              {promo.eyebrow}
            </span>
            <h3 className="mt-2.5 text-2xl font-bold leading-tight text-white sm:text-3xl">
              {promo.title}
            </h3>
            <p className="mt-2.5 text-sm text-white/80">{promo.body}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
              Shop the edit
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-base ease-out-quart group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
