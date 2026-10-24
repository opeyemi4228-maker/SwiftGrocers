"use client";

import React from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { useDelivery } from "@/lib/useDelivery";
import { useUIStore } from "@/lib/states/uiStore";
import { cn } from "@/lib/utils";

/**
 * Inline "Arrives today by 2:45 PM · Lekki Phase 1" line. Tapping it opens the
 * area picker. Renders a stable placeholder until the clock is known.
 */
export default function DeliverySlot({ className, prefix = "Arrives", showArea = true }) {
  const { slot, zone } = useDelivery();
  const openPicker = useUIStore((state) => state.setLocationOpen);

  return (
    <button
      type="button"
      onClick={() => openPicker(true)}
      className={cn(
        "group inline-flex items-center gap-1.5 text-left text-sm text-content-muted transition-colors hover:text-content-strong",
        className
      )}
    >
      <MapPin className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
      <span>
        {prefix}{" "}
        <span className="font-semibold text-content-strong">
          {slot ? slot.label.replace(/^Today/, "today").replace(/^Tomorrow/, "tomorrow") : "today"}
        </span>
        {showArea ? (
          <>
            {" "}
            to <span className="font-medium text-content-strong underline decoration-dotted underline-offset-4">{zone.name}</span>
          </>
        ) : null}
      </span>
      <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
    </button>
  );
}
