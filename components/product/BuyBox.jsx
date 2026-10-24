"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarClock, Check, Coins, Heart, Share2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/states/cartStore";
import { useUserStore, signInHref } from "@/lib/states/userStore";
import { useIsSaved, useWishlistStore } from "@/lib/states/wishlistStore";
import { SUBSCRIBE_DISCOUNT, SUBSCRIPTION_CADENCES, pointsFor } from "@/lib/commerce";
import { cn, formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import QuantityStepper from "@/components/ui/QuantityStepper";
import DeliverySlot from "@/components/location/DeliverySlot";
import StickyBuyBar from "./StickyBuyBar";

/**
 * Purchase controls. One-time is the default; subscribe-and-save is offered
 * beside it with the saving in naira, so it reads as a choice rather than an
 * upsell. The points line shows what this basket line is worth later.
 */
export default function BuyBox({ product }) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const ref = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState("once");
  const [cadence, setCadence] = useState("monthly");
  const [stuck, setStuck] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const inCart = useCartStore((state) =>
    state.items.filter((item) => (item.productId ?? item.id) === product.id).reduce((sum, item) => sum + item.quantity, 0)
  );
  const toggleSaved = useWishlistStore((state) => state.toggle);
  const saved = useIsSaved(product.id);

  // The sticky bar appears only once the real controls have scrolled away.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const soldOut = product.stock <= 0;
  const subscribed = mode === "subscribe";
  const unitPrice = subscribed ? Math.round(product.price * (1 - SUBSCRIBE_DISCOUNT)) : product.price;
  const saving = product.originalPrice > product.price ? product.originalPrice - product.price : 0;

  const add = ({ thenCheckout = false } = {}) => {
    const line = subscribed
      ? {
          ...product,
          lineId: `${product.id}::sub-${cadence}`,
          price: unitPrice,
          name: `${product.name} (subscription)`,
          subscription: { cadence, label: SUBSCRIPTION_CADENCES.find((entry) => entry.id === cadence)?.label },
        }
      : product;
    addItem(line, quantity);
    if (thenCheckout) {
      router.push(user ? "/payment" : signInHref("/payment"));
      return;
    }
    toast.success(`${quantity} × ${product.name} added`);
    openCart();
  };

  const share = async () => {
    const url = window.location.href;
    const text = `${product.name}, ${formatPrice(product.price)} on SwiftGrocers`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text, url });
        return;
      } catch {
        /* dismissed */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener");
  };

  return (
    <>
      <div ref={ref} className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2.5">
              <span className="tabular text-3xl font-extrabold text-content-strong">{formatPrice(unitPrice)}</span>
              {saving > 0 || subscribed ? (
                <span className="tabular text-sm text-content-muted line-through">
                  {formatPrice(subscribed ? product.price : product.originalPrice)}
                </span>
              ) : null}
            </div>
            <p className="tabular mt-0.5 text-xs text-content-muted">
              {product.unit}
              {product.unitPrice ? ` · ${product.unitPrice}` : ""}
            </p>
          </div>
          {saving > 0 ? (
            <span className="tabular rounded-full bg-danger-soft px-2.5 py-1 text-xs font-bold text-danger">Save {formatPrice(saving)}</span>
          ) : null}
        </div>

        <p className="mt-3 text-sm">
          {soldOut ? (
            <span className="font-medium text-content-muted">Out of stock, back within 48 hours</span>
          ) : product.stock <= 25 ? (
            <span className="font-semibold text-accent-700 dark:text-accent-300">Only {product.stock} left at your nearest store</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-medium text-brand-700 dark:text-brand-300">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              In stock
            </span>
          )}
        </p>

        {product.subscribable ? (
          <fieldset className="mt-5 grid gap-2">
            <legend className="sr-only">Purchase option</legend>
            {[
              { id: "once", title: "One-time purchase", detail: formatPrice(product.price) },
              {
                id: "subscribe",
                title: `Subscribe & save ${SUBSCRIBE_DISCOUNT * 100}%`,
                detail: `${formatPrice(Math.round(product.price * (1 - SUBSCRIBE_DISCOUNT)))} · skip or cancel anytime`,
              },
            ].map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition-colors",
                  mode === option.id ? "border-brand-600 bg-brand-50 dark:bg-brand-950" : "border-line hover:bg-surface-sunken"
                )}
              >
                <input type="radio" name="purchase" checked={mode === option.id} onChange={() => setMode(option.id)} className="h-4 w-4 accent-[hsl(var(--brand-600))]" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-content-strong">
                    {option.id === "subscribe" ? <CalendarClock className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" /> : null}
                    {option.title}
                  </span>
                  <span className="tabular block text-xs text-content-muted">{option.detail}</span>
                </span>
              </label>
            ))}
            {subscribed ? (
              <div className="flex flex-wrap gap-1.5 pl-1" role="radiogroup" aria-label="Delivery frequency">
                {SUBSCRIPTION_CADENCES.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    role="radio"
                    aria-checked={cadence === entry.id}
                    onClick={() => setCadence(entry.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                      cadence === entry.id ? "bg-brand-600 text-primary-content" : "bg-surface-sunken text-content hover:bg-line"
                    )}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            ) : null}
          </fieldset>
        ) : null}

        <div className="mt-5 flex items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} max={Math.max(1, product.stock)} />
          <div className="min-w-0 text-sm">
            <p className="tabular font-semibold text-content-strong">{formatPrice(unitPrice * quantity)}</p>
            <p className="tabular inline-flex items-center gap-1 text-xs text-accent-700 dark:text-accent-300">
              <Coins className="h-3 w-3" aria-hidden="true" /> Earns {pointsFor(unitPrice * quantity)} SwiftPoints
            </p>
          </div>
        </div>

        {inCart > 0 ? (
          <p className="mt-4 rounded-xl bg-brand-50 px-3 py-2 text-xs font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-200">
            {inCart} already in your cart
          </p>
        ) : null}

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <Button size="lg" block disabled={soldOut} onClick={() => add()} leadingIcon={ShoppingCart}>
            {soldOut ? "Out of stock" : subscribed ? "Subscribe" : "Add to cart"}
          </Button>
          <Button size="lg" block variant="outline" disabled={soldOut} onClick={() => add({ thenCheckout: true })}>
            Buy now
          </Button>
        </div>

        <DeliverySlot className="mt-5" />

        <div className="mt-4 flex items-center gap-1 border-t border-line pt-4">
          <Button size="sm" variant="ghost" onClick={() => toggleSaved(product.id)} aria-pressed={saved} leadingIcon={Heart} className={saved ? "text-danger" : undefined}>
            {saved ? "Saved" : "Save"}
          </Button>
          <Button size="sm" variant="ghost" onClick={share} leadingIcon={Share2}>
            Share
          </Button>
        </div>
      </div>

      <StickyBuyBar product={product} price={unitPrice} visible={stuck && !soldOut} onAdd={() => add()} />
    </>
  );
}
