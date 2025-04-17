
import { CurrentWeather } from "../types/weather";
import { getWeatherIcon } from "../services/weatherService";
import { 
  Cloud, Droplets, Sun, Thermometer, Wind, 
  CloudSun, CloudMoon, CloudRain, CloudSnow, CloudFog, CloudLightning
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { Badge } from "@/components/ui/badge";

interface WeatherCardProps {
  current: CurrentWeather;
  unitSystem: 'metric' | 'imperial';
}

const WeatherCard = ({ current, unitSystem }: WeatherCardProps) => {
  const { theme } = useTheme();
  const iconName = getWeatherIcon(current.condition.code, !!current.is_day);
  
  // Get the appropriate icon component
  const getIcon = () => {
    switch(iconName) {
      case "sun": return <Sun className={`h-20 w-20 ${theme === 'dark' ? 'text-yellow-300 animate-pulse-slow' : 'text-yellow-400'}`} />;
      case "moon": return <Sun className={`h-20 w-20 ${theme === 'dark' ? 'text-blue-300 animate-pulse-slow' : 'text-blue-400'}`} />;
      case "cloud": return <Cloud className={`h-20 w-20 ${theme === 'dark' ? 'text-gray-300 animate-float' : 'text-gray-400'}`} />;
      case "cloud-sun": return <CloudSun className={`h-20 w-20 ${theme === 'dark' ? 'text-amber-300 animate-float' : 'text-amber-400'}`} />;
      case "cloud-moon": return <CloudMoon className={`h-20 w-20 ${theme === 'dark' ? 'text-blue-300 animate-float' : 'text-blue-400'}`} />;
      case "cloud-rain": 
      case "cloud-sun-rain":
      case "cloud-moon-rain":
        return <CloudRain className={`h-20 w-20 ${theme === 'dark' ? 'text-blue-400 animate-float' : 'text-blue-500'}`} />;
      case "cloud-snow": return <CloudSnow className={`h-20 w-20 ${theme === 'dark' ? 'text-blue-200 animate-float' : 'text-blue-300'}`} />;
      case "cloud-fog": return <CloudFog className={`h-20 w-20 ${theme === 'dark' ? 'text-gray-300 animate-float' : 'text-gray-400'}`} />;
      case "cloud-lightning": return <CloudLightning className={`h-20 w-20 ${theme === 'dark' ? 'text-amber-400 animate-float' : 'text-amber-500'}`} />;
      default: return <CloudSun className={`h-20 w-20 ${theme === 'dark' ? 'text-amber-300 animate-float' : 'text-amber-400'}`} />;
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
    <Card className={`overflow-hidden backdrop-blur-md ${theme === 'dark' 
      ? 'bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 shadow-xl border-slate-700' 
      : 'bg-gradient-to-br from-white/90 to-blue-50/90 shadow-lg border-blue-100'} transition-all duration-300 hover:shadow-2xl`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <h2 className={`text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
                {temperature}<span className="text-4xl">{temperatureUnit}</span>
              </h2>
              <Badge variant={theme === 'dark' ? 'outline' : 'secondary'} className="h-fit text-xs px-2 py-0">
                {current.condition.text}
              </Badge>
            </div>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2 text-sm transition-colors duration-300`}>
              Feels like {feelsLike}{temperatureUnit}
            </p>
          </div>

          <div className={`${theme === 'dark' ? 'bg-slate-700/30' : 'bg-blue-100/50'} p-4 rounded-full transition-all duration-300 shadow-inner`}>
            {getIcon()}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-8 text-sm">
          <div className={`flex flex-col items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/30' : 'bg-blue-100/50'} transition-colors duration-300 animate-pop shadow-inner`} style={{ animationDelay: "100ms" }}>
            <Thermometer className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mb-2 transition-colors duration-300`} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Feels like</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>{feelsLike}{temperatureUnit}</span>
          </div>
          
          <div className={`flex flex-col items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/30' : 'bg-blue-100/50'} transition-colors duration-300 animate-pop shadow-inner`} style={{ animationDelay: "200ms" }}>
            <Wind className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mb-2 transition-colors duration-300`} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Wind</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>{windSpeed}</span>
          </div>
          
          <div className={`flex flex-col items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/30' : 'bg-blue-100/50'} transition-colors duration-300 animate-pop shadow-inner`} style={{ animationDelay: "300ms" }}>
            <Droplets className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mb-2 transition-colors duration-300`} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Humidity</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>{current.humidity}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
