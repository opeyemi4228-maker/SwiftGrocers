"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Truck, ArrowRight } from "lucide-react";
import { useCartStore, selectSubtotal, useCartHydrated } from "@/lib/states/cartStore";
import { priceOrder, FREE_DELIVERY_THRESHOLD } from "@/lib/commerce";
import { formatPrice, cn } from "@/lib/utils";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import QuantityStepper from "@/components/ui/QuantityStepper";
import SmartImage from "@/components/ui/SmartImage";
import EmptyState from "@/components/ui/EmptyState";

function FreeDeliveryMeter({ subtotal }) {
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const unlocked = remaining === 0;

  return (
    <div className="rounded-xl bg-surface-sunken p-3">
      <p className="flex items-center gap-2 text-xs font-medium text-content">
        <Truck className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
        {unlocked ? (
          <span className="font-semibold text-brand-700 dark:text-brand-300">
            Free delivery unlocked
          </span>
        ) : (
          <span>
            <span className="tabular font-semibold text-content-strong">{formatPrice(remaining)}</span>{" "}
            away from free delivery
          </span>
        )}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress towards free delivery"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-slow ease-out-expo",
            unlocked ? "bg-brand-500" : "bg-accent-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/** Mini cart. Reachable from the header and the mobile tab bar on every page. */
export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore(selectSubtotal);
  const hydrated = useCartHydrated();

  const { delivery, total } = priceOrder(subtotal);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Drawer
      open={isOpen && hydrated}
      onClose={closeCart}
      side="right"
      title="Your cart"
      description={itemCount === 1 ? "1 item" : `${itemCount} items`}
      bodyClassName="px-5 py-4"
      footer={
        items.length > 0 ? (
          <div className="space-y-3">
            <FreeDeliveryMeter subtotal={subtotal} />

            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-content-muted">Subtotal</dt>
                <dd className="tabular font-medium text-content-strong">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-content-muted">Delivery</dt>
                <dd className="tabular font-medium text-content-strong">
                  {delivery === 0 ? "Free" : formatPrice(delivery)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-1.5 text-base">
                <dt className="font-semibold text-content-strong">Total</dt>
                <dd className="tabular font-semibold text-content-strong">{formatPrice(total)}</dd>
              </div>
            </dl>

            <div className="grid gap-2">
              <Button href="/payment" onClick={closeCart} size="lg" block trailingIcon={ArrowRight}>
                Checkout
              </Button>
              <Button href="/cart" onClick={closeCart} variant="ghost" size="sm" block>
                View full cart
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse fresh produce, pantry staples and weekly deals to get started."
          action={
            <Button href="/shop" onClick={closeCart}>
              Start shopping
            </Button>
          }
          className="border-0 bg-transparent py-10"
        />
      ) : (
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 py-3 first:pt-0">
              <Link
                href={`/product/${item.slug}`}
                onClick={closeCart}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-sunken"
              >
                <SmartImage src={item.image} alt={item.name} sizes="80px" className="object-cover" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={closeCart}
                    className="line-clamp-2 text-sm font-medium text-content-strong hover:text-brand-700 dark:hover:text-brand-300"
                  >
                    {item.name}
                  </Link>
                  {item.unit ? (
                    <p className="mt-0.5 text-xs text-content-muted">{item.unit}</p>
                  ) : null}
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    max={item.maxStock ?? 99}
                    onChange={(quantity) => setQuantity(item.id, quantity)}
                    onRemove={() => removeItem(item.id)}
                  />
                  <span className="tabular text-sm font-semibold text-content-strong">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
