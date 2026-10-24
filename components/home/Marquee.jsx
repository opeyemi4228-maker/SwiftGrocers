import React from "react";

const DEFAULT_ITEMS = [
  "Picked this morning",
  "Delivered in about 2 hours",
  "Pay when it arrives",
  "Not fresh? Get your money back",
  "No haggling",
  "No stones in rice, no sand in crayfish",
  "Lagos · Abuja · Port Harcourt · Ibadan",
];

/**
 * A loud, looping band of promises between calmer sections. Content is
 * duplicated once so the CSS loop is seamless; the copy is hidden from
 * assistive tech the second time, and the motion stops under reduced motion.
 */
export default function Marquee({ items = DEFAULT_ITEMS, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-700 text-neutral-0 dark:bg-brand-900",
    accent: "bg-accent-400 text-neutral-950",
    ink: "bg-neutral-950 text-neutral-0",
  };

  const row = (hidden) => (
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-8 whitespace-nowrap">
          <span className="font-display text-sm font-bold uppercase tracking-[0.14em] sm:text-base">
            {item}
          </span>
          <span className="text-lg opacity-60" aria-hidden="true">✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`relative flex overflow-hidden py-3.5 ${tones[tone]}`}>
      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
