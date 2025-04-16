
import { useEffect, useState } from 'react';
import { CloudLightning, Wind } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 20, 100));
      } else {
        setTimeout(() => {
          onFinish();
        }, 500);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [progress, onFinish]);

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-white'
    } z-50`}>
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative flex items-center gap-1">
          <div className="animate-bounce-gentle">
            <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg">
              <CloudLightning className="h-12 w-12 text-white" />
              <Wind className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
        <h1 className={`text-4xl font-bold mt-4 ${theme === 'dark' ? 'text-white' : ''}`}>
          Breezy
        </h1>
        <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
          Your personal weather companion
        </p>
        
        <div className="w-64 h-1.5 bg-gray-200 rounded-full mt-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
