import React, { Suspense } from "react";
import ShopBrowser from "@/components/shop/ShopBrowser";
import { ProductCardSkeleton } from "@/components/ProductCard";

export const metadata = {
  title: "Shop all groceries",
  description:
    "Browse fresh produce, bakery, dairy, pantry staples and household essentials with same-day delivery.",
};

function ShopFallback() {
  return (
    <div className="container-page py-10" aria-busy="true" aria-label="Loading products">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopBrowser />
    </Suspense>
  );
}
