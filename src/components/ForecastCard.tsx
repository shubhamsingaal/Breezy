
import { ForecastDay } from "../types/weather";
import { getWeatherIcon } from "../services/weatherService";
import { useTheme } from "@/hooks/use-theme";
import { 
  Cloud, CloudLightning, CloudRain, CloudSnow, Sun, CloudSun 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ForecastCardProps {
  forecast: ForecastDay[];
  unitSystem: 'metric' | 'imperial';
}

const ForecastCard = ({ forecast, unitSystem }: ForecastCardProps) => {
  const { theme } = useTheme();
  
  // Get the appropriate icon component
  const getIcon = (code: number) => {
    const iconName = getWeatherIcon(code, true);
    
    switch(iconName) {
      case "sun": return <Sun className={`h-8 w-8 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-400'}`} />;
      case "cloud": return <Cloud className={`h-8 w-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`} />;
      case "cloud-sun": return <CloudSun className={`h-8 w-8 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-400'}`} />;
      case "cloud-rain": 
      case "cloud-sun-rain": return <CloudRain className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />;
      case "cloud-snow": return <CloudSnow className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-300'}`} />;
      case "cloud-lightning": return <CloudLightning className={`h-8 w-8 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />;
      default: return <CloudSun className={`h-8 w-8 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-400'}`} />;
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
    <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'} shadow-md transition-colors duration-300`}>
      <CardContent className="p-6">
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>7-Day Forecast</h3>
        
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
                className={`flex items-center justify-between p-3 rounded-lg ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-700/50' 
                    : 'hover:bg-blue-50'
                } transition-colors duration-300 animate-slide-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col">
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{formatDay(day.date)}</span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(day.date)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getIcon(day.day.condition.code)}
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hidden md:inline`}>{day.day.condition.text}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>High</span>
                    <span className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} font-medium`}>{maxTemp}{tempUnit}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Low</span>
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{minTemp}{tempUnit}</span>
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
