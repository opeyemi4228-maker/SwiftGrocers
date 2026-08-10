"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, List, PackageSearch, SlidersHorizontal, X } from "lucide-react";
import { products as CATALOG, CATEGORY_LABELS } from "@/lib/products";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Drawer from "@/components/ui/Drawer";
import EmptyState from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Input";
import ProductGrid from "@/components/ProductGrid";
import FilterPanel from "./FilterPanel";

const SORTS = {
  relevance: { label: "Most relevant", compare: null },
  popular: { label: "Most popular", compare: (a, b) => b.reviewCount - a.reviewCount },
  "price-asc": { label: "Price: low to high", compare: (a, b) => a.price - b.price },
  "price-desc": { label: "Price: high to low", compare: (a, b) => b.price - a.price },
  rating: { label: "Highest rated", compare: (a, b) => b.rating - a.rating },
  discount: { label: "Biggest discount", compare: (a, b) => b.discountPercent - a.discountPercent },
};

const QUICK_FILTERS = [
  { key: "onSale", label: "On sale" },
  { key: "organic", label: "Organic" },
  { key: "fresh", label: "Fresh today" },
  { key: "inStock", label: "In stock" },
];

const list = (value) => (value ? value.split(",").filter(Boolean) : []);

/**
 * Catalogue browser.
 *
 * All filter state lives in the query string. That makes any view shareable
 * and survives a refresh or a back navigation, and it removes the class of bug
 * where local state and the URL disagree about what is being shown.
 */
