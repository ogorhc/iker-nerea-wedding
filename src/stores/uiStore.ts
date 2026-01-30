import { create } from 'zustand';

interface UIState {
  isNavigationOpen: boolean;
  toggleNavigation: () => void;
  closeNavigation: () => void;
  openNavigation: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isNavigationOpen: false,
  toggleNavigation: () => set((state) => ({ isNavigationOpen: !state.isNavigationOpen })),
  closeNavigation: () => set({ isNavigationOpen: false }),
  openNavigation: () => set({ isNavigationOpen: true }),
}));
