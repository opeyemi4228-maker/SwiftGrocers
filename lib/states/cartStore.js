"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "swift:cart";
const LEGACY_KEY = "swift_grocers_cart";

/** Normalises anything product-shaped into the minimal line item we persist. */
function toLineItem(product, quantity) {
  return {
    id: product.id ?? product._id ?? product.slug,
    slug: product.slug ?? product.id,
    name: product.name,
    price: product.price ?? product.offerPrice ?? 0,
    originalPrice: product.originalPrice ?? null,
    image: product.image ?? product.images?.[0] ?? null,
    unit: product.weight ?? product.unit ?? null,
    category: product.category ?? null,
    maxStock: typeof product.stock === "number" ? product.stock : 99,
    quantity,
    addedAt: new Date().toISOString(),
  };
}

/**
 * The cart is the only state shared by nearly every screen, so it lives in one
 * persisted store. Components read derived totals from the selectors below
 * rather than recomputing them.
 */
export const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      saved: [],
      promo: null,
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const id = product.id ?? product._id ?? product.slug;
        const existing = items.find((item) => item.id === id);

        if (existing) {
          set({
            items: items.map((item) =>
              item.id === id
                ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxStock ?? 99) }
                : item
            ),
          });
        } else {
          set({ items: [...items, toLineItem(product, quantity)] });
        }
      },

      setQuantity: (id, quantity) => {
        if (quantity < 1) return get().removeItem(id);
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(quantity, item.maxStock ?? 99) } : item
          ),
        });
      },

      removeItem: (id) => set({ items: get().items.filter((item) => item.id !== id) }),

      clearCart: () => set({ items: [], promo: null }),

      saveForLater: (id) => {
        const item = get().items.find((entry) => entry.id === id);
        if (!item) return;
        set({
          items: get().items.filter((entry) => entry.id !== id),
          saved: [...get().saved.filter((entry) => entry.id !== id), item],
        });
      },

      moveToCart: (id) => {
        const item = get().saved.find((entry) => entry.id === id);
        if (!item) return;
        set({ saved: get().saved.filter((entry) => entry.id !== id) });
        get().addItem(item, item.quantity ?? 1);
      },

      removeSaved: (id) => set({ saved: get().saved.filter((entry) => entry.id !== id) }),

      applyPromo: (promo) => set({ promo }),
      clearPromo: () => set({ promo: null }),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // `isOpen` is transient UI state and must not survive a reload.
      partialize: ({ items, saved, promo }) => ({ items, saved, promo }),
      onRehydrateStorage: () => (state) => {
        if (!state || typeof window === "undefined") return;
        // One-time import of the pre-store localStorage array.
        try {
          const legacy = window.localStorage.getItem(LEGACY_KEY);
          if (!legacy) return;
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length && state.items.length === 0) {
            state.items = parsed.map((item) => toLineItem(item, item.quantity ?? 1));
          }
          window.localStorage.removeItem(LEGACY_KEY);
        } catch {
          /* corrupt legacy payload — safe to ignore */
        }
      },
    }
  )
);

/* --- Derived selectors -------------------------------------------------- */

export const selectCount = (state) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectSubtotal = (state) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const selectQuantityOf = (id) => (state) =>
  state.items.find((item) => item.id === id)?.quantity ?? 0;

/**
 * Persisted state is unavailable during SSR and the first client render.
 * Gate anything that would otherwise mismatch (badges, totals) on this.
 */
export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(useCartStore.persist.hasHydrated());
    return useCartStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
