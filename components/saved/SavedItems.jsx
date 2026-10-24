"use client";

import React from "react";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { getProductById } from "@/lib/products";
import { useCartStore } from "@/lib/states/cartStore";
import { useWishlistStore, useWishlistHydrated } from "@/lib/states/wishlistStore";
import ProductGrid from "@/components/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

export default function SavedItems() {
  const ids = useWishlistStore((state) => state.ids);
  const hydrated = useWishlistHydrated();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const items = ids.map(getProductById).filter(Boolean);

  if (!hydrated) return <ProductGrid loading skeletonCount={4} className="mt-8" />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Nothing saved yet"
        description="Tap the heart on any product to keep it here for later."
        action={<Button href="/shop">Start shopping</Button>}
        className="mt-8"
      />
    );
  }

  const inStock = items.filter((item) => item.stock > 0);

  return (
    <>
      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => {
            inStock.forEach((item) => addItem(item, 1));
            toast.success(`${inStock.length} saved items added`);
            openCart();
          }}
        >
          Add all {inStock.length} to cart
        </Button>
      </div>
      <ProductGrid products={items} className="mt-6" />
    </>
  );
}
