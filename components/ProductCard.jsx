"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Heart, Leaf, ShoppingBasket, Timer } from "lucide-react";
import { useCartStore } from "@/lib/states/cartStore";
import { cn, formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Rating from "@/components/ui/Rating";
import SmartImage from "@/components/ui/SmartImage";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Skeleton from "@/components/ui/Skeleton";

function StockNote({ stock }) {
  if (stock <= 0) {
    return <span className="text-xs font-medium text-content-muted">Out of stock</span>;
  }
  if (stock <= 10) {
    return (
      <span className="text-xs font-medium text-accent-700 dark:text-accent-300">
        Only {stock} left
      </span>
    );
  }
  return null;
}

/**
 * Product tile.
 *
 * The whole card is a link (via a stretched overlay anchor) while the cart
 * controls sit above it, so a tap anywhere opens the product but the add
 * button still works. Once an item is in the cart the button becomes a
 * stepper in place — no dialog, no page change.
 */
export default function ProductCard({
  product,
  variant = "grid",
  priority = false,
  className,
  style,
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const quantity = useCartStore(
    (state) => state.items.find((item) => item.id === product?.id)?.quantity ?? 0
  );

  if (!product) return null;

  const {
    id,
    slug,
    name,
    image,
    price,
    originalPrice,
    discountPercent,
    rating,
    reviewCount,
    unit,
    stock = 0,
    isOrganic,
    bestseller,
    isNew,
    categoryLabel,
    deliveryTime,
    description,
  } = product;

  const href = `/product/${slug ?? id}`;
  const soldOut = stock <= 0;

  const add = () => {
    addItem(product, 1);
    toast.success(`${name} added to cart`);
  };

  const media = (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-surface-sunken",
        variant === "grid" ? "aspect-product w-full" : "aspect-square w-28 rounded-xl sm:w-36"
      )}
    >
      <SmartImage
        src={image}
        alt={name}
        priority={priority}
        sizes={
          variant === "grid"
            ? "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
            : "144px"
        }
        className={cn(
          "object-cover transition-transform duration-slow ease-out-quart",
          !soldOut && "group-hover:scale-[1.04]"
        )}
      />

      <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
        {discountPercent > 0 ? (
          <Badge tone="solid-danger" size="sm" className="rounded-full font-bold">
            −{discountPercent}%
          </Badge>
        ) : null}
        {isNew ? (
          <Badge tone="solid" size="sm" className="rounded-full">
            New
          </Badge>
        ) : null}
        {bestseller && !isNew ? (
          <Badge tone="solid-accent" size="sm" className="rounded-full">
            Bestseller
          </Badge>
        ) : null}
      </div>

      {isOrganic ? (
        <span className="pointer-events-none absolute bottom-2.5 left-2.5">
          <Badge tone="brand" size="sm" icon={Leaf} className="rounded-full bg-surface/90 backdrop-blur">
            Organic
          </Badge>
        </span>
      ) : null}

      {soldOut ? (
        <div className="absolute inset-0 grid place-items-center bg-surface/70 backdrop-blur-[1px]">
          <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-content-strong shadow-sm">
            Out of stock
          </span>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setWishlisted((value) => !value)}
        aria-label={wishlisted ? `Remove ${name} from saved items` : `Save ${name} for later`}
        aria-pressed={wishlisted}
        className={cn(
          "absolute right-2.5 top-2.5 z-20 grid h-8 w-8 place-items-center rounded-full",
          "bg-surface/90 shadow-sm backdrop-blur transition-colors duration-fast",
          "hover:bg-surface",
          wishlisted ? "text-danger" : "text-content-muted hover:text-content-strong"
        )}
      >
        <Heart className="h-4 w-4" fill={wishlisted ? "currentColor" : "none"} aria-hidden="true" />
      </button>
    </div>
  );

  const cartControl = soldOut ? (
    <button
      type="button"
      disabled
      className="h-10 shrink-0 cursor-not-allowed rounded-xl bg-surface-sunken px-4 text-xs font-semibold text-content-muted"
    >
      Sold out
    </button>
  ) : quantity > 0 ? (
    <QuantityStepper
      size="sm"
      value={quantity}
      max={stock}
      onChange={(next) => setQuantity(id, next)}
      onRemove={() => removeItem(id)}
      className="relative z-20 shrink-0"
    />
  ) : (
    <button
      type="button"
      onClick={add}
      aria-label={`Add ${name} to cart, ${formatPrice(price)}`}
      className={cn(
        "relative z-20 inline-flex h-10 shrink-0 items-center gap-2 rounded-full border-2 px-4",
        "border-brand-600 bg-surface text-sm font-bold text-brand-700",
        "transition-[background-color,color,box-shadow,transform] duration-fast",
        "hover:bg-brand-600 hover:text-primary-content hover:shadow-brand-glow active:scale-95",
        "dark:text-brand-300 dark:hover:text-primary-content"
      )}
    >
      <ShoppingBasket className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="tabular">{formatPrice(price)}</span>
    </button>
  );

  if (variant === "list") {
    return (
      <article
        style={style}
        className={cn(
          "group relative flex gap-4 rounded-2xl border border-line bg-surface p-3",
          "transition-shadow duration-base ease-out-quart hover:shadow-md",
          className
        )}
      >
        {media}

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-2xs font-medium uppercase tracking-wider text-content-muted">
            {categoryLabel}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-content-strong sm:text-base">
            <Link href={href} className="after:absolute after:inset-0 after:content-['']">
              {name}
            </Link>
          </h3>

          {description ? (
            <p className="mt-1 line-clamp-2 text-xs text-content-muted sm:text-sm">{description}</p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Rating value={rating} count={reviewCount} size="sm" />
            {unit ? <span className="text-xs text-content-muted">{unit}</span> : null}
            <StockNote stock={stock} />
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <div>
              <span className="tabular text-lg font-semibold text-content-strong">
                {formatPrice(price)}
              </span>
              {originalPrice > price ? (
                <span className="tabular ml-2 text-xs text-content-muted line-through">
                  {formatPrice(originalPrice)}
                </span>
              ) : null}
            </div>
            {cartControl}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      style={style}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface",
        "transition-[box-shadow,border-color,transform] duration-base ease-out-quart",
        "hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lg",
        className
      )}
    >
      {media}

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-content-strong">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {name}
          </Link>
        </h3>

        <p className="mt-1 text-xs text-content-muted">{unit}</p>

        <div className="mt-2 flex items-center gap-2">
          <Rating value={rating} count={reviewCount} size="sm" />
        </div>

        {deliveryTime ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-content-muted">
            <Timer className="h-3 w-3 shrink-0" aria-hidden="true" />
            {deliveryTime}
          </p>
        ) : null}

        {/*
          The price is the button. The number a shopper is already evaluating
          becomes the tap target, which removes a separate control from the
          card, enlarges the hit area, and turns "decide" and "act" into one
          motion instead of two.
        */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <div className="min-w-0">
            {originalPrice > price ? (
              <div className="tabular text-xs text-content-muted line-through">
                {formatPrice(originalPrice)}
              </div>
            ) : (
              <StockNote stock={stock} />
            )}
          </div>
          {cartControl}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton({ variant = "grid" }) {
  if (variant === "list") {
    return (
      <div className="flex gap-4 rounded-2xl border border-line bg-surface p-3">
        <Skeleton className="aspect-square w-28 rounded-xl sm:w-36" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-6 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <Skeleton className="aspect-product w-full rounded-none" />
      <div className="space-y-2.5 p-3.5">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-16 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
