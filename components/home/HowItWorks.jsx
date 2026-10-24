import React from "react";

const STEPS = [
  {
    title: "Choose your items",
    body: "Search or tap a category, then press “Add”. You can also send your list to us on WhatsApp.",
  },
  {
    title: "Pick a delivery time",
    body: "Choose when you want it. Most orders arrive in about 2 hours.",
  },
  {
    title: "Pay when it arrives",
    body: "Check your items at the door, then pay with cash, transfer, card or POS.",
  },
];

/** Three steps on a shared baseline, joined by a hairline on wide screens. */
export default function HowItWorks() {
  return (
    <ol className="relative grid gap-10 sm:grid-cols-3 sm:gap-8">
      <span
        className="absolute left-0 right-0 top-5 hidden h-px bg-line sm:block"
        aria-hidden="true"
      />

      {STEPS.map((step, index) => (
        <li key={step.title} className="relative">
          <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-line bg-surface font-display text-sm font-bold text-brand-700 dark:text-brand-300">
            {index + 1}
          </span>
          <h3 className="mt-5 text-base font-semibold text-content-strong">{step.title}</h3>
          <p className="mt-2 max-w-xs text-sm text-content-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
