"use client";

import { useEffect } from "react";
import { useHistoryStore } from "@/lib/states/historyStore";

/** Records the product in recently-viewed. Renders nothing. */
export default function TrackView({ id }) {
  const track = useHistoryStore((state) => state.track);
  useEffect(() => track(id), [id, track]);
  return null;
}
