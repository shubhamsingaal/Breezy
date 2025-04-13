
import { CurrentWeather } from "../types/weather";
import { 
  CloudRain, Droplets, Gauge, Thermometer, 
  Umbrella, Wind, Sun, Eye 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherDetailsProps {
  current: CurrentWeather;
}

const WeatherDetails = ({ current }: WeatherDetailsProps) => {
  const detailItems = [
    {
      icon: <Thermometer className="h-5 w-5 text-weather-blue" />,
      label: "Feels Like",
      value: `${Math.round(current.feelslike_c)}°C`
    },
    {
      icon: <Wind className="h-5 w-5 text-weather-blue" />,
      label: "Wind",
      value: `${current.wind_kph} km/h`
    },
    {
      icon: <Droplets className="h-5 w-5 text-weather-blue" />,
      label: "Humidity",
      value: `${current.humidity}%`
    },
    {
      icon: <CloudRain className="h-5 w-5 text-weather-blue" />,
      label: "Precipitation",
      value: `${current.precip_mm} mm`
    },
    {
      icon: <Gauge className="h-5 w-5 text-weather-blue" />,
      label: "Pressure",
      value: `${current.pressure_mb} mb`
    },
    {
      icon: <Eye className="h-5 w-5 text-weather-blue" />,
      label: "Visibility",
      value: `${current.vis_km} km`
    },
    {
      icon: <Sun className="h-5 w-5 text-weather-blue" />,
      label: "UV Index",
      value: current.uv.toString()
    },
    {
      icon: <Wind className="h-5 w-5 text-weather-blue" />,
      label: "Wind Gust",
      value: `${current.gust_kph} km/h`
    }
  ];

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Weather Details</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {detailItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
              <div className="mb-2">{item.icon}</div>
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
