"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Check, Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/states/cartStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import QuantityStepper from "@/components/ui/QuantityStepper";

/** Quantity + add to cart. Kept in its own island so the page stays static. */
export default function BuyBox({ product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [saved, setSaved] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const inCart = useCartStore(
    (state) => state.items.find((item) => item.id === product.id)?.quantity ?? 0
  );

  const soldOut = product.stock <= 0;

  const add = ({ thenCheckout = false } = {}) => {
    addItem(product, quantity);
    if (thenCheckout) {
      router.push("/payment");
      return;
    }
    toast.success(`${quantity} × ${product.name} added`);
    openCart();
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <span className="tabular text-3xl font-bold text-content-strong">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price ? (
            <span className="tabular ml-2.5 text-sm text-content-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>
        <span className="text-xs text-content-muted">{product.unit}</span>
      </div>

      <p className="mt-1.5 text-sm">
        {soldOut ? (
          <span className="font-medium text-content-muted">Out of stock</span>
        ) : product.stock <= 10 ? (
          <span className="font-medium text-accent-700 dark:text-accent-300">
            Only {product.stock} left in stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-medium text-brand-700 dark:text-brand-300">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            In stock
          </span>
        )}
      </p>

      {inCart > 0 ? (
        <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-200">
          {inCart} already in your cart
        </p>
      ) : null}

      <div className="mt-5 flex items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={Math.max(1, product.stock)}
        />
        <span className="tabular text-sm text-content-muted">
          {formatPrice(product.price * quantity)} total
        </span>
      </div>

      <div className="mt-5 grid gap-2.5">
        <Button size="lg" block disabled={soldOut} onClick={() => add()} leadingIcon={ShoppingCart}>
          {soldOut ? "Out of stock" : "Add to cart"}
        </Button>
        <Button
          size="lg"
          block
          variant="outline"
          disabled={soldOut}
          onClick={() => add({ thenCheckout: true })}
        >
          Buy now
        </Button>
        <Button
          size="sm"
          block
          variant="ghost"
          onClick={() => setSaved((value) => !value)}
          aria-pressed={saved}
          leadingIcon={Heart}
        >
          {saved ? "Saved for later" : "Save for later"}
        </Button>
      </div>
    </div>
  );
}
