import React from "react";
import { BUNDLES } from "@/lib/bundles";
import { itemListLd } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PackCard from "@/components/packs/PackCard";
import AdirePattern from "@/components/ui/AdirePattern";

export const metadata = {
  title: "Soup Packs & Market Packs | Egusi, Jollof, Efo Riro",
  description:
    "Premeasured Nigerian soup packs and foodstuff boxes: egusi soup pack, party jollof pack, efo riro, pepper soup and a monthly foodstuff box. Everything for one pot, delivered today.",
  alternates: { canonical: "/market-packs" },
};

export default function MarketPacksPage() {
  const totalSaving = BUNDLES.reduce((sum, pack) => sum + pack.saving, 0);

  return (
    <>
      <JsonLd data={itemListLd(BUNDLES, "/market-packs")} />
      <header className="relative isolate overflow-hidden bg-brand-800 text-neutral-0 dark:bg-brand-900">
        <AdirePattern id="adire-packs" size={60} opacity={0.22} className="text-brand-200" />
        <div className="container-page relative py-14 sm:py-20">
          <Breadcrumbs tone="inverse" trail={[{ name: "Home", path: "/" }, { name: "Market packs", path: "/market-packs" }]} className="mb-5" />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">From our kitchen team</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.05] text-neutral-0 sm:text-6xl">
            Everything for one pot of soup.
          </h1>
          <p className="mt-5 max-w-xl text-base text-neutral-0/80 sm:text-lg">
            Every ingredient for one soup or one party, measured by people who cook it every week.
            No half bag of crayfish left over, no forgotten stockfish.
          </p>
          <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/20 pt-6">
            <div>
              <dt className="tabular text-2xl font-bold">{BUNDLES.length}</dt>
              <dd className="text-xs text-neutral-0/70">packs, cooked and tested</dd>
            </div>
            <div>
              <dt className="tabular text-2xl font-bold">up to {Math.max(...BUNDLES.map((pack) => pack.savingPercent))}%</dt>
              <dd className="text-xs text-neutral-0/70">cheaper than buying each part</dd>
            </div>
            <div>
              <dt className="tabular text-2xl font-bold">{formatPrice(totalSaving)}</dt>
              <dd className="text-xs text-neutral-0/70">saved if you tried them all</dd>
            </div>
          </dl>
        </div>
      </header>

      <Section size="sm" className="container-page">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BUNDLES.map((pack, index) => (
            <li key={pack.slug}>
              <PackCard pack={pack} priority={index < 3} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
