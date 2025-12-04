import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeatherStore } from '../store';
import {
    searchCity,
    getWeatherForecast,
    getWeatherForCurrentLocation,
} from '@/features/weather/api';
import type { GeocodeResult } from '../types';
import WeatherChart from './WeatherChart';
import PrecipitationChart from './PrecipitationChart';
import WindSpeedChart from './WindSpeedChart';
import { HiArrowRight } from 'react-icons/hi';
import { useSEO } from '@/utils/hooks';

const WeatherHome = () => {
  // SEO
  useSEO({
    title: 'Weather Forecast',
    description: 'Get real-time weather forecasts for any city worldwide. Search for cities, view current location weather, and explore 7-day forecasts with interactive charts.',
    keywords: 'weather, forecast, temperature, climate, weather app, city weather, current location weather, 7-day forecast',
    ogTitle: 'Weather Forecast - Dashverse',
    ogDescription: 'Get real-time weather forecasts for any city worldwide. Search for cities, view current location weather, and explore 7-day forecasts with interactive charts.',
    ogType: 'website',
  });
    const navigate = useNavigate();
    const {
        currentWeather,
        currentLocation,
        searchHistory,
        loading,
        error,
        setCurrentWeather,
        setCurrentLocation,
        addToSearchHistory,
        setLoading,
        setError,
    } = useWeatherStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    // Load current location weather on mount
    useEffect(() => {
        const loadCurrentLocationWeather = async () => {
            try {
                setLoading(true);
                setError(null);
                const { weather, location } = await getWeatherForCurrentLocation();
                setCurrentWeather(weather);
                setCurrentLocation(location);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to get current location weather');
                console.error('Error loading current location weather:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCurrentLocationWeather();
    }, [setCurrentWeather, setCurrentLocation, setLoading, setError]);

    // Search cities
    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        try {
            setLoading(true);
            const results = await searchCity(query);
            setSearchResults(results);
            setShowSearchResults(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to search cities');
            console.error('Error searching cities:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle city selection
    const handleCitySelect = async (city: GeocodeResult) => {
        try {
            setLoading(true);
            setError(null);
            setSearchQuery('');
            setShowSearchResults(false);

            // Get weather for selected city
            const weather = await getWeatherForecast(city.latitude, city.longitude);
            setCurrentWeather(weather);
            setCurrentLocation({
                latitude: city.latitude,
                longitude: city.longitude,
                name: city.name,
            });

            // Add to search history
            addToSearchHistory(city);

            // Navigate to results page
            navigate(`/weather/results`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load weather');
            console.error('Error loading weather:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle search history click
    const handleHistoryClick = async (item: typeof searchHistory[0]) => {
        try {
            setLoading(true);
            setError(null);
            const weather = await getWeatherForecast(item.latitude, item.longitude);
            setCurrentWeather(weather);
            setCurrentLocation({
                latitude: item.latitude,
                longitude: item.longitude,
                name: item.name,
            });
            navigate(`/weather/results`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load weather');
            console.error('Error loading weather:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="p-6 space-y-6">
            {/* Header with Search */}
            <header className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Weather</h1>
                    <p className="text-gray-600 dark:text-gray-300">Search for a city or view your current location weather</p>
                </div>

                {/* Compact Search Bar */}
                <nav className="relative shrink-0" aria-label="City search">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            placeholder="Search city..."
                            className="w-64 px-3 py-2 text-sm border cursor-pointer outline-0 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button
                            onClick={() => handleSearch(searchQuery)}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Search
                        </button>
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                        <ul className="absolute z-10 w-64 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto" role="listbox">
                            {searchResults.map((city) => (
                                <li key={city.id}>
                                    <button
                                        onClick={() => handleCitySelect(city)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                                        role="option"
                                    >
                                        <div className="font-medium text-gray-900 dark:text-white">{city.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {city.admin1 && `${city.admin1}, `}
                                            {city.country}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </nav>
            </header>

            {/* Error Message */}
            {error && (
                <aside className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400" role="alert">
                    {error}
                </aside>
            )}

            {/* Current Location Weather Preview */}
            {currentWeather && currentLocation && (
                <>
                    <article className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {(() => {
                                        // Helper to extract city name from timezone
                                        const extractCityFromTimezone = (timezone?: string): string | null => {
                                            if (!timezone) return null;
                                            const parts = timezone.split('/');
                                            return parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : null;
                                        };

                                        // Prefer stored name, then extract from timezone, then show coordinates
                                        if (currentLocation.name) {
                                            return currentLocation.name;
                                        }
                                        if (currentWeather?.timezone) {
                                            const cityFromTimezone = extractCityFromTimezone(currentWeather.timezone);
                                            if (cityFromTimezone) {
                                                return cityFromTimezone;
                                            }
                                        }
                                        return `${currentLocation.latitude.toFixed(2)}, ${currentLocation.longitude.toFixed(2)}`;
                                    })()}
                                </h2>
                                <p className="text-blue-100 text-lg font-bold">
                                    {currentWeather.current_weather.temperature}°C
                                </p>
                                <p className="text-blue-200 text-sm mt-1 font-bold">
                                    Wind: {currentWeather.current_weather.windspeed} km/h
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/weather/results')}
                                className="px-4 py-2 flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors cursor-pointer"
                            >
                                View Details <HiArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </article>

                    {/* Weather Charts */}
                    <section className="space-y-6" aria-label="Weather charts">
                        <WeatherChart weather={currentWeather} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PrecipitationChart weather={currentWeather} />
                            <WindSpeedChart weather={currentWeather} />
                        </div>
                    </section>
                </>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && (
                <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Searches</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
                        {searchHistory.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleHistoryClick(item)}
                                    className="p-4 border cursor-pointer border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left w-full"
                                >
                                    <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.country}</div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center p-8" role="status" aria-label="Loading weather data">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
                </div>
            )}
        </section>
    );
};

export default WeatherHome;

