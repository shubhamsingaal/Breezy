
import { CurrentWeather } from "../types/weather";
import { getWeatherIcon } from "../services/weatherService";
import { 
  Cloud, Droplets, Sun, Thermometer, Wind, 
  CloudSun, CloudMoon, CloudRain, CloudSnow, CloudFog, CloudLightning
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherCardProps {
  current: CurrentWeather;
  unitSystem: 'metric' | 'imperial';
}

const WeatherCard = ({ current, unitSystem }: WeatherCardProps) => {
  const iconName = getWeatherIcon(current.condition.code, !!current.is_day);
  
  // Get the appropriate icon component
  const getIcon = () => {
    switch(iconName) {
      case "sun": return <Sun className="h-16 w-16 text-yellow-400" />;
      case "moon": return <Sun className="h-16 w-16 text-blue-400" />;
      case "cloud": return <Cloud className="h-16 w-16 text-gray-400" />;
      case "cloud-sun": return <CloudSun className="h-16 w-16 text-amber-400" />;
      case "cloud-moon": return <CloudMoon className="h-16 w-16 text-blue-400" />;
      case "cloud-rain": 
      case "cloud-sun-rain":
      case "cloud-moon-rain":
        return <CloudRain className="h-16 w-16 text-blue-500" />;
      case "cloud-snow": return <CloudSnow className="h-16 w-16 text-blue-300" />;
      case "cloud-fog": return <CloudFog className="h-16 w-16 text-gray-400" />;
      case "cloud-lightning": return <CloudLightning className="h-16 w-16 text-amber-500" />;
      default: return <CloudSun className="h-16 w-16 text-amber-400" />;
    }
  };

  // Get temperature and feelsLike temperature based on unit system
  const temperature = unitSystem === 'metric' ? 
    Math.round(current.temp_c) : 
    Math.round(current.temp_f);
    
  const feelsLike = unitSystem === 'metric' ? 
    Math.round(current.feelslike_c) : 
    Math.round(current.feelslike_f);

  // Get wind speed based on unit system
  const windSpeed = unitSystem === 'metric' ? 
    `${current.wind_kph} km/h` : 
    `${current.wind_mph} mph`;

  // Get unit symbol
  const temperatureUnit = unitSystem === 'metric' ? '°C' : '°F';

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-5xl font-bold text-gray-800">{temperature}{temperatureUnit}</h2>
            <p className="text-gray-600 mt-1">{current.condition.text}</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            {getIcon()}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
          <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50">
            <Thermometer className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-xs text-gray-500">Feels like</span>
            <span className="font-medium text-gray-700">{feelsLike}{temperatureUnit}</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50">
            <Wind className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-xs text-gray-500">Wind</span>
            <span className="font-medium text-gray-700">{windSpeed}</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50">
            <Droplets className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-xs text-gray-500">Humidity</span>
            <span className="font-medium text-gray-700">{current.humidity}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
