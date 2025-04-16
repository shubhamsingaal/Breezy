
import { useTheme } from "@/hooks/use-theme";
import { Heart, Github, Cloud } from 'lucide-react';

const Footer = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`py-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} animate-fade-in`} style={{ animationDelay: "400ms" }}>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span>Made with</span>
          <Heart className={`h-4 w-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'} animate-pulse`} />
          <span>by</span>
          <a 
            href="https://github.com/shubhamsingaal/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors duration-300 hover:underline`}
          >
            <span>shubhamsingaal</span>
            <Github className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-2 flex items-center justify-center flex-wrap gap-x-2 text-xs opacity-70">
          <span>Powered by</span>
          <div className="flex items-center">
            <span>WeatherAPI</span>
            <Cloud className="h-3 w-3 mx-1" />
            <span>OpenWeatherMap</span>
          </div>
          <span>|</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
