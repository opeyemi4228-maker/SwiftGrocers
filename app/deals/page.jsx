import React from "react";
import { getDeals } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import CollectionPage from "@/components/shop/CollectionPage";

export const metadata = {
  title: "Deals & offers",
  description: "This week's negotiated vendor discounts on groceries, with same-day delivery.",
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
      description="Discounts we negotiate directly with vendors on things people actually buy — not clearance on what nobody wanted."
      image="https://images.unsplash.com/photo-1601599561213-832382fd07ba?auto=format&fit=crop&q=70&w=1800"
      imageAlt="A shopping trolley filled with groceries"
      tone="accent"
      stats={[
        { value: `${best}%`, label: "biggest discount" },
        { value: `${deals.length}`, label: "products reduced" },
        { value: formatPrice(saved), label: "off the full basket" },
      ]}
      products={deals}
      footerNote="Prices hold until Wednesday midnight or until vendor stock runs out."
    />
  );
}
