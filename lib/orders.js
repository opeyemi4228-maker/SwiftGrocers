import { products } from "@/lib/products";

/**
 * Demo order history. Line items reference the real catalogue so imagery and
 * prices stay consistent with what the shop shows.
 */
const pick = (id) => products.find((product) => product.id === id);

export const ORDER_STATUS = {
  delivered: { label: "Delivered", tone: "success" },
  "out-for-delivery": { label: "Out for delivery", tone: "info" },
  packing: { label: "Being packed", tone: "warning" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

export const ORDERS = [
  {
    id: "SG-24815",
    placedAt: "2026-07-24T09:12:00Z",
    status: "out-for-delivery",
    eta: "Today, 2:40 PM",
    payment: "Paystack · card ending 4242",
    address: "12 Admiralty Way, Lekki Phase 1, Lagos",
    lines: [
      { product: pick("fresh-tomatoes"), quantity: 2 },
      { product: pick("agege-bread"), quantity: 1 },
      { product: pick("eggs-crate"), quantity: 1 },
    ],
  },
  {
    id: "SG-24702",
    placedAt: "2026-07-19T16:40:00Z",
    status: "delivered",
    eta: "Delivered 19 Jul, 6:05 PM",
    payment: "Pay on delivery (POS)",
    address: "12 Admiralty Way, Lekki Phase 1, Lagos",
    lines: [
      { product: pick("parboiled-rice-10kg"), quantity: 1 },
      { product: pick("red-palm-oil"), quantity: 1 },
      { product: pick("ground-crayfish"), quantity: 2 },
    ],
  },
  {
    id: "SG-24566",
    placedAt: "2026-07-11T11:05:00Z",
    status: "delivered",
    eta: "Delivered 11 Jul, 1:20 PM",
    payment: "Card ending 4242",
    address: "Prime Mall, 6th Avenue, Abuja",
    lines: [
      { product: pick("ground-egusi"), quantity: 3 },
      { product: pick("ijebu-garri"), quantity: 2 },
    ],
  },
  {
    id: "SG-24390",
    placedAt: "2026-06-28T08:30:00Z",
    status: "cancelled",
    eta: "Cancelled by you",
    payment: "Refunded to card",
    address: "12 Admiralty Way, Lekki Phase 1, Lagos",
    lines: [{ product: pick("whole-chicken"), quantity: 1 }],
  },
].map((order) => {
  const lines = order.lines.filter((line) => line.product);
  return {
    ...order,
    lines,
    itemCount: lines.reduce((total, line) => total + line.quantity, 0),
    total: lines.reduce((total, line) => total + line.product.price * line.quantity, 0),
  };
});

export const getOrder = (id) => ORDERS.find((order) => order.id === id) ?? null;
