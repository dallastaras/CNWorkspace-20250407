import { create } from 'zustand';

interface StoreState {
  user: any | null;
  darkMode: boolean;
  selectedTimeframe: string;
  customDateRange: { start: Date; end: Date } | null;
  setUser: (user: any | null) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  darkMode: false,
  selectedTimeframe: 'day',
  customDateRange: null,
  setUser: (user) => set({ user }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));