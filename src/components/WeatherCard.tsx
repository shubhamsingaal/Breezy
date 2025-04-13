
import { CurrentWeather } from "../types/weather";
import { getWeatherIcon } from "../services/weatherService";
import { 
  Cloud, Droplets, Sun, Thermometer, Wind, 
  CloudSun, CloudMoon, CloudRain, CloudSnow, CloudFog, CloudLightning
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherCardProps {
  current: CurrentWeather;
}

const WeatherCard = ({ current }: WeatherCardProps) => {
  const iconName = getWeatherIcon(current.condition.code, !!current.is_day);
  
  // Get the appropriate icon component
  const getIcon = () => {
    switch(iconName) {
      case "sun": return <Sun className="h-16 w-16 text-weather-sunny" />;
      case "moon": return <Sun className="h-16 w-16 text-weather-blue" />;
      case "cloud": return <Cloud className="h-16 w-16 text-weather-cloudy" />;
      case "cloud-sun": return <CloudSun className="h-16 w-16 text-weather-cloudy" />;
      case "cloud-moon": return <CloudMoon className="h-16 w-16 text-weather-cloudy" />;
      case "cloud-rain": 
      case "cloud-sun-rain":
      case "cloud-moon-rain":
        return <CloudRain className="h-16 w-16 text-weather-rainy" />;
      case "cloud-snow": return <CloudSnow className="h-16 w-16 text-weather-cloudy" />;
      case "cloud-fog": return <CloudFog className="h-16 w-16 text-weather-cloudy" />;
      case "cloud-lightning": return <CloudLightning className="h-16 w-16 text-weather-cloudy" />;
      default: return <CloudSun className="h-16 w-16 text-weather-cloudy" />;
    }
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-5xl font-bold text-gray-800">{Math.round(current.temp_c)}°C</h2>
            <p className="text-gray-600">{current.condition.text}</p>
          </div>
          <div>
            {getIcon()}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-6 text-sm">
          <div className="flex items-center">
            <Thermometer className="h-4 w-4 text-weather-blue mr-2" />
            <span>Feels like {Math.round(current.feelslike_c)}°C</span>
          </div>
          
          <div className="flex items-center">
            <Wind className="h-4 w-4 text-weather-blue mr-2" />
            <span>{current.wind_kph} km/h</span>
          </div>
          
          <div className="flex items-center">
            <Droplets className="h-4 w-4 text-weather-blue mr-2" />
            <span>{current.humidity}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
