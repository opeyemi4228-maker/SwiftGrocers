import React from "react";
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import SmartImage from "@/components/ui/SmartImage";
import AddPackButton from "./AddPackButton";

/** Editorial pack tile: the finished dish sells the ingredients. */
export default function PackCard({ pack, priority = false }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-[box-shadow,transform] duration-base ease-out-quart hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-sunken">
        <SmartImage
          src={pack.image}
          alt={`${pack.name}, cooked and served`}
          priority={priority}
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 24vw"
          className="object-cover transition-transform duration-slow ease-out-quart group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-950/60 to-transparent" aria-hidden="true" />
        <span className="absolute left-3 top-3 rounded-full bg-accent-400 px-2.5 py-1 text-2xs font-bold text-neutral-950">
          Save {formatPrice(pack.saving)}
        </span>
        {pack.bestseller ? (
          <span className="absolute right-3 top-3 rounded-full bg-surface/95 px-2.5 py-1 text-2xs font-bold text-content-strong backdrop-blur">
            Most ordered
          </span>
        ) : pack.isNew ? (
          <span className="absolute right-3 top-3 rounded-full bg-surface/95 px-2.5 py-1 text-2xs font-bold text-content-strong backdrop-blur">
            New
          </span>
        ) : null}
        <div className="absolute bottom-3 left-3 flex gap-1.5 text-2xs font-semibold text-white">
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-950/50 px-2 py-1 backdrop-blur">
            <Users className="h-3 w-3" aria-hidden="true" /> Serves {pack.serves}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-950/50 px-2 py-1 backdrop-blur">
            <Clock className="h-3 w-3" aria-hidden="true" /> {pack.cookTime}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-lg font-bold leading-tight text-content-strong">
          <Link href={pack.href} className="after:absolute after:inset-0 after:content-['']">
            {pack.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-content-muted">{pack.tagline}</p>

        <div className="mt-auto pt-5">
          <div className="flex items-baseline gap-2">
            <p className="tabular text-xl font-bold text-content-strong">{formatPrice(pack.price)}</p>
            <p className="tabular text-xs text-content-muted line-through">{formatPrice(pack.value)}</p>
          </div>
          <AddPackButton pack={pack} className="mt-3 w-full" />
        </div>
      </div>
    </article>
  );
}
