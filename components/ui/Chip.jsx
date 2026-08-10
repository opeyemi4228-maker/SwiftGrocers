"use client";

import React from "react";
import { cn } from "@/lib/utils";

/** Single-select / multi-select filter pill. Announces state via aria-pressed. */
export default function Chip({
  active = false,
  icon: Icon,
  count,
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
        "transition-[background-color,border-color,color,box-shadow] duration-fast ease-out-quart",
        active
          ? "border-brand-600 bg-brand-600 text-primary-content shadow-sm"
          : "border-line-strong bg-surface text-content hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800 dark:hover:bg-brand-950 dark:hover:text-brand-200",
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
      {children}
      {typeof count === "number" ? (
        <span
          className={cn(
            "tabular rounded-full px-1.5 py-0.5 text-2xs font-semibold",
            active ? "bg-white/20" : "bg-surface-sunken text-content-muted"
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
