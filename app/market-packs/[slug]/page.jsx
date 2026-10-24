import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, ChefHat, Clock, RotateCcw, ShieldCheck, Users } from "lucide-react";
import { BUNDLES, getBundle } from "@/lib/bundles";
import { getProductById } from "@/lib/products";
import { pointsFor } from "@/lib/commerce";
import { absoluteUrl } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import SmartImage from "@/components/ui/SmartImage";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AddPackButton from "@/components/packs/AddPackButton";
import PackCard from "@/components/packs/PackCard";
import DeliverySlot from "@/components/location/DeliverySlot";

export function generateStaticParams() {
  return BUNDLES.map((pack) => ({ slug: pack.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pack = getBundle(slug);
  if (!pack) return { title: "Pack not found" };
  return {
    title: `${pack.name} | ${pack.contents.length} Ingredients, Serves ${pack.serves}`,
    description: `${pack.tagline} ${pack.contents.map((line) => line.label).join(", ")}. ${formatPrice(pack.price)}, save ${formatPrice(pack.saving)}. Delivered today.`,
    alternates: { canonical: pack.href },
    openGraph: { title: pack.name, images: [pack.image] },
  };
}

function packLd(pack) {
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pack.name,
    description: pack.tagline,
    image: pack.images,
    sku: pack.id,
    brand: { "@type": "Brand", name: "SwiftGrocers" },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(pack.href),
      priceCurrency: "NGN",
      price: pack.price,
      availability: "https://schema.org/InStock",
    },
  };
  if (!pack.steps.length) return [product];
  const minutes = parseInt(pack.cookTime, 10) || 60;
  return [
    product,
    {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: pack.name.replace(/ Pack$/, ""),
      image: pack.images,
      description: pack.tagline,
      recipeCuisine: "Nigerian",
      recipeYield: `Serves ${pack.serves}`,
      totalTime: `PT${minutes}M`,
      recipeIngredient: pack.contents.map((line) => `${line.qty} ${line.label}`),
      recipeInstructions: pack.steps.map((text) => ({ "@type": "HowToStep", text })),
    },
  ];
}

export default async function PackPage({ params }) {
  const { slug } = await params;
  const pack = getBundle(slug);
  if (!pack) notFound();
  const others = BUNDLES.filter((entry) => entry.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd data={packLd(pack)} />
      <div className="container-page pt-6">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Market packs", path: "/market-packs" }, { name: pack.name, path: pack.href }]} />
      </div>

      <div className="container-page grid gap-10 py-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-surface-sunken lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:aspect-square">
            <SmartImage src={pack.images[1]} alt={`${pack.name}, cooked`} priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            <span className="absolute left-4 top-4 rounded-full bg-accent-400 px-3 py-1.5 text-xs font-bold text-neutral-950">
              Save {formatPrice(pack.saving)} ({pack.savingPercent}%)
            </span>
          </div>
        </div>

        <div className="lg:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">Market pack</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-5xl">{pack.name}</h1>
          <p className="mt-3 text-lg text-content-muted">{pack.tagline}</p>

          <ul className="mt-5 flex flex-wrap gap-2 text-sm">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-3 py-1.5"><Users className="h-4 w-4" aria-hidden="true" /> Serves {pack.serves}</li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-3 py-1.5"><Clock className="h-4 w-4" aria-hidden="true" /> {pack.cookTime}</li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-3 py-1.5"><ChefHat className="h-4 w-4" aria-hidden="true" /> {pack.contents.length} ingredients</li>
          </ul>

          <div className="mt-7 rounded-3xl border border-line bg-surface p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="tabular text-sm text-content-muted">
                  Bought separately <span className="line-through">{formatPrice(pack.value)}</span>
                </p>
                <p className="tabular text-4xl font-extrabold text-content-strong">{formatPrice(pack.price)}</p>
              </div>
              <p className="tabular text-right text-xs text-content-muted">
                Earns <span className="font-bold text-accent-700 dark:text-accent-300">{pointsFor(pack.price)} SwiftPoints</span>
              </p>
            </div>
            <AddPackButton pack={pack} size="lg" label={`Add pack · ${formatPrice(pack.price)}`} className="mt-5 w-full" />
            <DeliverySlot className="mt-4" />
            {pack.subscribable ? (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Put it on a monthly subscription at checkout and save another 5%.
              </p>
            ) : null}
            <ul className="mt-5 grid gap-3 border-t border-line pt-5 text-xs text-content-muted sm:grid-cols-2">
              <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />Packed and sealed the morning it ships</li>
              <li className="flex items-start gap-2"><RotateCcw className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />Anything not fresh is refunded, no photos</li>
            </ul>
          </div>

          <h2 className="mt-10 text-xl font-semibold">What&apos;s in the pack</h2>
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {pack.contents.map((line) => {
              const product = line.productId ? getProductById(line.productId) : null;
              return (
                <li key={line.label} className="flex items-center gap-3 px-4 py-3">
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
                    {product ? <SmartImage src={product.image} alt="" sizes="44px" className="object-cover" /> : null}
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    {product ? (
                      <Link href={`/product/${product.slug}`} className="font-medium text-content-strong hover:text-brand-700 dark:hover:text-brand-300">{line.label}</Link>
                    ) : (
                      <span className="font-medium text-content-strong">{line.label}</span>
                    )}
                  </span>
                  <span className="tabular shrink-0 text-sm text-content-muted">{line.qty}</span>
                </li>
              );
            })}
          </ul>

          {pack.steps.length ? (
            <>
              <h2 className="mt-10 text-xl font-semibold">How we cook it</h2>
              <ol className="mt-4 space-y-4">
                {pack.steps.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 font-display text-sm font-bold text-neutral-0">{index + 1}</span>
                    <p className="pt-1 text-sm leading-relaxed text-content">{step}</p>
                  </li>
                ))}
              </ol>
            </>
          ) : null}
        </div>
      </div>

      <Section size="sm" className="container-page border-t border-line">
        <SectionHeader title="More market packs" action="See all" actionHref="/market-packs" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((entry) => (
            <PackCard key={entry.slug} pack={entry} />
          ))}
        </div>
      </Section>
    </>
  );
}
