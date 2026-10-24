"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/products";
import { categoryIcon } from "@/lib/categoryIcons";
import SmartImage from "@/components/ui/SmartImage";

/**
 * Aisle shortcuts. On phones it is a two-row horizontal scroller, so all
 * twelve aisles fit within one thumb-swipe instead of a screen-and-a-half of
 * vertical scrolling; from `sm` up it settles into a grid.
 */
export default function CategoryRail() {
  return (
    <div className="-mx-4 grid snap-x snap-mandatory auto-cols-[6.75rem] grid-flow-col grid-rows-2 gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid-flow-row sm:grid-cols-4 sm:grid-rows-none sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
      {CATEGORIES.map((category) => {
        const Icon = categoryIcon(category.slug);
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group relative flex snap-start flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[box-shadow,transform,border-color] duration-base ease-out-quart hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
          >
            <span className="relative aspect-[5/4] w-full overflow-hidden bg-surface-sunken">
              <SmartImage
                src={category.image}
                alt=""
                sizes="(max-width: 640px) 108px, 15vw"
                className="object-cover transition-transform duration-slow ease-out-quart group-hover:scale-110"
              />
              <span className="absolute bottom-1.5 left-1.5 grid h-7 w-7 place-items-center rounded-lg bg-surface/95 text-brand-700 shadow-sm backdrop-blur dark:text-brand-300">
                <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </span>
            </span>
            <span className="flex flex-1 items-center px-2.5 py-2 sm:px-3 sm:py-2.5">
              <span className="text-xs font-semibold leading-tight text-content-strong sm:text-sm">
                <span className="sm:hidden">{category.short}</span>
                <span className="hidden sm:inline">{category.label}</span>
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
