"use client";

import React from "react";
import { cn } from "@/lib/utils";

const fieldBase = [
  "w-full bg-surface text-content-strong placeholder:text-content-muted",
  "border border-line-strong rounded-xl",
  "transition-[border-color,box-shadow] duration-fast ease-out-quart",
  "hover:border-neutral-400",
  "focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15",
  "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-70",
];

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-3.5 text-sm",
  lg: "h-12 px-4 text-base",
};

export const Input = React.forwardRef(function Input(
  { className, size = "md", invalid, leadingIcon: Leading, trailingSlot, ...props },
  ref
) {
  const input = (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        fieldBase,
        sizes[size],
        Leading && "pl-10",
        trailingSlot && "pr-11",
        invalid && "border-danger focus:border-danger focus:ring-danger/15",
        className
      )}
      {...props}
    />
  );

  if (!Leading && !trailingSlot) return input;

  return (
    <div className="relative">
      {Leading ? (
        <Leading
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted"
          aria-hidden="true"
        />
      ) : null}
      {input}
      {trailingSlot ? (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailingSlot}</div>
      ) : null}
    </div>
  );
});

export const Textarea = React.forwardRef(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        fieldBase,
        "min-h-28 resize-y px-3.5 py-3 text-sm",
        invalid && "border-danger focus:border-danger focus:ring-danger/15",
        className
      )}
      {...props}
    />
  );
});

export const Select = React.forwardRef(function Select(
  { className, size = "md", children, ...props },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          fieldBase,
          sizes[size],
          "cursor-pointer appearance-none pr-9",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 8l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

/** Label + help/error text wrapper. Wires `id`, `aria-describedby` for you. */
export function Field({ label, hint, error, required, htmlFor, className, children }) {
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-content-strong">
          {label}
          {required ? (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {React.isValidElement(children)
        ? React.cloneElement(children, {
            id: htmlFor,
            "aria-describedby": describedBy,
            invalid: Boolean(error) || children.props.invalid,
            required,
          })
        : children}

      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-content-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default Input;
