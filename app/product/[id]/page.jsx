import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Leaf, MapPin, RotateCcw, Truck } from "lucide-react";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/products";
import { deliveryEstimate } from "@/lib/commerce";
import { Section, SectionHeader } from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import Rating from "@/components/ui/Rating";
import ProductRail from "@/components/ProductRail";
import ProductGallery from "@/components/product/ProductGallery";
import BuyBox from "@/components/product/BuyBox";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.slug }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductBySlug(id);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [product.image] },
  };
}

const PROMISES = [
  { icon: Truck, title: "Same-day delivery", body: "Order before 6 PM for delivery today." },
  { icon: RotateCcw, title: "Refunded if not fresh", body: "Report within 24 hours, no photos needed." },
  { icon: Leaf, title: "Traceable sourcing", body: "Every listing names the farm or maker." },
];

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProductBySlug(id);

  if (!product) notFound();

  const related = getRelatedProducts(product, 8);

  return (
    <>
      <div className="container-page pt-8">
        <nav aria-label="Breadcrumb" className="text-xs text-content-muted">
          <Link href="/" className="transition-colors hover:text-content-strong">
            Home
          </Link>
          <span className="mx-1.5" aria-hidden="true">/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="transition-colors hover:text-content-strong"
          >
            {product.categoryLabel}
          </Link>
          <span className="mx-1.5" aria-hidden="true">/</span>
          <span className="text-content-strong">{product.name}</span>
        </nav>
      </div>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <ProductGallery
            images={product.images}
            alt={product.name}
            discountPercent={product.discountPercent}
          />
        </div>

        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2">
            {product.isOrganic ? (
              <Badge tone="brand" icon={Leaf}>
                Organic
              </Badge>
            ) : null}
            {product.bestseller ? <Badge tone="accent">Bestseller</Badge> : null}
            {product.isNew ? <Badge tone="solid">New</Badge> : null}
          </div>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Rating value={product.rating} count={product.reviewCount} size="lg" />
            <span className="text-sm text-content-muted">
              by <span className="font-medium text-content-strong">{product.brand}</span>
            </span>
          </div>

          <p className="mt-5 text-base text-content-muted">{product.description}</p>

          <div className="mt-7">
            <BuyBox product={product} />
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-content-muted">
            <Truck className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            Estimated delivery:{" "}
            <span className="font-medium text-content-strong">{deliveryEstimate()}</span>
          </p>

          <ul className="mt-8 grid gap-5 border-t border-line pt-7 sm:grid-cols-3">
            {PROMISES.map((promise) => (
              <li key={promise.title}>
                <promise.icon
                  className="h-4 w-4 text-brand-600 dark:text-brand-400"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h2 className="mt-2.5 text-sm font-semibold text-content-strong">
                  {promise.title}
                </h2>
                <p className="mt-1 text-xs text-content-muted">{promise.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- Detail --- */}
      <Section size="sm" className="container-page border-t border-line">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <h2 className="text-xl font-semibold">Product details</h2>
            <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
              {[
                ["Brand", product.brand],
                ["Category", product.categoryLabel],
                ["Pack size", product.unit],
                ["Origin", product.origin],
                ["Vendor", product.vendor?.name],
                ["Storage", product.isFresh ? "Keep refrigerated" : "Cool, dry place"],
              ]
                .filter(([, value]) => Boolean(value))
                .map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-6 py-3">
                    <dt className="text-content-muted">{label}</dt>
                    <dd className="text-right font-medium text-content-strong">{value}</dd>
                  </div>
                ))}
            </dl>

            {product.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} tone="neutral" outlined>
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-5">
            {product.nutritionFacts ? (
              <>
                <h2 className="text-xl font-semibold">Nutrition, per 100 g</h2>
                <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line">
                  {Object.entries(product.nutritionFacts).map(([key, value]) => (
                    <div key={key} className="bg-surface p-4">
                      <dt className="text-xs uppercase tracking-wider text-content-muted">{key}</dt>
                      <dd className="tabular mt-1 text-lg font-semibold text-content-strong">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : null}

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-surface-sunken p-5">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-content-strong">
                  Sourced from {product.origin}
                </p>
                <p className="mt-1 text-sm text-content-muted">
                  Supplied by {product.vendor?.name}, rated {product.vendor?.rating} by buyers on
                  SwiftGrocers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section size="sm" className="container-page">
        <SectionHeader
          title="Often bought with this"
          description="Shoppers who bought this usually add these too."
          action="Shop all"
          actionHref="/shop"
        />
        <ProductRail products={related} />
      </Section>
    </>
  );
}
