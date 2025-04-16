
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { Eye, Gauge } from 'lucide-react';

interface VisibilityInfoProps {
  visibility: number;
  unit: string;
}

const VisibilityInfo = ({ visibility, unit }: VisibilityInfoProps) => {
  const { theme } = useTheme();
  
  // Determine visibility category
  const getVisibilityCategory = () => {
    if (unit === 'km') {
      if (visibility >= 10) return { text: 'Excellent', color: 'text-green-500' };
      if (visibility >= 5) return { text: 'Good', color: 'text-blue-500' };
      if (visibility >= 2) return { text: 'Moderate', color: 'text-yellow-500' };
      if (visibility >= 1) return { text: 'Poor', color: 'text-orange-500' };
      return { text: 'Very Poor', color: 'text-red-500' };
    } else {
      // For miles
      if (visibility >= 6) return { text: 'Excellent', color: 'text-green-500' };
      if (visibility >= 3) return { text: 'Good', color: 'text-blue-500' };
      if (visibility >= 1) return { text: 'Moderate', color: 'text-yellow-500' };
      if (visibility >= 0.5) return { text: 'Poor', color: 'text-orange-500' };
      return { text: 'Very Poor', color: 'text-red-500' };
    }
  };

  const visibilityCategory = getVisibilityCategory();
  
  // Calculate percentage for the gauge (max visibility considered as 20km or 12 miles)
  const maxVisibility = unit === 'km' ? 20 : 12;
  const percentage = Math.min(100, (visibility / maxVisibility) * 100);
  
  return (
    <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'} shadow-md transition-all duration-500 hover:shadow-lg hover-lift animate-slide-up`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Eye className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
          Visibility
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 flex flex-col items-center">
        <div className="flex items-center justify-center mb-3 transition-all">
          <div className="w-32 h-32 relative">
            <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
              <circle 
                cx="60" cy="60" r="54" 
                fill="none" 
                stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} 
                strokeWidth="12"
                className="transition-all duration-500"
              />
              <circle 
                cx="60" cy="60" r="54" 
                fill="none" 
                stroke={
                  visibilityCategory.text === 'Excellent' ? '#22c55e' :
                  visibilityCategory.text === 'Good' ? '#3b82f6' :
                  visibilityCategory.text === 'Moderate' ? '#eab308' :
                  visibilityCategory.text === 'Poor' ? '#f97316' : '#ef4444'
                }
                strokeWidth="12"
                strokeDasharray="339.292"
                strokeDashoffset={339.292 * (1 - percentage/100)}
                strokeLinecap="round"
                className="transition-all duration-1000 animate-pulse-slow"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center transition-all">
              <span className={`text-4xl font-bold ${visibilityCategory.color} animate-bounce-gentle`}>{visibility}</span>
              <span className="text-sm opacity-70">{unit}</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-4 transition-all">
          <p className={`text-lg font-medium ${visibilityCategory.color}`}>
            {visibilityCategory.text} Visibility
          </p>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {visibilityCategory.text === 'Excellent' && 'Clear conditions, perfect visibility'}
            {visibilityCategory.text === 'Good' && 'Good conditions, distant objects visible'}
            {visibilityCategory.text === 'Moderate' && 'Some haze, moderately clear view'}
            {visibilityCategory.text === 'Poor' && 'Significant haze or fog present'}
            {visibilityCategory.text === 'Very Poor' && 'Heavy fog or pollution, limited visibility'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisibilityInfo;
