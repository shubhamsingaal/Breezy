import React, { useState, useEffect, useCallback } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTheme } from '@/hooks/use-theme';
import SplashScreen from '@/components/SplashScreen';
import { getWeatherData } from '../services/weatherService';
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";
import SearchBar from '../components/SearchBar';
import LocationDisplay from '../components/LocationDisplay';
import WeatherCard from '../components/WeatherCard';
import WeatherDetails from '../components/WeatherDetails';
import ForecastCard from '../components/ForecastCard';
import ThemeToggle from '../components/ThemeToggle';
import WeatherMap from '../components/WeatherMap';
import AirQuality from '../components/AirQuality';
import SunriseSunset from '../components/SunriseSunset';
import UVIndex from '../components/UVIndex';
import WeatherHighlights from '../components/WeatherHighlights';
import WeatherAlerts from '../components/WeatherAlerts';
import FavLocations from '../components/FavLocations';
import VisibilityInfo from '../components/VisibilityInfo';
import MoonPhase from '../components/MoonPhase';
import { useQuery } from '@tanstack/react-query';
import { Loader2, RefreshCw, CloudLightning } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [location, setLocation] = useState<string>("San Francisco");
  const [error, setError] = useState<string | null>(null);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteLocations");
    return saved ? JSON.parse(saved) : ["San Francisco", "New York", "London"];
  });
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const { toast: toastNotification } = useToast();
  const { user, settings, saveUserSettings } = useAuth();
  
  useEffect(() => {
    if (user && settings) {
      if (settings.unitSystem) {
        setUnitSystem(settings.unitSystem);
      }
    }
  }, [user, settings]);
  
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
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching weather data:", error);
        setError(error.message || "Could not fetch weather data. Please try again.");
        
        toastNotification({
          title: "Error",
          description: error.message || "Could not fetch weather data. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  useEffect(() => {
    if (weatherData && !isDataLoaded) {
      setError(null);
      setIsDataLoaded(true);
      toast.success("Weather data updated successfully");
      
      if (user && settings.notificationEnabled && weatherData.alerts?.alert?.length > 0) {
        const mostSevereAlert = weatherData.alerts.alert[0];
        toastNotification({
          title: "Weather Alert",
          description: mostSevereAlert.headline || "Weather alert in your area",
          variant: "destructive"
        });
      }
    }
  }, [weatherData, isDataLoaded, user, settings, toastNotification]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500); // Increase the splash screen duration

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = useCallback((searchLocation: string) => {
    setLocation(searchLocation);
    setIsDataLoaded(false);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsDataLoaded(false);
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
        setIsDataLoaded(false);
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
    const newUnitSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
    setUnitSystem(newUnitSystem);
    
    if (user) {
      saveUserSettings({ unitSystem: newUnitSystem });
    }
  }, [unitSystem, user, saveUserSettings]);

  const addToFavorites = useCallback((locationName: string) => {
    if (!favorites.includes(locationName)) {
      const newFavorites = [...favorites, locationName];
      setFavorites(newFavorites);
      localStorage.setItem("favoriteLocations", JSON.stringify(newFavorites));
      toast.success(`Added ${locationName} to favorites`);
    }
  }, [favorites]);

  const removeFromFavorites = useCallback((locationName: string) => {
    const newFavorites = favorites.filter(fav => fav !== locationName);
    setFavorites(newFavorites);
    localStorage.setItem("favoriteLocations", JSON.stringify(newFavorites));
    toast.success(`Removed ${locationName} from favorites`);
  }, [favorites]);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <div className={theme === 'dark' ? 'bg-gradient-dark' : 'bg-gradient-light'}>
          <Header />
          <main className="pt-20 min-h-screen animate-fade-in">
            {pageLoading || (isLoading && !weatherData) ? (
              <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gradient-dark' : 'bg-gradient-light'} transition-colors duration-700`}>
                <div className="animate-bounce-gentle">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg">
                    <CloudLightning className="h-12 w-12 text-white" />
                  </div>
                </div>
                <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} animate-fade-in`}>Loading weather data...</p>
              </div>
            ) : (
              <div className={`min-h-screen transition-all duration-700 ${theme === 'dark' ? 'bg-gradient-dark' : 'bg-gradient-to-b from-sky-50 to-white'} px-4 pb-8 pt-16 sm:px-6 sm:pb-10`}>
                <div className="max-w-7xl mx-auto animate-fade-in transition-all mt-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center justify-between w-full md:w-auto">
                      {weatherData && <LocationDisplay location={weatherData.location} />}
                      <div className="md:hidden">
                        <ThemeToggle />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-end gap-2 w-full md:w-auto">
                      <SearchBar 
                        onSearch={handleSearch} 
                        isLoading={isFetching} 
                        onDetectLocation={handleDetectLocation}
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant={theme === 'dark' ? "outline" : "default"}
                          size="sm"
                          onClick={toggleUnitSystem}
                          className={`h-10 transition-all duration-300 ${theme === 'dark' ? 'hover:bg-slate-700' : ''}`}
                        >
                          {unitSystem === 'metric' ? '°C' : '°F'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleRefresh} 
                          disabled={isFetching} 
                          className={`h-10 w-10 transition-all duration-300 ${theme === 'dark' ? 'hover:bg-slate-700' : ''}`}
                          title="Refresh weather data"
                        >
                          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                        </Button>
                        <div className="hidden md:block">
                          <ThemeToggle />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className={`${theme === 'dark' ? 'bg-red-900/30 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-md mb-6 animate-fade-in`}>
                      {error}
                    </div>
                  )}
                  
                  <div className="mb-6 transition-all duration-500">
                    <FavLocations 
                      favorites={favorites} 
                      currentLocation={weatherData?.location.name || ""} 
                      onSelect={handleSearch}
                      onAdd={() => weatherData && addToFavorites(weatherData.location.name)}
                      onRemove={removeFromFavorites}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5">
                      {weatherData && (
                        <div className="animate-slide-up">
                          <WeatherCard 
                            current={weatherData.current} 
                            unitSystem={unitSystem} 
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="lg:col-span-7">
                      {weatherData && (
                        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                          <WeatherDetails 
                            current={weatherData.current} 
                            unitSystem={unitSystem} 
                          />
                        </div>
                      )}
                    </div>
                    
                    {weatherData?.alerts && weatherData.alerts.alert?.length > 0 && (
                      <div className="lg:col-span-12">
                        <WeatherAlerts alerts={weatherData.alerts} />
                      </div>
                    )}
                    
                    <div className="lg:col-span-12">
                      {weatherData && (
                        <WeatherHighlights 
                          current={weatherData.current}
                          forecast={weatherData.forecast}
                          unitSystem={unitSystem}
                        />
                      )}
                    </div>
                    
                    <div className="lg:col-span-12">
                      {weatherData && (
                        <WeatherMap 
                          lat={weatherData.location.lat} 
                          lon={weatherData.location.lon}
                          location={weatherData.location.name}
                        />
                      )}
                    </div>
                    
                    <div className="lg:col-span-4">
                      {weatherData && weatherData.forecast.forecastday[0] && (
                        <SunriseSunset 
                          astroData={weatherData.forecast.forecastday[0].astro} 
                          localTime={weatherData.location.localtime}
                        />
                      )}
                    </div>
                    
                    <div className="lg:col-span-4">
                      {weatherData && (
                        <UVIndex uvIndex={weatherData.current.uv} />
                      )}
                    </div>
                    
                    <div className="lg:col-span-4">
                      <AirQuality />
                    </div>
                    
                    <div className="lg:col-span-6">
                      {weatherData && (
                        <VisibilityInfo 
                          visibility={unitSystem === 'metric' ? weatherData.current.vis_km : weatherData.current.vis_miles}
                          unit={unitSystem === 'metric' ? 'km' : 'miles'}
                        />
                      )}
                    </div>
                    
                    <div className="lg:col-span-6">
                      {weatherData && weatherData.forecast.forecastday[0] && (
                        <MoonPhase 
                          astroData={weatherData.forecast.forecastday[0].astro}
                        />
                      )}
                    </div>
                    
                    <div className="lg:col-span-12">
                      {weatherData && (
                        <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                          <ForecastCard 
                            forecast={weatherData.forecast.forecastday} 
                            unitSystem={unitSystem}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Footer />
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
};

export default Index;
