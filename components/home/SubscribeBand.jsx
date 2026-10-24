import React from "react";
import Link from "next/link";
import { CalendarClock, PauseCircle, Percent } from "lucide-react";
import { getSubscribables } from "@/lib/products";
import { SUBSCRIBE_DISCOUNT } from "@/lib/commerce";
import SmartImage from "@/components/ui/SmartImage";
import Button from "@/components/ui/Button";

const PERKS = [
  { icon: Percent, title: `${SUBSCRIBE_DISCOUNT * 100}% off, every time`, body: "On every subscribed item, for as long as you stay." },
  { icon: CalendarClock, title: "You pick the rhythm", body: "Weekly, fortnightly or monthly, on the day you choose." },
  { icon: PauseCircle, title: "Skip, pause or cancel", body: "Change it any time from your account." },
];

/** Subscribe & save, the reason someone comes back without being asked. */
export default function SubscribeBand() {
  const staples = getSubscribables(6);

  return (
    <div className="grid gap-10 overflow-hidden rounded-[2rem] border border-line bg-surface lg:grid-cols-12">
      <div className="p-7 sm:p-12 lg:col-span-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
          Subscribe &amp; save
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          Never run out of rice, garri or diapers again.
        </h2>
        <p className="mt-4 max-w-lg text-base text-content-muted">
          Choose the things you buy all the time. We bring them to you every week or month, for
          less money, and remind you a day before.
        </p>

        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {PERKS.map((perk) => (
            <li key={perk.title}>
              <perk.icon className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-semibold text-content-strong">{perk.title}</h3>
              <p className="mt-1 text-sm text-content-muted">{perk.body}</p>
            </li>
          ))}
        </ul>

        <Button href="/shop?subscribe=1" size="lg" className="mt-9">
          Set up repeat delivery
        </Button>
      </div>

      <div className="relative bg-brand-50 p-6 dark:bg-brand-950 lg:col-span-5">
        <ul className="grid grid-cols-3 gap-3">
          {staples.map((product) => (
            <li key={product.id}>
              <Link href={`/product/${product.slug}`} className="group block">
                <span className="relative block aspect-square overflow-hidden rounded-2xl bg-surface shadow-sm">
                  <SmartImage src={product.image} alt="" sizes="(max-width: 1024px) 30vw, 12vw" className="object-cover transition-transform duration-slow group-hover:scale-105" />
                </span>
                <span className="mt-1.5 block truncate text-2xs font-semibold text-content-strong">{product.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
