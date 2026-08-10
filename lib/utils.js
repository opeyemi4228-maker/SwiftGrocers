import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Conditional class names with Tailwind conflict resolution. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** Money for display. Non-numeric input passes through untouched. */
export function formatPrice(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return value ?? "—";
  return NGN.format(value);
}

const COMPACT = new Intl.NumberFormat("en-NG", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCompact(value) {
  if (typeof value !== "number") return value ?? "—";
  return COMPACT.format(value);
}

export function formatDate(value, options = { dateStyle: "medium" }) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-NG", options).format(date);
}

export function discountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Clamp for quantity steppers and slider inputs. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
