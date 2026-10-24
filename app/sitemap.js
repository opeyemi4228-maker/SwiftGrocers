import { CATEGORIES, products } from "@/lib/products";
import { BUNDLES } from "@/lib/bundles";
import { CITIES } from "@/lib/locations";
import { absoluteUrl } from "@/lib/seo";

/** Every indexable URL, generated from the same data the pages render. */
export default function sitemap() {
  const now = new Date();
  const entry = (path, priority, changeFrequency = "weekly") => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "daily"),
    entry("/shop", 0.9, "daily"),
    entry("/deals", 0.9, "daily"),
    entry("/market-packs", 0.9),
    entry("/quick-list", 0.7, "monthly"),
    entry("/fresh-picks", 0.7, "daily"),
    entry("/organic-healthy", 0.6),
    entry("/seasonal-specials", 0.6),
    entry("/rewards", 0.5, "monthly"),
    entry("/help", 0.5, "monthly"),
    entry("/about", 0.4, "monthly"),
    entry("/contact", 0.4, "monthly"),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
    ...CITIES.map((city) => entry(`/delivery/${city.slug}`, 0.8)),
    ...CATEGORIES.map((category) => entry(`/category/${category.slug}`, 0.8, "daily")),
    ...BUNDLES.map((pack) => entry(pack.href, 0.7)),
    ...products.map((product) => entry(`/product/${product.slug}`, 0.6, "daily")),
  ];
}
