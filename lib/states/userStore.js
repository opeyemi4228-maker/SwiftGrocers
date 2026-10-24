"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

/** Where to send a signed-out visitor so they come back to `next` afterwards. */
export function signInHref(next) {
  return `/auth?next=${encodeURIComponent(next)}`;
}

/**
 * The `next` a sign-in may return to. Only same-site paths: `//evil.com` and
 * `/\evil.com` are protocol-relative to a browser, so they are refused.
 */
export function safeNext(value, fallback = "/shop") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}

/**
 * Sends a signed-out visitor to sign in and back to `next` afterwards.
 * `ready` is false until storage has loaded and a user is present, so callers
 * render a placeholder rather than flash the protected page.
 */
export function useRequireUser(next) {
  const user = useUserStore((state) => state.user);
  const hydrated = useUserHydrated();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.replace(signInHref(next));
  }, [hydrated, user, router, next]);

  return { user, ready: hydrated && Boolean(user) };
}
