import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flame, Leaf, MapPin, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { getFrequentlyBoughtWith, getProductBySlug, getRelatedProducts, localNamesFor, products } from "@/lib/products";
import { getReviews, ratingBreakdown } from "@/lib/reviews";
import { productLd } from "@/lib/seo";
import { formatCompact, formatPrice } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import Rating from "@/components/ui/Rating";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ProductRail from "@/components/ProductRail";
import ProductGallery from "@/components/product/ProductGallery";
import BuyBox from "@/components/product/BuyBox";
import FrequentlyBought from "@/components/product/FrequentlyBought";
import Reviews from "@/components/product/Reviews";
import TrackView from "@/components/product/TrackView";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.slug }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductBySlug(id);
  if (!product) return { title: "Product not found" };

  // Local names that aren't already in the product name, e.g. "ewa, agonyin".
  const local = localNamesFor(product, 2).join(", ");
  // Short units read well in a title; long ones ("1 large tuber (≈3 kg)") and repeats don't.
  const sizeInName = /\d/.test(product.name) && product.unit.match(/\d+/)?.some((n) => product.name.includes(n));
  const unit = product.unit.length <= 12 && !sizeInName ? `, ${product.unit}` : "";

  return {
    title: `${product.name}${unit} | ${formatPrice(product.price)}`,
    // Kept near 155 characters so search results show it whole.
    description: `Buy ${product.name}${local ? ` (${local})` : ""} for ${formatPrice(product.price)}. Same-day delivery in Lagos, Abuja, PH & Ibadan. Pay on delivery.`.slice(0, 160),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${formatPrice(product.price)}`,
      description: product.description,
      images: [{ url: product.images[1], width: 1400, height: 1400, alt: product.name }],
    },
  };
}

const PROMISES = [
  { icon: Truck, title: "Same day delivery", body: "Order by 7 PM, at your door today." },
  { icon: RotateCcw, title: "Fresh or refunded", body: "Tell us within 24 hours. No photos." },
  { icon: ShieldCheck, title: "Pay on delivery", body: "Cash, transfer or POS at the door." },
];

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProductBySlug(id);
  if (!product) notFound();

  const related = getRelatedProducts(product, 10);
  const companions = getFrequentlyBoughtWith(product);
  const reviews = getReviews(product);
  const breakdown = ratingBreakdown(product);

  const facts = [
    ["Pack size", product.unit],
    ["Unit price", product.unitPrice],
    ["Origin", product.origin],
    ["Supplied by", product.vendor?.name],
    ["Storage", product.isFresh ? "Cool and dry, or refrigerated" : "Cool, dry place"],
    ["Brand", product.brand],
  ].filter(([, value]) => Boolean(value));

  return (
    <>
      <JsonLd data={productLd(product)} />
      <TrackView id={product.id} />

      <div className="container-page pt-6">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: product.categoryLabel, path: `/category/${product.category}` },
            { name: product.name, path: `/product/${product.slug}` },
          ]}
        />
      </div>

      <div className="container-page grid gap-8 py-6 sm:py-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
            <ProductGallery images={product.images} alt={product.name} discountPercent={product.discountPercent} />
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2">
            {product.bestseller ? <Badge tone="accent">Bestseller</Badge> : null}
            {product.isNew ? <Badge tone="solid">New</Badge> : null}
            {product.isOrganic ? <Badge tone="brand" icon={Leaf}>Organic</Badge> : null}
            {product.isFresh ? <Badge tone="brand">Fresh today</Badge> : null}
          </div>

          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <a href="#reviews" className="transition-opacity hover:opacity-80">
              <Rating value={product.rating} count={product.reviewCount} size="md" />
            </a>
            {product.soldLastWeek >= 300 ? (
              <span className="inline-flex items-center gap-1 text-content-muted">
                <Flame className="h-3.5 w-3.5 text-accent-500" aria-hidden="true" />
                <span className="tabular font-medium text-content-strong">{formatCompact(product.soldLastWeek)}</span> bought last week
              </span>
            ) : null}
          </div>

          <p className="mt-5 text-base leading-relaxed text-content">{product.description}</p>

          {localNamesFor(product).length ? (
            <p className="mt-3 text-sm text-content-muted">
              Also called: <span className="text-content">{localNamesFor(product).join(", ")}</span>
            </p>
          ) : null}

          <div className="mt-6">
            <BuyBox product={product} />
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {PROMISES.map((promise) => (
              <li key={promise.title} className="flex items-start gap-3 sm:flex-col sm:gap-2">
                <promise.icon className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" strokeWidth={1.75} aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold text-content-strong">{promise.title}</span>
                  <span className="block text-xs text-content-muted">{promise.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {companions.length ? (
        <Section size="sm" className="container-page pt-6">
          <FrequentlyBought product={product} companions={companions} />
        </Section>
      ) : null}

      <Section size="sm" className="container-page border-t border-line">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <h2 className="text-xl font-semibold">Good to know</h2>
            <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
              {facts.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 py-3">
                  <dt className="text-content-muted">{label}</dt>
                  <dd className="text-right font-medium text-content-strong">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-5">
            <div className="flex items-start gap-3 rounded-3xl bg-surface-sunken p-6">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <div>
                <p className="text-base font-semibold text-content-strong">From {product.origin}</p>
                <p className="mt-1.5 text-sm text-content-muted">
                  Supplied by {product.vendor?.name}, rated {product.vendor?.rating} by SwiftGrocers shoppers.
                  Every batch is checked by our team before it&apos;s packed.
                </p>
                <Link href={`/category/${product.category}`} className="link-underline mt-4 text-sm">
                  More from {product.categoryLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section size="sm" className="container-page border-t border-line">
        <Reviews product={product} breakdown={breakdown} reviews={reviews} />
      </Section>

      <Section size="sm" className="container-page border-t border-line">
        <SectionHeader title="People also buy" description="Items that go well with this one." action="See more like this" actionHref={`/category/${product.category}`} />
        <ProductRail products={related} />
      </Section>
    </>
  );
}
