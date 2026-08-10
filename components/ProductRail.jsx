"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

/**
 * Horizontally scrolling product row.
 *
 * Scrolling is native (so touch, trackpad and keyboard all behave normally);
 * the arrow buttons page by one viewport width and hide themselves at each end
 * rather than sitting there disabled.
 */
export default function ProductRail({ products = [], className, itemClassName }) {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setEdges({
      start: scrollLeft < 8,
      end: scrollLeft + clientWidth >= scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure, products.length]);

  const page = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div ref={trackRef} className="rail -mx-4 px-4 sm:mx-0 sm:px-0">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={cn("w-[10.5rem] shrink-0 sm:w-[13.5rem]", itemClassName)}
          >
            <ProductCard product={product} priority={index < 3} />
          </div>
        ))}
      </div>

      {!edges.start ? (
        <button
          type="button"
          onClick={() => page(-1)}
          aria-label="Scroll left"
          className="absolute -left-4 top-[38%] hidden h-10 w-10 place-items-center rounded-full border border-line bg-surface shadow-lg transition-colors hover:bg-surface-sunken lg:grid"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}

      {!edges.end ? (
        <button
          type="button"
          onClick={() => page(1)}
          aria-label="Scroll right"
          className="absolute -right-4 top-[38%] hidden h-10 w-10 place-items-center rounded-full border border-line bg-surface shadow-lg transition-colors hover:bg-surface-sunken lg:grid"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
