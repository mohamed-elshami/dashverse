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

const WeatherHome = () => {
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
        <div className="p-6 space-y-6">
            {/* Header with Search */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Weather</h1>
                    <p className="text-gray-600 dark:text-gray-300">Search for a city or view your current location weather</p>
                </div>

                {/* Compact Search Bar */}
                <div className="relative shrink-0">
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
                        <div className="absolute z-10 w-64 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {searchResults.map((city) => (
                                <button
                                    key={city.id}
                                    onClick={() => handleCitySelect(city)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                                >
                                    <div className="font-medium text-gray-900 dark:text-white">{city.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {city.admin1 && `${city.admin1}, `}
                                        {city.country}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Current Location Weather Preview */}
            {currentWeather && currentLocation && (
                <>
                    <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {currentLocation.name || `${currentLocation.latitude.toFixed(2)}, ${currentLocation.longitude.toFixed(2)}`}
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
                    </div>

                    {/* Weather Charts */}
                    <div className="space-y-6">
                        <WeatherChart weather={currentWeather} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PrecipitationChart weather={currentWeather} />
                            <WindSpeedChart weather={currentWeather} />
                        </div>
                    </div>
                </>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Searches</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchHistory.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleHistoryClick(item)}
                                className="p-4 border cursor-pointer border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                                <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.country}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}
        </div>
    );
};

export default WeatherHome;

