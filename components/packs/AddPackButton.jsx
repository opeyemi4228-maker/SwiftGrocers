"use client";

import React from "react";
import toast from "react-hot-toast";
import { Check, Plus } from "lucide-react";
import { useCartStore } from "@/lib/states/cartStore";
import { cn } from "@/lib/utils";

/** One tap, whole pot. A pack is a single cart line, so this is the regular add action. */
export default function AddPackButton({ pack, className, size = "md", label = "Add pack" }) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const inCart = useCartStore((state) => state.items.some((item) => item.id === pack.id));

  return (
    <button
      type="button"
      onClick={() => {
        addItem(pack, 1);
        toast.success(`${pack.name} added, ${pack.contents.length} ingredients in one go`);
        if (size === "lg") openCart();
      }}
      className={cn(
        "relative z-20 inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl font-bold transition-[background-color,box-shadow,transform] duration-fast active:scale-[0.97]",
        inCart
          ? "bg-brand-50 text-brand-800 ring-1 ring-brand-600 dark:bg-brand-950 dark:text-brand-200"
          : "bg-brand-600 text-primary-content hover:bg-brand-700 hover:shadow-brand-glow",
        size === "lg" ? "h-12 px-6 text-base" : "h-10 px-4 text-sm",
        className
      )}
    >
      {inCart ? (
        <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
      )}
      {inCart ? (size === "lg" ? "In cart, add another" : "Add again") : label}
    </button>
  );
}
