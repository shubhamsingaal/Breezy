
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { Wind, AlertTriangle, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AirQualityProps {
  aqi?: number; // Air Quality Index
}

const AirQuality = ({ aqi = 35 }: AirQualityProps) => {
  const { theme } = useTheme();

  // Calculate air quality category based on AQI value
  const getAirQualityCategory = (value: number) => {
    if (value <= 50) return { label: 'Good', color: 'bg-green-500', textColor: 'text-green-500', icon: <CheckCircle /> };
    if (value <= 100) return { label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-500', icon: <AlertCircle /> };
    if (value <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', textColor: 'text-orange-500', icon: <AlertCircle /> };
    if (value <= 200) return { label: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-500', icon: <AlertTriangle /> };
    if (value <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-500', icon: <AlertTriangle /> };
    return { label: 'Hazardous', color: 'bg-rose-600', textColor: 'text-rose-600', icon: <AlertTriangle /> };
  };

  const airQuality = getAirQualityCategory(aqi);
  const progressValue = Math.min(100, (aqi / 300) * 100);

  return (
    <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'} shadow-md transition-all duration-300 hover:shadow-lg animate-slide-up`} style={{ animationDelay: "100ms" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Wind className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
          Air Quality
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={`font-medium flex items-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              <span className={`mr-2 p-1 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <Activity className={`h-4 w-4 ${airQuality.textColor}`} />
              </span>
              AQI: {aqi}
            </span>
            <span className={`text-sm font-medium ${airQuality.textColor}`}>{airQuality.label}</span>
          </div>
          
          <Progress value={progressValue} className="h-2" 
            style={{ 
              background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '--progress-background': airQuality.color
            } as React.CSSProperties} 
          />
          
          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex justify-between mt-1">
              <span>Good</span>
              <span>Hazardous</span>
            </div>
            <p className="mt-2">
              {aqi <= 50 && "Air quality is good and poses little or no risk."}
              {aqi > 50 && aqi <= 100 && "Air quality is acceptable; however, there may be a risk for some people, particularly those who are unusually sensitive to air pollution."}
              {aqi > 100 && aqi <= 150 && "Members of sensitive groups may experience health effects."}
              {aqi > 150 && aqi <= 200 && "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."}
              {aqi > 200 && aqi <= 300 && "Health alert: everyone may experience more serious health effects."}
              {aqi > 300 && "Health warnings of emergency conditions. The entire population is more likely to be affected."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQuality;
