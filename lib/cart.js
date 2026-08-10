"use client";

/**
 * Compatibility shim. The cart now lives in `lib/states/cartStore`; this module
 * keeps the older imperative API working for screens that have not moved to the
 * hook yet. New code should use `useCartStore` directly.
 */

import { useCartStore, selectCount, selectSubtotal } from "@/lib/states/cartStore";

export const CART_KEY = "swift:cart";

export function getCart() {
  return useCartStore.getState().items;
}

export function addItem(product, quantity = 1) {
  useCartStore.getState().addItem(product, quantity);
  return getCart();
}

export function updateQuantity(productId, quantity) {
  useCartStore.getState().setQuantity(productId, quantity);
  return getCart();
}

export function removeItem(productId) {
  useCartStore.getState().removeItem(productId);
  return getCart();
}

export function clearCart() {
  useCartStore.getState().clearCart();
  return getCart();
}

export function getItemCount() {
  return selectCount(useCartStore.getState());
}

export function getTotal() {
  return selectSubtotal(useCartStore.getState());
}

/**
 * Legacy screens listen for a `cartUpdated` window event. Bridge store changes
 * to that event so they keep refreshing until they are migrated.
 */
if (typeof window !== "undefined" && !window.__swiftCartBridge) {
  window.__swiftCartBridge = useCartStore.subscribe((state, previous) => {
    if (state.items !== previous.items) {
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { count: selectCount(state) } }));
    }
  });
}
