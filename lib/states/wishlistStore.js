"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** Saved products, by id. Persisted so the heart survives a reload. */
export const useWishlistStore = create()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set({ ids: get().ids.includes(id) ? get().ids.filter((entry) => entry !== id) : [id, ...get().ids] }),
      remove: (id) => set({ ids: get().ids.filter((entry) => entry !== id) }),
      clear: () => set({ ids: [] }),
    }),
    { name: "swift:wishlist", storage: createJSONStorage(() => localStorage) }
  )
);

export function useWishlistHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(useWishlistStore.persist.hasHydrated());
    return useWishlistStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  return hydrated;
}

/** True when `id` is saved, false until storage has been read, to match SSR. */
export function useIsSaved(id) {
  const saved = useWishlistStore((state) => state.ids.includes(id));
  const hydrated = useWishlistHydrated();
  return hydrated && saved;
}
