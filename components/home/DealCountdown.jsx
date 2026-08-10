"use client";

import React, { useEffect, useState } from "react";
import { Flame } from "lucide-react";

/** Milliseconds until midnight tonight. */
function untilEndOfDay() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return Math.max(0, end.getTime() - Date.now());
}

const pad = (value) => String(value).padStart(2, "0");

/**
 * Live countdown for the daily deals row. Renders nothing until mounted so the
 * server-rendered markup cannot disagree with the client clock.
 */
export default function DealCountdown() {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    setRemaining(untilEndOfDay());
    const timer = setInterval(() => setRemaining(untilEndOfDay()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (remaining === null) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  const parts = [
    Math.floor(totalSeconds / 3600),
    Math.floor((totalSeconds % 3600) / 60),
    totalSeconds % 60,
  ];

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-danger-soft px-3 py-1.5 text-xs font-medium text-danger">
      <Flame className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      Ends in
      <span className="tabular font-bold" aria-label={`${parts[0]} hours ${parts[1]} minutes left`}>
        {parts.map(pad).join(":")}
      </span>
    </span>
  );
}
