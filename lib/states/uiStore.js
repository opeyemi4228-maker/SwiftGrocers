"use client";

import { create } from "zustand";

/** Transient chrome state: which overlay is currently on screen. */
export const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isFiltersOpen: false,

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setFiltersOpen: (open) => set({ isFiltersOpen: open }),
  closeAll: () => set({ isMobileMenuOpen: false, isSearchOpen: false, isFiltersOpen: false }),
}));
