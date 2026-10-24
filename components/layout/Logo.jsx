import React from "react";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { cn } from "@/lib/utils";

/** Height classes per size. Width follows the artwork's 155×80 ratio. */
const HEIGHTS = {
  sm: "h-9",
  md: "h-11 lg:h-12",
  lg: "h-12 lg:h-16",
};

/** Brand lockup, rendered from the source artwork at its native aspect ratio. */
export default function Logo({ className, href = "/", size = "lg", label = "SwiftGrocers home" }) {
  const mark = (
    <Image
      src={assets.logo}
      alt="SwiftGrocers"
      width={155}
      height={80}
      priority
      sizes="155px"
      className={cn("w-auto object-contain", HEIGHTS[size] ?? HEIGHTS.lg)}
    />
  );

  if (!href) {
    return <span className={cn("inline-flex items-center", className)}>{mark}</span>;
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn("inline-flex items-center rounded-lg transition-opacity hover:opacity-90", className)}
    >
      {mark}
    </Link>
  );
}
