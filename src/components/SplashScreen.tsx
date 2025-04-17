
import { useEffect, useState } from 'react';
import { CloudLightning, Wind } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 10, 100));
      } else {
        setFadeOut(true);
        setTimeout(() => {
          onFinish();
        }, 800);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [progress, onFinish]);

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-white'
    } z-50 transition-opacity duration-800 ease-in-out ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="animate-bounce-gentle">
            <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-lg shadow-lg">
              <CloudLightning className="h-14 w-14 text-white" />
              <Wind className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black/5 dark:bg-black/20 rounded-full filter blur-md"></div>
        </div>
        
        <h1 className={`text-5xl font-bold mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text ${theme === 'dark' ? 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.1)]' : 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]'}`}>
          Breezy
        </h1>
        
        <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
          Your personal weather companion
        </p>
        
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-6 overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full absolute top-0 left-0 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
          Loading weather data...
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
