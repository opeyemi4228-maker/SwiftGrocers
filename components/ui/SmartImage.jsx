"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * next/image with a graceful failure state and a fade-in on decode, so a
 * missing or slow asset degrades to a labelled placeholder instead of the
 * browser's broken-image glyph.
 */
export default function SmartImage({
  src,
  alt,
  className,
  wrapperClassName,
  fill = true,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
  priority = false,
  width,
  height,
  ...props
}) {
  const [status, setStatus] = useState("loading");

  if (!src || status === "error") {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-surface-sunken",
          wrapperClassName
        )}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-6 w-6 text-content-muted/60" aria-hidden="true" />
      </div>
    );
  }

  return (
    <>
      {status === "loading" ? (
        <div className={cn("absolute inset-0 skeleton rounded-none", wrapperClassName)} />
      ) : null}
      <Image
        src={src}
        alt={alt}
        fill={fill || undefined}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={fill ? sizes : undefined}
        priority={priority}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={cn(
          "transition-opacity duration-slow ease-out-quart",
          status === "loaded" ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </>
  );
}
