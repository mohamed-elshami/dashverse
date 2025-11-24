import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FoodState {
  foodData: any[];
  favorites: any[];
  loading: boolean;
  error: string | null;
  setFoodData: (data: any[]) => void;
  addToFavorites: (item: any) => void;
  removeFromFavorites: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set) => ({
      foodData: [],
      favorites: [],
      loading: false,
      error: null,
      setFoodData: (data) => set({ foodData: data }),
      addToFavorites: (item) =>
        set((state) => ({
          favorites: [...state.favorites, item],
        })),
      removeFromFavorites: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== id),
        })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'food-storage', // localStorage key
      partialize: (state) => ({
        foodData: state.foodData,
        favorites: state.favorites,
        // loading and error are not persisted (transient states)
      }),
    }
  )
);

