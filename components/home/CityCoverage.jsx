import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CITIES, COMING_SOON } from "@/lib/locations";
import SmartImage from "@/components/ui/SmartImage";

/** City tiles double as crawlable links to each city's landing page. */
export default function CityCoverage() {
  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CITIES.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/delivery/${city.slug}`}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl p-5 sm:aspect-[3/4]"
            >
              <SmartImage src={city.image} alt="" sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition-transform duration-slow ease-out-quart group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent" aria-hidden="true" />
              <div className="relative">
                <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-accent-300">{city.state}</p>
                <h3 className="mt-1 flex items-center justify-between text-2xl font-bold text-white">
                  Grocery delivery in {city.name}
                  <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </h3>
                <p className="mt-2 line-clamp-2 text-xs text-white/75">
                  {city.zones.slice(0, 5).map((zone) => zone.name).join(" · ")} and more
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-center text-sm text-content-muted">
        Coming soon to {COMING_SOON.join(", ")}.
      </p>
    </>
  );
}
