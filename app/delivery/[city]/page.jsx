import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Timer } from "lucide-react";
import { CITIES, getCity } from "@/lib/locations";
import { CATEGORIES, getBestsellers } from "@/lib/products";
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from "@/lib/commerce";
import { faqLd, localBusinessLd } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import FAQ from "@/components/home/FAQ";

export function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "City not found" };
  const fastest = Math.min(...city.zones.map((zone) => zone.eta));
  return {
    title: `Grocery & Foodstuff Delivery in ${city.name} | From ${fastest} Minutes`,
    description: `Order foodstuff online in ${city.name}: ${city.zones.slice(0, 6).map((zone) => zone.name).join(", ")} and more. Fresh tomatoes, rice, yam, garri and soup ingredients delivered in under 2 hours. Pay on delivery.`,
    alternates: { canonical: `/delivery/${slug}` },
    openGraph: { images: [city.image] },
  };
}

export default async function CityPage({ params }) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const fastest = Math.min(...city.zones.map((zone) => zone.eta));
  const faq = [
    { q: `How long does grocery delivery take in ${city.name}?`, a: `From ${fastest} minutes in ${city.zones.find((zone) => zone.eta === fastest).name}, and under two hours across the rest of ${city.name}. Order before 7:00 PM for same day delivery.` },
    { q: `How much is delivery in ${city.name}?`, a: `Free on orders over ${formatPrice(FREE_DELIVERY_THRESHOLD)}; otherwise a flat ${formatPrice(STANDARD_DELIVERY_FEE)} anywhere in ${city.name}.` },
    { q: `Which areas of ${city.name} do you cover?`, a: `${city.zones.map((zone) => zone.name).join(", ")}. We're adding new areas every month.` },
  ];

  return (
    <>
      <JsonLd data={[localBusinessLd(city), faqLd(faq)]} />
      <header className="relative isolate overflow-hidden">
        <SmartImage src={city.image} alt={`${city.name}, ${city.state}`} priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-neutral-950/20" aria-hidden="true" />
        <div className="container-page py-16 sm:py-24">
          <Breadcrumbs tone="inverse" trail={[{ name: "Home", path: "/" }, { name: `Delivery in ${city.name}`, path: `/delivery/${slug}` }]} className="mb-5" />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">{city.state}</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
            Grocery delivery in {city.name}, from {fastest} minutes.
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
            Fresh foodstuff from our {city.hub}, at your door before the pot boils. Pay by card,
            transfer, USSD, or on delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/shop" size="lg" variant="accent">Start shopping</Button>
            <Button href="/market-packs" size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white">
              Browse soup packs
            </Button>
          </div>
        </div>
      </header>

      <Section size="sm" className="container-page">
        <SectionHeader eyebrow="Coverage" title={`Areas we deliver to in ${city.name}`} description="Typical door to door time after you place your order." />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {city.zones.map((zone) => (
            <li key={zone.name} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
              <MapPin className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <span className="min-w-0 flex-1 text-sm font-medium text-content-strong">{zone.name}</span>
              <span className="tabular inline-flex items-center gap-1 text-xs font-semibold text-content-muted">
                <Timer className="h-3.5 w-3.5" aria-hidden="true" />~{zone.eta} min
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-center gap-2 text-sm text-content-muted">
          <Clock className="h-4 w-4" aria-hidden="true" /> Open every day, 7:00 AM to 9:00 PM. Same day cutoff 7:00 PM.
        </p>
      </Section>

      <Section size="sm" className="container-page pt-0">
        <SectionHeader title={`Popular in ${city.name} this week`} action="Shop all" actionHref="/shop" />
        <ProductGrid products={getBestsellers(8)} />
      </Section>

      <Section size="sm" className="container-prose pt-0">
        <h2 className="mb-6 text-center text-2xl font-semibold">Delivery in {city.name}: questions</h2>
        <FAQ items={faq} />
      </Section>

      <Section size="sm" className="container-page pt-0">
        <h2 className="text-lg font-semibold">Shop by category in {city.name}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link href={`/category/${category.slug}`} className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-content transition-colors hover:border-brand-300">
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-content-muted">
          Also delivering in{" "}
          {CITIES.filter((entry) => entry.slug !== slug).map((entry, index, list) => (
            <React.Fragment key={entry.slug}>
              <Link href={`/delivery/${entry.slug}`} className="link-underline">{entry.name}</Link>
              {index < list.length - 1 ? ", " : "."}
            </React.Fragment>
          ))}
        </p>
      </Section>
    </>
  );
}
