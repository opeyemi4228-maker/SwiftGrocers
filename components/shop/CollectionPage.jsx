import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SmartImage from "@/components/ui/SmartImage";
import ProductGrid from "@/components/ProductGrid";
import Button from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";

/**
 * Shared layout for curated collections (deals, organic, seasonal, fresh
 * picks). These pages differ only in copy, imagery and which slice of the
 * catalogue they show, so they share one implementation instead of four
 * near-identical ones.
 */
export default function CollectionPage({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  stats = [],
  products = [],
  tone = "brand",
  children,
  footerNote,
}) {
  const tones = {
    brand: "from-brand-900/90 via-brand-900/60",
    accent: "from-accent-700/90 via-accent-700/55",
    neutral: "from-neutral-950/90 via-neutral-950/55",
  };

  return (
    <>
      {/* --- Collection banner --- */}
      <header className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10">
          <SmartImage src={image} alt={imageAlt} priority sizes="100vw" className="object-cover" />
          <div
            className={cn("absolute inset-0 bg-gradient-to-r to-transparent", tones[tone])}
            aria-hidden="true"
          />
        </div>

        <div className="container-page py-16 sm:py-24">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-white/70">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              /
            </span>
            <span className="text-white">{title}</span>
          </nav>

          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">{description}</p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#collection" size="lg" variant="accent">
                Shop the collection
              </Button>
              <Button
                href="/shop"
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
              >
                Browse everything
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {stats.length > 0 ? (
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/20 pt-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="tabular text-2xl font-bold text-white">{stat.value}</dt>
                    <dd className="mt-0.5 text-xs text-white/70">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </header>

      {children}

      <Section id="collection" size="md" className="container-page scroll-mt-32">
        <SectionHeader
          title={`${products.length} ${products.length === 1 ? "product" : "products"} in this edit`}
          description={footerNote}
          action="Refine in shop"
          actionHref="/shop"
        />
        <ProductGrid products={products} />
      </Section>
    </>
  );
}
