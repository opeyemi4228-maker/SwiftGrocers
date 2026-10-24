"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChefHat,
  ChevronDown,
  ClipboardList,
  Coins,
  Heart,
  LayoutGrid,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Phone,
  ShoppingCart,
  Tag,
  Truck,
  User,
} from "lucide-react";
import { categoryIcon } from "@/lib/categoryIcons";
import { PRIMARY_NAV, SECONDARY_NAV, DEPARTMENTS, CONTACT_DETAILS } from "@/lib/navigation";
import { getCategory, getProductsByCategory } from "@/lib/products";
import { useCartStore, selectCount, selectSubtotal, useCartHydrated } from "@/lib/states/cartStore";
import { useUserStore, useUserHydrated } from "@/lib/states/userStore";
import { useWishlistStore, useWishlistHydrated } from "@/lib/states/wishlistStore";
import { useUIStore } from "@/lib/states/uiStore";
import { useDelivery } from "@/lib/useDelivery";
import { useClickOutside, useScrolled } from "@/lib/hooks";
import { cn, formatPrice } from "@/lib/utils";
import { isBareRoute } from "@/lib/chrome";
import { FREE_DELIVERY_THRESHOLD, whatsappLink } from "@/lib/commerce";
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";

/* --- Utility bar ------------------------------------------------------------
   Where it's going and when, the two facts that decide whether a grocery
   order happens at all, sit above everything else. */

function LocationButton({ className, compact = false }) {
  const { zone, city, slot } = useDelivery();
  const open = useUIStore((state) => state.setLocationOpen);

  return (
    <button
      type="button"
      onClick={() => open(true)}
      className={cn("group inline-flex min-w-0 items-center gap-1.5 text-left", className)}
      aria-label={`Delivering to ${zone.name}, ${city.name}. Change area`}
    >
      <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-300" aria-hidden="true" />
      <span className="min-w-0 truncate">
        <span className="opacity-75">Deliver to</span>{" "}
        <span className="font-semibold underline decoration-white/30 underline-offset-2 group-hover:decoration-white">
          {zone.name}
          {compact ? "" : `, ${city.name}`}
        </span>
        {slot ? (
          <span className="opacity-75">
            {" "}
            · {slot.sameDay ? "today" : "tomorrow"} by <span className="tabular">{slot.short.replace("Tomorrow ", "")}</span>
          </span>
        ) : null}
      </span>
      <ChevronDown className="h-3 w-3 shrink-0 opacity-70" aria-hidden="true" />
    </button>
  );
}

function UtilityBar() {
  return (
    <div className="bg-brand-900 text-xs text-neutral-0 dark:bg-brand-950">
      <div className="container-page flex h-9 items-center justify-between gap-4">
        <LocationButton className="lg:hidden" compact />
        <LocationButton className="hidden lg:inline-flex" />

        <p className="hidden items-center gap-1.5 opacity-90 md:flex">
          <Truck className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
          Free delivery over <span className="tabular font-semibold">{formatPrice(FREE_DELIVERY_THRESHOLD)}</span>
        </p>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={whatsappLink("Hi SwiftGrocers!")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" aria-hidden="true" />
            Order on WhatsApp
          </a>
          <Link href="/orders" className="opacity-90 transition-opacity hover:opacity-100">
            Track order
          </Link>
          <Link href="/help" className="opacity-90 transition-opacity hover:opacity-100">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
}

/* --- Header actions -------------------------------------------------------- */

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
          ? "h-12 w-12 flex-col justify-center gap-0.5 rounded-xl text-content hover:bg-surface-sunken"
          : "h-11 bg-brand-600 pl-4 pr-5 text-primary-content shadow-sm hover:bg-brand-700 hover:shadow-brand-glow"
      )}
      aria-label={hydrated && count > 0 ? `Open cart, ${count} item${count === 1 ? "" : "s"}` : "Open cart"}
    >
      <span className="relative">
        <ShoppingCart className="h-[18px] w-[18px]" aria-hidden="true" />
        {badge ? (
          <span
            className="tabular absolute -right-2.5 -top-2.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent-400 px-1 text-[10px] font-bold text-neutral-950 ring-2 ring-surface"
            aria-hidden="true"
          >
            {badge}
          </span>
        ) : null}
      </span>
      {!compact ? (
        <span className="text-left leading-tight">
          <span className="block text-2xs opacity-80">Cart</span>
          <span className="tabular block text-xs font-bold">{hydrated ? formatPrice(subtotal) : "₦0"}</span>
        </span>
      ) : (
        <span className="text-2xs font-semibold leading-none">Cart</span>
      )}
    </button>
  );
}

