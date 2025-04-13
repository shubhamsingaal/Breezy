
import { MapPin, Clock, Globe } from "lucide-react";
import { Location } from "../types/weather";
import { useTheme } from "@/hooks/use-theme";

interface LocationDisplayProps {
  location: Location;
}

const LocationDisplay = ({ location }: LocationDisplayProps) => {
  const { name, region, country, lat, lon } = location;
  const { theme } = useTheme();
  
  // Format the date and time
  const datetime = new Date(location.localtime);
  const formattedDate = datetime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const formattedTime = datetime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Calculate local time zone name
  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="flex flex-col mb-4 animate-fade-in">
      <div className="flex items-center">
        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-primary/10'} p-2.5 rounded-full mr-3 transition-colors duration-300`}>
          <MapPin className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-primary'}`} />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} flex items-center gap-2 transition-colors duration-300`}>
            {name}
            {region && `, ${region}`}
          </h1>
          <div className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
            <Globe className="h-4 w-4" />
            <p>{country} • {lat.toFixed(2)}°N, {lon.toFixed(2)}°E</p>
          </div>
        </div>
      </div>
      <div className={`flex items-center mt-2 ml-14 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
        <Clock className="h-4 w-4 mr-1" />
        <span>{formattedDate} | {formattedTime} ({timeZoneName})</span>
      </div>
    </div>
  );
};

export default LocationDisplay;
