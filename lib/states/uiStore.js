"use client";

import { create } from "zustand";

/** Transient chrome state: which overlay is currently on screen. */
export const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isFiltersOpen: false,
  isLocationOpen: false,

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setFiltersOpen: (open) => set({ isFiltersOpen: open }),
  setLocationOpen: (open) => set({ isLocationOpen: open }),
  closeAll: () =>
    set({ isMobileMenuOpen: false, isSearchOpen: false, isFiltersOpen: false, isLocationOpen: false }),
}));
