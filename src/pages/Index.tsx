
import { useState, useEffect } from 'react';
import { getWeatherData } from '../services/weatherService';
import { WeatherData } from '../types/weather';
import { useToast } from "@/components/ui/use-toast";
import SearchBar from '../components/SearchBar';
import LocationDisplay from '../components/LocationDisplay';
import WeatherCard from '../components/WeatherCard';
import WeatherDetails from '../components/WeatherDetails';
import ForecastCard from '../components/ForecastCard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string>("San Francisco");
  const { toast } = useToast();

  useEffect(() => {
    fetchWeatherData(location);
  }, []);

  const fetchWeatherData = async (searchLocation: string) => {
    try {
      setLoading(true);
      const data = await getWeatherData(searchLocation);
      setWeatherData(data);
      setLocation(searchLocation);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "Error",
        description: "Could not fetch weather data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newLocation: string) => {
    fetchWeatherData(newLocation);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-weather-blue" />
        <p className="mt-4 text-gray-600">Loading weather data...</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600">No weather data available</p>
        <div className="mt-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-8 sm:px-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {weatherData && <LocationDisplay location={weatherData.location} />}
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main weather card */}
          <div className="lg:col-span-5">
            {weatherData && <WeatherCard current={weatherData.current} />}
          </div>
          
          {/* Weather details */}
          <div className="lg:col-span-7">
            {weatherData && <WeatherDetails current={weatherData.current} />}
          </div>
          
          {/* Forecast */}
          <div className="lg:col-span-12">
            {weatherData && <ForecastCard forecast={weatherData.forecast.forecastday} />}
          </div>
        </div>
        
        <div className="text-center text-gray-400 text-sm mt-12">
          <p>Note: This is demo data. Connect to a real weather API for actual weather information.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