function SavedLink({ compact = false }) {
  const count = useWishlistStore((state) => state.ids.length);
  const hydrated = useWishlistHydrated();
  const shown = hydrated && count > 0;

  return (
    <Link
      href="/saved"
      aria-label={shown ? `Saved items, ${count}` : "Saved items"}
      className={cn(
        "relative items-center justify-center rounded-full text-content transition-colors hover:bg-surface-sunken hover:text-content-strong",
        compact ? "inline-flex h-12 w-12 flex-col gap-0.5 rounded-xl" : "hidden h-11 w-11 lg:inline-flex"
      )}
    >
      <Heart className="h-[18px] w-[18px]" aria-hidden="true" />
      {shown ? (
        <span className="tabular absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[9px] font-bold text-neutral-0" aria-hidden="true">
          {count}
        </span>
      ) : null}
      {compact ? <span className="text-2xs font-semibold leading-none">Saved</span> : null}
    </Link>
  );
}

/* --- Mega menu ------------------------------------------------------------- */

function AislePreview({ slug, onNavigate }) {
  const category = getCategory(slug);
  const top = [...getProductsByCategory(slug)].sort((a, b) => b.soldLastWeek - a.soldLastWeek).slice(0, 4);
  if (!category) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-content-strong">{category.label}</p>
          <p className="mt-1 max-w-sm text-sm text-content-muted">{category.blurb}</p>
        </div>
        <Link
          href={`/category/${slug}`}
          onClick={onNavigate}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
        >
          See all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-5 grid grid-cols-4 gap-3">
        {top.map((product) => (
          <li key={product.id}>
            <Link href={`/product/${product.slug}`} onClick={onNavigate} className="group block">
              <span className="relative block aspect-square overflow-hidden rounded-xl bg-surface-sunken">
                <SmartImage src={product.image} alt="" sizes="120px" className="object-cover transition-transform duration-slow group-hover:scale-105" />
              </span>
              <span className="mt-2 line-clamp-2 block text-xs font-medium leading-snug text-content-strong group-hover:text-brand-700 dark:group-hover:text-brand-300">
                {product.name}
              </span>
              <span className="tabular mt-0.5 block text-xs font-bold text-content-strong">{formatPrice(product.price)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/market-packs"
        onClick={onNavigate}
        className="mt-auto flex items-center gap-3 rounded-2xl bg-accent-50 p-3 pt-3 transition-colors hover:bg-accent-100 dark:bg-accent-700/20"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-400 text-neutral-950">
          <ChefHat className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-content-strong">Cooking tonight? Get the whole pot.</span>
          <span className="block text-xs text-content-muted">Egusi, jollof and efo riro packs, every ingredient, measured.</span>
        </span>
        <ArrowRight className="h-4 w-4 text-content-muted" aria-hidden="true" />
      </Link>
    </div>
  );
}

function AislesMenu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(DEPARTMENTS[0].slug);
  const closeTimer = useRef(null);
  const ref = useClickOutside(() => setOpen(false));

  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // A short grace period stops the panel snapping shut when the pointer cuts a corner.
  const enter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };

  return (
    <div ref={ref} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors duration-fast",
          open ? "bg-brand-600 text-primary-content" : "bg-surface-sunken text-content-strong hover:bg-line"
        )}
      >
        <LayoutGrid className="h-4 w-4" aria-hidden="true" />
        All categories
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-fast", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-overlay grid w-[min(60rem,calc(100vw-5rem))] grid-cols-[16rem_1fr] overflow-hidden rounded-3xl border border-line bg-surface shadow-xl animate-scale-in">
          <ul className="max-h-[32rem] overflow-y-auto border-r border-line bg-surface-sunken/60 p-2">
            {DEPARTMENTS.map((department) => {
              const Icon = categoryIcon(department.slug);
              const isActive = active === department.slug;
              return (
                <li key={department.slug}>
                  <Link
                    href={department.href}
                    onMouseEnter={() => setActive(department.slug)}
                    onFocus={() => setActive(department.slug)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      isActive ? "bg-surface font-semibold text-content-strong shadow-sm" : "text-content hover:bg-surface/70"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-brand-600 dark:text-brand-400" : "text-content-muted")} strokeWidth={1.9} aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{department.label}</span>
                    {isActive ? <ArrowRight className="h-3.5 w-3.5 text-content-muted" aria-hidden="true" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="p-6">
            <AislePreview slug={active} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NavLink({ href, label, highlight, badge, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm transition-colors duration-fast",
        active ? "font-semibold text-brand-700 dark:text-brand-300" : "font-medium text-content hover:bg-surface-sunken hover:text-content-strong",
        highlight && !active && "text-danger hover:text-danger"
      )}
    >
      {highlight ? <Tag className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      {label}
      {badge ? (
        <span className="rounded-full bg-accent-400 px-1.5 py-0.5 text-[10px] font-bold leading-none text-neutral-950">{badge}</span>
      ) : null}
      {active ? <span className="absolute inset-x-3 -bottom-[5px] h-0.5 rounded-full bg-brand-600 dark:bg-brand-400" aria-hidden="true" /> : null}
    </Link>
  );
}

/* --- Mobile menu ----------------------------------------------------------- */

const SHORTCUTS = [
  { href: "/deals", label: "Deals", icon: Tag, tone: "bg-danger-soft text-danger" },
  { href: "/market-packs", label: "Soup packs", icon: ChefHat, tone: "bg-accent-100 text-accent-700 dark:bg-accent-700/25 dark:text-accent-200" },
  { href: "/quick-list", label: "Shopping list", icon: ClipboardList, tone: "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200" },
  { href: "/orders", label: "My orders", icon: Package, tone: "bg-info-soft text-info" },
  { href: "/saved", label: "Saved items", icon: Heart, tone: "bg-danger-soft text-danger" },
  { href: "/rewards", label: "Rewards", icon: Coins, tone: "bg-accent-100 text-accent-700 dark:bg-accent-700/25 dark:text-accent-200" },
];

function MobileMenu({ open, onClose, user, isActive }) {
  return (
    <Drawer open={open} onClose={onClose} side="left" title="Menu">
      <div className="px-4 py-4">
        <Link
          href={user ? "/account" : "/auth"}
          className="flex items-center gap-3 rounded-2xl bg-brand-800 p-4 text-neutral-0"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 font-display text-sm font-bold">
            {user ? (user.firstName?.[0] ?? "S") : <User className="h-5 w-5" aria-hidden="true" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">{user ? `Hi, ${user.firstName ?? "there"}` : "Sign in or create account"}</span>
            <span className="block text-xs text-neutral-0/75">{user ? "Your orders, addresses and rewards" : "Get 20% off your first order"}</span>
          </span>
          <ArrowRight className="h-4 w-4 opacity-70" aria-hidden="true" />
        </Link>

        <ul className="mt-4 grid grid-cols-3 gap-2">
          {SHORTCUTS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="flex flex-col items-center gap-2 rounded-2xl border border-line p-3 text-center text-xs font-semibold text-content-strong transition-colors hover:bg-surface-sunken"
              >
                <span className={cn("grid h-9 w-9 place-items-center rounded-xl", item.tone)}>
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mb-1 mt-6 px-1 text-xs font-semibold uppercase tracking-wider text-content-muted">Categories</p>
        <ul className="space-y-0.5">
          {DEPARTMENTS.map((department) => {
            const Icon = categoryIcon(department.slug);
            return (
              <li key={department.slug}>
                <Link
                  href={department.href}
                  aria-current={isActive(department.href) ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-surface-sunken",
                    isActive(department.href) ? "bg-brand-50 font-semibold text-brand-800 dark:bg-brand-950 dark:text-brand-200" : "text-content"
                  )}
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

        <div className="mt-6 grid gap-2 border-t border-line pt-5">
          <p className="px-1 text-sm font-semibold text-content-strong">Need help? Talk to us</p>
          <Button
            as="a"
            href={whatsappLink("Hi SwiftGrocers!")}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            block
            leadingIcon={MessageCircle}
          >
            Chat on WhatsApp
          </Button>
          <Button as="a" href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`} variant="ghost" block leadingIcon={Phone}>
            {CONTACT_DETAILS.phone}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

/* --- Header ---------------------------------------------------------------- */

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

      <UtilityBar />

      <header
        className={cn(
          "sticky top-0 z-header border-b border-line bg-surface/90 backdrop-blur-xl backdrop-saturate-150",
          "transition-shadow duration-base",
          scrolled && "shadow-md"
        )}
      >
        <div className="container-page flex h-16 items-center gap-2 lg:h-[4.75rem] lg:gap-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="-ml-2 flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl text-content transition-colors hover:bg-surface-sunken lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="text-2xs font-semibold leading-none">Menu</span>
          </button>

          <Logo className="shrink-0" size="md" />

          <SearchBox className="hidden min-w-0 flex-1 lg:block" />

          <div className="ml-auto flex items-center gap-0.5 lg:gap-1.5">
            <Link
              href={user ? "/account" : "/auth"}
              className="hidden h-11 items-center gap-2.5 rounded-full px-3 text-left transition-colors hover:bg-surface-sunken lg:inline-flex"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-sunken text-content-strong">
                <User className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-2xs text-content-muted">{user ? `Hi, ${user.firstName || "there"}` : "Sign in"}</span>
                <span className="block text-xs font-semibold text-content-strong">My account</span>
              </span>
            </Link>

            <SavedLink />
            <span className="lg:hidden">
              <SavedLink compact />
            </span>

            <span className="hidden lg:inline-flex">
              <CartButton />
            </span>
            <span className="lg:hidden">
              <CartButton compact />
            </span>
          </div>
        </div>

        <div className="container-page pb-3 lg:hidden">
          <SearchBox />
        </div>

        <div className="hidden border-t border-line lg:block">
          <div className="container-page flex h-14 items-center gap-2">
            <AislesMenu />
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

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} user={user} isActive={isActive} />
    </>
  );
}
