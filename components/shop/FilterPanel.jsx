"use client";

import React, { useMemo, useState } from "react";
import { Star, Zap } from "lucide-react";
import { CATEGORIES, products } from "@/lib/products";
import { categoryIcon } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import PriceRange from "./PriceRange";

const DIETARY = ["soup", "swallow", "organic", "vegan", "high-protein", "diabetic-friendly"];
const BRANDS_SHOWN = 6;

const countBy = (predicate) => products.filter(predicate).length;

function Group({ title, action, children }) {
  return (
    <section className="border-b border-line py-6 first:pt-0 last:border-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-content-strong">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Check({ checked, onChange, label, count, media }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-content transition-colors hover:text-content-strong">
      {media}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {typeof count === "number" ? (
        <span className="tabular text-xs text-content-muted">{count}</span>
      ) : null}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={cn(
          "h-[18px] w-[18px] shrink-0 cursor-pointer appearance-none rounded-md border-2 border-line-strong bg-surface",
          "transition-[background-color,border-color] duration-fast",
          "checked:border-brand-600 checked:bg-brand-600",
          "checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox=%220 0 16 16%22 fill=%22white%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0Z%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat"
        )}
      />
    </label>
  );
}

/**
 * Filter controls. Stateless, it renders the filter object it is given and
 * reports changes upward, so the URL stays the single source of truth.
 */
export default function FilterPanel({ filters, onChange, onReset, activeCount }) {
  const [showAllBrands, setShowAllBrands] = useState(false);

  const brands = useMemo(() => {
    const tally = new Map();
    for (const product of products) {
      tally.set(product.brand, (tally.get(product.brand) ?? 0) + 1);
    }
    return [...tally.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, []);

  const prices = useMemo(() => products.map((product) => product.price), []);
  const visibleBrands = showAllBrands ? brands : brands.slice(0, BRANDS_SHOWN);

  const toggleList = (key, value) => {
    const current = filters[key] ?? [];
    onChange({
      [key]: current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value],
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-content-strong">
          Filters
          {activeCount > 0 ? (
            <span className="tabular rounded-full bg-brand-600 px-1.5 py-0.5 text-2xs font-bold text-primary-content">
              {activeCount}
            </span>
          ) : null}
        </h2>
        {activeCount > 0 ? (
          <Button variant="link" size="sm" onClick={onReset}>
            Reset all
          </Button>
        ) : null}
      </div>

      <Group
        title="Price range"
        action={
          filters.min !== null || filters.max !== null ? (
            <Button variant="link" size="sm" onClick={() => onChange({ min: null, max: null })}>
              Reset
            </Button>
          ) : null
        }
      >
        <PriceRange
          prices={prices}
          min={filters.min}
          max={filters.max}
          onChange={({ min, max }) => onChange({ min, max })}
        />
      </Group>

      <Group title="Star rating">
        <div className="space-y-1">
          {[4.5, 4, 3].map((threshold) => {
            const active = filters.rating === threshold;
            return (
              <button
                key={threshold}
                type="button"
                onClick={() => onChange({ rating: active ? null : threshold })}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-colors",
                  active ? "bg-brand-50 dark:bg-brand-950" : "hover:bg-surface-sunken"
                )}
              >
                <span className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={cn(
                        "h-3.5 w-3.5",
                        index < Math.floor(threshold)
                          ? "text-accent-400"
                          : "text-neutral-300 dark:text-neutral-700"
                      )}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    active ? "font-semibold text-brand-800 dark:text-brand-200" : "text-content"
                  )}
                >
                  {threshold} &amp; up
                </span>
                <span className="tabular ml-auto text-xs text-content-muted">
                  {countBy((product) => product.rating >= threshold)}
                </span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Category">
        <div className="-my-1 max-h-72 overflow-y-auto pr-1">
          {CATEGORIES.map((category) => {
            const Icon = categoryIcon(category.slug);
            return (
              <Check
                key={category.slug}
                label={category.label}
                count={countBy((product) => product.category === category.slug)}
                checked={filters.categories.includes(category.slug)}
                onChange={() => toggleList("categories", category.slug)}
                media={
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface-sunken text-brand-600 dark:text-brand-400">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                }
              />
            );
          })}
        </div>
      </Group>

      <Group
        title="Brand"
        action={
          filters.brands?.length ? (
            <Button variant="link" size="sm" onClick={() => onChange({ brands: [] })}>
              Reset
            </Button>
          ) : null
        }
      >
        <div className="-my-1">
          {visibleBrands.map((brand) => (
            <Check
              key={brand.name}
              label={brand.name}
              count={brand.count}
              checked={filters.brands?.includes(brand.name) ?? false}
              onChange={() => toggleList("brands", brand.name)}
              media={
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-sunken text-2xs font-bold text-content-muted"
                  aria-hidden="true"
                >
                  {brand.name.slice(0, 2).toUpperCase()}
                </span>
              }
            />
          ))}
        </div>

        {brands.length > BRANDS_SHOWN ? (
          <button
            type="button"
            onClick={() => setShowAllBrands((value) => !value)}
            className="mt-3 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
          >
            {showAllBrands ? "Show fewer brands" : `More brands (${brands.length - BRANDS_SHOWN})`}
          </button>
        ) : null}
      </Group>

      <Group title="Delivery speed">
        <div className="flex rounded-full bg-surface-sunken p-1" role="group" aria-label="Delivery speed">
          {[
            { key: "any", label: "Any" },
            { key: "same-day", label: "Same day" },
            { key: "next-day", label: "Next day" },
          ].map((option) => {
            const active = (filters.speed ?? "any") === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange({ speed: option.key === "any" ? null : option.key })}
                aria-pressed={active}
                className={cn(
                  "flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors duration-fast",
                  active
                    ? "bg-brand-600 text-primary-content shadow-sm"
                    : "text-content-muted hover:text-content-strong"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <p className="mt-3 flex items-start gap-2 text-xs text-content-muted">
          <Zap className="mt-0.5 h-3 w-3 shrink-0 text-accent-500" aria-hidden="true" />
          Same day covers anything picked this morning. Order before 6 PM.
        </p>
      </Group>

      <Group title="Dietary">
        <div className="-my-1">
          {DIETARY.map((tag) => (
            <Check
              key={tag}
              label={tag.replace("-", " ").replace(/^\w/, (character) => character.toUpperCase())}
              count={countBy((product) => product.tags?.includes(tag))}
              checked={filters.dietary.includes(tag)}
              onChange={() => toggleList("dietary", tag)}
            />
          ))}
        </div>
      </Group>

      <Group title="Availability">
        <div className="-my-1">
          <Check
            label="In stock only"
            checked={filters.inStock}
            onChange={() => onChange({ inStock: !filters.inStock })}
            count={countBy((product) => product.stock > 0)}
          />
          <Check
            label="On sale"
            checked={filters.onSale}
            onChange={() => onChange({ onSale: !filters.onSale })}
            count={countBy((product) => product.discountPercent > 0)}
          />
        </div>
      </Group>
    </div>
  );
}
