import { CATEGORIES } from "@/lib/products";

/** Primary navigation. Order reflects how often shoppers use each destination. */
export const PRIMARY_NAV = [
  { href: "/shop", label: "Shop all" },
  { href: "/deals", label: "Deals", highlight: true },
  { href: "/fresh-picks", label: "Fresh picks" },
  { href: "/organic-healthy", label: "Organic" },
  { href: "/seasonal-specials", label: "Seasonal" },
];

export const SECONDARY_NAV = [
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact" },
];

export const DEPARTMENTS = CATEGORIES.map((category) => ({
  href: `/shop?category=${category.slug}`,
  label: category.label,
  slug: category.slug,
}));

export const FOOTER_SECTIONS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/deals", label: "Deals & offers" },
      { href: "/fresh-picks", label: "Fresh picks" },
      { href: "/organic-healthy", label: "Organic & healthy" },
      { href: "/seasonal-specials", label: "Seasonal specials" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/orders", label: "Your orders" },
      { href: "/cart", label: "Your cart" },
      { href: "/add-address", label: "Delivery addresses" },
      { href: "/auth", label: "Sign in" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/contact", label: "Contact us" },
    ],
  },
];

export const CONTACT_DETAILS = {
  email: "hello@swiftgrocers.com.ng",
  phone: "+234 908 720 6986",
  address: "Prime Mall, Plot C110, 69 Road, 6th Avenue, Abuja",
};
