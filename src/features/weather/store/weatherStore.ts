import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WeatherForecastResponse,
  GeocodeResult,
  LocationCoordinates,
  SearchHistoryItem,
} from '@/features/weather/types';

interface WeatherState {
  // Current weather data
  currentWeather: WeatherForecastResponse | null;
  currentLocation: LocationCoordinates | null;

  // Search history (last 10)
  searchHistory: SearchHistoryItem[];

  // UI state
  loading: boolean;
  error: string | null;

  // Actions
  setCurrentWeather: (weather: WeatherForecastResponse) => void;
  setCurrentLocation: (location: LocationCoordinates) => void;
  addToSearchHistory: (location: GeocodeResult) => void;
  removeFromSearchHistory: (id: string) => void;
  clearSearchHistory: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentWeather: null,
      currentLocation: null,
      searchHistory: [],
      loading: false,
      error: null,

      // Set current weather
      setCurrentWeather: (weather) => set({ currentWeather: weather }),

      // Set current location
      setCurrentLocation: (location) => set({ currentLocation: location }),

      // Add to search history (keep last 10)
      addToSearchHistory: (location) => {
        const { searchHistory } = get();
        const newItem: SearchHistoryItem = {
          id: `${location.latitude}-${location.longitude}`,
          name: location.name,
          latitude: location.latitude,
          longitude: location.longitude,
          country: location.country,
          searchedAt: new Date().toISOString(),
        };

        // Remove if already exists (to move to top)
        const filtered = searchHistory.filter((item) => item.id !== newItem.id);

        // Add to beginning and keep only last 10
        const updated = [newItem, ...filtered].slice(0, 10);

        set({ searchHistory: updated });
      },

      // Remove from search history
      removeFromSearchHistory: (id) => {
        set((state) => ({
          searchHistory: state.searchHistory.filter((item) => item.id !== id),
        }));
      },

      // Clear search history
      clearSearchHistory: () => set({ searchHistory: [] }),

      // Set loading state
      setLoading: (loading) => set({ loading }),

      // Set error state
      setError: (error) => set({ error }),
    }),
    {
      name: 'weather-storage',
      partialize: (state) => ({
        currentWeather: state.currentWeather,
        currentLocation: state.currentLocation,
        searchHistory: state.searchHistory,
        // loading and error are not persisted (transient states)
      }),
    }
  )
);

