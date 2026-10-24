import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

/** Visible breadcrumb trail plus its BreadcrumbList structured data, from one source. */
export default function Breadcrumbs({ trail, className, tone = "default" }) {
  const muted = tone === "inverse" ? "text-white/70 hover:text-white" : "text-content-muted hover:text-content-strong";
  const current = tone === "inverse" ? "text-white" : "text-content-strong";

  return (
    <>
      <JsonLd data={breadcrumbLd(trail)} />
      <nav aria-label="Breadcrumb" className={cn("text-xs", className)}>
        <ol className="flex flex-wrap items-center gap-1">
          {trail.map((entry, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={entry.path} className="inline-flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className={cn("font-medium", current)}>{entry.name}</span>
                ) : (
                  <>
                    <Link href={entry.path} className={cn("transition-colors", muted)}>{entry.name}</Link>
                    <ChevronRight className={cn("h-3 w-3", tone === "inverse" ? "text-white/50" : "text-content-muted")} aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
