
import { useState, useEffect } from 'react';
import { getWeatherData } from '../services/weatherService';
import { WeatherData } from '../types/weather';
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import SearchBar from '../components/SearchBar';
import LocationDisplay from '../components/LocationDisplay';
import WeatherCard from '../components/WeatherCard';
import WeatherDetails from '../components/WeatherDetails';
import ForecastCard from '../components/ForecastCard';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string>("San Francisco");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast: toastNotification } = useToast();

  useEffect(() => {
    fetchWeatherData(location);
  }, []);

  const fetchWeatherData = async (searchLocation: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getWeatherData(searchLocation);
      setWeatherData(data);
      setLocation(searchLocation);
      setLastUpdated(new Date());
      
      // Show success toast
      toast.success("Weather data updated successfully");
    } catch (error: any) {
      console.error("Error fetching weather data:", error);
      setError(error.message || "Could not fetch weather data. Please try again.");
      
      toastNotification({
        title: "Error",
        description: error.message || "Could not fetch weather data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newLocation: string) => {
    fetchWeatherData(newLocation);
  };

  const handleRefresh = () => {
    fetchWeatherData(location);
  };

  if (loading && !weatherData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Loading weather data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-8 sm:px-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {weatherData && <LocationDisplay location={weatherData.location} />}
          <div className="flex flex-col md:flex-row items-end gap-2">
            <SearchBar onSearch={handleSearch} isLoading={loading} />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={loading} 
              className="h-10 w-10"
              title="Refresh weather data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
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
        
        {lastUpdated && (
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
