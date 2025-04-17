
import React from 'react';
import { CloudLightning, Heart } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`mt-12 mb-6 flex flex-col items-center justify-center text-center ${
      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
    } transition-colors duration-300 space-y-2`}>
      <div className="flex items-center gap-1">
        <CloudLightning className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">Breezy</span>
      </div>
      
      <div className="flex flex-col items-center space-y-1">
        <div className="flex items-center gap-1 text-xs">
          <span>Made with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          <span>by</span>
        </div>
        <span className="text-sm font-medium">shubhamsingaal</span>
      </div>
      
      <div className="text-xs mt-2">
        Powered by WeatherAPI & OpenWeatherMap | © {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;
