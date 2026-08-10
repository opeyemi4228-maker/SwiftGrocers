import React from "react";
import { Check, Clock, MapPin, Package, Receipt } from "lucide-react";
import { getBestsellers } from "@/lib/products";
import { deliveryEstimate } from "@/lib/commerce";
import Button from "@/components/ui/Button";
import ProductRail from "@/components/ProductRail";
import { Section, SectionHeader } from "@/components/ui/Section";

export const metadata = {
  title: "Order confirmed",
  description: "Your SwiftGrocers order is confirmed and being packed.",
};

const TIMELINE = [
  { icon: Check, title: "Order confirmed", detail: "We have your basket and payment.", done: true },
  { icon: Package, title: "Being packed", detail: "A picker is selecting your items now.", done: false },
  { icon: MapPin, title: "On the way", detail: "You will get a link to track the driver.", done: false },
];

export default function OrderPlacedPage() {
  return (
    <>
      <div className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-neutral-0 shadow-brand-glow">
            <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden="true" />
          </span>

          <h1 className="mt-7 text-3xl font-bold sm:text-4xl">Order confirmed</h1>
          <p className="mt-3 text-lg text-content-muted">
            Thank you. We are packing it now and you will get a text when the driver sets off.
          </p>

          <div className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-surface-sunken px-5 py-3">
            <Clock className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <span className="text-sm">
              Estimated arrival{" "}
              <span className="font-semibold text-content-strong">{deliveryEstimate()}</span>
            </span>
          </div>
        </div>

        {/* Progress */}
        <ol className="mx-auto mt-14 grid max-w-3xl gap-8 sm:grid-cols-3">
          {TIMELINE.map((step) => (
            <li key={step.title} className="text-center">
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
          <Button href="/orders" size="lg" block>
            <Receipt className="h-4 w-4" aria-hidden="true" />
            Track this order
          </Button>
          <Button href="/shop" size="lg" block variant="outline">
            Keep shopping
          </Button>
        </div>
      </div>

      <Section size="sm" className="container-page border-t border-line">
        <SectionHeader
          title="Add to your next basket"
          description="Popular with people who ordered what you just did."
          action="Shop all"
          actionHref="/shop"
        />
        <ProductRail products={getBestsellers(8)} />
      </Section>
    </>
  );
}
