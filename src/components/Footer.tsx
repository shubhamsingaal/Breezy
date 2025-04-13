
import { useTheme } from "@/hooks/use-theme";
import { Heart, Github } from 'lucide-react';

const Footer = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`py-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} animate-fade-in`} style={{ animationDelay: "400ms" }}>
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
      <div className="mt-2 text-xs opacity-70">
        Powered by WeatherAPI | © {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;
