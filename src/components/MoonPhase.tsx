
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { Moon } from 'lucide-react';
import { AstroData } from '../types/weather';

interface MoonPhaseProps {
  astroData: AstroData;
}

const MoonPhase = ({ astroData }: MoonPhaseProps) => {
  const { theme } = useTheme();
  const { moon_phase, moon_illumination } = astroData;
  
  // Helper function to get moon phase icon
  const getMoonPhaseIcon = () => {
    switch (moon_phase.toLowerCase()) {
      case 'new moon':
        return '🌑';
      case 'waxing crescent':
        return '🌒';
      case 'first quarter':
        return '🌓';
      case 'waxing gibbous':
        return '🌔';
      case 'full moon':
        return '🌕';
      case 'waning gibbous':
        return '🌖';
      case 'last quarter':
        return '🌗';
      case 'waning crescent':
        return '🌘';
      default:
        return '🌕';
    }
  };

  // Get description for the moon phase
  const getMoonPhaseDescription = () => {
    switch (moon_phase.toLowerCase()) {
      case 'new moon':
        return 'The moon is not visible from Earth as it is located between the Earth and Sun.';
      case 'waxing crescent':
        return 'A small part of the moon becomes visible as it starts to move away from the Sun.';
      case 'first quarter':
        return 'Half of the moon is visible as it continues to move away from the Sun.';
      case 'waxing gibbous':
        return 'More than half of the moon becomes visible as it approaches full moon.';
      case 'full moon':
        return 'The entire face of the moon is visible from Earth, appearing as a complete circle.';
      case 'waning gibbous':
        return 'The visible part of the moon starts to decrease after the full moon.';
      case 'last quarter':
        return 'Half of the moon is visible as it continues to decrease.';
      case 'waning crescent':
        return 'A small crescent of the moon is visible as it approaches the new moon phase.';
      default:
        return 'Moon phase information not available.';
    }
  };
  
  return (
    <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'} shadow-md transition-all duration-500 hover:shadow-lg hover-lift animate-slide-up`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Moon className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
          Moon Phase
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center mb-4">
          <div className={`text-6xl mb-2 ${theme === 'dark' ? 'animate-glow' : ''} animate-float`}>
            {getMoonPhaseIcon()}
          </div>
          <h3 className="text-lg font-medium">{moon_phase}</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Illumination: {moon_illumination}%
          </p>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4 transition-all duration-500">
          <div 
            className="bg-blue-500 h-2.5 rounded-full animate-pulse-slow transition-all duration-1000" 
            style={{ width: `${parseInt(moon_illumination)}%` }}
          ></div>
        </div>
        
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-center transition-all duration-500`}>
          {getMoonPhaseDescription()}
        </p>
      </CardContent>
    </Card>
  );
};

export default MoonPhase;
