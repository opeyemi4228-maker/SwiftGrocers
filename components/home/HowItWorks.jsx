import React from "react";

const STEPS = [
  {
    title: "Fill your basket",
    body: "Search 4,000 products or start from a past order. Prices update live as vendors restock.",
  },
  {
    title: "Pick your window",
    body: "Two hours from now, or a slot later in the week. Change it any time before the picker starts.",
  },
  {
    title: "Watch it arrive",
    body: "Follow your driver on the map. Pay on delivery or in advance — whichever you prefer.",
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
