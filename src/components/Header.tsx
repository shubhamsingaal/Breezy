
import React from 'react';
import { CloudLightning, Wind } from 'lucide-react';
import UserProfile from './auth/UserProfile';
import { useTheme } from '@/hooks/use-theme';

const Header = () => {
  const { theme } = useTheme();
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${
      theme === 'dark' ? 'bg-slate-900/90 border-b border-slate-700' : 'bg-white/90 border-b'
    } backdrop-blur-sm px-4 py-2 animate-fade-in transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo & App Name */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 p-1.5 rounded-lg">
            <CloudLightning className="h-6 w-6 text-white" />
            <Wind className="h-5 w-5 text-white" />
          </div>
          <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>
            Breezy
          </span>
          <span className={`text-sm hidden sm:inline-block ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
            Weather
          </span>
        </div>
        
        {/* User Authentication */}
        <UserProfile />
      </div>
    </header>
  );
};

export default Header;
