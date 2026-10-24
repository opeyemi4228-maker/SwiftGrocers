"use client";

import React from "react";
import { Bike } from "lucide-react";
import { useDelivery } from "@/lib/useDelivery";
import { useUIStore } from "@/lib/states/uiStore";
import { cn } from "@/lib/utils";

/**
 * The live delivery card on the hero photograph. Every number on it is
 * computed from the shopper's area and the real same-day cut-off, so the
 * urgency is true: when the cut-off passes, the card says tomorrow.
 */
export default function HeroSlotCard({ className }) {
  const { slot, zone, city } = useDelivery();
  const open = useUIStore((state) => state.setLocationOpen);

  return (
    <button
      type="button"
      onClick={() => open(true)}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 pr-5 text-left shadow-xl transition-transform duration-base ease-out-quart hover:-translate-y-0.5",
        className
      )}
    >
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-neutral-0">
        <Bike className="h-5 w-5" aria-hidden="true" />
        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-surface bg-accent-500" />
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-2xs font-semibold uppercase tracking-wider text-content-muted">
          Next slot · {zone.name}, {city.name}
        </span>
        <span className="tabular block text-sm font-bold text-content-strong">
          {slot ? slot.label : "Checking riders near you…"}
        </span>
        <span className="block text-xs text-content-muted">
          {slot ? slot.cutoffNote : " "}
        </span>
      </span>
    </button>
  );
}
