import axios from 'axios';
import type {
  GeocodeResult,
  GeocodeResponse,
  WeatherForecastResponse,
  LocationCoordinates,
} from '../types';

// Open-Meteo API base URLs (public API, no auth needed)
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1';
const WEATHER_API = 'https://api.open-meteo.com/v1';

// Create axios instance for open-meteo (no baseURL, no interceptors needed)
const openMeteoClient = axios.create({
  timeout: 10000,
});

/**
 * Search for cities by name (geocoding)
 */
export const searchCity = async (query: string): Promise<GeocodeResult[]> => {
  try {
    const response = await openMeteoClient.get<GeocodeResponse>(`${GEOCODING_API}/search`, {
      params: {
        name: query,
        count: 10, // Limit to 10 results
        language: 'en',
        format: 'json',
      },
    });
    return response.data.results || [];
  } catch (error) {
    console.error('Error searching city:', error);
    throw error;
  }
};

/**
 * Get weather forecast for a location
 */
export const getWeatherForecast = async (
  latitude: number,
  longitude: number
): Promise<WeatherForecastResponse> => {
  try {
    const response = await openMeteoClient.get<WeatherForecastResponse>(`${WEATHER_API}/forecast`, {
      params: {
        latitude,
        longitude,
        current_weather: true,
        daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max',
        timezone: 'auto',
        forecast_days: 7, // 7-day forecast
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

/**
 * Get user's current location using browser geolocation API
 */
export const getCurrentLocation = (): Promise<LocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Reverse geocode - get city name from coordinates
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<GeocodeResult | null> => {
  try {
    const response = await openMeteoClient.get<GeocodeResponse>(`${GEOCODING_API}/search`, {
      params: {
        latitude,
        longitude,
        count: 1,
        language: 'en',
        format: 'json',
      },
    });
    return response.data.results?.[0] || null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};

/**
 * Get weather for current location with city name
 */
export const getWeatherForCurrentLocation = async (): Promise<{
  weather: WeatherForecastResponse;
  location: LocationCoordinates;
}> => {
  const location = await getCurrentLocation();
  const weather = await getWeatherForecast(location.latitude, location.longitude);

  // Try to get city name from reverse geocoding
  const cityInfo = await reverseGeocode(location.latitude, location.longitude);

  return {
    weather,
    location: {
      ...location,
      name: cityInfo?.name || undefined,
    },
  };
};

