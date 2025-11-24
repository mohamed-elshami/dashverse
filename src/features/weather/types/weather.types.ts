// Geocoding Types
export interface GeocodeResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string; // State/Province
    country_code: string;
}

export interface GeocodeResponse {
    results: GeocodeResult[];
    generationtime_ms: number;
}

// Weather Types
export interface CurrentWeather {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
}

export interface DailyForecast {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
}

export interface WeatherForecastResponse {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_weather: CurrentWeather;
    daily: DailyForecast;
}

// Location Types
export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    name?: string;
}

// Store Types
export interface SearchHistoryItem {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    searchedAt: string;
}

