"use client";

import { useEffect, useState } from "react";
import { useUserStore, useUserHydrated } from "@/lib/states/userStore";
import { resolveLocation } from "@/lib/locations";
import { nextDeliverySlot } from "@/lib/commerce";

/**
 * The shopper's delivery area and the slot an order placed now would get.
 *
 * Time-dependent, so it returns `slot: null` until mounted, the server render
 * and the first client render must agree, and the server cannot know the time
 * the page will be read. The slot re-computes every minute so the cut-off note
 * never goes stale on a page left open.
 */
export function useDelivery() {
  const stored = useUserStore((state) => state.deliverTo);
  const hydrated = useUserHydrated();
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const { city, zone } = resolveLocation(hydrated ? stored : null);
  const slot = now ? nextDeliverySlot(now, zone.eta) : null;

  return { city, zone, slot, chosen: hydrated && Boolean(stored), ready: Boolean(now) && hydrated };
}
