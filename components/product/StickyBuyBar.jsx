"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import SmartImage from "@/components/ui/SmartImage";

/** Keeps "add" one thumb-tap away on long product pages, without covering the tab bar. */
export default function StickyBuyBar({ product, price, visible, onAdd }) {
  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-[var(--tabbar-height)] z-header border-t border-line bg-surface/95 backdrop-blur-xl transition-transform duration-base ease-out-quart safe-bottom lg:bottom-0",
        visible ? "translate-y-0" : "pointer-events-none translate-y-[120%]"
      )}
    >
      <div className="container-page flex items-center gap-3 py-2.5">
        <span className="relative hidden h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-sunken sm:block">
          <SmartImage src={product.image} alt="" sizes="44px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-content-strong">{product.name}</p>
          <p className="tabular text-xs text-content-muted">{formatPrice(price)} · {product.unit}</p>
        </div>
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={onAdd}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-bold text-primary-content transition-colors hover:bg-brand-700"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Add
        </button>
      </div>
    </div>
  );
}
