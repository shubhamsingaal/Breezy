
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/use-theme';
import { Loader2, Map, Layers, CloudRain, Wind, Thermometer } from 'lucide-react';

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
    // This is a placeholder for an actual map integration
    // In a real implementation, you would initialize a map library here
    const loadMap = async () => {
      try {
        setIsMapLoading(true);
        // Simulate map loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsMapLoading(false);
      } catch (error) {
        console.error("Error loading map:", error);
        setIsMapLoading(false);
      }
    };

    if (mapRef.current) {
      loadMap();
    }

    return () => {
      // Clean up map instance if needed
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
          <TabsContent value="temp">{renderMap()}</TabsContent>
          <TabsContent value="rain">{renderMap()}</TabsContent>
          <TabsContent value="wind">{renderMap()}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeatherMap;
