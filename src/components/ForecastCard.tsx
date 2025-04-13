
import { ForecastDay } from "../types/weather";
import { getWeatherIcon } from "../services/weatherService";
import { 
  Cloud, CloudLightning, CloudRain, CloudSnow, Sun, CloudSun 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ForecastCardProps {
  forecast: ForecastDay[];
}

const ForecastCard = ({ forecast }: ForecastCardProps) => {
  // Get the appropriate icon component
  const getIcon = (code: number) => {
    const iconName = getWeatherIcon(code, true);
    
    switch(iconName) {
      case "sun": return <Sun className="h-8 w-8 text-weather-sunny" />;
      case "cloud": return <Cloud className="h-8 w-8 text-weather-cloudy" />;
      case "cloud-sun": return <CloudSun className="h-8 w-8 text-weather-cloudy" />;
      case "cloud-rain": 
      case "cloud-sun-rain": return <CloudRain className="h-8 w-8 text-weather-rainy" />;
      case "cloud-snow": return <CloudSnow className="h-8 w-8 text-weather-cloudy" />;
      case "cloud-lightning": return <CloudLightning className="h-8 w-8 text-weather-cloudy" />;
      default: return <CloudSun className="h-8 w-8 text-weather-cloudy" />;
    }
  };

  // Format date to day name
  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">7-Day Forecast</h3>
        
        <div className="space-y-3">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="w-24 font-medium">
                {formatDay(day.date)}
              </div>
              
              <div className="flex items-center">
                {getIcon(day.day.condition.code)}
                <span className="ml-2 text-sm text-gray-600">{day.day.condition.text}</span>
              </div>
              
              <div className="text-right">
                <span className="text-gray-800 font-medium">{Math.round(day.day.maxtemp_c)}°</span>
                <span className="text-gray-500 ml-2">{Math.round(day.day.mintemp_c)}°</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
