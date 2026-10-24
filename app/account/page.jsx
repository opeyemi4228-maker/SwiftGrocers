"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  LifeBuoy,
  LogOut,
  Package,
  ShoppingCart,
  Tag,
  Truck,
  User,
} from "lucide-react";
import { ORDERS } from "@/lib/orders";
import { useUserStore, useUserHydrated, signInHref } from "@/lib/states/userStore";
import { useCartStore, selectCount, useCartHydrated } from "@/lib/states/cartStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Logo from "@/components/layout/Logo";

/** Destinations reachable from the account hub. Each one is a real route. */
const LINKS = [
  {
    href: "/orders",
    icon: Package,
    title: "Order history",
    description: "Track a delivery, order again, or ask for a refund.",
  },
  {
    href: "/cart",
    icon: ShoppingCart,
    title: "Your cart",
    description: "Pick up where you left off and check out.",
  },
  {
    href: "/payment",
    icon: CreditCard,
    title: "Payment",
    description: "Review how you pay for deliveries.",
  },
  {
    href: "/deals",
    icon: Tag,
    title: "Deals for you",
    description: "This week's vendor negotiated discounts.",
  },
  {
    href: "/contact",
    icon: LifeBuoy,
    title: "Help & support",
    description: "Something wrong with an order? Talk to us.",
  },
];

function initialsOf(user) {
  const source = user.firstName || user.email || "";
  return source.trim().slice(0, 1).toUpperCase() || "?";
}

function AccountSkeleton() {
  return (
    <div className="container-page py-10" aria-busy="true" aria-label="Loading your account">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-4 h-24 w-full rounded-2xl" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const hydrated = useUserHydrated();

  const cartCount = useCartStore(selectCount);
  const cartHydrated = useCartHydrated();

  // Signed-out visitors have nothing to see here, send them to sign in.
  useEffect(() => {
    if (hydrated && !user) router.replace(signInHref("/account"));
  }, [hydrated, user, router]);

  const stats = useMemo(() => {
    const inProgress = ORDERS.filter(
      (order) => order.status === "out-for-delivery" || order.status === "packing"
    ).length;
    const spend = ORDERS.filter((order) => order.status !== "cancelled").reduce(
      (total, order) => total + order.total,
      0
    );
    return { total: ORDERS.length, inProgress, spend };
  }, []);

  const signOut = () => {
    clearUser();
    toast.success("Signed out");
    router.push("/");
  };

  if (!hydrated || !user) return <AccountSkeleton />;

  return (
    <div className="min-h-dvh">
      {/*
        The account area renders without the site header, footer or tab bar
        (see `lib/chrome.js`), so this bar carries the only way back out.
      */}
      <div className="sticky top-0 z-header border-b border-line bg-surface/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="-ml-1 inline-flex items-center gap-2 rounded-full py-2 pl-1 pr-4 text-sm font-medium text-content transition-colors hover:bg-surface-sunken hover:text-content-strong"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </span>
            Back
          </button>

          <Logo size="sm" />
        </div>
      </div>

      <div className="container-page py-8 sm:py-10">
      {/* --- Identity --- */}
      <div className="flex flex-wrap items-center gap-4 border-b border-line pb-6">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-600 text-xl font-bold text-neutral-0"
          aria-hidden="true"
        >
          {initialsOf(user)}
        </span>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold text-content-strong sm:text-3xl">
            {user.firstName ? `Hi, ${user.firstName}` : "Your account"}
          </h1>
          <p className="mt-1 truncate text-sm text-content-muted">{user.email}</p>
        </div>

        <Button variant="outline" onClick={signOut} leadingIcon={LogOut} className="shrink-0">
          Sign out
        </Button>
      </div>

      {/* --- At a glance --- */}
      <dl className="grid grid-cols-3 gap-4 border-b border-line py-6">
        <div>
          <dt className="text-sm text-content-muted">Total orders</dt>
          <dd className="tabular mt-1 text-2xl font-semibold text-content-strong">{stats.total}</dd>
        </div>
        <div>
          <dt className="text-sm text-content-muted">In progress</dt>
          <dd className="tabular mt-1 text-2xl font-semibold text-content-strong">
            {stats.inProgress}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-content-muted">Lifetime spend</dt>
          <dd className="tabular mt-1 text-2xl font-semibold text-content-strong">
            {formatPrice(stats.spend)}
          </dd>
        </div>
      </dl>

      {stats.inProgress > 0 ? (
        <Link
          href="/orders"
          className="mt-6 flex items-center gap-2.5 rounded-2xl bg-info-soft px-5 py-3.5 text-sm transition-colors hover:brightness-[0.98]"
        >
          <Truck className="h-4 w-4 shrink-0 text-info" aria-hidden="true" />
          <span className="font-medium text-content-strong">
            {stats.inProgress} {stats.inProgress === 1 ? "delivery is" : "deliveries are"} on the
            way
          </span>
          <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-content-muted" aria-hidden="true" />
        </Link>
      ) : null}

      {/* --- Destinations --- */}
      <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-content-muted">
        Manage
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const badge =
            link.href === "/cart" && cartHydrated && cartCount > 0 ? cartCount : null;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex h-full items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-sunken text-brand-600 dark:text-brand-400"
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-content-strong">{link.title}</span>
                    {badge ? (
                      <span className="tabular grid h-5 min-w-[20px] place-items-center rounded-full bg-accent-500 px-1.5 text-[11px] font-bold text-neutral-950">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-sm text-content-muted">
                    {link.description}
                  </span>
                </span>

                <ChevronRight
                  className="h-4 w-4 shrink-0 text-content-muted"
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* --- Profile --- */}
      <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-content-muted">
        Profile
      </h2>
      <dl className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface px-5">
        <div className="flex items-center gap-4 py-4">
          <User className="h-4 w-4 shrink-0 text-content-muted" aria-hidden="true" />
          <dt className="w-24 shrink-0 text-sm text-content-muted">Name</dt>
          <dd className="min-w-0 flex-1 truncate text-sm font-medium text-content-strong">
            {user.firstName || "Not set"}
          </dd>
        </div>
        <div className="flex items-center gap-4 py-4">
          <span className="h-4 w-4 shrink-0" aria-hidden="true" />
          <dt className="w-24 shrink-0 text-sm text-content-muted">Email</dt>
          <dd className="min-w-0 flex-1 truncate text-sm font-medium text-content-strong">
            {user.email}
          </dd>
        </div>
      </dl>
      </div>
    </div>
  );
}
