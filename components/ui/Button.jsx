"use client";

import React from "react";
import NextLink from "next/link";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap",
    "font-medium leading-none",
    "transition-[background-color,color,box-shadow,transform,border-color]",
    "duration-fast ease-out-quart",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-content shadow-sm hover:bg-primary-hover hover:shadow-brand-glow",
        accent:
          "bg-accent-500 text-neutral-950 shadow-sm hover:bg-accent-400 hover:shadow-accent-glow",
        secondary:
          "bg-surface-sunken text-content-strong hover:bg-line",
        outline:
          "border border-line-strong bg-surface text-content-strong hover:border-brand-400 hover:bg-brand-50 hover:text-brand-800 dark:hover:bg-brand-950 dark:hover:text-brand-200",
        ghost: "text-content hover:bg-surface-sunken hover:text-content-strong",
        subtle: "bg-brand-50 text-brand-800 hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-200 dark:hover:bg-brand-900",
        danger: "bg-danger text-neutral-0 shadow-sm hover:brightness-110",
        link: "h-auto p-0 text-brand-700 underline-offset-4 hover:underline dark:text-brand-300",
      },
      size: {
        xs: "h-8 rounded-md px-3 text-xs",
        sm: "h-9 rounded-lg px-3.5 text-sm",
        md: "h-11 rounded-xl px-5 text-sm",
        lg: "h-12 rounded-xl px-6 text-base",
        xl: "h-14 rounded-2xl px-8 text-base",
        icon: "h-10 w-10 rounded-full",
        "icon-sm": "h-8 w-8 rounded-full",
        "icon-lg": "h-12 w-12 rounded-full",
      },
      block: {
        true: "w-full",
      },
    },
    compoundVariants: [{ variant: "link", size: ["xs", "sm", "md", "lg", "xl"], class: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  }
);

/**
 * Icons arrive either as a component reference (`icon={ArrowRight}`) from
 * client components, or as an element (`icon={<ArrowRight />}`) — the form a
 * server component must use, since a component reference cannot be serialized
 * across that boundary.
 *
 * Elements are wrapped rather than cloned: an element created in a server
 * component carries a client reference as its type, and `cloneElement` on that
 * throws "element type is invalid" during static prerendering. The wrapper
 * sizes the icon through a child selector instead of rewriting its props.
 */
function renderIcon(icon) {
  if (!icon) return null;

  if (React.isValidElement(icon)) {
    return (
      <span
        className="inline-flex shrink-0 [&>svg]:h-4 [&>svg]:w-4"
        aria-hidden="true"
      >
        {icon}
      </span>
    );
  }

  const Icon = icon;
  return <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />;
}

/**
 * Passing `href` renders a Next.js `Link` with button styling. `as` overrides
 * the element for anything else, but only from client components — a component
 * reference cannot cross the server/client boundary as a prop.
 *
 * `loading` overlays the spinner so the button's width never changes.
 */
const Button = React.forwardRef(function Button(
  {
    as,
    href,
    className,
    variant,
    size,
    block,
    loading = false,
    leadingIcon: Leading,
    trailingIcon: Trailing,
    children,
    disabled,
    type,
    ...props
  },
  ref
) {
  const Component = as ?? (href ? NextLink : "button");
  const isNativeButton = Component === "button";

  return (
    <Component
      ref={ref}
      href={href}
      type={isNativeButton ? type || "button" : type}
      disabled={isNativeButton ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      aria-disabled={!isNativeButton && (disabled || loading) ? true : undefined}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    >
      {loading && (
        <Loader2 className="absolute h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      <span
        className={cn(
          "inline-flex items-center gap-2",
          loading && "invisible"
        )}
      >
        {renderIcon(Leading)}
        {children}
        {renderIcon(Trailing)}
      </span>
    </Component>
  );
});

export default Button;
