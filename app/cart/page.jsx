"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowRight, Heart, ShieldCheck, ShoppingBag, Tag, Truck, X } from "lucide-react";
import {
  useCartStore,
  selectSubtotal,
  selectCount,
  useCartHydrated,
} from "@/lib/states/cartStore";
import { priceOrder, findPromo, FREE_DELIVERY_THRESHOLD, deliveryEstimate } from "@/lib/commerce";
import { formatPrice, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import QuantityStepper from "@/components/ui/QuantityStepper";
import SmartImage from "@/components/ui/SmartImage";
import Skeleton from "@/components/ui/Skeleton";
import ProductRail from "@/components/ProductRail";
import { getBestsellers } from "@/lib/products";

function LineItem({ item, onQuantity, onRemove, onSave }) {
  return (
    <li className="flex gap-4 py-6 first:pt-0">
      <Link
        href={`/product/${item.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-sunken sm:h-28 sm:w-28"
      >
        <SmartImage src={item.image} alt={item.name} sizes="112px" className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/product/${item.slug}`}
              className="text-sm font-semibold text-content-strong hover:text-brand-700 sm:text-base dark:hover:text-brand-300"
            >
              {item.name}
            </Link>
            {item.unit ? <p className="mt-1 text-xs text-content-muted">{item.unit}</p> : null}
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.name} from cart`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-content-muted transition-colors hover:bg-danger-soft hover:text-danger"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <div className="flex items-center gap-3">
            <QuantityStepper
              size="sm"
              value={item.quantity}
              max={item.maxStock ?? 99}
              onChange={onQuantity}
              onRemove={onRemove}
            />
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-content-muted transition-colors hover:text-brand-700 dark:hover:text-brand-300"
            >
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              Save for later
            </button>
          </div>

          <div className="text-right">
            <div className="tabular text-base font-semibold text-content-strong">
              {formatPrice(item.price * item.quantity)}
            </div>
            {item.quantity > 1 ? (
              <div className="tabular text-xs text-content-muted">
                {formatPrice(item.price)} each
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}

function PromoField({ promo, onApply, onClear }) {
  const [code, setCode] = useState("");

  const apply = (event) => {
    event.preventDefault();
    const match = findPromo(code);
    if (!match) {
      toast.error("That code is not valid");
      return;
    }
    onApply(match);
    setCode("");
    toast.success(match.label);
  };

  if (promo) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl bg-success-soft px-3.5 py-3">
        <span className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-brand-800 dark:text-brand-200">
          <Tag className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{promo.code} applied</span>
        </span>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-xs font-semibold text-brand-800 underline dark:text-brand-200"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={apply} className="flex gap-2">
      <label htmlFor="promo" className="sr-only">
        Promo code
      </label>
      <Input
        id="promo"
        size="sm"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="Promo code"
        className="flex-1 uppercase"
      />
      <Button type="submit" size="sm" variant="secondary" disabled={!code.trim()}>
        Apply
      </Button>
    </form>
  );
}

export default function CartPage() {
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const saved = useCartStore((state) => state.saved);
  const promo = useCartStore((state) => state.promo);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const saveForLater = useCartStore((state) => state.saveForLater);
  const moveToCart = useCartStore((state) => state.moveToCart);
  const removeSaved = useCartStore((state) => state.removeSaved);
  const applyPromo = useCartStore((state) => state.applyPromo);
  const clearPromo = useCartStore((state) => state.clearPromo);
  const subtotal = useCartStore(selectSubtotal);
  const count = useCartStore(selectCount);

  const { discount, delivery, total, freeDeliveryRemaining } = priceOrder(subtotal, promo);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  if (!hydrated) {
    return (
      <div className="container-page py-12" aria-busy="true" aria-label="Loading your cart">
        <Skeleton className="h-9 w-48" />
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-2xl lg:col-span-4" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Nothing here yet. Browse the aisles or pick up where the deals are."
          action={<Button href="/shop">Start shopping</Button>}
          secondaryAction={
            <Button href="/deals" variant="outline">
              See this week&apos;s deals
            </Button>
          }
        />

        {saved.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-xl font-semibold">Saved for later</h2>
            <ul className="mt-5 divide-y divide-line">
              {saved.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                    <SmartImage src={item.image} alt={item.name} sizes="64px" className="object-cover" />
                  </div>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}</span>
                  <Button size="sm" variant="outline" onClick={() => moveToCart(item.id)}>
                    Move to cart
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold">Popular right now</h2>
          <ProductRail products={getBestsellers(8)} />
        </section>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <header className="mb-10">
        <nav aria-label="Breadcrumb" className="mb-3 text-xs text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-strong">
            Home
          </Link>
          <span className="mx-1.5" aria-hidden="true">/</span>
          <span className="text-content-strong">Cart</span>
        </nav>
        <h1 className="text-3xl font-bold sm:text-4xl">Your cart</h1>
        <p className="mt-2 text-base text-content-muted">
          <span className="tabular font-medium text-content-strong">{count}</span>{" "}
          {count === 1 ? "item" : "items"} · arriving {deliveryEstimate().toLowerCase()}
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-8">
          {/* Free delivery progress */}
          <div className="mb-8 rounded-2xl border border-line bg-surface p-4">
            <p className="flex items-center gap-2 text-sm">
              <Truck
                className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400"
                aria-hidden="true"
              />
              {freeDeliveryRemaining === 0 ? (
                <span className="font-semibold text-brand-700 dark:text-brand-300">
                  Free delivery unlocked on this order
                </span>
              ) : (
                <span className="text-content">
                  Add{" "}
                  <span className="tabular font-semibold text-content-strong">
                    {formatPrice(freeDeliveryRemaining)}
                  </span>{" "}
                  more for free delivery
                </span>
              )}
            </p>
            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progress towards free delivery"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-slow ease-out-expo",
                  freeDeliveryRemaining === 0 ? "bg-brand-500" : "bg-accent-500"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="divide-y divide-line">
            {items.map((item) => (
              <LineItem
                key={item.id}
                item={item}
                onQuantity={(quantity) => setQuantity(item.id, quantity)}
                onRemove={() => {
                  removeItem(item.id);
                  toast.success("Removed from cart");
                }}
                onSave={() => {
                  saveForLater(item.id);
                  toast.success("Saved for later");
                }}
              />
            ))}
          </ul>

          {saved.length > 0 ? (
            <section className="mt-12 border-t border-line pt-10">
              <h2 className="text-lg font-semibold">
                Saved for later{" "}
                <span className="tabular font-normal text-content-muted">({saved.length})</span>
              </h2>
              <ul className="mt-5 divide-y divide-line">
                {saved.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                      <SmartImage src={item.image} alt={item.name} sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-content-strong">{item.name}</p>
                      <p className="tabular text-xs text-content-muted">{formatPrice(item.price)}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => moveToCart(item.id)}>
                      Move to cart
                    </Button>
                    <button
                      type="button"
                      onClick={() => removeSaved(item.id)}
                      aria-label={`Remove ${item.name} from saved items`}
                      className="grid h-8 w-8 place-items-center rounded-full text-content-muted transition-colors hover:bg-danger-soft hover:text-danger"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* --- Summary --- */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-lg font-semibold">Order summary</h2>

              <div className="mt-5">
                <PromoField promo={promo} onApply={applyPromo} onClear={clearPromo} />
              </div>

              <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-content-muted">Subtotal</dt>
                  <dd className="tabular font-medium text-content-strong">
                    {formatPrice(subtotal)}
                  </dd>
                </div>

                {discount > 0 ? (
                  <div className="flex justify-between">
                    <dt className="text-content-muted">Discount</dt>
                    <dd className="tabular font-medium text-brand-700 dark:text-brand-300">
                      −{formatPrice(discount)}
                    </dd>
                  </div>
                ) : null}

                <div className="flex justify-between">
                  <dt className="text-content-muted">Delivery</dt>
                  <dd className="tabular font-medium text-content-strong">
                    {delivery === 0 ? "Free" : formatPrice(delivery)}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between border-t border-line pt-4">
                  <dt className="text-base font-semibold text-content-strong">Total</dt>
                  <dd className="tabular text-2xl font-bold text-content-strong">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              <Button href="/payment" size="lg" block className="mt-6">
                Checkout
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>

              <p className="mt-4 flex items-start gap-2 text-xs text-content-muted">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Pay on delivery or by card. Anything that arrives less than fresh is refunded in
                full.
              </p>
            </div>

            <Button href="/shop" variant="ghost" block className="mt-3">
              Continue shopping
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
