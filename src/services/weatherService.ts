
import { WeatherData } from "../types/weather";

const API_KEY = "c2bd3b0b6bb14034b3a81330251304";
const BASE_URL = "https://api.weatherapi.com/v1";

// Cache mechanism to reduce API calls
const weatherCache = new Map();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

export async function getWeatherData(location: string): Promise<WeatherData> {
  try {
    // Check if we have a valid cached response
    const cacheKey = `weather_${location}`;
    const cachedData = weatherCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
      console.log("Using cached weather data for", location);
      return cachedData.data;
    }
    
    // Make API call with error handling
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=no&alerts=yes`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Weather data not available');
    }
    
    const data = await response.json();
    
    // Cache the fresh data
    weatherCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export function getWeatherIcon(code: number, isDay: boolean = true): string {
  // Map weather codes to Lucide icon names
  switch(code) {
    case 1000: // Clear/Sunny
      return isDay ? "sun" : "moon";
    case 1003: // Partly cloudy
      return isDay ? "cloud-sun" : "cloud-moon";
    case 1006: // Cloudy
    case 1009: // Overcast
      return "cloud";
    case 1030: // Mist
    case 1135: // Fog
    case 1147: // Freezing fog
      return "cloud-fog";
    case 1063: // Patchy rain possible
    case 1180: // Patchy light rain
    case 1183: // Light rain
    case 1186: // Moderate rain at times
    case 1189: // Moderate rain
    case 1192: // Heavy rain at times
    case 1195: // Heavy rain
      return isDay ? "cloud-sun-rain" : "cloud-moon-rain";
    case 1087: // Thundery outbreaks possible
    case 1273: // Patchy light rain with thunder
    case 1276: // Moderate or heavy rain with thunder
      return "cloud-lightning";
    case 1066: // Patchy snow possible
    case 1114: // Blowing snow
    case 1210: // Patchy light snow
    case 1213: // Light snow
    case 1216: // Patchy moderate snow
    case 1219: // Moderate snow
    case 1222: // Patchy heavy snow
    case 1225: // Heavy snow
      return "cloud-snow";
    case 1069: // Patchy sleet possible
    case 1072: // Patchy freezing drizzle possible
    case 1168: // Freezing drizzle
    case 1171: // Heavy freezing drizzle
    case 1198: // Light freezing rain
    case 1201: // Moderate or heavy freezing rain
      return "cloud-hail";
    default:
      return isDay ? "cloud-sun" : "cloud-moon";
  }
}

// Helper function to get user's current location
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000 // 10 minutes
    });
  });
}
