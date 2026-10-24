import React from "react";
import { Banknote, CreditCard, Hash, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

const METHODS = [
  { icon: CreditCard, label: "Card", note: "Visa · Mastercard · Verve" },
  { icon: Landmark, label: "Bank transfer", note: "Instant confirmation" },
  { icon: Hash, label: "USSD", note: "No data needed" },
  { icon: Banknote, label: "Pay on delivery", note: "Cash or POS" },
];

/** The four ways Nigerians actually pay. Shown wherever trust is decided. */
export default function PaymentMethods({ className, compact = false }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Accepted payment methods">
      {METHODS.map((method) => (
        <li
          key={method.label}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border border-line bg-surface text-content-strong",
            compact ? "px-2.5 py-1.5 text-2xs font-semibold" : "px-3 py-2 text-xs font-semibold"
          )}
        >
          <method.icon className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <span>
            {method.label}
            {!compact ? <span className="block text-2xs font-normal text-content-muted">{method.note}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
