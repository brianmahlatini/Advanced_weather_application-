import { useState, useEffect, useCallback } from 'react';
import { CurrentWeather, WeatherForecast, OneCallWeather, AirQuality } from '../types/weather';

const API_KEY = "daac26c52c5cde564db91e49e596478c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  current: CurrentWeather | null;
  forecast: WeatherForecast | null;
  oneCall: OneCallWeather | null;
  airQuality: AirQuality | null;
}

export interface UseWeatherResult {
  weather: WeatherData;
  loading: boolean;
  error: string | null;
  searchWeather: (query: string) => Promise<void>;
  getWeatherByCoords: (lat: number, lon: number) => Promise<void>;
}

export const useWeather = (): UseWeatherResult => {
  const [weather, setWeather] = useState<WeatherData>({
    current: null,
    forecast: null,
    oneCall: null,
    airQuality: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      // First, try to get current weather to validate API key
      const currentResponse = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      
      if (!currentResponse.ok) {
        if (currentResponse.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else if (currentResponse.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`Weather API error: ${currentResponse.status} ${currentResponse.statusText}`);
        }
      }

      const current = await currentResponse.json();

      // Now fetch other data
      const [forecastResponse, airQualityResponse] = await Promise.all([
        fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
        fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
      ]);

      if (!forecastResponse.ok || !airQualityResponse.ok) {
        console.warn('Some weather data could not be fetched, but continuing with available data');
      }

      const forecast = forecastResponse.ok ? await forecastResponse.json() : null;
      const airQuality = airQualityResponse.ok ? await airQualityResponse.json() : null;

      // Try to get OneCall data (this might not be available with free API keys)
      let oneCall = null;
      try {
        const oneCallResponse = await fetch(`${BASE_URL}/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${API_KEY}`);
        if (oneCallResponse.ok) {
          oneCall = await oneCallResponse.json();
        }
      } catch (error) {
        console.warn('OneCall API not available, using basic forecast data');
      }

      setWeather({
        current,
        forecast,
        oneCall,
        airQuality,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchWeather = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/weather?q=${query}&units=metric&appid=${API_KEY}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`Search failed: ${response.status} ${response.statusText}`);
        }
      }

      const currentWeather = await response.json();
      const { lat, lon } = currentWeather.coord;
      
      await fetchWeatherData(lat, lon);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }, [fetchWeatherData]);

  const getWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    await fetchWeatherData(lat, lon);
  }, [fetchWeatherData]);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoords(latitude, longitude);
        },
        () => {
          // Fallback to a default location (London)
          console.log('Using default location (London) as geolocation failed');
          getWeatherByCoords(51.5074, -0.1278);
        }
      );
    } else {
      // Fallback to a default location (London)
      console.log('Using default location (London) as geolocation is not supported');
      getWeatherByCoords(51.5074, -0.1278);
    }
  }, [getWeatherByCoords]);

  return {
    weather,
    loading,
    error,
    searchWeather,
    getWeatherByCoords,
  };
};