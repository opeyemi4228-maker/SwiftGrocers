"use client";

import React, { useMemo } from "react";
import { cn, formatPrice } from "@/lib/utils";

const BUCKETS = 28;

/**
 * Price filter with a distribution histogram behind a dual-thumb slider.
 *
 * The histogram is the point: a bare slider asks people to guess where the
 * products actually are, while the shape shows them at a glance and makes the
 * range they pick an informed one. Bars outside the selection stay visible but
 * recede, so the trade-off of narrowing is always on screen.
 */
export default function PriceRange({ prices, min, max, onChange }) {
  const { floor, ceiling, bars, average } = useMemo(() => {
    if (!prices.length) return { floor: 0, ceiling: 0, bars: [], average: 0 };

    const low = Math.min(...prices);
    const high = Math.max(...prices);
    const span = Math.max(1, high - low);
    const counts = new Array(BUCKETS).fill(0);

    for (const price of prices) {
      const index = Math.min(BUCKETS - 1, Math.floor(((price - low) / span) * BUCKETS));
      counts[index] += 1;
    }

    const peak = Math.max(...counts, 1);

    return {
      floor: low,
      ceiling: high,
      average: Math.round(prices.reduce((total, price) => total + price, 0) / prices.length),
      bars: counts.map((count, index) => ({
        // A visible floor height keeps empty buckets legible as gaps, not voids.
        height: count === 0 ? 6 : Math.max(12, Math.round((count / peak) * 100)),
        from: low + (span / BUCKETS) * index,
        to: low + (span / BUCKETS) * (index + 1),
      })),
    };
  }, [prices]);

  const lower = min ?? floor;
  const upper = max ?? ceiling;
  const span = Math.max(1, ceiling - floor);
  const toPercent = (value) => ((value - floor) / span) * 100;

  const commit = (nextLower, nextUpper) => {
    const safeLower = Math.min(nextLower, nextUpper);
    const safeUpper = Math.max(nextLower, nextUpper);
    onChange({
      min: safeLower <= floor ? null : safeLower,
      max: safeUpper >= ceiling ? null : safeUpper,
    });
  };

  if (!prices.length) return null;

  const step = Math.max(50, Math.round(span / 100 / 50) * 50);

  return (
    <div>
      <p className="text-xs text-content-muted">
        Average price is{" "}
        <span className="tabular font-semibold text-content-strong">{formatPrice(average)}</span>
      </p>

      {/* Distribution */}
      <div className="mt-4 flex h-16 items-end gap-[2px]" aria-hidden="true">
        {bars.map((bar, index) => {
          const inRange = bar.to >= lower && bar.from <= upper;
          return (
            <span
              key={index}
              style={{ height: `${bar.height}%` }}
              className={cn(
                "flex-1 rounded-sm transition-colors duration-fast",
                inRange ? "bg-brand-400" : "bg-line"
              )}
            />
          );
        })}
      </div>

      {/* Track */}
      <div className="relative mt-3 h-2">
        <span className="absolute inset-x-0 top-0 h-2 rounded-full bg-surface-sunken" />
        <span
          className="absolute top-0 h-2 rounded-full bg-brand-600"
          style={{
            left: `${toPercent(lower)}%`,
            right: `${100 - toPercent(upper)}%`,
          }}
        />

        <input
          type="range"
          className="range-input"
          min={floor}
          max={ceiling}
          step={step}
          value={lower}
          onChange={(event) => commit(Number(event.target.value), upper)}
          aria-label="Minimum price"
          aria-valuetext={formatPrice(lower)}
        />
        <input
          type="range"
          className="range-input"
          min={floor}
          max={ceiling}
          step={step}
          value={upper}
          onChange={(event) => commit(lower, Number(event.target.value))}
          aria-label="Maximum price"
          aria-valuetext={formatPrice(upper)}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="tabular rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-0 dark:bg-neutral-0 dark:text-neutral-900">
          {formatPrice(lower)}
        </span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <span className="tabular rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-0 dark:bg-neutral-0 dark:text-neutral-900">
          {formatPrice(upper)}
        </span>
      </div>
    </div>
  );
}
