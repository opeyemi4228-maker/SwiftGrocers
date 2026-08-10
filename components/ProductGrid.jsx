"use client";

import React from "react";
import { PackageSearch } from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

/**
 * Product grid.
 *
 * Deliberately not layout-animated: `layout` on a filterable grid makes every
 * card animate on each keystroke, which reads as jitter and costs a layout
 * pass per frame. Cards fade in on mount instead, and only the first row is
 * given image priority.
 */
export default function ProductGrid({
  products = [],
  variant = "grid",
  loading = false,
  skeletonCount = 8,
  emptyState,
  className,
}) {
  if (loading) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading products"
        className={cn(
          variant === "list" ? "space-y-3" : "grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4",
          className
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} variant={variant} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      emptyState ?? (
        <EmptyState
          icon={PackageSearch}
          title="No products match those filters"
          description="Try removing a filter or widening the price range."
        />
      )
    );
  }

  return (
    <div
      className={cn(
        variant === "list" ? "space-y-3" : "grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          priority={index < 4}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index, 8) * 25}ms` }}
        />
      ))}
    </div>
  );
}
