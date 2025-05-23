
import React from 'react';
import { CloudLightning, Heart, Github } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`mt-12 mb-6 flex flex-col items-center justify-center text-center ${
      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
    } transition-colors duration-300 space-y-3`}>
      <div className="flex items-center gap-1">
        <CloudLightning className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-medium">Breezy</span>
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center gap-1 text-xs">
          <span>Made with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          <span>by</span>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="https://github.com/shubhamsingaal" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text hover:opacity-80 transition-opacity"
          >
            shubhamsingaal
          </a>
          <a
            href="https://github.com/shubhamsingaal" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`rounded-full p-1 ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
            aria-label="GitHub Profile"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
      
      <div className="text-xs mt-2">
        Powered by <span className="font-medium">WeatherAPI</span> & <span className="font-medium">OpenWeatherMap</span> | © {currentYear}
      </div>
    </footer>
  );
};

export default Footer;
