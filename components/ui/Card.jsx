import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const cardVariants = cva("rounded-2xl transition-shadow duration-base ease-out-quart", {
  variants: {
    variant: {
      default: "border border-line bg-surface shadow-xs",
      raised: "border border-line bg-surface-raised shadow-md",
      sunken: "bg-surface-sunken",
      ghost: "bg-transparent",
      outline: "border border-line-strong bg-transparent",
    },
    interactive: {
      true: "hover:shadow-lg",
    },
    padded: {
      none: "",
      sm: "p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
    },
  },
  defaultVariants: { variant: "default", padded: "none" },
});

export default function Card({ className, variant, interactive, padded, as: Component = "div", ...props }) {
  return (
    <Component
      className={cn(cardVariants({ variant, interactive, padded }), className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-1 px-5 pt-5 sm:px-6 sm:pt-6", className)} {...props} />;
}

export function CardTitle({ className, as: Component = "h3", ...props }) {
  return <Component className={cn("text-base font-semibold", className)} {...props} />;
}

export function CardBody({ className, ...props }) {
  return <div className={cn("px-5 py-5 sm:px-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center gap-3 border-t border-line px-5 py-4 sm:px-6", className)}
      {...props}
    />
  );
}
