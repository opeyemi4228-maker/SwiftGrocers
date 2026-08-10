"use client";

import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn, clamp } from "@/lib/utils";

const sizes = {
  sm: { root: "h-9", button: "h-9 w-9", value: "w-8 text-sm", icon: "h-3.5 w-3.5" },
  md: { root: "h-11", button: "h-11 w-11", value: "w-10 text-sm", icon: "h-4 w-4" },
};

/**
 * Quantity control. At quantity 1 the decrement turns into a remove action
 * when `onRemove` is supplied, so users never hit a dead disabled button.
 */
export default function QuantityStepper({
  value,
  onChange,
  onRemove,
  min = 1,
  max = 99,
  size = "md",
  label = "Quantity",
  className,
}) {
  const s = sizes[size];
  const willRemove = Boolean(onRemove) && value <= min;

  const set = (next) => onChange?.(clamp(next, min, max));

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-xl border border-line-strong bg-surface",
        s.root,
        className
      )}
    >
      <button
        type="button"
        onClick={() => (willRemove ? onRemove() : set(value - 1))}
        disabled={!willRemove && value <= min}
        aria-label={willRemove ? "Remove item" : `Decrease ${label.toLowerCase()}`}
        className={cn(
          "inline-flex items-center justify-center text-content transition-colors duration-fast",
          "hover:bg-surface-sunken hover:text-content-strong disabled:opacity-40 disabled:hover:bg-transparent",
          willRemove && "text-danger hover:bg-danger-soft hover:text-danger",
          s.button
        )}
      >
        {willRemove ? <Trash2 className={s.icon} /> : <Minus className={s.icon} />}
      </button>

      <span
        aria-live="polite"
        aria-label={`${label}: ${value}`}
        className={cn("tabular text-center font-semibold text-content-strong", s.value)}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => set(value + 1)}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={cn(
          "inline-flex items-center justify-center text-content transition-colors duration-fast",
          "hover:bg-surface-sunken hover:text-content-strong disabled:opacity-40 disabled:hover:bg-transparent",
          s.button
        )}
      >
        <Plus className={s.icon} />
      </button>
    </div>
  );
}
