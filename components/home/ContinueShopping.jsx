"use client";

import React from "react";
import { History, Repeat } from "lucide-react";
import { getProductById } from "@/lib/products";
import { ORDERS } from "@/lib/orders";
import { useHistoryStore, useHistoryHydrated } from "@/lib/states/historyStore";
import { useUserStore, useUserHydrated } from "@/lib/states/userStore";
import ProductRail from "@/components/ProductRail";

/**
 * Personal row: "Buy it again" for signed-in shoppers, otherwise whatever they
 * looked at recently. Renders nothing for a first-time visitor rather than an
 * empty shelf, and nothing until storage is read so SSR stays consistent.
 */
export default function ContinueShopping() {
  const viewed = useHistoryStore((state) => state.viewed);
  const historyReady = useHistoryHydrated();
  const user = useUserStore((state) => state.user);
  const userReady = useUserHydrated();

  if (!historyReady || !userReady) return null;

  const pastIds = user
    ? [...new Set(ORDERS.filter((order) => order.status === "delivered").flatMap((order) => order.lines.map((line) => line.product.id)))]
    : [];
  const ids = pastIds.length ? pastIds : viewed;
  const items = ids.map(getProductById).filter(Boolean);
  if (items.length < 2) return null;

  const isReorder = pastIds.length > 0;
  const Icon = isReorder ? Repeat : History;

  return (
    <section className="container-page pt-14 sm:pt-20">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-semibold sm:text-2xl">
            {isReorder ? `Buy it again, ${user.firstName ?? "friend"}` : "Pick up where you left off"}
          </h2>
          <p className="text-sm text-content-muted">
            {isReorder ? "From your last deliveries, one tap to restock." : "Things you looked at recently."}
          </p>
        </div>
      </div>
      <ProductRail products={items} />
    </section>
  );
}
