import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { CATEGORIES, getCategory, getProductsByCategory } from "@/lib/products";
import { BUNDLES } from "@/lib/bundles";
import { CITIES } from "@/lib/locations";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/commerce";
import { faqLd, itemListLd } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import PackCard from "@/components/packs/PackCard";
import FAQ from "@/components/home/FAQ";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Category not found" };
  const count = getProductsByCategory(slug).length;

  return {
    title: `Buy ${category.label} Online in Nigeria`,
    description: `Shop ${count} ${category.label.toLowerCase()} products online, ${category.blurb} Same day delivery in Lagos, Abuja, Port Harcourt and Ibadan. Pay on delivery.`,
    alternates: { canonical: `/category/${slug}` },
    openGraph: { title: `${category.label} · SwiftGrocers`, images: [category.image] },
  };
}

function categoryFaq(category, items) {
  const cheapest = [...items].sort((a, b) => a.price - b.price)[0];
  const popular = [...items].sort((a, b) => b.soldLastWeek - a.soldLastWeek).slice(0, 3);
  return [
    {
      q: `How much do ${category.label.toLowerCase()} cost on SwiftGrocers?`,
      a: `Prices in this category start from ${formatPrice(cheapest.price)} (${cheapest.name}, ${cheapest.unit}). Every price is shown up front and checkout adds no service fee; delivery is free over ${formatPrice(FREE_DELIVERY_THRESHOLD)}.`,
    },
    {
      q: `What are the most popular ${category.label.toLowerCase()} right now?`,
      a: `Last week shoppers ordered ${popular.map((item) => item.name).join(", ")} the most.`,
    },
    {
      q: `Can I get ${category.label.toLowerCase()} delivered today?`,
      a: `Yes, order before 7:00 PM for same day delivery in ${CITIES.map((city) => city.name).join(", ")}. Most areas receive orders within 60 to 120 minutes.`,
    },
  ];
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = [...getProductsByCategory(slug)].sort((a, b) => b.soldLastWeek - a.soldLastWeek);
  const ids = new Set(items.map((item) => item.id));
  const packs = BUNDLES.filter((pack) => pack.contents.some((line) => ids.has(line.productId))).slice(0, 3);
  const faq = categoryFaq(category, items);
  const others = CATEGORIES.filter((entry) => entry.slug !== slug);

  return (
    <>
      <JsonLd data={[itemListLd(items, `/category/${slug}`), faqLd(faq)]} />

      <header className="relative isolate overflow-hidden border-b border-line bg-surface">
        <div className="container-page grid gap-8 py-8 sm:py-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Breadcrumbs
              trail={[
                { name: "Home", path: "/" },
                { name: "Shop", path: "/shop" },
                { name: category.label, path: `/category/${slug}` },
              ]}
              className="mb-4"
            />
            <h1 className="text-3xl font-bold sm:text-5xl">{category.label}</h1>
            <p className="mt-3 max-w-xl text-base text-content-muted sm:text-lg">{category.blurb}</p>
            <p className="mt-4 text-sm text-content-muted">
              <span className="tabular font-semibold text-content-strong">{items.length}</span> products ·
              same day delivery · free over {formatPrice(FREE_DELIVERY_THRESHOLD)}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button href={`/shop?category=${slug}`} variant="outline" size="sm" leadingIcon={<SlidersHorizontal />}>
                Filter &amp; sort
              </Button>
              <Button href={`/shop?category=${slug}&sale=1`} variant="ghost" size="sm">
                On sale in this category
              </Button>
            </div>
          </div>
          <div className="relative hidden aspect-[16/10] overflow-hidden rounded-3xl bg-surface-sunken lg:col-span-5 lg:block">
            <SmartImage src={category.image.replace("w=600", "w=1200")} alt={category.label} priority sizes="40vw" className="object-cover" />
          </div>
        </div>

        <div className="border-t border-line">
          <nav aria-label="Other categories" className="container-page flex gap-2 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map((entry) => (
              <Link
                key={entry.slug}
                href={`/category/${entry.slug}`}
                aria-current={entry.slug === slug ? "page" : undefined}
                className={
                  entry.slug === slug
                    ? "shrink-0 rounded-full bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-primary-content"
                    : "shrink-0 rounded-full bg-surface-sunken px-3.5 py-1.5 text-xs font-medium text-content transition-colors hover:bg-line"
                }
              >
                {entry.short}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <Section size="sm" className="container-page pt-8 sm:pt-10">
        <ProductGrid products={items} />
      </Section>

      {packs.length > 0 ? (
        <section className="border-y border-line bg-surface py-14 sm:py-16">
          <div className="container-page">
            <SectionHeader
              eyebrow="Cook it tonight"
              title="Market packs with these ingredients"
              action="All market packs"
              actionHref="/market-packs"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packs.map((pack) => (
                <PackCard key={pack.slug} pack={pack} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Section size="sm" className="container-prose">
        <h2 className="mb-6 text-center text-2xl font-semibold">{category.label}: common questions</h2>
        <FAQ items={faq} />
      </Section>

      <Section size="sm" className="container-page pt-0">
        <h2 className="text-lg font-semibold">Keep shopping</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {others.map((entry) => (
            <li key={entry.slug}>
              <Link href={`/category/${entry.slug}`} className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-content transition-colors hover:border-brand-300 hover:text-brand-800 dark:hover:text-brand-200">
                {entry.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
