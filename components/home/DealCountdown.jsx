"use client";

import React, { useEffect, useState } from "react";
import { Flame } from "lucide-react";

/**
 * Milliseconds until this week's deals end: Wednesday 23:59 Lagos time, the
 * same rule the deals page states. The countdown is only allowed to say what
 * the pricing actually does.
 */
function untilDealsEnd(now = Date.now()) {
  const wat = new Date(now + 60 * 60 * 1000); // shift to WAT, read with UTC getters
  const day = wat.getUTCDay(); // 0 Sun … 3 Wed
  const daysToWed = (3 - day + 7) % 7;
  const end = Date.UTC(wat.getUTCFullYear(), wat.getUTCMonth(), wat.getUTCDate() + daysToWed, 23, 59, 59);
  return Math.max(0, end - 60 * 60 * 1000 - now);
}

const pad = (value) => String(value).padStart(2, "0");

/** Renders nothing until mounted so server markup cannot disagree with the client clock. */
export default function DealCountdown() {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    setRemaining(untilDealsEnd());
    const timer = setInterval(() => setRemaining(untilDealsEnd()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (remaining === null) return null;

  const total = Math.floor(remaining / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-danger-soft px-3 py-1.5 text-xs font-medium text-danger">
      <Flame className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      Prices end in
      <span
        className="tabular font-bold"
        aria-label={`${days} days ${hours} hours ${minutes} minutes left`}
      >
        {days > 0 ? `${days}d ` : ""}
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    </span>
  );
}
