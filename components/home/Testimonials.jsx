import React from "react";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    quote:
      "I stopped budgeting an hour for the market. The tomatoes arrive firmer than the ones I used to pick myself.",
    name: "Adaeze Okonkwo",
    detail: "Lekki, Lagos · 34 orders",
    tone: "bg-brand-100 text-brand-800",
  },
  {
    quote:
      "One box of vegetables a week for the restaurant. Two years in and they have missed a delivery once, and refunded it before I asked.",
    name: "Ibrahim Bello",
    detail: "Wuse II, Abuja · 210 orders",
    tone: "bg-accent-100 text-accent-700",
  },
  {
    quote:
      "The prices actually hold. Nothing quietly goes up between the basket and the checkout, which is more than I can say for the alternatives.",
    name: "Chinelo Eze",
    detail: "GRA, Port Harcourt · 61 orders",
    tone: "bg-info-soft text-info",
  },
];

const initials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

/** Customer quotes. Initial avatars avoid stock-photo faces standing in for real people. */
export default function Testimonials() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {REVIEWS.map((review) => (
        <li
          key={review.name}
          className="flex flex-col rounded-2xl border border-line bg-surface p-6"
        >
          <div className="flex gap-0.5 text-accent-400" aria-label="Rated 5 out of 5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
            ))}
          </div>

          <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-content">
            “{review.quote}”
          </blockquote>

          <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold ${review.tone}`}
              aria-hidden="true"
            >
              {initials(review.name)}
            </span>
            <span>
              <span className="block text-sm font-semibold text-content-strong">{review.name}</span>
              <span className="block text-xs text-content-muted">{review.detail}</span>
            </span>
          </figcaption>
        </li>
      ))}
    </ul>
  );
}
