import { SITE } from "@/lib/seo";

const PRIVATE = ["/cart", "/payment", "/account", "/auth", "/orders", "/order-placed", "/saved", "/add-address", "/my-orders"];

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [...PRIVATE, "/shop?*"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
