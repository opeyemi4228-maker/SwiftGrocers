import React from "react";
import { getDeals } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import CollectionPage from "@/components/shop/CollectionPage";

export const metadata = {
  title: "Deals & offers",
  description: "This week's negotiated vendor discounts on groceries, with same day delivery.",
};

export default function DealsPage() {
  const deals = getDeals(50);
  const best = deals[0]?.discountPercent ?? 0;
  const saved = deals.reduce(
    (total, product) => total + ((product.originalPrice ?? product.price) - product.price),
    0
  );

  return (
    <CollectionPage
      eyebrow="Refreshed every Thursday"
      title="Deals & offers"
      description="Lower prices on the things people buy every day. New deals every Thursday."
      image="https://images.unsplash.com/photo-1734255026082-82fdc81991f0?auto=format&fit=crop&q=70&w=1800"
      imageAlt="Traders selling fresh tomatoes at a Nigerian market"
      tone="accent"
      stats={[
        { value: `${best}%`, label: "biggest discount" },
        { value: `${deals.length}`, label: "products reduced" },
        { value: formatPrice(saved), label: "saved if you buy them all" },
      ]}
      products={deals}
      footerNote="Prices hold until Wednesday midnight or until vendor stock runs out."
    />
  );
}
