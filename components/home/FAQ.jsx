import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Native <details> disclosure: keyboard and screen-reader support for free,
 * works without JavaScript, and the answers stay in the HTML for crawlers.
 */
export default function FAQ({ items }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
      {items.map((item, index) => (
        <details key={item.q} className="group" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-left text-base font-semibold text-content-strong transition-colors hover:bg-surface-sunken sm:px-7 [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown className="h-5 w-5 shrink-0 text-content-muted transition-transform duration-base group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="-mt-1 px-5 pb-6 text-sm leading-relaxed text-content-muted sm:px-7">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
