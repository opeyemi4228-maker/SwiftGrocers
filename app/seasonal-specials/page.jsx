import React from "react";
import { products } from "@/lib/products";
import CollectionPage from "@/components/shop/CollectionPage";
import { Section, SectionHeader } from "@/components/ui/Section";

const CALENDAR = [
  { months: "Jan to Mar", produce: "Oranges, cabbage, carrots, garden eggs" },
  { months: "Apr to Jun", produce: "Mangoes, cucumbers, watermelon, okra" },
  { months: "Jul to Sep", produce: "Sweetcorn, pears, avocado, ugu leaves" },
  { months: "Oct to Dec", produce: "Tomatoes, peppers, pineapple, yam" },
];

const currentQuarter = () => Math.floor(new Date().getMonth() / 3);

export const metadata = {
  title: "Seasonal specials",
  description: "Peak season produce at its cheapest and best, refreshed as the harvest changes.",
};

export default function SeasonalSpecialsPage() {
  const seasonal = products.filter(
    (product) => product.isFresh || product.category === "fruits-vegetables" || product.category === "tubers-plantain"
  );
  const quarter = currentQuarter();

  return (
    <CollectionPage
      eyebrow="In season now"
      title="What's good this month"
      description="Produce costs least and tastes best at its peak. This edit follows the harvest rather than the shelf plan."
      image="https://images.unsplash.com/photo-1734255026082-82fdc81991f0?auto=format&fit=crop&q=70&w=1800"
      imageAlt="Seasonal fruit and vegetables on a market stall"
      tone="neutral"
      stats={[
        { value: `${seasonal.length}`, label: "in season" },
        { value: "Up to 30%", label: "below off season" },
        { value: "Weekly", label: "buyer refresh" },
      ]}
      products={seasonal}
      footerNote="Availability shifts week to week as harvests come in."
    >
      <Section size="sm" className="container-page border-b border-line">
        <SectionHeader
          eyebrow="Growing calendar"
          title="When Nigerian produce peaks"
          description="Buy along this calendar and you pay the harvest price rather than the storage price."
        />
        <ol className="grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:grid-cols-4">
          {CALENDAR.map((entry, index) => {
            const active = index === quarter;
            return (
              <li
                key={entry.months}
                className={active ? "bg-brand-50 p-6 dark:bg-brand-950" : "bg-surface p-6"}
              >
                <p
                  className={
                    active
                      ? "text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300"
                      : "text-xs font-semibold uppercase tracking-wider text-content-muted"
                  }
                >
                  {entry.months}
                  {active ? " · now" : ""}
                </p>
                <p className="mt-3 text-sm text-content">{entry.produce}</p>
              </li>
            );
          })}
        </ol>
      </Section>
    </CollectionPage>
  );
}
