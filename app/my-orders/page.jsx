import { redirect } from "next/navigation";

/** Legacy route kept as a redirect so old links still resolve. */
export default function MyOrdersPage() {
  redirect("/orders");
}
