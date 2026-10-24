"use client";

import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowRight, CalendarClock, Coins, MessageCircle, Plus, ShoppingBag, Truck } from "lucide-react";
import { useCartStore, selectSubtotal, useCartHydrated } from "@/lib/states/cartStore";
import { useUserStore, signInHref } from "@/lib/states/userStore";
import { priceOrder, pointsFor, FREE_DELIVERY_THRESHOLD } from "@/lib/commerce";
import { getBestsellers, getRelatedProducts, getProductById, products } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import QuantityStepper from "@/components/ui/QuantityStepper";
import SmartImage from "@/components/ui/SmartImage";

function FreeDeliveryMeter({ subtotal }) {
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const unlocked = remaining === 0;

  return (
    <div className="rounded-xl bg-surface-sunken p-3">
      <p className="flex items-center gap-2 text-xs font-medium text-content">
        <Truck className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
        {unlocked ? (
          <span className="font-semibold text-brand-700 dark:text-brand-300">You&apos;ve unlocked free delivery</span>
        ) : (
          <span>
            Add <span className="tabular font-semibold text-content-strong">{formatPrice(remaining)}</span> more for free delivery
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
          className={cn("h-full rounded-full transition-[width] duration-slow ease-out-expo", unlocked ? "bg-brand-500" : "bg-accent-500")}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Suggestions sized to the gap: things that cost about what is missing, so
 * one tap finishes the job. Shown only while delivery is still charged.
 */
function GapFiller({ remaining, inCart, onAdd }) {
  if (remaining <= 0) return null;
  // Things that go with what's already in the cart come first; price fit breaks ties.
  const related = new Set(
    [...inCart].flatMap((id) => getRelatedProducts(getProductById(id), 6).map((product) => product.id))
  );
  const picks = products
    .filter((product) => !inCart.has(product.id) && product.stock > 0 && product.price >= remaining * 0.4)
    .sort(
      (a, b) =>
        Number(related.has(b.id)) - Number(related.has(a.id)) ||
        Math.abs(a.price - remaining) - Math.abs(b.price - remaining)
    )
    .slice(0, 3);
  if (!picks.length) return null;

  return (
    <div className="mt-5 rounded-2xl border border-dashed border-line-strong p-3">
      <p className="px-1 text-xs font-semibold text-content-strong">Close the gap with one of these</p>
      <ul className="mt-2 space-y-1">
        {picks.map((product) => (
          <li key={product.id} className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-surface-sunken">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
              <SmartImage src={product.image} alt="" sizes="40px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-content-strong">{product.name}</span>
              <span className="tabular block text-xs text-content-muted">{formatPrice(product.price)}</span>
            </span>
            <button
              type="button"
              onClick={() => onAdd(product)}
              aria-label={`Add ${product.name}`}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-primary-content transition-colors hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Mini cart. Reachable from the header and the mobile tab bar on every page. */
export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const checkoutHref = useUserStore((state) => state.user) ? "/payment" : signInHref("/payment");
  const addItem = useCartStore((state) => state.addItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore(selectSubtotal);
  const hydrated = useCartHydrated();

  const { delivery, total, freeDeliveryRemaining } = priceOrder(subtotal);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const savings = items.reduce(
    (sum, item) => sum + (item.originalPrice > item.price ? (item.originalPrice - item.price) * item.quantity : 0),
    0
  );
  const inCart = new Set(items.map((item) => item.productId ?? item.id));

  const quickAdd = (product) => {
    addItem(product, 1);
    toast.success(`${product.name} added`);
  };

  const shareText = `My SwiftGrocers cart (${formatPrice(total)}):\n${items
    .map((item) => `• ${item.quantity} × ${item.name}`)
    .join("\n")}`;

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
                <dd className="tabular font-medium text-content-strong">{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-1.5 text-base">
                <dt className="font-semibold text-content-strong">Total</dt>
                <dd className="tabular font-bold text-content-strong">{formatPrice(total)}</dd>
              </div>
            </dl>

            <p className="flex items-center justify-between gap-3 text-xs">
              {savings > 0 ? (
                <span className="tabular font-semibold text-danger">You&apos;re saving {formatPrice(savings)}</span>
              ) : (
                <span />
              )}
              <span className="tabular inline-flex items-center gap-1 font-medium text-accent-700 dark:text-accent-300">
                <Coins className="h-3.5 w-3.5" aria-hidden="true" /> Earns {pointsFor(total)} points
              </span>
            </p>

            <div className="grid gap-2">
              <Button href={checkoutHref} onClick={closeCart} size="lg" block trailingIcon={ArrowRight}>
                Checkout · {formatPrice(total)}
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
        <div className="py-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            <ShoppingBag className="h-6 w-6" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
          <p className="mt-1 text-sm text-content-muted">Start with what most people add first.</p>
          <ul className="mt-6 space-y-1 text-left">
            {getBestsellers(4).map((product) => (
              <li key={product.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-sunken">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
                  <SmartImage src={product.image} alt="" sizes="44px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-content-strong">{product.name}</span>
                  <span className="tabular block text-xs text-content-muted">{formatPrice(product.price)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => quickAdd(product)}
                  aria-label={`Add ${product.name}`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 text-primary-content hover:bg-brand-700"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-2">
            <Button href="/shop" onClick={closeCart} block>Browse the aisles</Button>
            <Button href="/quick-list" onClick={closeCart} variant="ghost" block>Paste a shopping list instead</Button>
          </div>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 py-3 first:pt-0">
                <Link
                  href={item.href ?? `/product/${item.slug}`}
                  onClick={closeCart}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-sunken"
                >
                  <SmartImage src={item.image} alt={item.name} sizes="80px" className="object-cover" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={item.href ?? `/product/${item.slug}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-medium text-content-strong hover:text-brand-700 dark:hover:text-brand-300"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-content-muted">
                      {item.unit ? <span>{item.unit}</span> : null}
                      {item.subscription ? (
                        <span className="inline-flex items-center gap-1 font-medium text-brand-700 dark:text-brand-300">
                          <CalendarClock className="h-3 w-3" aria-hidden="true" /> {item.subscription.label}
                        </span>
                      ) : null}
                    </p>
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

          <GapFiller remaining={freeDeliveryRemaining} inCart={inCart} onAdd={quickAdd} />

          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-content-muted transition-colors hover:text-content-strong"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Send this cart to someone on WhatsApp
          </a>
        </>
      )}
    </Drawer>
  );
}
