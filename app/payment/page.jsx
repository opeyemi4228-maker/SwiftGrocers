"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Banknote,
  Check,
  ChevronLeft,
  CreditCard,
  Lock,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import { useCartStore, selectSubtotal, useCartHydrated } from "@/lib/states/cartStore";
import { priceOrder } from "@/lib/commerce";
import { formatPrice, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input, { Field, Select } from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import SmartImage from "@/components/ui/SmartImage";

const SLOTS = [
  { id: "asap", label: "Within 2 hours", detail: "Arrives by 2:40 PM today" },
  { id: "evening", label: "This evening", detail: "Between 6:00 and 9:00 PM" },
  { id: "tomorrow", label: "Tomorrow morning", detail: "Between 8:00 and 11:00 AM" },
];

const METHODS = [
  { id: "card", label: "Card", detail: "Visa, Mastercard, Verve", icon: CreditCard },
  { id: "transfer", label: "Bank transfer", detail: "Pay from your banking app", icon: Smartphone },
  { id: "cash", label: "Pay on delivery", detail: "Cash or POS at your door", icon: Banknote },
];

function OptionCard({ selected, onSelect, name, title, detail, icon: Icon }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-[border-color,background-color] duration-fast",
        selected
          ? "border-brand-600 bg-brand-50 dark:bg-brand-950"
          : "border-line hover:border-line-strong hover:bg-surface-sunken"
      )}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />

      <span
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
          selected ? "border-brand-600 bg-brand-600 text-neutral-0" : "border-line-strong"
        )}
        aria-hidden="true"
      >
        {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-sm font-semibold text-content-strong">
          {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-content-muted">{detail}</span>
      </span>
    </label>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const promo = useCartStore((state) => state.promo);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore(selectSubtotal);

  const [slot, setSlot] = useState("asap");
  const [method, setMethod] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "Lagos",
    note: "",
  });
  const [errors, setErrors] = useState({});

  const { discount, delivery, total } = priceOrder(subtotal, promo);

  const set = (key) => (event) => {
    setAddress((previous) => ({ ...previous, [key]: event.target.value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    const next = {};
    if (!address.name.trim()) next.name = "Who should the driver ask for?";
    if (!/^[0-9+\s-]{7,}$/.test(address.phone)) next.phone = "Enter a reachable phone number.";
    if (address.street.trim().length < 6) next.street = "Enter the full street address.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Check the highlighted fields");
      return;
    }

    setPlacing(true);
    // No payments backend is wired up yet; this stands in for that call.
    await new Promise((resolve) => setTimeout(resolve, 900));
    clearCart();
    router.push("/order-placed");
  };

  if (!hydrated) {
    return (
      <div className="container-page py-12" aria-busy="true" aria-label="Loading checkout">
        <Skeleton className="h-9 w-40" />
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <Skeleton className="h-96 rounded-2xl lg:col-span-5" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ShoppingBag}
          title="There is nothing to check out"
          description="Your cart is empty. Add a few things and come back."
          action={<Button href="/shop">Start shopping</Button>}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-content-muted transition-colors hover:text-content-strong"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to cart
      </Link>

      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-base text-content-muted">
        Two steps: where it goes, and how you pay.
      </p>

      <form onSubmit={placeOrder} noValidate className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-10 lg:col-span-7">
          {/* Delivery details */}
          <section>
            <h2 className="text-lg font-semibold">
              <span className="mr-2 text-content-muted">1.</span>
              Delivery address
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name" required error={errors.name}>
                <Input value={address.name} onChange={set("name")} autoComplete="name" placeholder="Amaka Nwosu" />
              </Field>

              <Field label="Phone number" htmlFor="phone" required error={errors.phone}>
                <Input
                  type="tel"
                  value={address.phone}
                  onChange={set("phone")}
                  autoComplete="tel"
                  placeholder="0801 234 5678"
                />
              </Field>

              <Field
                label="Street address"
                htmlFor="street"
                required
                error={errors.street}
                className="sm:col-span-2"
              >
                <Input
                  value={address.street}
                  onChange={set("street")}
                  autoComplete="street-address"
                  placeholder="12 Admiralty Way, Lekki Phase 1"
                />
              </Field>

              <Field label="City" htmlFor="city">
                <Select value={address.city} onChange={set("city")}>
                  <option>Lagos</option>
                  <option>Abuja</option>
                  <option>Port Harcourt</option>
                </Select>
              </Field>

              <Field label="Note for the driver" htmlFor="note" hint="Gate code, landmark, anything useful.">
                <Input value={address.note} onChange={set("note")} placeholder="Blue gate opposite the pharmacy" />
              </Field>
            </div>
          </section>

          {/* Delivery window */}
          <section>
            <h2 className="text-lg font-semibold">
              <span className="mr-2 text-content-muted">2.</span>
              Delivery window
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {SLOTS.map((option) => (
                <OptionCard
                  key={option.id}
                  name="slot"
                  selected={slot === option.id}
                  onSelect={() => setSlot(option.id)}
                  title={option.label}
                  detail={option.detail}
                />
              ))}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-lg font-semibold">
              <span className="mr-2 text-content-muted">3.</span>
              Payment
            </h2>

            <div className="mt-5 grid gap-3">
              {METHODS.map((option) => (
                <OptionCard
                  key={option.id}
                  name="method"
                  selected={method === option.id}
                  onSelect={() => setMethod(option.id)}
                  title={option.label}
                  detail={option.detail}
                  icon={option.icon}
                />
              ))}
            </div>

            {method === "card" ? (
              <div className="mt-5 grid gap-5 rounded-2xl bg-surface-sunken p-5 sm:grid-cols-2">
                <Field label="Card number" htmlFor="card" className="sm:col-span-2">
                  <Input inputMode="numeric" placeholder="4242 4242 4242 4242" autoComplete="cc-number" />
                </Field>
                <Field label="Expiry" htmlFor="expiry">
                  <Input placeholder="MM / YY" autoComplete="cc-exp" />
                </Field>
                <Field label="CVC" htmlFor="cvc">
                  <Input inputMode="numeric" placeholder="123" autoComplete="cc-csc" />
                </Field>
              </div>
            ) : null}
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-lg font-semibold">Your order</h2>

              <ul className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                      <SmartImage src={item.image} alt="" sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-content-strong">
                        {item.name}
                      </span>
                      <span className="tabular block text-xs text-content-muted">
                        Qty {item.quantity}
                      </span>
                    </span>
                    <span className="tabular shrink-0 text-sm font-semibold text-content-strong">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-content-muted">Subtotal</dt>
                  <dd className="tabular font-medium text-content-strong">{formatPrice(subtotal)}</dd>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between">
                    <dt className="text-content-muted">Discount ({promo?.code})</dt>
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

              <Button type="submit" size="lg" block loading={placing} className="mt-6">
                {method === "cash" ? "Place order" : `Pay ${formatPrice(total)}`}
              </Button>

              <p className="mt-4 flex items-start gap-2 text-xs text-content-muted">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Payments are encrypted end to end. We never store your card details.
              </p>

              <p className="mt-3 flex items-start gap-2 text-xs text-content-muted">
                <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                You can change the delivery window any time before a picker starts your basket.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
