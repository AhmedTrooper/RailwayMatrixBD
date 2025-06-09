import {create} from "zustand";

interface ThemeState {
  dark: boolean;
  setDark: (value: boolean) => void;
  toggleDark: () => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  dark: true,
  setDark: (value) => set({ dark: value }),
  toggleDark: () => set((state) => ({ dark: !state.dark })),
}));

export default useThemeStore;
