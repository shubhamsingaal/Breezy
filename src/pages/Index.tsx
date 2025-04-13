
import { useState, useEffect, useCallback } from 'react';
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
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const [location, setLocation] = useState<string>("San Francisco");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const { toast: toastNotification } = useToast();
  
  // Use React Query for better caching and auto-refetching
  const { 
    data: weatherData, 
    isLoading, 
    isFetching,
    refetch 
  } = useQuery({
    queryKey: ['weatherData', location, unitSystem],
    queryFn: () => getWeatherData(location),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 15, // Auto refresh every 15 minutes
    retry: 1,
    onError: (error: any) => {
      console.error("Error fetching weather data:", error);
      setError(error.message || "Could not fetch weather data. Please try again.");
      
      toastNotification({
        title: "Error",
        description: error.message || "Could not fetch weather data. Please try again.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      setError(null);
      setLastUpdated(new Date());
      toast.success("Weather data updated successfully");
    }
  });

  const handleSearch = useCallback((searchLocation: string) => {
    setLocation(searchLocation);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);
  
  const handleDetectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      toastNotification({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }
    
    toast.loading("Detecting your location...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `${latitude},${longitude}`;
        setLocation(locationString);
        toast.dismiss();
        toast.success("Location detected successfully");
      },
      (error) => {
        console.error("Error getting user location:", error);
        toast.dismiss();
        toastNotification({
          title: "Location Error",
          description: "Unable to retrieve your location. Please allow location access or search manually.",
          variant: "destructive"
        });
      },
      { timeout: 10000 }
    );
  }, [toastNotification]);

  const toggleUnitSystem = useCallback(() => {
    setUnitSystem(prev => prev === 'metric' ? 'imperial' : 'metric');
  }, []);

  // Initial location detection on component mount
  useEffect(() => {
    // We're not auto-detecting on load to avoid permission popups without user action
    // But we could uncomment this if desired:
    // handleDetectLocation();
  }, []);

  if (isLoading && !weatherData) {
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
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={isFetching} 
              onDetectLocation={handleDetectLocation}
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleUnitSystem}
                className="h-10"
              >
                {unitSystem === 'metric' ? '°C' : '°F'}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRefresh} 
                disabled={isFetching} 
                className="h-10 w-10"
                title="Refresh weather data"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
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
            {weatherData && (
              <WeatherCard 
                current={weatherData.current} 
                unitSystem={unitSystem} 
              />
            )}
          </div>
          
          {/* Weather details */}
          <div className="lg:col-span-7">
            {weatherData && (
              <WeatherDetails 
                current={weatherData.current} 
                unitSystem={unitSystem} 
              />
            )}
          </div>
          
          {/* Forecast */}
          <div className="lg:col-span-12">
            {weatherData && (
              <ForecastCard 
                forecast={weatherData.forecast.forecastday} 
                unitSystem={unitSystem}
              />
            )}
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
