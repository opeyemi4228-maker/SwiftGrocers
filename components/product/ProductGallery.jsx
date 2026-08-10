"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import SmartImage from "@/components/ui/SmartImage";
import Badge from "@/components/ui/Badge";

/** Product imagery with thumbnail selection. Arrow keys move between shots. */
export default function ProductGallery({ images = [], alt, discountPercent = 0 }) {
  const [active, setActive] = useState(0);
  const shots = images.length > 0 ? images : [null];

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") setActive((i) => (i + 1) % shots.length);
    if (event.key === "ArrowLeft") setActive((i) => (i - 1 + shots.length) % shots.length);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-square overflow-hidden rounded-3xl bg-surface-sunken"
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="group"
        aria-label={`${alt} — image ${active + 1} of ${shots.length}`}
      >
        <SmartImage
          src={shots[active]}
          alt={alt}
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover"
        />

        {discountPercent > 0 ? (
          <Badge tone="solid-danger" className="absolute left-4 top-4 rounded-full font-bold">
            −{discountPercent}% today
          </Badge>
        ) : null}
      </div>

      {shots.length > 1 ? (
        <div className="flex gap-3" role="tablist" aria-label="Product images">
          {shots.map((shot, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show image ${index + 1}`}
              onClick={() => setActive(index)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-sunken transition-all duration-fast",
                index === active
                  ? "ring-2 ring-brand-600 ring-offset-2 ring-offset-canvas"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <SmartImage src={shot} alt="" sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
