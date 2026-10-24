"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { useCartStore } from "@/lib/states/cartStore";
import { cn, formatPrice } from "@/lib/utils";
import SmartImage from "@/components/ui/SmartImage";
import Button from "@/components/ui/Button";

/** "Frequently bought together": the current item plus two pairings, all pre-ticked. */
export default function FrequentlyBought({ product, companions }) {
  const all = [product, ...companions];
  const [picked, setPicked] = useState(() => new Set(all.map((item) => item.id)));
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const chosen = all.filter((item) => picked.has(item.id));
  const total = chosen.reduce((sum, item) => sum + item.price, 0);

  const toggle = (id) =>
    setPicked((previous) => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
      <h2 className="text-xl font-semibold">Frequently bought together</h2>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
        <ul className="flex flex-1 items-center gap-2 sm:gap-4">
          {all.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 ? <Plus className="h-4 w-4 shrink-0 text-content-muted" aria-hidden="true" /> : null}
              <li className="min-w-0 flex-1">
                <label className={cn("block cursor-pointer transition-opacity", !picked.has(item.id) && "opacity-45")}>
                  <span className="relative block aspect-square overflow-hidden rounded-2xl bg-surface-sunken">
                    <SmartImage src={item.image} alt="" sizes="(max-width: 640px) 28vw, 160px" className="object-cover" />
                    <input
                      type="checkbox"
                      checked={picked.has(item.id)}
                      onChange={() => toggle(item.id)}
                      aria-label={`Include ${item.name}`}
                      className="absolute left-2 top-2 h-5 w-5 rounded accent-[hsl(var(--brand-600))]"
                    />
                  </span>
                  <span className="mt-2 line-clamp-2 block text-xs font-medium text-content-strong">
                    {index === 0 ? <span className="font-bold">This item: </span> : null}
                    {index === 0 ? item.name : <Link href={`/product/${item.slug}`} className="hover:underline">{item.name}</Link>}
                  </span>
                  <span className="tabular block text-xs font-bold text-content-strong">{formatPrice(item.price)}</span>
                </label>
              </li>
            </React.Fragment>
          ))}
        </ul>
        <div className="shrink-0 rounded-2xl bg-surface-sunken p-5 lg:w-64">
          <p className="text-sm text-content-muted">Total for {chosen.length} item{chosen.length === 1 ? "" : "s"}</p>
          <p className="tabular text-2xl font-bold text-content-strong">{formatPrice(total)}</p>
          <Button
            block
            className="mt-4"
            disabled={!chosen.length}
            onClick={() => {
              chosen.forEach((item) => addItem(item, 1));
              toast.success(`${chosen.length} items added`);
              openCart();
            }}
          >
            Add {chosen.length === all.length ? "all " : ""}{chosen.length} to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
