import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NewsState {
  newsData: any[];
  loading: boolean;
  error: string | null;
  setNewsData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNewsStore = create<NewsState>()(
  persist(
    (set) => ({
      newsData: [],
      loading: false,
      error: null,
      setNewsData: (data) => set({ newsData: data }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'news-storage', // localStorage key
      partialize: (state) => ({
        newsData: state.newsData,
        // loading and error are not persisted (transient states)
      }),
    }
  )
);

