"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/products";
import SmartImage from "@/components/ui/SmartImage";

/** Department shortcuts. Scrolls on mobile, wraps to a grid from `sm` up. */
export default function CategoryRail() {
  return (
    <div className="rail -mx-4 px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
      {CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          href={`/shop?category=${category.slug}`}
          className="group flex w-24 shrink-0 flex-col items-center gap-3 sm:w-auto"
        >
          <span className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-sunken ring-1 ring-line transition-[box-shadow,transform] duration-base ease-out-quart group-hover:-translate-y-1 group-hover:shadow-lg">
            <SmartImage
              src={category.image}
              alt=""
              sizes="(max-width: 640px) 96px, 15vw"
              className="object-cover transition-transform duration-slow ease-out-quart group-hover:scale-105"
            />
          </span>
          <span className="text-center text-xs font-medium leading-tight text-content-strong sm:text-sm">
            {category.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
