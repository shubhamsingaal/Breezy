
import { MapPin, Clock, Globe } from "lucide-react";
import { Location } from "../types/weather";

interface LocationDisplayProps {
  location: Location;
}

const LocationDisplay = ({ location }: LocationDisplayProps) => {
  const { name, region, country, lat, lon } = location;
  
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
        <div className="bg-primary/10 p-2.5 rounded-full mr-3">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            {name}
            {region && `, ${region}`}
          </h1>
          <div className="flex items-center gap-1 text-gray-600">
            <Globe className="h-4 w-4" />
            <p>{country} • {lat.toFixed(2)}°N, {lon.toFixed(2)}°E</p>
          </div>
        </div>
      </div>
      <div className="flex items-center mt-2 ml-14 text-sm text-gray-600">
        <Clock className="h-4 w-4 mr-1" />
        <span>{formattedDate} | {formattedTime} ({timeZoneName})</span>
      </div>
    </div>
  );
};

export default LocationDisplay;
