import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NewsCategory, NewsItem } from '../types';

interface NewsState {
  newsData: NewsItem[];
  selectedCategory: NewsCategory;
  searchQuery: string;
  location: string;
  loading: boolean;
  error: string | null;
  setNewsData: (data: NewsItem[]) => void;
  setSelectedCategory: (category: NewsCategory) => void;
  setSearchQuery: (query: string) => void;
  setLocation: (location: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearNews: () => void;
}

export const useNewsStore = create<NewsState>()(
  persist(
    (set) => ({
      newsData: [],
      selectedCategory: 'Top Stories',
      searchQuery: '',
      location: 'US',
      loading: false,
      error: null,
      setNewsData: (data) => set({ newsData: data }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setLocation: (location) => set({ location }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearNews: () => set({ newsData: [] }),
    }),
    {
      name: 'news-storage',
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
        searchQuery: state.searchQuery,
        location: state.location,
        // newsData, loading, and error are not persisted (transient states)
      }),
    }
  )
);

