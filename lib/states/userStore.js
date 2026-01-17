import create from "zustand";

export const useUserStore = create((set) => ({
  user: null, // shape: { id, email, firstName, lastName, ... }
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));