import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/use-theme';
import { Loader2, Map, Layers, CloudRain, Wind, Thermometer } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface WeatherMapProps {
  lat: number;
  lon: number;
  location: string;
}

const WeatherMap = ({ lat, lon, location }: WeatherMapProps) => {
  const { theme } = useTheme();
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapType, setMapType] = useState<'temp' | 'rain' | 'wind'>('temp');

  useEffect(() => {
    console.log('WeatherMap Props:', { lat, lon, location });

    if (!mapRef.current) {
      console.error('Map container is not available.');
      return;
    }

    console.log('Initializing Leaflet map...');
    const map = L.map(mapRef.current).setView([lat, lon], 10);

    console.log('Adding base tile layer...');
    const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    console.log('Adding weather layer:', mapType);
    const weatherLayers = {
      temp: L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=d2b94886e6fe4a2de469dd8df40d5ed7`),
      rain: L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=d2b94886e6fe4a2de469dd8df40d5ed7`),
      wind: L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=d2b94886e6fe4a2de469dd8df40d5ed7`)
    };

    const selectedLayer = weatherLayers[mapType];
    if (selectedLayer) {
      console.log('Adding selected weather layer to map:', mapType);
      console.log('Tile Layer URL:', weatherLayers[mapType]._url);
      selectedLayer.addTo(map);
    } else {
      console.error('Invalid map type selected:', mapType);
    }

    setIsMapLoading(false);

    return () => {
      console.log('Cleaning up map instance...');
      map.remove();
    };
  }, [lat, lon, mapType]);

  // This would be replaced with actual map rendering
  const renderMap = () => {
    if (isMapLoading) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-slate-800 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
      <div className="relative h-64 overflow-hidden rounded-lg">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-slate-800' : 'bg-blue-50'} flex items-center justify-center`}>
          <div className="text-center p-4">
            <Map className={`h-12 w-12 mb-2 mx-auto ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Map for {location} ({lat.toFixed(2)}°, {lon.toFixed(2)}°)
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {mapType === 'temp' && 'Temperature layer'}
              {mapType === 'rain' && 'Precipitation layer'}
              {mapType === 'wind' && 'Wind layer'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'} shadow-md transition-all duration-300 hover:shadow-lg animate-slide-up`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Layers className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
          Weather Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temp" className="mb-4">
          <TabsList className={`grid w-full grid-cols-3 ${theme === 'dark' ? 'bg-slate-700' : ''}`}>
            <TabsTrigger value="temp" onClick={() => setMapType('temp')}>
              <Thermometer className="h-4 w-4 mr-1" /> Temperature
            </TabsTrigger>
            <TabsTrigger value="rain" onClick={() => setMapType('rain')}>
              <CloudRain className="h-4 w-4 mr-1" /> Precipitation
            </TabsTrigger>
            <TabsTrigger value="wind" onClick={() => setMapType('wind')}>
              <Wind className="h-4 w-4 mr-1" /> Wind
            </TabsTrigger>
          </TabsList>
          <TabsContent value="temp">
            <div ref={mapRef} className="h-64 w-full rounded-lg overflow-hidden" />
          </TabsContent>
          <TabsContent value="rain">
            <div ref={mapRef} className="h-64 w-full rounded-lg overflow-hidden" />
          </TabsContent>
          <TabsContent value="wind">
            <div ref={mapRef} className="h-64 w-full rounded-lg overflow-hidden" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeatherMap;
