import React from "react";
import Link from "next/link";
import { Leaf, Scale, Truck, Users } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";

export const metadata = {
  title: "Our story",
  description:
    "Why SwiftGrocers buys direct from Nigerian farms and vendors, and how the two-hour delivery promise actually works.",
};

const NUMBERS = [
  { value: "12,400", label: "households served" },
  { value: "180", label: "partner farms & vendors" },
  { value: "3", label: "cities covered" },
  { value: "2 hrs", label: "median delivery time" },
];

const PRINCIPLES = [
  {
    icon: Scale,
    title: "One price, start to finish",
    body: "The number on the shelf is the number on the receipt. No service fee appears at checkout, and we do not raise prices when demand spikes.",
  },
  {
    icon: Leaf,
    title: "Buy direct, pay fairly",
    body: "We buy from farms and makers without a middle layer, and we publish who supplied what. Vendors are paid within seven days, not ninety.",
  },
  {
    icon: Truck,
    title: "Cold chain or nothing",
    body: "Chilled and frozen goods travel in insulated boxes with temperature logs. If a log breaks, the order is refunded before you notice.",
  },
  {
    icon: Users,
    title: "Answerable to people, not tickets",
    body: "Support is staffed in Abuja by people who can issue a refund on the spot. There is no escalation queue to disappear into.",
  },
];

const TIMELINE = [
  {
    year: "2019",
    title: "One van, one market",
    body: "We started buying at Mile 12 before dawn and delivering across Lagos by lunchtime, for 40 households.",
  },
  {
    year: "2021",
    title: "Direct from the farm",
    body: "We cut the wholesale layer out entirely, signing our first 30 farms and dropping produce prices by roughly a fifth.",
  },
  {
    year: "2023",
    title: "Abuja and Port Harcourt",
    body: "Two more cities, two more cold-chain depots, and the two-hour promise became the default rather than the exception.",
  },
  {
    year: "2026",
    title: "180 vendors and counting",
    body: "Bakers, dairies and spice makers now sell alongside the farms, all under the same pricing rules.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* --- Intro --- */}
      <header className="border-b border-line bg-brand-mesh">
        <div className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-content-muted">
              <Link href="/" className="transition-colors hover:text-content-strong">
                Home
              </Link>
              <span className="mx-1.5" aria-hidden="true">/</span>
              <span className="text-content-strong">Our story</span>
            </nav>

            <h1 className="text-4xl font-bold leading-[1.08] sm:text-5xl">
              We started because the tomatoes kept arriving soft.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-content-muted">
              Nigerian produce is some of the best in the world, and most of it spoils between the
              farm and the plate. SwiftGrocers exists to shorten that trip — for the people growing
              it as much as the people eating it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/shop" size="lg">
                Shop the catalogue
              </Button>
              <Button href="/contact" size="lg" variant="outline">
                Talk to us
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <figure className="relative aspect-card overflow-hidden rounded-3xl bg-surface-sunken shadow-lg">
              <SmartImage
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=70&w=1400"
                alt="Fresh produce being sorted at a market"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </header>

      {/* --- Numbers --- */}
      <Section size="sm" className="container-page">
        <dl className="grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:grid-cols-4">
          {NUMBERS.map((item) => (
            <div key={item.label} className="bg-surface p-7">
              <dt className="tabular text-3xl font-bold text-content-strong">{item.value}</dt>
              <dd className="mt-1.5 text-sm text-content-muted">{item.label}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* --- Principles --- */}
      <Section size="md" className="container-page">
        <SectionHeader
          eyebrow="How we operate"
          title="Four rules we do not bend"
          description="Every decision about pricing, sourcing and support is checked against these."
        />

        <ul className="grid gap-10 sm:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <li key={principle.title}>
              <principle.icon
                className="h-5 w-5 text-brand-600 dark:text-brand-400"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <h3 className="mt-4 text-lg font-semibold text-content-strong">{principle.title}</h3>
              <p className="mt-2.5 text-base text-content-muted">{principle.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* --- Timeline --- */}
      <Section size="md" className="border-y border-line bg-surface">
        <div className="container-page">
          <SectionHeader eyebrow="How we got here" title="Seven years, three cities" />

          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((entry) => (
              <li key={entry.year} className="border-t border-line pt-6">
                <p className="tabular text-sm font-bold text-brand-700 dark:text-brand-300">
                  {entry.year}
                </p>
                <h3 className="mt-3 text-base font-semibold text-content-strong">{entry.title}</h3>
                <p className="mt-2 text-sm text-content-muted">{entry.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* --- Vendors --- */}
      <Section size="md" className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <figure className="relative aspect-card overflow-hidden rounded-3xl bg-surface-sunken lg:col-span-6">
            <SmartImage
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=70&w=1200"
              alt="A vendor arranging produce"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </figure>

          <div className="lg:col-span-6">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Sell with us
            </h2>
            <p className="mt-4 text-base text-content-muted">
              If you grow, bake or make something worth eating, we would like to list it. Our terms
              are the same for a single farm as for a national brand: transparent commission,
              payment within seven days, and your name on the product page.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" size="lg">
                Become a vendor
              </Button>
              <Button href="/shop" size="lg" variant="outline">
                See who already does
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
