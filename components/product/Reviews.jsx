import React from "react";
import { BadgeCheck, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Rating from "@/components/ui/Rating";

/** Rating histogram and a few reviews. The bars read faster than any number. */
export default function Reviews({ product, breakdown, reviews }) {
  return (
    <div id="reviews" className="grid scroll-mt-40 gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-4">
        <h2 className="text-xl font-semibold">Customer reviews</h2>
        <div className="mt-4 flex items-center gap-3">
          <span className="tabular font-display text-5xl font-extrabold text-content-strong">{product.rating.toFixed(1)}</span>
          <div>
            <Rating value={product.rating} size="lg" showValue={false} />
            <p className="tabular mt-1 text-sm text-content-muted">{product.reviewCount.toLocaleString("en-NG")} ratings</p>
          </div>
        </div>
        <ul className="mt-6 space-y-2">
          {breakdown.map((row) => (
            <li key={row.stars} className="flex items-center gap-3 text-sm">
              <span className="tabular inline-flex w-8 items-center gap-0.5 text-content-muted">
                {row.stars}
                <Star className="h-3 w-3" fill="currentColor" strokeWidth={0} aria-hidden="true" />
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-sunken" aria-hidden="true">
                <span className="block h-full rounded-full bg-accent-400" style={{ width: `${Math.round(row.share * 100)}%` }} />
              </span>
              <span className="tabular w-10 text-right text-xs text-content-muted">{Math.round(row.share * 100)}%</span>
              <span className="sr-only">{row.stars} stars: {row.count} ratings</span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="space-y-4 lg:col-span-8">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Rating value={review.rating} size="sm" showValue={false} />
              <time dateTime={review.date} className="text-xs text-content-muted">{formatDate(review.date)}</time>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-content-strong">{review.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-content">{review.body}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-content-muted">
              <span className="font-medium text-content-strong">{review.author}</span> · {review.location}
              {review.verified ? (
                <span className="inline-flex items-center gap-1 text-brand-700 dark:text-brand-300">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified purchase
                </span>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
