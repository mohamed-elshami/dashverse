import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { HiArrowLeft, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useWeatherStore } from '../store';
import { useNavigate } from 'react-router-dom';
import WeatherChart from './WeatherChart';
import PrecipitationChart from './PrecipitationChart';
import WindSpeedChart from './WindSpeedChart';

const WeatherResults = () => {
    const navigate = useNavigate();
    const { currentWeather, currentLocation } = useWeatherStore();

    if (!currentWeather) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg font-bold dark:text-gray-300 mb-4">No weather data available</p>
                    <button
                        onClick={() => navigate('/weather')}
                        className="px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700  text-white rounded-lg transition-colors"
                    >
                        Go to Weather Home
                    </button>
                </div>
            </div>
        );
    }

    const { current_weather, daily } = currentWeather;
    const locationName = currentLocation?.name || 'Current Location';

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{locationName}</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        {currentWeather.timezone} • {currentWeather.elevation}m elevation
                    </p>
                </div>
                <button
                    onClick={() => navigate('/weather')}
                    className="px-4 py-2 flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors cursor-pointer"
                >
                    <HiArrowLeft className="w-4 h-4" /> Back
                </button>
            </div>

            {/* Current Weather Card */}
            <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-6xl font-bold mb-2">{current_weather.temperature}°C</div>
                        <div className="text-xl mb-4">Current Temperature</div>
                        <div className="space-y-2 text-sm">
                            <div>Wind: {current_weather.windspeed} km/h</div>
                            <div>Direction: {current_weather.winddirection}°</div>
                        </div>
                    </div>
                    <div className="text-8xl">🌤️</div>
                </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">7-Day Forecast</h2>
                <ForecastSlider daily={daily} />
            </div>

            {/* Weather Charts */}
            {currentWeather && (
                <div className="space-y-6">
                    <WeatherChart weather={currentWeather} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PrecipitationChart weather={currentWeather} />
                        <WindSpeedChart weather={currentWeather} />
                    </div>
                </div>
            )}
        </div>
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
                <div className="flex gap-4">
                    {daily.time.map((date, index) => (
                        <div
                            key={date}
                            className="flex-[0_0_auto] select-none min-w-0 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]"
                        >
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow">
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-2xl mb-2">🌤️</div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    {daily.temperature_2m_max[index]}°
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {daily.temperature_2m_min[index]}°
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    {daily.precipitation_sum[index]}mm
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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

