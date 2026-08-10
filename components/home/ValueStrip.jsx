import React from "react";
import { Leaf, RotateCcw, Truck, Wallet } from "lucide-react";

const VALUES = [
  {
    icon: Truck,
    title: "Two-hour delivery",
    body: "Order before 6 PM and it arrives the same day, tracked door to door.",
  },
  {
    icon: Leaf,
    title: "Picked, not stored",
    body: "Produce leaves the farm the morning your order ships. Nothing sits in a depot.",
  },
  {
    icon: Wallet,
    title: "Prices you can check",
    body: "The shelf price is the price. No surge pricing, no service fee at checkout.",
  },
  {
    icon: RotateCcw,
    title: "Refunded, no debate",
    body: "Anything that arrives less than fresh is refunded in full. Just tell us.",
  },
];

/** Four commitments, separated by rules rather than boxed into cards. */
export default function ValueStrip() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:grid-cols-4">
      {VALUES.map((value) => (
        <li key={value.title} className="bg-surface p-6">
          <value.icon
            className="h-5 w-5 text-brand-600 dark:text-brand-400"
            aria-hidden="true"
            strokeWidth={1.75}
          />
          <h3 className="mt-4 text-sm font-semibold text-content-strong">{value.title}</h3>
          <p className="mt-1.5 text-sm text-content-muted">{value.body}</p>
        </li>
      ))}
    </ul>
  );
}
