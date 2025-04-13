
import { CurrentWeather } from "../types/weather";
import { getWeatherIcon } from "../services/weatherService";
import { 
  Cloud, Droplets, Sun, Thermometer, Wind, 
  CloudSun, CloudMoon, CloudRain, CloudSnow, CloudFog, CloudLightning
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";

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
      case "sun": return <Sun className={`h-16 w-16 ${theme === 'dark' ? 'text-yellow-300 animate-pulse-slow' : 'text-yellow-400'}`} />;
      case "moon": return <Sun className={`h-16 w-16 ${theme === 'dark' ? 'text-blue-300 animate-pulse-slow' : 'text-blue-400'}`} />;
      case "cloud": return <Cloud className={`h-16 w-16 ${theme === 'dark' ? 'text-gray-300 animate-float' : 'text-gray-400'}`} />;
      case "cloud-sun": return <CloudSun className={`h-16 w-16 ${theme === 'dark' ? 'text-amber-300 animate-float' : 'text-amber-400'}`} />;
      case "cloud-moon": return <CloudMoon className={`h-16 w-16 ${theme === 'dark' ? 'text-blue-300 animate-float' : 'text-blue-400'}`} />;
      case "cloud-rain": 
      case "cloud-sun-rain":
      case "cloud-moon-rain":
        return <CloudRain className={`h-16 w-16 ${theme === 'dark' ? 'text-blue-400 animate-float' : 'text-blue-500'}`} />;
      case "cloud-snow": return <CloudSnow className={`h-16 w-16 ${theme === 'dark' ? 'text-blue-200 animate-float' : 'text-blue-300'}`} />;
      case "cloud-fog": return <CloudFog className={`h-16 w-16 ${theme === 'dark' ? 'text-gray-300 animate-float' : 'text-gray-400'}`} />;
      case "cloud-lightning": return <CloudLightning className={`h-16 w-16 ${theme === 'dark' ? 'text-amber-400 animate-float' : 'text-amber-500'}`} />;
      default: return <CloudSun className={`h-16 w-16 ${theme === 'dark' ? 'text-amber-300 animate-float' : 'text-amber-400'}`} />;
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
    <Card className={`overflow-hidden ${theme === 'dark' 
      ? 'bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl border-slate-700' 
      : 'bg-gradient-to-br from-white to-blue-50 shadow-lg'} transition-all duration-300 hover:scale-[1.01]`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>{temperature}{temperatureUnit}</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-1 transition-colors duration-300`}>{current.condition.text}</p>
          </div>
          <div className={`${theme === 'dark' ? 'bg-slate-700/50' : 'bg-primary/10'} p-3 rounded-full transition-colors duration-300`}>
            {getIcon()}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
          <div className={`flex flex-col items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-blue-50'} transition-colors duration-300 animate-pop`} style={{ animationDelay: "100ms" }}>
            <Thermometer className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mb-1 transition-colors duration-300`} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Feels like</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>{feelsLike}{temperatureUnit}</span>
          </div>
          
          <div className={`flex flex-col items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-blue-50'} transition-colors duration-300 animate-pop`} style={{ animationDelay: "200ms" }}>
            <Wind className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mb-1 transition-colors duration-300`} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Wind</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>{windSpeed}</span>
          </div>
          
          <div className={`flex flex-col items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-blue-50'} transition-colors duration-300 animate-pop`} style={{ animationDelay: "300ms" }}>
            <Droplets className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mb-1 transition-colors duration-300`} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Humidity</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300`}>{current.humidity}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
