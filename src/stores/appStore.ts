import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          // Apply theme class immediately
          if (typeof window !== 'undefined') {
            const html = document.documentElement;
            if (newTheme === 'dark') {
              html.classList.add('dark');
            } else {
              html.classList.remove('dark');
            }
          }
          return { theme: newTheme };
        });
      },
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'app-storage', // localStorage key
      partialize: (state) => ({
        theme: state.theme,
        // sidebarOpen is not persisted as it should reset based on screen size
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme when store rehydrates from localStorage
        if (state && typeof window !== 'undefined') {
          const html = document.documentElement;
          if (state.theme === 'dark') {
            html.classList.add('dark');
          } else {
            html.classList.remove('dark');
          }
        }
      },
    }
  )
);

