
import { ForecastDay } from "../types/weather";
import { getWeatherIcon } from "../services/weatherService";
import { 
  Cloud, CloudLightning, CloudRain, CloudSnow, Sun, CloudSun 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ForecastCardProps {
  forecast: ForecastDay[];
  unitSystem: 'metric' | 'imperial';
}

const ForecastCard = ({ forecast, unitSystem }: ForecastCardProps) => {
  // Get the appropriate icon component
  const getIcon = (code: number) => {
    const iconName = getWeatherIcon(code, true);
    
    switch(iconName) {
      case "sun": return <Sun className="h-8 w-8 text-yellow-400" />;
      case "cloud": return <Cloud className="h-8 w-8 text-gray-400" />;
      case "cloud-sun": return <CloudSun className="h-8 w-8 text-amber-400" />;
      case "cloud-rain": 
      case "cloud-sun-rain": return <CloudRain className="h-8 w-8 text-blue-500" />;
      case "cloud-snow": return <CloudSnow className="h-8 w-8 text-blue-300" />;
      case "cloud-lightning": return <CloudLightning className="h-8 w-8 text-amber-500" />;
      default: return <CloudSun className="h-8 w-8 text-amber-400" />;
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

  // Format date to month/day format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">7-Day Forecast</h3>
        
        <div className="space-y-3">
          {forecast.map((day, index) => {
            // Get temperature values based on unit system
            const maxTemp = unitSystem === 'metric' ? 
              Math.round(day.day.maxtemp_c) : 
              Math.round(day.day.maxtemp_f);
              
            const minTemp = unitSystem === 'metric' ? 
              Math.round(day.day.mintemp_c) : 
              Math.round(day.day.mintemp_f);
              
            const tempUnit = unitSystem === 'metric' ? '°C' : '°F';
            
            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">{formatDay(day.date)}</span>
                  <span className="text-xs text-gray-500">{formatDate(day.date)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getIcon(day.day.condition.code)}
                  <span className="text-sm text-gray-600 hidden md:inline">{day.day.condition.text}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">High</span>
                    <span className="text-gray-800 font-medium">{maxTemp}{tempUnit}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">Low</span>
                    <span className="text-gray-600">{minTemp}{tempUnit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
