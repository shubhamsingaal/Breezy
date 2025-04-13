
import { WeatherData } from "../types/weather";

const API_KEY = "your_api_key_here"; // Normally you'd use an environment variable
const BASE_URL = "https://api.weatherapi.com/v1";

export async function getWeatherData(location: string): Promise<WeatherData> {
  try {
    // For demo purposes, we'll return mock data instead of making real API calls
    return getMockWeatherData(location);
    
    // In a real app with API key, you would use:
    // const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=no&alerts=no`);
    // if (!response.ok) throw new Error('Weather data not available');
    // return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

// Mock data for demonstration purposes
function getMockWeatherData(location: string): WeatherData {
  const cityName = location.toLowerCase().includes("london") 
    ? "London" 
    : location.toLowerCase().includes("new york")
    ? "New York"
    : location.toLowerCase().includes("tokyo")
    ? "Tokyo"
    : "San Francisco";
    
  const isRainy = cityName === "London";
  const isCloudy = cityName === "New York";
  const isSunny = cityName === "Tokyo" || cityName === "San Francisco";
  
  const currentTemp = isSunny ? 28 : isCloudy ? 18 : 15;
  const conditionText = isSunny ? "Sunny" : isCloudy ? "Partly cloudy" : "Light rain";
  const conditionIcon = isSunny ? "//cdn.weatherapi.com/weather/64x64/day/113.png" : 
                        isCloudy ? "//cdn.weatherapi.com/weather/64x64/day/116.png" : 
                        "//cdn.weatherapi.com/weather/64x64/day/296.png";

  return {
    location: {
      name: cityName,
      region: "",
      country: cityName === "London" ? "UK" : cityName === "New York" || cityName === "San Francisco" ? "USA" : "Japan",
      lat: 0,
      lon: 0,
      localtime: new Date().toISOString(),
    },
    current: {
      temp_c: currentTemp,
      temp_f: (currentTemp * 9/5) + 32,
      is_day: 1,
      condition: {
        text: conditionText,
        icon: conditionIcon,
        code: isSunny ? 1000 : isCloudy ? 1003 : 1183
      },
      wind_mph: 8.1,
      wind_kph: 13,
      wind_degree: 250,
      wind_dir: "WSW",
      pressure_mb: 1018,
      pressure_in: 30.06,
      precip_mm: isRainy ? 0.5 : 0,
      precip_in: isRainy ? 0.02 : 0,
      humidity: isSunny ? 45 : isCloudy ? 65 : 80,
      cloud: isSunny ? 10 : isCloudy ? 50 : 80,
      feelslike_c: currentTemp - 1,
      feelslike_f: ((currentTemp - 1) * 9/5) + 32,
      vis_km: 10,
      vis_miles: 6,
      uv: isSunny ? 8 : 4,
      gust_mph: 12.5,
      gust_kph: 20.2
    },
    forecast: {
      forecastday: Array.from({ length: 7 }, (_, i) => {
        const isWeekendDay = (new Date().getDay() + i) % 7 === 0 || (new Date().getDay() + i) % 7 === 6;
        const randomTemp = currentTemp + (Math.random() * 8 - 4);
        const randomCondition = Math.random() > 0.6 ? conditionText : 
                               Math.random() > 0.3 ? "Cloudy" : "Rain";
        const randomIcon = randomCondition.includes("Sunny") ? "//cdn.weatherapi.com/weather/64x64/day/113.png" : 
                          randomCondition.includes("Cloudy") ? "//cdn.weatherapi.com/weather/64x64/day/116.png" : 
                          "//cdn.weatherapi.com/weather/64x64/day/296.png";
                          
        return {
          date: new Date(new Date().setDate(new Date().getDate() + i)).toISOString().split('T')[0],
          day: {
            maxtemp_c: randomTemp + 3,
            maxtemp_f: ((randomTemp + 3) * 9/5) + 32,
            mintemp_c: randomTemp - 5,
            mintemp_f: ((randomTemp - 5) * 9/5) + 32,
            avgtemp_c: randomTemp,
            avgtemp_f: (randomTemp * 9/5) + 32,
            maxwind_mph: 10 + Math.random() * 5,
            maxwind_kph: (10 + Math.random() * 5) * 1.6,
            totalprecip_mm: randomCondition.includes("Rain") ? 5 + Math.random() * 10 : 0,
            totalprecip_in: randomCondition.includes("Rain") ? (5 + Math.random() * 10) / 25.4 : 0,
            totalsnow_cm: 0,
            avgvis_km: 10,
            avgvis_miles: 6,
            avghumidity: randomCondition.includes("Rain") ? 80 : randomCondition.includes("Cloudy") ? 65 : 50,
            daily_will_it_rain: randomCondition.includes("Rain") ? 1 : 0,
            daily_chance_of_rain: randomCondition.includes("Rain") ? 70 : 0,
            daily_will_it_snow: 0,
            daily_chance_of_snow: 0,
            condition: {
              text: randomCondition,
              icon: randomIcon,
              code: randomCondition.includes("Sunny") ? 1000 : 
                    randomCondition.includes("Cloudy") ? 1003 : 1183
            },
            uv: randomCondition.includes("Sunny") ? 8 : 4
          },
          astro: {
            sunrise: "06:15 AM",
            sunset: "07:45 PM",
            moonrise: "09:30 PM",
            moonset: "08:10 AM",
            moon_phase: "Waxing Gibbous",
            moon_illumination: "75",
            is_moon_up: 0,
            is_sun_up: 1
          },
          hour: []
        };
      })
    }
  };
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
