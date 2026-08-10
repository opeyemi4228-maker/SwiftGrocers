import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap font-medium leading-none",
  {
    variants: {
      tone: {
        neutral: "bg-surface-sunken text-content",
        brand: "bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-200",
        accent: "bg-accent-50 text-accent-700 dark:bg-accent-700/25 dark:text-accent-200",
        success: "bg-success-soft text-success dark:text-brand-200",
        warning: "bg-warning-soft text-accent-700 dark:text-accent-200",
        danger: "bg-danger-soft text-danger dark:text-danger",
        info: "bg-info-soft text-info dark:text-info",
        solid: "bg-neutral-900 text-neutral-0 dark:bg-neutral-0 dark:text-neutral-900",
        "solid-danger": "bg-danger text-neutral-0",
        "solid-accent": "bg-accent-500 text-neutral-950",
      },
      size: {
        sm: "rounded-md px-1.5 py-1 text-2xs",
        md: "rounded-lg px-2 py-1.5 text-xs",
        lg: "rounded-lg px-2.5 py-2 text-sm",
      },
      outlined: {
        true: "border",
      },
    },
    compoundVariants: [
      { outlined: true, tone: "neutral", class: "border-line bg-transparent" },
      { outlined: true, tone: "brand", class: "border-brand-200 dark:border-brand-800" },
    ],
    defaultVariants: { tone: "neutral", size: "md" },
  }
);

export default function Badge({ className, tone, size, outlined, icon: Icon, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ tone, size, outlined }), className)} {...props}>
      {Icon ? <Icon className="h-3 w-3 shrink-0" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
