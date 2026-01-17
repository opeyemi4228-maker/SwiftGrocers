import create from "zustand";

export const useCartStore = create((set, get) => ({
  items: [], // { id, productId, name, price, qty, image }
  addItem: (item) => {
    const items = get().items;
    const exists = items.find((i) => i.productId === item.productId);
    if (exists) {
      set({
        items: items.map((i) =>
          i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i
        ),
      });
    } else {
      set({ items: [...items, item] });
    }
  },
  updateQty: (productId, qty) =>
    set({
      items: get().items.map((i) =>
        i.productId === productId ? { ...i, qty } : i
      ),
    }),
  removeItem: (productId) =>
    set({ items: get().items.filter((i) => i.productId !== productId) }),
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((s, i) => s + i.qty, 0),
  subtotal: () => get().items.reduce((s, i) => s + i.qty * i.price, 0),
}));
