import { CATEGORIES } from "@/lib/products";
import { CITIES } from "@/lib/locations";

/** Primary navigation. Order reflects how often shoppers use each destination. */
export const PRIMARY_NAV = [
  { href: "/deals", label: "Deals", highlight: true },
  { href: "/market-packs", label: "Soup packs" },
  { href: "/quick-list", label: "Shopping list", badge: "New" },
  { href: "/fresh-picks", label: "Fresh today" },
  { href: "/organic-healthy", label: "Organic" },
];

export const SECONDARY_NAV = [
  { href: "/rewards", label: "Rewards" },
  { href: "/about", label: "About us" },
];

export const DEPARTMENTS = CATEGORIES.map((category) => ({
  href: `/category/${category.slug}`,
  label: category.label,
  short: category.short,
  slug: category.slug,
}));

export const FOOTER_SECTIONS = [
  {
    title: "Shop",
    links: [
      ...CATEGORIES.slice(0, 4).map((category) => ({ href: `/category/${category.slug}`, label: category.label })),
      { href: "/shop", label: "All products" },
    ],
  },
  {
    title: "Ways to shop",
    links: [
      { href: "/market-packs", label: "Soup packs" },
      { href: "/quick-list", label: "Shopping list" },
      { href: "/deals", label: "This week's deals" },
      { href: "/fresh-picks", label: "Fresh today" },
      { href: "/seasonal-specials", label: "In season" },
      { href: "/rewards", label: "Rewards" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/orders", label: "Track an order" },
      { href: "/contact", label: "Contact us" },
      { href: "/help", label: "Help & questions" },
      { href: "/saved", label: "Saved items" },
      { href: "/account", label: "My account" },
    ],
  },
  {
    title: "We deliver to",
    links: CITIES.map((city) => ({ href: `/delivery/${city.slug}`, label: city.name })),
  },
];

export const CONTACT_DETAILS = {
  email: "hello@swiftgrocers.com.ng",
  phone: "+234 908 720 6986",
  address: "Prime Mall, Plot C110, 69 Road, 6th Avenue, Abuja",
  hours: "Every day, 7:00 AM to 9:00 PM",
};
