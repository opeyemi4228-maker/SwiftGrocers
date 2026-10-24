"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CreditCard, MapPin, Package, RotateCcw, Search, Truck } from "lucide-react";
import { ORDERS, ORDER_STATUS } from "@/lib/orders";
import { useCartStore } from "@/lib/states/cartStore";
import { useRequireUser } from "@/lib/states/userStore";
import { formatDate, formatPrice, cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import SmartImage from "@/components/ui/SmartImage";
import Skeleton from "@/components/ui/Skeleton";

const FILTERS = [
  { key: "all", label: "All orders" },
  { key: "out-for-delivery", label: "In progress" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function OrderCard({ order, onReorder }) {
  const status = ORDER_STATUS[order.status];
  const inProgress = order.status === "out-for-delivery" || order.status === "packing";

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold text-content-strong">{order.id}</h2>
            <Badge tone={status.tone}>{status.label}</Badge>
          </div>
          <p className="mt-1.5 text-xs text-content-muted">
            Placed {formatDate(order.placedAt)} · {order.itemCount}{" "}
            {order.itemCount === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="text-right">
          <p className="tabular text-lg font-semibold text-content-strong">
            {formatPrice(order.total)}
          </p>
          <p className="text-xs text-content-muted">{order.payment}</p>
        </div>
      </header>

      {inProgress ? (
        <div className="flex items-center gap-2.5 border-b border-line bg-info-soft px-5 py-3 text-sm sm:px-6">
          <Truck className="h-4 w-4 shrink-0 text-info" aria-hidden="true" />
          <span className="font-medium text-content-strong">{order.eta}</span>
        </div>
      ) : null}

      <ul className="divide-y divide-line px-5 sm:px-6">
        {order.lines.map((line) => (
          <li key={line.product.id} className="flex items-center gap-4 py-4">
            <Link
              href={`/product/${line.product.slug}`}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-sunken"
            >
              <SmartImage
                src={line.product.image}
                alt={line.product.name}
                sizes="64px"
                className="object-cover"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${line.product.slug}`}
                className="block truncate text-sm font-medium text-content-strong hover:text-brand-700 dark:hover:text-brand-300"
              >
                {line.product.name}
              </Link>
              <p className="tabular mt-0.5 text-xs text-content-muted">
                Qty {line.quantity} · {formatPrice(line.product.price)} each
              </p>
            </div>

            <span className="tabular shrink-0 text-sm font-semibold text-content-strong">
              {formatPrice(line.product.price * line.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-6">
        <p className="inline-flex items-center gap-2 text-xs text-content-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {order.address}
        </p>

        <div className="flex flex-wrap gap-2">
          {order.status !== "cancelled" ? (
            <Button size="sm" variant="outline" onClick={() => onReorder(order)} leadingIcon={RotateCcw}>
              Buy again
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" href="/contact">
            Get help
          </Button>
        </div>
      </footer>
    </article>
  );
}

export default function OrdersPage() {
  const { ready } = useRequireUser("/orders");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return ORDERS.filter((order) => {
      if (filter !== "all" && order.status !== filter) return false;
      if (!term) return true;
      return (
        order.id.toLowerCase().includes(term) ||
        order.lines.some((line) => line.product.name.toLowerCase().includes(term))
      );
    });
  }, [filter, query]);

  const reorder = (order) => {
    order.lines.forEach((line) => addItem(line.product, line.quantity));
    toast.success(`${order.itemCount} items added from ${order.id}`);
    openCart();
  };

  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((entry) => [
          entry.key,
          entry.key === "all"
            ? ORDERS.length
            : ORDERS.filter((order) => order.status === entry.key).length,
        ])
      ),
    []
  );

  if (!ready) {
    return (
      <div className="container-page py-12" aria-busy="true" aria-label="Loading your orders">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-8 h-48 rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="container-page py-10 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-3 text-xs text-content-muted">
            <Link href="/" className="transition-colors hover:text-content-strong">
              Home
            </Link>
            <span className="mx-1.5" aria-hidden="true">/</span>
            <span className="text-content-strong">Orders</span>
          </nav>

          <h1 className="text-3xl font-bold sm:text-4xl">Orders &amp; returns</h1>
          <p className="mt-2 text-base text-content-muted">
            Track a delivery, buy a past order again, or ask for a refund.
          </p>

          <dl className="mt-8 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
            <div>
              <dt className="text-xs text-content-muted">Total orders</dt>
              <dd className="tabular mt-1 text-xl font-semibold text-content-strong">
                {ORDERS.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-content-muted">In progress</dt>
              <dd className="tabular mt-1 text-xl font-semibold text-content-strong">
                {counts["out-for-delivery"]}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-content-muted">Lifetime spend</dt>
              <dd className="tabular mt-1 text-xl font-semibold text-content-strong">
                {formatPrice(
                  ORDERS.filter((order) => order.status !== "cancelled").reduce(
                    (total, order) => total + order.total,
                    0
                  )
                )}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="container-page py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="rail pb-0">
            {FILTERS.map((entry) => (
              <Chip
                key={entry.key}
                active={filter === entry.key}
                count={counts[entry.key]}
                onClick={() => setFilter(entry.key)}
              >
                {entry.label}
              </Chip>
            ))}
          </div>

          <div className="sm:w-72">
            <label htmlFor="order-search" className="sr-only">
              Search orders
            </label>
            <Input
              id="order-search"
              type="search"
              size="sm"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by order ID or product"
              leadingIcon={Search}
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders match"
            description="Try a different filter, or clear the search to see everything."
            action={
              <Button
                onClick={() => {
                  setFilter("all");
                  setQuery("");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className={cn("space-y-5")}>
            {visible.map((order) => (
              <OrderCard key={order.id} order={order} onReorder={reorder} />
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl bg-surface-sunken p-6">
          <CreditCard className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <p className="flex-1 text-sm text-content">
            Refunds land back on the original payment method within three working days.
          </p>
          <Button href="/contact" size="sm" variant="outline">
            Start a return
          </Button>
        </div>
      </div>
    </>
  );
}
