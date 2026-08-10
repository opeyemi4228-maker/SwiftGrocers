import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Vertical rhythm wrapper. Every page section uses one of these three sizes. */
export function Section({ className, size = "md", children, ...props }) {
  const padding = {
    sm: "py-14 sm:py-20",
    md: "py-20 sm:py-28",
    lg: "py-24 sm:py-36",
  }[size];

  return (
    <section className={cn(padding, className)} {...props}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  actionHref,
  align = "start",
  className,
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        {description ? (
          <p className="mt-2.5 text-base text-content-muted">{description}</p>
        ) : null}
      </div>

      {action && actionHref ? (
        <Link
          href={actionHref}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
        >
          {action}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-base ease-out-quart group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </div>
  );
}

export default Section;
