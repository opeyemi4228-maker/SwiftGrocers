import create from "zustand";

export const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ isMobileMenuOpen: v }),
  isDeptOpen: false,
  setDeptOpen: (v) => set({ isDeptOpen: v }),
  isLangOpen: false,
  setLangOpen: (v) => set({ isLangOpen: v }),
}));
