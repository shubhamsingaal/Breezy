
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { Sunrise, Sunset, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AstroData } from '../types/weather';

interface SunriseSunsetProps {
  astroData: AstroData;
  localTime: string;
}

const SunriseSunset = ({ astroData, localTime }: SunriseSunsetProps) => {
  const { theme } = useTheme();
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [nextEvent, setNextEvent] = useState<'sunrise' | 'sunset'>('sunrise');
  
  // Format time string to get hours and minutes
  const formatTimeToDate = (timeStr: string, dateStr: string): Date => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    
    let hour = parseInt(hours, 10);
    if (modifier === 'PM' && hour < 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;
    
    const date = new Date(dateStr);
    date.setHours(hour);
    date.setMinutes(parseInt(minutes, 10));
    
    return date;
  };
  
  // Calculate time remaining until next sunrise or sunset
  useEffect(() => {
    const updateTimeRemaining = () => {
      try {
        const now = new Date(localTime);
        const today = now.toISOString().split('T')[0];
        
        const sunriseTime = formatTimeToDate(astroData.sunrise, today);
        const sunsetTime = formatTimeToDate(astroData.sunset, today);
        
        let targetTime: Date;
        let eventType: 'sunrise' | 'sunset';
        
        // Determine if sunrise or sunset is next
        if (now < sunriseTime) {
          targetTime = sunriseTime;
          eventType = 'sunrise';
        } else if (now < sunsetTime) {
          targetTime = sunsetTime;
          eventType = 'sunset';
        } else {
          // Both sunrise and sunset have passed for today, show time until tomorrow's sunrise
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];
          targetTime = formatTimeToDate(astroData.sunrise, tomorrowStr);
          eventType = 'sunrise';
        }
        
        setNextEvent(eventType);
        
        // Calculate difference
        const diffMs = targetTime.getTime() - now.getTime();
        if (diffMs <= 0) {
          setTimeRemaining("Now");
          return;
        }
        
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        
        setTimeRemaining(`${diffHrs}h ${diffMins}m`);
      } catch (error) {
        console.error("Error calculating time remaining:", error);
        setTimeRemaining("--");
      }
    };
    
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [astroData, localTime]);
  
  return (
    <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'} shadow-md transition-all duration-300 hover:shadow-lg animate-slide-up`} style={{ animationDelay: "200ms" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {nextEvent === 'sunrise' ? (
            <Sunrise className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
          ) : (
            <Sunset className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`} />
          )}
          Sun & Moon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className={`flex flex-col items-center p-3 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
              : 'bg-gradient-to-br from-amber-50 to-orange-50'
          } transition-all duration-300`}>
            <div className="flex items-center mb-1">
              <Sunrise className={`h-6 w-6 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'} animate-pulse-slow`} />
            </div>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Sunrise</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{astroData.sunrise}</span>
            
            {nextEvent === 'sunrise' && (
              <div className={`mt-1 text-xs ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'} animate-pulse`}>
                In {timeRemaining}
              </div>
            )}
          </div>
          
          <div className={`flex flex-col items-center p-3 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
              : 'bg-gradient-to-br from-amber-50 to-orange-50'
          } transition-all duration-300`}>
            <div className="flex items-center mb-1">
              <Sunset className={`h-6 w-6 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'} animate-pulse-slow`} />
            </div>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Sunset</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{astroData.sunset}</span>
            
            {nextEvent === 'sunset' && (
              <div className={`mt-1 text-xs ${theme === 'dark' ? 'text-orange-300' : 'text-orange-600'} animate-pulse`}>
                In {timeRemaining}
              </div>
            )}
          </div>
          
          <div className={`flex flex-col items-center p-3 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-50'
          } transition-all duration-300 col-span-2`}>
            <div className="flex items-center mb-1">
              <Moon className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-500'} animate-pulse-slow`} />
            </div>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Moon Phase</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{astroData.moon_phase}</span>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              {astroData.is_moon_up ? "Moon is up" : "Moon is down"} • Illumination: {astroData.moon_illumination}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SunriseSunset;
