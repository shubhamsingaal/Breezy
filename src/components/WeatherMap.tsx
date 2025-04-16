
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/use-theme';
import { Loader2, Map, Layers, CloudRain, Wind, Thermometer } from 'lucide-react';
// Import Leaflet properly with dynamic import to prevent SSR issues
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
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    let map: any;
    let L: any;
    
    async function initMap() {
      try {
        // Dynamically import Leaflet to avoid SSR issues
        const leaflet = await import('leaflet');
        L = leaflet.default;
        
        if (!mapRef.current) {
          console.error('Map container is not available.');
          return;
        }

        console.log('Initializing Leaflet map...', { lat, lon });
        
        // Check if a map already exists and remove it
        if (mapInstance) {
          mapInstance.remove();
        }
        
        map = L.map(mapRef.current).setView([lat, lon], 10);
        setMapInstance(map);

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
          selectedLayer.addTo(map);
        }

        setIsMapLoading(false);
        
        // Add marker at the location
        L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${location}</b><br>Lat: ${lat}, Lon: ${lon}`)
          .openPopup();
      } catch (error) {
        console.error('Failed to initialize map:', error);
        setIsMapLoading(false);
      }
    }

    initMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [lat, lon, mapType, mapInstance]);

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
          <TabsContent value="temp" className="h-64">
            {isMapLoading ? (
              <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-slate-800 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div ref={mapRef} className="h-full w-full rounded-lg overflow-hidden" />
            )}
          </TabsContent>
          <TabsContent value="rain" className="h-64">
            {isMapLoading ? (
              <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-slate-800 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div ref={mapRef} className="h-full w-full rounded-lg overflow-hidden" />
            )}
          </TabsContent>
          <TabsContent value="wind" className="h-64">
            {isMapLoading ? (
              <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-slate-800 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div ref={mapRef} className="h-full w-full rounded-lg overflow-hidden" />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeatherMap;
