import { create } from "zustand";

const useThemeState = create((set) => ({
  theme: "dark",
  setThemeDark: () => set({ theme: "dark" }),
  setThemeLight: () => set({ theme: "light" }),
}));
export default useThemeState;
