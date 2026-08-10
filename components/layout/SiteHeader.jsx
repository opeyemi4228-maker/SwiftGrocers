"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutGrid, Menu, Package, ShoppingCart, Sparkles, User, X } from "lucide-react";
import { categoryIcon } from "@/lib/categoryIcons";
import { PRIMARY_NAV, SECONDARY_NAV, DEPARTMENTS } from "@/lib/navigation";
import { useCartStore, selectCount, selectSubtotal, useCartHydrated } from "@/lib/states/cartStore";
import { useUserStore, useUserHydrated } from "@/lib/states/userStore";
import { useClickOutside, useScrolled } from "@/lib/hooks";
import { cn, formatPrice } from "@/lib/utils";
import { isBareRoute } from "@/lib/chrome";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/commerce";
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";

const ANNOUNCEMENT_KEY = "swift:announcement-dismissed";

function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(sessionStorage.getItem(ANNOUNCEMENT_KEY) !== "1");
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-brand-800 text-neutral-0 dark:bg-brand-950">
      <div className="container-page flex h-9 items-center justify-center gap-2 text-xs">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent-300" aria-hidden="true" />
        <p className="truncate">
          Free delivery on orders over{" "}
          <span className="tabular font-semibold">{formatPrice(FREE_DELIVERY_THRESHOLD)}</span> ·{" "}
          <Link href="/deals" className="font-semibold underline underline-offset-2">
            See this week&apos;s deals
          </Link>
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem(ANNOUNCEMENT_KEY, "1");
          setVisible(false);
        }}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-neutral-0/70 transition-colors hover:bg-white/10 hover:text-neutral-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function CartButton({ compact = false }) {
  const openCart = useCartStore((state) => state.openCart);
  const count = useCartStore(selectCount);
  const subtotal = useCartStore(selectSubtotal);
  const hydrated = useCartHydrated();

  const badge = hydrated && count > 0 ? (count > 99 ? "99+" : count) : null;

  return (
    <button
      type="button"
      onClick={openCart}
      className={cn(
        "group relative inline-flex items-center gap-2.5 rounded-full transition-colors duration-fast",
        compact
          ? "h-10 w-10 justify-center text-content hover:bg-surface-sunken"
          : "h-11 border border-line-strong bg-surface pl-4 pr-5 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950"
      )}
      aria-label={
        hydrated && count > 0 ? `Open cart, ${count} item${count === 1 ? "" : "s"}` : "Open cart"
      }
    >
      <span className="relative">
        <ShoppingCart className="h-[18px] w-[18px]" aria-hidden="true" />
        {badge ? (
          <span
            className="tabular absolute -right-2 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-neutral-950"
            aria-hidden="true"
          >
            {badge}
          </span>
        ) : null}
      </span>

      {!compact ? (
        <span className="text-left leading-tight">
          <span className="block text-2xs text-content-muted">Cart</span>
          <span className="tabular block text-xs font-semibold text-content-strong">
            {hydrated ? formatPrice(subtotal) : "—"}
          </span>
        </span>
      ) : null}
    </button>
  );
}

function CategoriesMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-colors duration-fast",
          open
            ? "bg-brand-600 text-primary-content"
            : "bg-surface-sunken text-content-strong hover:bg-line"
        )}
      >
        <LayoutGrid className="h-4 w-4" aria-hidden="true" />
        Categories
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-fast", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-overlay w-[38rem] overflow-hidden rounded-2xl border border-line bg-surface p-2.5 shadow-xl animate-scale-in">
          <ul className="grid grid-cols-2 gap-1">
            {DEPARTMENTS.map((department) => {
              const Icon = categoryIcon(department.slug);
              return (
                <li key={department.slug}>
                  <Link
                    href={department.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-content transition-colors hover:bg-brand-50 hover:text-brand-800 dark:hover:bg-brand-950 dark:hover:text-brand-200"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-sunken text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-primary-content dark:text-brand-400">
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="font-medium">{department.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-1.5 border-t border-line px-3 pt-3">
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
            >
              Shop all products
              <ChevronDown className="h-3.5 w-3.5 -rotate-90" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NavLink({ href, label, highlight, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex h-9 items-center rounded-full px-3 text-sm transition-colors duration-fast",
        active
          ? "font-semibold text-brand-700 dark:text-brand-300"
          : "font-medium text-content hover:text-content-strong",
        highlight && !active && "text-accent-700 dark:text-accent-300"
      )}
    >
      {label}
      {active ? (
        <span
          className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-brand-600 dark:bg-brand-400"
          aria-hidden="true"
        />
      ) : null}
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled(4);
  const [menuOpen, setMenuOpen] = useState(false);
  const storedUser = useUserStore((state) => state.user);
  const userHydrated = useUserHydrated();

  // The session is read from localStorage, so it does not exist during SSR or
  // on the first client render. Gating on hydration keeps those two in step.
  const user = userHydrated ? storedUser : null;

  // A route change should never leave the mobile drawer open behind the page.
  useEffect(() => setMenuOpen(false), [pathname]);

  // The account area renders without site chrome.
  if (isBareRoute(pathname)) return null;

  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <>
      <a
        href="#main"
        className="sr-only z-toast focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-xl focus:bg-brand-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-content"
      >
        Skip to content
      </a>

      <AnnouncementBar />

      <header
        className={cn(
          "sticky top-0 z-header border-b border-line bg-surface/85 backdrop-blur-xl backdrop-saturate-150",
          "transition-shadow duration-base",
          scrolled && "shadow-md"
        )}
      >
        {/* --- Main row --- */}
        <div className="container-page flex h-14 items-center gap-3 lg:h-20 lg:gap-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="-ml-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-content transition-colors hover:bg-surface-sunken lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo className="shrink-0" />

          <SearchBox className="hidden min-w-0 flex-1 lg:block" />

          <div className="ml-auto flex items-center gap-1 lg:gap-2">
            <Link
              href="/orders"
              className="hidden h-10 items-center gap-2 rounded-full px-3 text-left transition-colors hover:bg-surface-sunken lg:inline-flex"
            >
              <Package className="h-[18px] w-[18px] text-content" aria-hidden="true" />
              <span className="leading-tight">
                <span className="block text-2xs text-content-muted">Returns</span>
                <span className="block text-xs font-semibold text-content-strong">& orders</span>
              </span>
            </Link>

            <Link
              href={user ? "/account" : "/auth"}
              className="hidden h-10 items-center gap-2 rounded-full px-3 text-left transition-colors hover:bg-surface-sunken lg:inline-flex"
            >
              <User className="h-[18px] w-[18px] text-content" aria-hidden="true" />
              <span className="leading-tight">
                <span className="block text-2xs text-content-muted">
                  {user ? `Hi, ${user.firstName || user.name || "there"}` : "Sign in"}
                </span>
                <span className="block text-xs font-semibold text-content-strong">Account</span>
              </span>
            </Link>

            <span className="hidden lg:inline-flex">
              <CartButton />
            </span>
            <span className="lg:hidden">
              <CartButton compact />
            </span>
          </div>
        </div>

        {/* --- Mobile search row --- */}
        <div className="container-page pb-3 lg:hidden">
          <SearchBox />
        </div>

        {/* --- Desktop category row --- */}
        <div className="hidden border-t border-line lg:block">
          <div className="container-page flex h-12 items-center gap-2">
            <CategoriesMenu />
            <nav aria-label="Primary" className="flex items-center gap-0.5">
              {PRIMARY_NAV.map((link) => (
                <NavLink key={link.href} {...link} active={isActive(link.href)} />
              ))}
            </nav>
            <nav aria-label="Secondary" className="ml-auto flex items-center gap-0.5">
              {SECONDARY_NAV.map((link) => (
                <NavLink key={link.href} {...link} active={isActive(link.href)} />
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* --- Mobile navigation --- */}
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="left" title="Menu">
        <nav aria-label="Mobile" className="px-3 py-3">
          <ul className="space-y-0.5">
            {[{ href: "/", label: "Home" }, ...PRIMARY_NAV, ...SECONDARY_NAV].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-sm transition-colors",
                    isActive(link.href)
                      ? "bg-brand-50 font-semibold text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                      : "font-medium text-content hover:bg-surface-sunken"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mb-1 mt-5 px-3 text-xs font-semibold uppercase tracking-wider text-content-muted">
            Categories
          </p>
          <ul className="space-y-0.5">
            {DEPARTMENTS.map((department) => {
              const Icon = categoryIcon(department.slug);
              return (
                <li key={department.slug}>
                  <Link
                    href={department.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-content transition-colors hover:bg-surface-sunken"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-sunken text-brand-600 dark:text-brand-400">
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="font-medium">{department.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 border-t border-line px-3 pt-4">
            <Button href={user ? "/account" : "/auth"} block leadingIcon={User}>
              {user ? "Your account" : "Sign in"}
            </Button>
          </div>
        </nav>
      </Drawer>
    </>
  );
}
