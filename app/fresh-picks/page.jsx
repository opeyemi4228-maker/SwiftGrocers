import React from "react";
import { products } from "@/lib/products";
import CollectionPage from "@/components/shop/CollectionPage";

export const metadata = {
  title: "Fresh picks",
  description:
    "New arrivals and same day fresh produce, picked by our buyers the morning your order ships.",
};

export default function FreshPicksPage() {
  const picks = products.filter((product) => product.isFresh || product.isNew);

  return (
    <CollectionPage
      eyebrow="Picked this morning"
      title="Fresh picks"
      description="Everything here left a farm or a kitchen within the last 24 hours. Ordered before 6 PM, it reaches you today."
      image="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=70&w=1800"
      imageAlt="Crates of fresh produce at a market"
      stats={[
        { value: `${picks.length}`, label: "products in season" },
        { value: "2 hrs", label: "typical delivery" },
        { value: "180", label: "partner farms" },
      ]}
      products={picks}
      footerNote="Stock reflects this morning's deliveries and updates as vendors restock."
    />
  );
}
