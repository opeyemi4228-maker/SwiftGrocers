import React from "react";
import { cn } from "@/lib/utils";

/**
 * A geometric motif after adire eleko, the Yoruba resist-dyed indigo cloth.
 * Concentric circles, a stitched cross and dotted borders, tiled. It inherits
 * `currentColor`, so the surface it sits on decides the ink, and it is always
 * decorative.
 */
export default function AdirePattern({ className, size = 56, opacity = 0.18, id = "adire" }) {
  const s = size;
  const h = s / 2;

  return (
    <svg className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden="true">
      <defs>
        <pattern id={`adire-${id}`} width={s} height={s} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.25" opacity={opacity}>
            <circle cx={h} cy={h} r={s * 0.32} />
            <circle cx={h} cy={h} r={s * 0.2} strokeDasharray="2 3" />
            <circle cx={h} cy={h} r={s * 0.07} fill="currentColor" />
            <path d={`M0 0 L${s * 0.14} ${s * 0.14} M${s} 0 L${s * 0.86} ${s * 0.14} M0 ${s} L${s * 0.14} ${s * 0.86} M${s} ${s} L${s * 0.86} ${s * 0.86}`} />
            <path d={`M${h} 0 V${s * 0.1} M${h} ${s} V${s * 0.9} M0 ${h} H${s * 0.1} M${s} ${h} H${s * 0.9}`} strokeDasharray="1.5 2.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#adire-${id})`} />
    </svg>
  );
}
