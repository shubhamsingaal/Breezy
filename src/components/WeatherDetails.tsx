
import { CurrentWeather } from "../types/weather";
import { useTheme } from "@/hooks/use-theme";
import { 
  CloudRain, Droplets, Gauge, Thermometer, 
  Umbrella, Wind, Sun, Eye 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherDetailsProps {
  current: CurrentWeather;
  unitSystem: 'metric' | 'imperial';
}

const WeatherDetails = ({ current, unitSystem }: WeatherDetailsProps) => {
  const { theme } = useTheme();
  
  // Convert values based on unit system
  const feelsLike = unitSystem === 'metric' ? 
    `${Math.round(current.feelslike_c)}°C` : 
    `${Math.round(current.feelslike_f)}°F`;
    
  const windSpeed = unitSystem === 'metric' ? 
    `${current.wind_kph} km/h` : 
    `${current.wind_mph} mph`;
    
  const visibility = unitSystem === 'metric' ? 
    `${current.vis_km} km` : 
    `${current.vis_miles} mi`;
    
  const pressure = unitSystem === 'metric' ? 
    `${current.pressure_mb} mb` : 
    `${current.pressure_in} inHg`;
    
  const precip = unitSystem === 'metric' ? 
    `${current.precip_mm} mm` : 
    `${current.precip_in} in`;
    
  const gust = unitSystem === 'metric' ? 
    `${current.gust_kph} km/h` : 
    `${current.gust_mph} mph`;

  const detailItems = [
    {
      icon: <Thermometer className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />,
      label: "Feels Like",
      value: feelsLike
    },
    {
      icon: <Wind className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />,
      label: "Wind",
      value: windSpeed
    },
    {
      icon: <Droplets className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />,
      label: "Humidity",
      value: `${current.humidity}%`
    },
    {
      icon: <CloudRain className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />,
      label: "Precipitation",
      value: precip
    },
    {
      icon: <Gauge className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />,
      label: "Pressure",
      value: pressure
    },
    {
      icon: <Eye className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />,
      label: "Visibility",
      value: visibility
    },
    {
      icon: <Sun className={`h-5 w-5 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-500'}`} />,
      label: "UV Index",
      value: current.uv.toString()
    },
    {
      icon: <Wind className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />,
      label: "Wind Gust",
      value: gust
    }
  ];

  return (
    <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'} shadow-md transition-colors duration-300`}>
      <CardContent className="p-6">
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Weather Details</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {detailItems.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center p-3 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-700 to-slate-800 hover:shadow-slate-700/20' 
                  : 'bg-gradient-to-br from-gray-50 to-blue-50 hover:shadow-sm'
              } transition-all duration-300 hover:scale-[1.02] animate-pop`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`${theme === 'dark' ? 'bg-slate-600' : 'bg-white'} p-2 rounded-full mb-2 shadow-sm transition-colors duration-300`}>
                {item.icon}
              </div>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDetails;
