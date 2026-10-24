"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const LIMIT = 12;

/**
 * Recently viewed product ids, newest first. Powers "Continue where you left
 * off", the cheapest personalisation there is, and it needs no account.
 */
export const useHistoryStore = create()(
  persist(
    (set, get) => ({
      viewed: [],
      track: (id) => set({ viewed: [id, ...get().viewed.filter((entry) => entry !== id)].slice(0, LIMIT) }),
      clear: () => set({ viewed: [] }),
    }),
    { name: "swift:history", storage: createJSONStorage(() => localStorage) }
  )
);

export function useHistoryHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(useHistoryStore.persist.hasHydrated());
    return useHistoryStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  return hydrated;
}
