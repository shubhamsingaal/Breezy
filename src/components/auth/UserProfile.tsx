
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { LogOut, Settings, User, Bell, Mail } from 'lucide-react';
import AuthModal from './AuthModal';
import { useTheme } from '@/hooks/use-theme';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const UserProfile = () => {
  const { user, logout, settings, saveUserSettings } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(
    settings.notificationEnabled ?? false
  );
  const { theme } = useTheme();
  
  const handleLogout = async () => {
    await logout();
  };

  const toggleNotifications = async () => {
    const newState = !isNotificationsEnabled;
    setIsNotificationsEnabled(newState);
    await saveUserSettings({ notificationEnabled: newState });
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return (
      <>
        <Button 
          onClick={() => setIsAuthModalOpen(true)}
          variant="outline"
          className={`${theme === 'dark' ? 'border-slate-600 hover:bg-slate-700 text-white' : ''}`}
        >
          <User className="mr-2 h-4 w-4" />
          Sign In
        </Button>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={`relative rounded-full p-0 h-9 w-9 ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
          >
            <Avatar>
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
              <AvatarFallback>
                {user.displayName ? getInitials(user.displayName) : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : ''}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex gap-2 items-center cursor-default">
            <Mail className="h-4 w-4" />
            {user.email}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-default">
            <div className="flex items-center space-x-2">
              <Label htmlFor="notification-toggle" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Weather Alerts
                </div>
              </Label>
              <Switch 
                id="notification-toggle" 
                checked={isNotificationsEnabled}
                onCheckedChange={toggleNotifications}
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 dark:text-red-400 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile;
