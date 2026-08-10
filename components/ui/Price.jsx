import React from "react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

const sizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

/** Current price with optional struck-through original. */
export default function Price({ value, original, size = "md", className, align = "start" }) {
  const hasDiscount = typeof original === "number" && original > value;

  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
        align === "end" && "justify-end",
        className
      )}
    >
      <span className={cn("tabular font-semibold text-content-strong", sizes[size])}>
        {formatPrice(value)}
      </span>
      {hasDiscount ? (
        <>
          <span className="tabular text-xs text-content-muted line-through">
            {formatPrice(original)}
          </span>
          <span className="sr-only">discounted from {formatPrice(original)}</span>
        </>
      ) : null}
    </span>
  );
}
