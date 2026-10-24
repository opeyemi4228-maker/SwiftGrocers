"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, CornerDownLeft, TrendingUp } from "lucide-react";
import { searchProducts } from "@/lib/products";
import { useClickOutside, useDebounced } from "@/lib/hooks";
import { cn, formatPrice } from "@/lib/utils";
import SmartImage from "@/components/ui/SmartImage";

const POPULAR = ["Tomatoes", "Rice", "Milk", "Bread", "Eggs", "Olive oil"];

/**
 * Product search with a live suggestion list.
 *
 * Implemented as an ARIA combobox: arrow keys move a virtual cursor through the
 * options while focus stays in the input, and the active option is announced.
 */
export default function SearchBox({ className, autoFocus = false, onNavigate, size = "md" }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounced(query, 120);
  const results = useMemo(() => searchProducts(debouncedQuery, 6), [debouncedQuery]);

  const containerRef = useClickOutside(() => setOpen(false));

  useEffect(() => setActiveIndex(-1), [debouncedQuery]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const go = (href) => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(href);
  };

  const submit = (event) => {
    event.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      go(`/product/${results[activeIndex].slug}`);
      return;
    }
    if (query.trim()) go(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    }
  };

  const showPanel = open && (results.length > 0 || query.trim().length > 0 || !query);
  const heights = { md: "h-11", lg: "h-12" };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={submit} role="search">
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border border-line-strong bg-surface pl-4 pr-1.5",
            "transition-[border-color,box-shadow] duration-fast",
            "focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15",
            heights[size]
          )}
        >
          <Search className="h-4 w-4 shrink-0 text-content-muted" aria-hidden="true" />

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search: rice, tomatoes, yam…"
            aria-label="Search products"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            className="min-w-0 flex-1 bg-transparent text-sm text-content-strong outline-none placeholder:text-content-muted"
          />

          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-content-muted transition-colors hover:bg-surface-sunken hover:text-content-strong"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}

          <button
            type="submit"
            className="hidden h-8 shrink-0 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-content transition-colors hover:bg-primary-hover sm:inline-flex"
          >
            Search
          </button>
        </div>
      </form>

      {showPanel ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-overlay overflow-hidden rounded-2xl border border-line bg-surface shadow-xl animate-scale-in"
          role="presentation"
        >
          {results.length > 0 ? (
            <ul id={listboxId} role="listbox" aria-label="Product suggestions" className="max-h-[22rem] overflow-y-auto p-1.5">
              {results.map((product, index) => (
                <li key={product.id} role="none">
                  <button
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => go(`/product/${product.slug}`)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors",
                      index === activeIndex ? "bg-surface-sunken" : "hover:bg-surface-sunken"
                    )}
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
                      <SmartImage src={product.image} alt="" sizes="44px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-content-strong">
                        {product.name}
                      </span>
                      <span className="block truncate text-xs text-content-muted">
                        {product.categoryLabel} · {product.unit}
                      </span>
                    </span>
                    <span className="tabular shrink-0 text-sm font-semibold text-content-strong">
                      {formatPrice(product.price)}
                    </span>
                  </button>
                </li>
              ))}

              <li role="none" className="border-t border-line p-1 pt-1.5">
                <button
                  type="button"
                  onClick={() => go(`/shop?q=${encodeURIComponent(query.trim())}`)}
                  className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-950"
                >
                  See all results for “{query.trim()}”
                  <CornerDownLeft className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            </ul>
          ) : query.trim() ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-medium text-content-strong">
                No matches for “{query.trim()}”
              </p>
              <p className="mt-1 text-xs text-content-muted">
                Check the spelling or browse the full catalogue.
              </p>
              <button
                type="button"
                onClick={() => go("/shop")}
                className="mt-3 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
              >
                Browse all products
              </button>
            </div>
          ) : (
            <div className="p-3">
              <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-content-muted">
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                Popular searches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full bg-surface-sunken px-3 py-1.5 text-xs font-medium text-content transition-colors hover:bg-brand-50 hover:text-brand-800 dark:hover:bg-brand-950 dark:hover:text-brand-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
