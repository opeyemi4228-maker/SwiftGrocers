"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, Tag, User } from "lucide-react";
import { useCartStore, selectCount, useCartHydrated } from "@/lib/states/cartStore";
import { useUserStore, useUserHydrated } from "@/lib/states/userStore";
import { cn } from "@/lib/utils";
import { isBareRoute } from "@/lib/chrome";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/deals", label: "Deals", icon: Tag },
  { type: "cart", label: "Cart", icon: ShoppingCart },
  { type: "account", icon: User },
];

/**
 * Thumb-reachable navigation for small screens. Mirrors the destinations in the
 * desktop header so the two never drift apart.
 */
export default function MobileTabBar() {
  const pathname = usePathname();
  const openCart = useCartStore((state) => state.openCart);
  const count = useCartStore(selectCount);
  const hydrated = useCartHydrated();

  const user = useUserStore((state) => state.user);
  const userHydrated = useUserHydrated();

  // The session only exists client-side, so before hydration this has to match
  // what the server rendered: signed out.
  const signedIn = userHydrated && Boolean(user);

  // The label stays "Account" either way, signed out, the tab is how you get
  // to sign-in, so hydrating the session never shifts the bar.
  const tabs = TABS.map((tab) =>
    tab.type === "account"
      ? { ...tab, label: "Account", href: signedIn ? "/account" : "/auth" }
      : tab
  );

  if (isBareRoute(pathname)) return null;

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-header border-t border-line bg-surface/95 backdrop-blur-xl safe-bottom lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.href ? isActive(tab.href) : false;

          const inner = (
            <>
              <span className="relative">
                <Icon
                  className={cn("h-5 w-5", active ? "text-brand-600 dark:text-brand-400" : "text-content-muted")}
                  aria-hidden="true"
                />
                {tab.type === "cart" && hydrated && count > 0 ? (
                  <span
                    className="tabular absolute -right-2.5 -top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-neutral-950"
                    aria-hidden="true"
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "text-xs",
                  active
                    ? "font-semibold text-brand-700 dark:text-brand-300"
                    : "font-medium text-content-muted"
                )}
              >
                {tab.label}
              </span>
            </>
          );

          return (
            <li key={tab.href ?? tab.type}>
              {tab.type === "cart" ? (
                <button
                  type="button"
                  onClick={openCart}
                  aria-label={count > 0 ? `Open cart, ${count} items` : "Open cart"}
                  className="flex h-16 w-full flex-col items-center justify-center gap-1"
                >
                  {inner}
                </button>
              ) : (
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className="flex h-16 flex-col items-center justify-center gap-1"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
