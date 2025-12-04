import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { HiArrowLeft, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useWeatherStore } from '../store';
import { useNavigate } from 'react-router-dom';
import WeatherChart from './WeatherChart';
import PrecipitationChart from './PrecipitationChart';
import WindSpeedChart from './WindSpeedChart';
import { useSEO } from '@/utils/hooks';

const WeatherResults = () => {
    const navigate = useNavigate();
    const { currentWeather, currentLocation } = useWeatherStore();

    // Helper to extract city name from timezone (e.g., "Europe/London" -> "London")
    const extractCityFromTimezone = (timezone?: string): string | null => {
        if (!timezone) return null;
        const parts = timezone.split('/');
        return parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : null;
    };

    // Get location name: prefer stored name, then extract from timezone, then show coordinates
    const getLocationName = (): string => {
        if (currentLocation?.name) {
            return currentLocation.name;
        }
        if (currentWeather?.timezone) {
            const cityFromTimezone = extractCityFromTimezone(currentWeather.timezone);
            if (cityFromTimezone) {
                return cityFromTimezone;
            }
        }
        if (currentLocation) {
            return `${currentLocation.latitude.toFixed(2)}, ${currentLocation.longitude.toFixed(2)}`;
        }
        return 'Unknown Location';
    };

    // SEO - Dynamic based on location
    const locationName = getLocationName();
    const temperature = currentWeather?.current_weather.temperature || '';
    const seoDescription = currentWeather
        ? `Weather forecast for ${locationName}. Current temperature: ${temperature}°C. View detailed 7-day forecast with temperature, precipitation, and wind speed charts.`
        : `View detailed weather forecast for ${locationName}.`;

    useSEO(
        {
            title: `Weather - ${locationName}`,
            description: seoDescription,
            keywords: `weather, forecast, ${locationName}, temperature, climate, weather forecast, 7-day forecast`,
            ogTitle: `Weather Forecast for ${locationName} - Dashverse`,
            ogDescription: seoDescription,
            ogType: 'website',
        },
        [locationName, temperature]
    );

    if (!currentWeather) {
        return (
            <section className="p-6">
                <section className="text-center py-12">
                    <p className="text-gray-600 text-lg font-bold dark:text-gray-300 mb-4">No weather data available</p>
                    <button
                        onClick={() => navigate('/weather')}
                        className="px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700  text-white rounded-lg transition-colors"
                    >
                        Go to Weather Home
                    </button>
                </section>
            </section>
        );
    }

    const { current_weather, daily } = currentWeather;

    return (
        <section className="p-6 space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{locationName}</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        {currentWeather.timezone} • {currentWeather.elevation}m elevation
                    </p>
                </div>
                <nav>
                    <button
                        onClick={() => navigate('/weather')}
                        className="px-4 py-2 flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors cursor-pointer"
                        aria-label="Go back to weather home"
                    >
                        <HiArrowLeft className="w-4 h-4" /> Back
                    </button>
                </nav>
            </header>

            {/* Current Weather Card */}
            <article className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-6xl font-bold mb-2">{current_weather.temperature}°C</div>
                        <div className="text-xl mb-4">Current Temperature</div>
                        <div className="space-y-2 text-sm">
                            <div>Wind: {current_weather.windspeed} km/h</div>
                            <div>Direction: {current_weather.winddirection}°</div>
                        </div>
                    </div>
                    <div className="text-8xl" aria-hidden="true">🌤️</div>
                </div>
            </article>

            {/* 7-Day Forecast */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">7-Day Forecast</h2>
                <ForecastSlider daily={daily} />
            </section>

            {/* Weather Charts */}
            {currentWeather && (
                <section className="space-y-6" aria-label="Weather data visualizations">
                    <WeatherChart weather={currentWeather} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PrecipitationChart weather={currentWeather} />
                        <WindSpeedChart weather={currentWeather} />
                    </div>
                </section>
            )}
        </section>
    );
};

interface ForecastSliderProps {
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
    };
}

const ForecastSlider = ({ daily }: ForecastSliderProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 },
            '(min-width: 1024px)': { slidesToScroll: 3 },
        },
    });
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        const updateButtonState = () => {
            setPrevBtnDisabled(!emblaApi.canScrollPrev());
            setNextBtnDisabled(!emblaApi.canScrollNext());
        };

        emblaApi.on('reInit', updateButtonState);
        emblaApi.on('select', updateButtonState);

        // Set initial state after mount
        updateButtonState();

        return () => {
            emblaApi.off('reInit', updateButtonState);
            emblaApi.off('select', updateButtonState);
        };
    }, [emblaApi]);

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <ul className="flex gap-4" role="list">
                    {daily.time.map((date, index) => (
                        <li
                            key={date}
                            className="flex-[0_0_auto] select-none min-w-0 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]"
                        >
                            <article className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow">
                                <time className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block" dateTime={date}>
                                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </time>
                                <div className="text-2xl mb-2" aria-hidden="true">🌤️</div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    {daily.temperature_2m_max[index]}°
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {daily.temperature_2m_min[index]}°
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    {daily.precipitation_sum[index]}mm
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={scrollPrev}
                disabled={prevBtnDisabled}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Previous slide"
            >
                <HiChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300 cursor-pointer disabled:cursor-not-allowed" />
            </button>
            <button
                onClick={scrollNext}
                disabled={nextBtnDisabled}
                className="absolute right-0 top-1/2 -translate-y-1/2    translate-x-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Next slide"
            >
                <HiChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300 cursor-pointer " />
            </button>
        </div>
    );
};

export default WeatherResults;

