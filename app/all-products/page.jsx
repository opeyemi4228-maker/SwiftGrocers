import { redirect } from "next/navigation";

/**
 * Legacy route. The shop page is the single catalogue surface now, so this
 * redirects rather than maintaining a second, diverging product list.
 */
export default function AllProductsPage() {
  redirect("/shop");
}
