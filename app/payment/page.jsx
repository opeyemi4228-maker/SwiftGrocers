"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Banknote,
  Check,
  ChevronLeft,
  Coins,
  CreditCard,
  Hash,
  Landmark,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCartStore, selectSubtotal, useCartHydrated } from "@/lib/states/cartStore";
import { useUserStore, useRequireUser } from "@/lib/states/userStore";
import { CITIES, resolveLocation } from "@/lib/locations";
import { PAYMENT_METHODS, deliveryWindows, pointsFor, priceOrder } from "@/lib/commerce";
import { formatPrice, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input, { Field, Select } from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import SmartImage from "@/components/ui/SmartImage";

const METHOD_ICONS = { card: CreditCard, transfer: Landmark, ussd: Hash, pod: Banknote };

const USSD_BANKS = [
  { name: "GTBank", code: "*737#" },
  { name: "First Bank", code: "*894#" },
  { name: "Access Bank", code: "*901#" },
  { name: "Zenith Bank", code: "*966#" },
  { name: "UBA", code: "*919#" },
  { name: "Opay", code: "*955#" },
];

/** 080x/081x/070x/090x/091x numbers, with or without +234. */
const NG_PHONE = /^(?:\+?234|0)[789][01]\d{8}$/;

function OptionCard({ selected, onSelect, name, title, detail, icon: Icon, aside }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-[border-color,background-color] duration-fast",
        selected ? "border-brand-600 bg-brand-50 dark:bg-brand-950" : "border-line hover:border-line-strong hover:bg-surface-sunken"
      )}
    >
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="sr-only" />
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
      {aside ? <span className="shrink-0 text-xs font-semibold text-brand-700 dark:text-brand-300">{aside}</span> : null}
    </label>
  );
}

