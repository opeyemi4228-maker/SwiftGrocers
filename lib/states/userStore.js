"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** Session/profile state. Persisted so a reload does not sign the user out. */
export const useUserStore = create()(
  persist(
    (set) => ({
      user: null, // { id, email, firstName, lastName, avatar }
      deliverTo: null,
      setUser: (user) => set({ user }),
      setDeliverTo: (deliverTo) => set({ deliverTo }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "swift:user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * The session lives in localStorage, so the server and the first client render
 * always see `user: null`. Anything that branches on sign-in state must wait
 * for this before rendering, or the two renders disagree.
 */
export function useUserHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(useUserStore.persist.hasHydrated());
    return useUserStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