export default function ShopBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filters = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      categories: list(searchParams.get("category")),
      dietary: list(searchParams.get("diet")),
      brands: list(searchParams.get("brand")),
      speed: searchParams.get("speed"),
      min: searchParams.has("min") ? Number(searchParams.get("min")) : null,
      max: searchParams.has("max") ? Number(searchParams.get("max")) : null,
      rating: searchParams.has("rating") ? Number(searchParams.get("rating")) : null,
      inStock: searchParams.get("stock") === "1",
      onSale: searchParams.get("sale") === "1",
      organic: searchParams.get("organic") === "1",
      fresh: searchParams.get("fresh") === "1",
      sort: searchParams.get("sort") ?? "relevance",
      view: searchParams.get("view") === "list" ? "list" : "grid",
    }),
    [searchParams]
  );

  const update = useCallback(
    (patch) => {
      const params = new URLSearchParams(searchParams.toString());

      const setParam = (key, value) => {
        if (value === null || value === undefined || value === "" || value === false) {
          params.delete(key);
        } else {
          params.set(key, value === true ? "1" : String(value));
        }
      };

      for (const [key, value] of Object.entries(patch)) {
        switch (key) {
          case "categories":
            setParam("category", value.join(","));
            break;
          case "dietary":
            setParam("diet", value.join(","));
            break;
          case "brands":
            setParam("brand", value.join(","));
            break;
          case "inStock":
            setParam("stock", value);
            break;
          case "onSale":
            setParam("sale", value);
            break;
          default:
            setParam(key, value);
        }
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const reset = () => router.replace(pathname, { scroll: false });

  const results = useMemo(() => {
    const term = filters.q.trim().toLowerCase();

    const filtered = CATALOG.filter((product) => {
      if (term) {
        const haystack = `${product.name} ${product.brand} ${product.categoryLabel} ${product.tags?.join(" ")}`;
        if (!haystack.toLowerCase().includes(term)) return false;
      }
      if (filters.categories.length && !filters.categories.includes(product.category)) return false;
      if (filters.dietary.length && !filters.dietary.every((tag) => product.tags?.includes(tag)))
        return false;
      if (filters.min !== null && product.price < filters.min) return false;
      if (filters.max !== null && product.price > filters.max) return false;
      if (filters.rating !== null && product.rating < filters.rating) return false;
      if (filters.brands.length && !filters.brands.includes(product.brand)) return false;
      if (filters.speed === "same-day" && !product.isFresh) return false;
      if (filters.speed === "next-day" && product.isFresh) return false;
      if (filters.inStock && product.stock <= 0) return false;
      if (filters.onSale && product.discountPercent <= 0) return false;
      if (filters.organic && !product.isOrganic) return false;
      if (filters.fresh && !product.isFresh) return false;
      return true;
    });

    const compare = SORTS[filters.sort]?.compare;
    return compare ? [...filtered].sort(compare) : filtered;
  }, [filters]);

  const activePills = useMemo(() => {
    const pills = [];
    if (filters.q) pills.push({ label: `“${filters.q}”`, clear: () => update({ q: null }) });
    filters.categories.forEach((slug) =>
      pills.push({
        label: CATEGORY_LABELS[slug] ?? slug,
        clear: () => update({ categories: filters.categories.filter((c) => c !== slug) }),
      })
    );
    filters.dietary.forEach((tag) =>
      pills.push({
        label: tag,
        clear: () => update({ dietary: filters.dietary.filter((d) => d !== tag) }),
      })
    );
    filters.brands.forEach((brand) =>
      pills.push({
        label: brand,
        clear: () => update({ brands: filters.brands.filter((entry) => entry !== brand) }),
      })
    );
    if (filters.speed)
      pills.push({
        label: filters.speed === "same-day" ? "Same day" : "Next day",
        clear: () => update({ speed: null }),
      });
    if (filters.min !== null || filters.max !== null)
      pills.push({ label: "Price range", clear: () => update({ min: null, max: null }) });
    if (filters.rating) pills.push({ label: `${filters.rating}★ & up`, clear: () => update({ rating: null }) });
    if (filters.inStock) pills.push({ label: "In stock", clear: () => update({ inStock: false }) });
    if (filters.onSale) pills.push({ label: "On sale", clear: () => update({ onSale: false }) });
    if (filters.organic) pills.push({ label: "Organic", clear: () => update({ organic: null }) });
    if (filters.fresh) pills.push({ label: "Fresh", clear: () => update({ fresh: null }) });
    return pills;
  }, [filters, update]);

  const panel = (
    <FilterPanel
      filters={filters}
      onChange={update}
      onReset={reset}
      activeCount={activePills.length}
    />
  );

  return (
    <>
      {/* --- Page heading --- */}
      <header className="border-b border-line bg-surface">
        <div className="container-page py-8 sm:py-10">
          <nav aria-label="Breadcrumb" className="mb-3 text-xs text-content-muted">
            <Link href="/" className="transition-colors hover:text-content-strong">
              Home
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              /
            </span>
            <span className="text-content-strong">Shop</span>
          </nav>

          <h1 className="text-3xl font-bold sm:text-4xl">
            {filters.q
              ? `Results for “${filters.q}”`
              : filters.categories.length === 1
                ? CATEGORY_LABELS[filters.categories[0]]
                : "Everything in store"}
          </h1>
          <p className="mt-2 text-base text-content-muted">
            <span className="tabular font-medium text-content-strong">{results.length}</span>{" "}
            {results.length === 1 ? "product" : "products"} · delivered in as little as two hours
          </p>

          <div className="rail mt-6 pb-0">
            {QUICK_FILTERS.map((quick) => (
              <Chip
                key={quick.key}
                active={Boolean(filters[quick.key])}
                onClick={() => update({ [quick.key]: !filters[quick.key] })}
              >
                {quick.label}
              </Chip>
            ))}
          </div>
        </div>
      </header>

      <div className="container-page py-8">
        <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
          {/* --- Desktop filters --- */}
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-height)+1.5rem)] max-h-[calc(100dvh-var(--header-height)-3rem)] overflow-y-auto pr-2">
              {panel}
            </div>
          </aside>

          <div className="min-w-0">
            {/* --- Toolbar --- */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                leadingIcon={SlidersHorizontal}
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden"
              >
                Filters
                {activePills.length > 0 ? (
                  <span className="tabular ml-1 rounded-full bg-brand-600 px-1.5 text-2xs font-bold text-primary-content">
                    {activePills.length}
                  </span>
                ) : null}
              </Button>

              <div className="ml-auto flex items-center gap-2">
                <label htmlFor="sort" className="hidden text-xs text-content-muted sm:block">
                  Sort
                </label>
                <Select
                  id="sort"
                  size="sm"
                  value={filters.sort}
                  onChange={(event) => update({ sort: event.target.value })}
                  className="w-44"
                >
                  {Object.entries(SORTS).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </Select>

                <div
                  className="hidden items-center rounded-lg border border-line-strong p-0.5 sm:flex"
                  role="group"
                  aria-label="View mode"
                >
                  {[
                    { mode: "grid", Icon: LayoutGrid, label: "Grid view" },
                    { mode: "list", Icon: List, label: "List view" },
                  ].map(({ mode, Icon, label }) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => update({ view: mode === "grid" ? null : mode })}
                      aria-pressed={filters.view === mode}
                      aria-label={label}
                      className={cn(
                        "grid h-8 w-8 place-items-center rounded-md transition-colors",
                        filters.view === mode
                          ? "bg-surface-sunken text-content-strong"
                          : "text-content-muted hover:text-content-strong"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* --- Active filters --- */}
            {activePills.length > 0 ? (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {activePills.map((pill, index) => (
                  <button
                    key={`${pill.label}-${index}`}
                    type="button"
                    onClick={pill.clear}
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken py-1.5 pl-3 pr-2 text-xs font-medium text-content transition-colors hover:bg-line"
                  >
                    {pill.label}
                    <X className="h-3 w-3" aria-hidden="true" />
                    <span className="sr-only">Remove filter</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={reset}
                  className="ml-1 text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300"
                >
                  Clear all
                </button>
              </div>
            ) : null}

            <ProductGrid
              products={results}
              variant={filters.view}
              emptyState={
                <EmptyState
                  icon={PackageSearch}
                  title="Nothing matches those filters"
                  description="Try widening the price range or removing a dietary filter."
                  action={<Button onClick={reset}>Clear all filters</Button>}
                />
              }
            />
          </div>
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="bottom"
        title="Filters"
        bodyClassName="px-5 py-4"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" block onClick={reset}>
              Clear all
            </Button>
            <Button block onClick={() => setDrawerOpen(false)}>
              Show {results.length} results
            </Button>
          </div>
        }
      >
        {panel}
      </Drawer>
    </>
  );
}
