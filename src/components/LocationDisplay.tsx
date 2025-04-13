
import { MapPin } from "lucide-react";
import { Location } from "../types/weather";

interface LocationDisplayProps {
  location: Location;
}

const LocationDisplay = ({ location }: LocationDisplayProps) => {
  const { name, region, country } = location;
  
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

  return (
    <div className="flex flex-col mb-4 animate-fade-in">
      <div className="flex items-center">
        <MapPin className="h-6 w-6 text-weather-blue mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">
          {name}
          {region && `, ${region}`}
        </h1>
      </div>
      <div className="text-gray-600 ml-8">
        <p>{country}</p>
        <p className="text-sm">{formattedDate} | {formattedTime}</p>
      </div>
    </div>
  );
};

export default LocationDisplay;
