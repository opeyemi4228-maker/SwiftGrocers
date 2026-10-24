"use client";

import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Flame, Heart, Leaf, Plus } from "lucide-react";
import { useCartStore } from "@/lib/states/cartStore";
import { useIsSaved, useWishlistStore } from "@/lib/states/wishlistStore";
import { cn, formatCompact, formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Rating from "@/components/ui/Rating";
import SmartImage from "@/components/ui/SmartImage";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Skeleton from "@/components/ui/Skeleton";

const LOW_STOCK = 25;

function StockNote({ stock }) {
  if (stock <= 0) {
    return <span className="text-xs font-medium text-content-muted">Out of stock</span>;
  }
  if (stock <= LOW_STOCK) {
    return (
      <span className="text-xs font-semibold text-accent-700 dark:text-accent-300">
        Only {stock} left
      </span>
    );
  }
  return null;
}

/** "1.8k bought last week", a real count from the catalogue, shown only when it is meaningful. */
function Popularity({ count }) {
  if (!count || count < 300) return null;
  return (
    <p className="inline-flex items-center gap-1 text-2xs font-medium text-content-muted">
      <Flame className="h-3 w-3 shrink-0 text-accent-500" aria-hidden="true" />
      <span className="tabular">{formatCompact(count)}</span> bought last week
    </p>
  );
}

/**
 * Product tile.
 *
 * The whole card is a link (via a stretched overlay anchor) while the cart
 * controls sit above it, so a tap anywhere opens the product but the add
 * button still works. Once an item is in the cart the button becomes a
 * stepper in place, no dialog, no page change.
 *
 * Price sits on its own line with the saving in naira beneath it: on a phone,
 * the add control then gets the card's full width, which is the largest
 * target a two-column grid can offer the thumb.
 */
export default function ProductCard({
  product,
  variant = "grid",
  priority = false,
  className,
  style,
}) {
  const addItem = useCartStore((state) => state.addItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const quantity = useCartStore(
    (state) => state.items.find((item) => item.id === product?.id)?.quantity ?? 0
  );
  const toggleSaved = useWishlistStore((state) => state.toggle);
  const wishlisted = useIsSaved(product?.id);

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
    unitPrice,
    stock = 0,
    isOrganic,
    bestseller,
    isNew,
    categoryLabel,
    description,
    soldLastWeek,
  } = product;

  const href = product.href ?? `/product/${slug ?? id}`;
  const soldOut = stock <= 0;
  const saving = originalPrice > price ? originalPrice - price : 0;

  const add = () => {
    addItem(product, 1);
    toast.success(`${name} added to your cart`);
  };

  const save = () => {
    toggleSaved(id);
    toast(wishlisted ? "Removed from saved items" : "Saved for later", { icon: wishlisted ? "🤍" : "❤️" });
  };

  const media = (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-surface-sunken",
        variant === "grid" ? "aspect-square w-full" : "aspect-square w-28 rounded-xl sm:w-36"
      )}
    >
      <SmartImage
        src={image}
        alt={name}
        priority={priority}
        sizes={
          variant === "grid"
            ? "(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 18vw"
            : "144px"
        }
        className={cn(
          "object-cover transition-transform duration-slow ease-out-quart",
          !soldOut && "group-hover:scale-[1.05]"
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
        onClick={save}
        aria-label={wishlisted ? `Remove ${name} from saved items` : `Save ${name} for later`}
        aria-pressed={wishlisted}
        className={cn(
          "absolute right-2.5 top-2.5 z-20 grid h-9 w-9 place-items-center rounded-full",
          "bg-surface/90 shadow-sm backdrop-blur transition-[color,transform] duration-fast active:scale-90",
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
      className="relative z-20 h-10 w-full cursor-not-allowed rounded-xl bg-surface-sunken px-4 text-xs font-semibold text-content-muted"
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
      label={`${name} quantity`}
      className="relative z-20 h-10 w-full justify-between border-brand-600 bg-brand-50 dark:bg-brand-950"
    />
  ) : (
    <button
      type="button"
      onClick={add}
      aria-label={`Add ${name} to cart, ${formatPrice(price)}`}
      className={cn(
        "relative z-20 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl px-3",
        "bg-brand-600 text-sm font-bold text-primary-content",
        "transition-[background-color,box-shadow,transform] duration-fast",
        "hover:bg-brand-700 hover:shadow-brand-glow active:scale-[0.97]"
      )}
    >
      <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
      Add
    </button>
  );

  const priceBlock = (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="tabular text-base font-bold text-content-strong sm:text-lg">
          {formatPrice(price)}
        </span>
        {saving > 0 ? (
          <span className="tabular text-xs text-content-muted line-through">
            {formatPrice(originalPrice)}
          </span>
        ) : null}
      </div>
      {saving > 0 ? (
        <p className="tabular text-2xs font-semibold text-danger">You save {formatPrice(saving)}</p>
      ) : unitPrice ? (
        <p className="tabular text-2xs text-content-muted">{unitPrice}</p>
      ) : null}
    </div>
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
            {priceBlock}
            <div className="w-32 shrink-0">{cartControl}</div>
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

      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-content-strong">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {name}
          </Link>
        </h3>

        <p className="mt-0.5 truncate text-xs text-content-muted">{unit}</p>

        <div className="mt-1.5 flex items-center gap-2">
          <Rating value={rating} count={reviewCount} size="sm" />
        </div>

        <div className="mt-1.5 min-h-4">
          {stock > 0 && stock <= LOW_STOCK ? <StockNote stock={stock} /> : <Popularity count={soldLastWeek} />}
        </div>

        <div className="mt-auto pt-3">{priceBlock}</div>
        <div className="mt-2.5">{cartControl}</div>
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
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2.5 p-3.5">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
