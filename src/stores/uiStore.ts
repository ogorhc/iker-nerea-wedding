import { create } from 'zustand';

interface UIState {
  isNavigationOpen: boolean;
  toggleNavigation: () => void;
  closeNavigation: () => void;
  openNavigation: () => void;
  // Loader: esperar fuentes + capas del parallax antes de mostrar contenido
  fontsLoaded: boolean;
  parallaxLoaded: boolean;
  setFontsLoaded: (value: boolean) => void;
  setParallaxLoaded: (value: boolean) => void;
  resetLoadingState: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isNavigationOpen: false,
  toggleNavigation: () => set((state) => ({ isNavigationOpen: !state.isNavigationOpen })),
  closeNavigation: () => set({ isNavigationOpen: false }),
  openNavigation: () => set({ isNavigationOpen: true }),
  fontsLoaded: false,
  parallaxLoaded: false,
  setFontsLoaded: (value) => set({ fontsLoaded: value }),
  setParallaxLoaded: (value) => set({ parallaxLoaded: value }),
  resetLoadingState: () => set({ fontsLoaded: false, parallaxLoaded: false }),
}));
