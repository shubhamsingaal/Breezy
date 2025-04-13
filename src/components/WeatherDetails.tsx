
import { CurrentWeather } from "../types/weather";
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
      icon: <Thermometer className="h-5 w-5 text-blue-500" />,
      label: "Feels Like",
      value: feelsLike
    },
    {
      icon: <Wind className="h-5 w-5 text-blue-500" />,
      label: "Wind",
      value: windSpeed
    },
    {
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      label: "Humidity",
      value: `${current.humidity}%`
    },
    {
      icon: <CloudRain className="h-5 w-5 text-blue-500" />,
      label: "Precipitation",
      value: precip
    },
    {
      icon: <Gauge className="h-5 w-5 text-blue-500" />,
      label: "Pressure",
      value: pressure
    },
    {
      icon: <Eye className="h-5 w-5 text-blue-500" />,
      label: "Visibility",
      value: visibility
    },
    {
      icon: <Sun className="h-5 w-5 text-yellow-500" />,
      label: "UV Index",
      value: current.uv.toString()
    },
    {
      icon: <Wind className="h-5 w-5 text-blue-500" />,
      label: "Wind Gust",
      value: gust
    }
  ];

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Weather Details</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {detailItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-blue-50 hover:shadow-sm transition-shadow">
              <div className="bg-white p-2 rounded-full mb-2 shadow-sm">
                {item.icon}
              </div>
              <span className="text-xs text-gray-500">{item.label}</span>
              <span className="font-medium text-gray-700">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDetails;
