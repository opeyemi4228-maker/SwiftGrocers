"use client";

import React, { useEffect, useState } from "react";
import { Check, MapPin, Timer } from "lucide-react";
import toast from "react-hot-toast";
import { CITIES, COMING_SOON, resolveLocation } from "@/lib/locations";
import { useUserStore } from "@/lib/states/userStore";
import { useUIStore } from "@/lib/states/uiStore";
import { cn } from "@/lib/utils";
import Drawer from "@/components/ui/Drawer";

/**
 * Delivery-area chooser. Mounted once in the layout and opened from anywhere
 * through the UI store, so the header pill, the hero and checkout all edit the
 * same value.
 */
export default function LocationPicker() {
  const open = useUIStore((state) => state.isLocationOpen);
  const setOpen = useUIStore((state) => state.setLocationOpen);
  const deliverTo = useUserStore((state) => state.deliverTo);
  const setDeliverTo = useUserStore((state) => state.setDeliverTo);

  const current = resolveLocation(deliverTo);
  const [citySlug, setCitySlug] = useState(current.city.slug);

  useEffect(() => {
    if (open) setCitySlug(resolveLocation(deliverTo).city.slug);
  }, [open, deliverTo]);

  const city = CITIES.find((entry) => entry.slug === citySlug) ?? CITIES[0];

  const choose = (zone) => {
    setDeliverTo({ city: city.slug, zone: zone.name });
    setOpen(false);
    toast.success(`Delivering to ${zone.name}, ${city.name}`);
  };

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      side="right"
      title="Where should we deliver?"
      description="Prices are the same everywhere. Delivery times depend on your area."
      bodyClassName="px-5 py-5"
    >
      <div role="tablist" aria-label="City" className="grid grid-cols-2 gap-2">
        {CITIES.map((entry) => (
          <button
            key={entry.slug}
            type="button"
            role="tab"
            aria-selected={entry.slug === citySlug}
            onClick={() => setCitySlug(entry.slug)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-fast",
              entry.slug === citySlug
                ? "border-brand-600 bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                : "border-line text-content-strong hover:border-line-strong hover:bg-surface-sunken"
            )}
          >
            {entry.name}
            <span className="block text-2xs font-medium text-content-muted">{entry.state}</span>
          </button>
        ))}
      </div>

      <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-content-muted">
        Areas in {city.name}
      </p>
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
        {city.zones.map((zone) => {
          const selected = current.city.slug === city.slug && current.zone.name === zone.name;
          return (
            <li key={zone.name}>
              <button
                type="button"
                onClick={() => choose(zone)}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-sunken",
                  selected && "bg-brand-50 dark:bg-brand-950"
                )}
              >
                <MapPin className="h-4 w-4 shrink-0 text-content-muted" aria-hidden="true" />
                <span className="min-w-0 flex-1 text-sm font-medium text-content-strong">
                  {zone.name}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-content-muted">
                  <Timer className="h-3.5 w-3.5" aria-hidden="true" />~{zone.eta} min
                </span>
                {selected ? (
                  <Check className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs text-content-muted">
        Coming soon: {COMING_SOON.join(", ")}. Not listed? Message us on WhatsApp and we'll tell you
        the moment we reach you.
      </p>
    </Drawer>
  );
}
