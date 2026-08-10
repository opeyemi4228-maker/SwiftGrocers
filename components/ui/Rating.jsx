import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

/**
 * Star rating. Renders partial stars via a clipped overlay rather than
 * rounding, so 4.3 and 4.7 don't look identical.
 */
export default function Rating({
  value = 0,
  count,
  size = "md",
  showValue = true,
  className,
}) {
  const rounded = Math.round(value * 10) / 10;
  const fillWidth = `${(Math.min(Math.max(value, 0), 5) / 5) * 100}%`;

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={`Rated ${rounded} out of 5${count ? ` from ${count} reviews` : ""}`}
    >
      <span className="relative inline-flex" aria-hidden="true">
        <span className="inline-flex gap-0.5 text-neutral-300 dark:text-neutral-700">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className={sizes[size]} fill="currentColor" strokeWidth={0} />
          ))}
        </span>
        <span
          className="absolute inset-0 inline-flex gap-0.5 overflow-hidden text-accent-400"
          style={{ width: fillWidth }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className={cn(sizes[size], "shrink-0")} fill="currentColor" strokeWidth={0} />
          ))}
        </span>
      </span>

      {showValue ? (
        <span className="tabular text-xs font-medium text-content-strong">{rounded}</span>
      ) : null}
      {typeof count === "number" ? (
        <span className="tabular text-xs text-content-muted">({count})</span>
      ) : null}
    </span>
  );
}