function StepHeading({ number, title, done }) {
  return (
    <h2 className="flex items-center gap-3 text-lg font-semibold">
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
          done ? "bg-brand-600 text-neutral-0" : "bg-surface-sunken text-content-strong"
        )}
      >
        {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : number}
      </span>
      {title}
    </h2>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const promo = useCartStore((state) => state.promo);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore(selectSubtotal);
  const deliverTo = useUserStore((state) => state.deliverTo);
  const setDeliverTo = useUserStore((state) => state.setDeliverTo);
  const { user, ready: signedIn } = useRequireUser("/payment");

  const initial = resolveLocation(deliverTo);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: initial.city.slug,
    zone: initial.zone.name,
    note: "",
  });
  const [slot, setSlot] = useState("asap");
  const [method, setMethod] = useState("card");
  const [bank, setBank] = useState(USSD_BANKS[0].name);
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({});
  const [now, setNow] = useState(null);

  // The windows depend on the clock, which the server cannot know.
  useEffect(() => setNow(new Date()), []);

  // Prefill from the signed-in profile once storage has loaded.
  useEffect(() => {
    if (!user) return;
    setAddress((previous) => ({
      ...previous,
      name: previous.name || [user.firstName, user.lastName].filter(Boolean).join(" "),
      phone: previous.phone || user.phone || "",
    }));
  }, [user]);

  const city = CITIES.find((entry) => entry.slug === address.city) ?? CITIES[0];
  const zone = city.zones.find((entry) => entry.name === address.zone) ?? city.zones[0];
  const windows = useMemo(() => (now ? deliveryWindows(now, zone.eta) : []), [now, zone.eta]);

  const { discount, delivery, total } = priceOrder(subtotal, promo);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addressDone = address.name.trim() && NG_PHONE.test(address.phone.replace(/[\s-]/g, "")) && address.street.trim().length >= 6;

  const set = (key) => (event) => {
    const value = event.target.value;
    setAddress((previous) => {
      const next = { ...previous, [key]: value };
      if (key === "city") next.zone = (CITIES.find((entry) => entry.slug === value) ?? CITIES[0]).zones[0].name;
      return next;
    });
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    const next = {};
    if (!address.name.trim()) next.name = "Who should the rider ask for?";
    if (!NG_PHONE.test(address.phone.replace(/[\s-]/g, ""))) next.phone = "Enter a Nigerian number, e.g. 0803 123 4567.";
    if (address.street.trim().length < 6) next.street = "Enter the house number and street.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please check the highlighted fields");
      document.getElementById(Object.keys(next)[0])?.focus();
      return;
    }

    setPlacing(true);
    setDeliverTo({ city: city.slug, zone: zone.name });
    // No payments backend is wired up yet; this stands in for the Paystack call.
    await new Promise((resolve) => setTimeout(resolve, 900));
    try {
      window.sessionStorage.setItem(
        "swift:last-order",
        JSON.stringify({ total, points: pointsFor(total), itemCount, zone: zone.name, city: city.name, window: windows.find((entry) => entry.id === slot)?.detail })
      );
    } catch {
      /* storage unavailable */
    }
    clearCart();
    router.push("/order-placed");
  };

  // Checkout is for signed-in shoppers only; useRequireUser sends anyone else to sign in.
  if (!hydrated || !signedIn) {
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

  const selectedMethod = PAYMENT_METHODS.find((entry) => entry.id === method);

  return (
    <div className="container-page py-8 sm:py-12">
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm font-medium text-content-muted transition-colors hover:text-content-strong">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to cart
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Checkout</h1>
          <p className="mt-1.5 text-base text-content-muted">Three quick steps. You won&apos;t be charged until you confirm.</p>
        </div>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-3 py-1.5 text-xs font-medium text-content">
          <Lock className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" /> Secure checkout
        </p>
      </div>

      <form onSubmit={placeOrder} noValidate className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-10 lg:col-span-7">
          <section className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
            <StepHeading number={1} title="Where should we deliver?" done={addressDone} />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name" required error={errors.name}>
                <Input id="name" value={address.name} onChange={set("name")} autoComplete="name" placeholder="Amaka Nwosu" />
              </Field>
              <Field label="Phone number" htmlFor="phone" required error={errors.phone} hint={errors.phone ? undefined : "The rider calls this number on arrival."}>
                <Input id="phone" type="tel" inputMode="tel" value={address.phone} onChange={set("phone")} autoComplete="tel" placeholder="0803 123 4567" />
              </Field>
              <Field label="City" htmlFor="city">
                <Select id="city" value={address.city} onChange={set("city")}>
                  {CITIES.map((entry) => (
                    <option key={entry.slug} value={entry.slug}>{entry.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Area" htmlFor="zone" hint={`Usually ~${zone.eta} minutes`}>
                <Select id="zone" value={zone.name} onChange={set("zone")}>
                  {city.zones.map((entry) => (
                    <option key={entry.name} value={entry.name}>{entry.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="House number and street" htmlFor="street" required error={errors.street} className="sm:col-span-2">
                <Input id="street" value={address.street} onChange={set("street")} autoComplete="street-address" placeholder="12 Admiralty Way" />
              </Field>
              <Field label="Landmark or note for the rider" htmlFor="note" hint="Gate colour, estate name, nearest bus stop." className="sm:col-span-2">
                <Input id="note" value={address.note} onChange={set("note")} placeholder="Blue gate opposite the filling station" />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
            <StepHeading number={2} title="When should it arrive?" done={Boolean(now)} />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {windows.length
                ? windows.map((option) => (
                    <OptionCard
                      key={option.id}
                      name="slot"
                      selected={slot === option.id}
                      onSelect={() => setSlot(option.id)}
                      title={option.label}
                      detail={option.detail}
                      aside={option.id === "asap" ? "Fastest" : null}
                    />
                  ))
                : [0, 1, 2, 3].map((index) => <Skeleton key={index} className="h-[4.5rem] rounded-2xl" />)}
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
            <StepHeading number={3} title="How would you like to pay?" />
            <div className="mt-5 grid gap-3">
              {PAYMENT_METHODS.map((option) => (
                <OptionCard
                  key={option.id}
                  name="method"
                  selected={method === option.id}
                  onSelect={() => setMethod(option.id)}
                  title={option.label}
                  detail={option.detail}
                  icon={METHOD_ICONS[option.id]}
                  aside={option.id === "pod" ? "Popular" : null}
                />
              ))}
            </div>

            {method === "ussd" ? (
              <div className="mt-4 rounded-2xl bg-surface-sunken p-4">
                <Field label="Your bank" htmlFor="bank">
                  <Select id="bank" value={bank} onChange={(event) => setBank(event.target.value)}>
                    {USSD_BANKS.map((entry) => (
                      <option key={entry.name} value={entry.name}>{entry.name} ({entry.code})</option>
                    ))}
                  </Select>
                </Field>
                <p className="mt-3 text-xs text-content-muted">After you confirm, we&apos;ll show a code to dial. It works on any phone, with no data.</p>
              </div>
            ) : method === "card" ? (
              <p className="mt-4 flex items-start gap-2 rounded-2xl bg-surface-sunken p-4 text-xs text-content-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                You&apos;ll enter your card in Paystack&apos;s secure window. We never see or store your card number.
              </p>
            ) : method === "transfer" ? (
              <p className="mt-4 rounded-2xl bg-surface-sunken p-4 text-xs text-content-muted">
                We&apos;ll give you a one time account number. Your order starts packing the moment the transfer lands.
              </p>
            ) : (
              <p className="mt-4 rounded-2xl bg-surface-sunken p-4 text-xs text-content-muted">
                Check everything at your door, then pay the rider by cash, transfer or POS.
              </p>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
            <div className="rounded-3xl border border-line bg-surface p-6">
              <h2 className="text-lg font-semibold">Your order · {itemCount} item{itemCount === 1 ? "" : "s"}</h2>

              <ul className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                      <SmartImage src={item.image} alt="" sizes="56px" className="object-cover" />
                      <span className="tabular absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-neutral-900 px-1 text-[10px] font-bold text-neutral-0">
                        {item.quantity}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-content-strong">{item.name}</span>
                      <span className="block truncate text-xs text-content-muted">{item.subscription?.label ?? item.unit}</span>
                    </span>
                    <span className="tabular shrink-0 text-sm font-semibold text-content-strong">{formatPrice(item.price * item.quantity)}</span>
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
                    <dd className="tabular font-medium text-brand-700 dark:text-brand-300">−{formatPrice(discount)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-content-muted">Delivery to {zone.name}</dt>
                  <dd className="tabular font-medium text-content-strong">{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-content-muted">Service fee</dt>
                  <dd className="tabular font-medium text-content-strong">₦0</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-4">
                  <dt className="text-base font-semibold text-content-strong">Total</dt>
                  <dd className="tabular text-2xl font-bold text-content-strong">{formatPrice(total)}</dd>
                </div>
              </dl>

              <p className="tabular mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent-700 dark:text-accent-300">
                <Coins className="h-3.5 w-3.5" aria-hidden="true" /> You&apos;ll earn {pointsFor(total)} SwiftPoints on this order
              </p>

              <Button type="submit" size="lg" block loading={placing} className="mt-5">
                {method === "pod" ? `Place order · ${formatPrice(total)}` : `Pay ${formatPrice(total)} with ${selectedMethod?.label.toLowerCase()}`}
              </Button>

              <p className="mt-4 flex items-start gap-2 text-xs text-content-muted">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Payments are processed by Paystack and encrypted end to end.
              </p>
              <p className="mt-3 flex items-start gap-2 text-xs text-content-muted">
                <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                You can change the delivery window any time before our shopper starts packing your order.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
