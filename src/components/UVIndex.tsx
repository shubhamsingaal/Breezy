
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { Sun, ShieldAlert } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface UVIndexProps {
  uvIndex: number;
}

const UVIndex = ({ uvIndex }: UVIndexProps) => {
  const { theme } = useTheme();

  // Get UV index category
  const getUVCategory = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'bg-green-500', textColor: 'text-green-500', advice: 'No protection needed. You can safely stay outside.' };
    if (uv <= 5) return { label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-500', advice: 'Seek shade during midday hours. Wear sun protection.' };
    if (uv <= 7) return { label: 'High', color: 'bg-orange-500', textColor: 'text-orange-500', advice: 'Reduce time in the sun between 10 a.m. and 4 p.m. Cover up, wear a hat and sunglasses.' };
    if (uv <= 10) return { label: 'Very High', color: 'bg-red-500', textColor: 'text-red-500', advice: 'Take extra precautions. Unprotected skin can burn quickly.' };
    return { label: 'Extreme', color: 'bg-purple-500', textColor: 'text-purple-500', advice: 'Take all precautions. Unprotected skin can burn in minutes.' };
  };

  const uvCategory = getUVCategory(uvIndex);
  const progressValue = Math.min(100, (uvIndex / 11) * 100);

  return (
    <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'} shadow-md transition-all duration-300 hover:shadow-lg animate-slide-up`} style={{ animationDelay: "300ms" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Sun className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
          UV Index
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-1">
            <span className={`font-medium text-2xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              {uvIndex}
            </span>
            <span className={`text-sm font-medium ${uvCategory.textColor}`}>{uvCategory.label}</span>
          </div>
          
          <Progress value={progressValue} className="h-2" 
            style={{ 
              background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '--progress-background': uvCategory.color
            } as React.CSSProperties} 
          />
          
          <div className="flex items-center pt-2">
            <ShieldAlert className={`h-4 w-4 mr-2 flex-shrink-0 ${uvCategory.textColor}`} />
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {uvCategory.advice}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UVIndex;
