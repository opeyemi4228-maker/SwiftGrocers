"use client";

import React, { useEffect, useState } from "react";
import { Check, Clock, Coins, MapPin, MessageCircle, Package, Receipt } from "lucide-react";
import { REFERRAL_REWARD, deliveryEstimate } from "@/lib/commerce";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

const TIMELINE = [
  { icon: Check, title: "Order confirmed", detail: "We have received your order.", done: true },
  { icon: Package, title: "Being packed", detail: "Our shopper is picking your items now.", done: false },
  { icon: MapPin, title: "On the way", detail: "You'll get a text with the rider's number.", done: false },
];

/**
 * Reads the order summary checkout left in session storage. Without one (a
 * direct visit), the page still makes sense, it just shows less.
 */
export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [eta, setEta] = useState(null);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("swift:last-order");
      if (saved) setOrder(JSON.parse(saved));
    } catch {
      /* storage unavailable */
    }
    setEta(deliveryEstimate());
  }, []);

  const share = `I just did my market run on SwiftGrocers without leaving the house 🙌 Use my link for ${formatPrice(REFERRAL_REWARD)} off your first order: https://swiftgrocers.com.ng/r/SWIFT2000`;

  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="relative mx-auto grid h-20 w-20 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/30" aria-hidden="true" />
        <span className="relative grid h-20 w-20 place-items-center rounded-full bg-brand-600 text-neutral-0 shadow-brand-glow">
          <Check className="h-10 w-10" strokeWidth={2.5} aria-hidden="true" />
        </span>
      </span>

      <h1 className="mt-7 text-3xl font-bold sm:text-5xl">Your order is confirmed.</h1>
      <p className="mt-3 text-lg text-content-muted">
        Thank you{order?.zone ? `, we're heading to ${order.zone}` : ""}. We&apos;ll text you when the rider sets off.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left">
          <Clock className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <span>
            <span className="block text-xs text-content-muted">Arriving</span>
            <span className="block text-sm font-semibold text-content-strong">{order?.window ?? eta ?? "Today"}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-accent-50 p-4 text-left dark:bg-accent-700/20">
          <Coins className="h-5 w-5 shrink-0 text-accent-700 dark:text-accent-300" aria-hidden="true" />
          <span>
            <span className="block text-xs text-content-muted">You earned</span>
            <span className="tabular block text-sm font-semibold text-content-strong">
              {order ? `${order.points} SwiftPoints (${formatPrice(order.points)} off next time)` : "SwiftPoints on this order"}
            </span>
          </span>
        </div>
      </div>

      <ol className="mt-12 grid gap-8 sm:grid-cols-3">
        {TIMELINE.map((step) => (
          <li key={step.title}>
            <span
              className={
                step.done
                  ? "mx-auto grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-neutral-0"
                  : "mx-auto grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-content-muted"
              }
            >
              <step.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-sm font-semibold text-content-strong">{step.title}</h2>
            <p className="mt-1 text-xs text-content-muted">{step.detail}</p>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-12 flex max-w-md flex-col gap-3 sm:flex-row">
        <Button href="/orders" size="lg" block leadingIcon={Receipt}>
          Track this order
        </Button>
        <Button href="/shop" size="lg" block variant="outline">
          Keep shopping
        </Button>
      </div>

      <div className="mt-12 rounded-3xl bg-brand-800 p-6 text-left text-neutral-0 sm:flex sm:items-center sm:justify-between sm:gap-6 dark:bg-brand-900">
        <div>
          <p className="text-base font-bold">Know someone who hates the market run?</p>
          <p className="mt-1 text-sm text-neutral-0/75">Send them {formatPrice(REFERRAL_REWARD)} off. You get {formatPrice(REFERRAL_REWARD)} too.</p>
        </div>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(share)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-neutral-950 sm:mt-0"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Share on WhatsApp
        </a>
      </div>
    </div>
  );
}
