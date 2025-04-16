
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthChange, 
  getCurrentUser, 
  loginUser, 
  registerUser, 
  logoutUser,
  signInWithGoogle,
  getUserFavorites,
  saveUserFavorites,
  addToFavorites as addFavorite,
  removeFromFavorites as removeFavorite,
  getUserSettings,
  saveUserSettings as updateUserSettings
} from '../services/firebaseService';
import { User } from 'firebase/auth';
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  favorites: string[];
  settings: {
    unitSystem?: 'metric' | 'imperial';
    theme?: 'light' | 'dark';
    notificationEnabled?: boolean;
    email?: string;
  };
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  addToFavorites: (location: string) => Promise<boolean>;
  removeFromFavorites: (location: string) => Promise<boolean>;
  saveUserSettings: (settings: {
    unitSystem?: 'metric' | 'imperial';
    theme?: 'light' | 'dark';
    notificationEnabled?: boolean;
    email?: string;
  }) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  favorites: [],
  settings: {},
  login: async () => false,
  register: async () => false,
  logout: async () => false,
  signInWithGoogle: async () => false,
  addToFavorites: async () => false,
  removeFromFavorites: async () => false,
  saveUserSettings: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [settings, setSettings] = useState<{
    unitSystem?: 'metric' | 'imperial';
    theme?: 'light' | 'dark';
    notificationEnabled?: boolean;
    email?: string;
  }>({});

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setLoading(true);
      setUser(authUser);
      
      if (authUser) {
        // Load user data from Firestore
        const userFavorites = await getUserFavorites(authUser.uid);
        setFavorites(userFavorites);
        
        const userSettings = await getUserSettings(authUser.uid);
        setSettings(userSettings);
      } else {
        // Reset when logged out
        setFavorites([]);
        setSettings({});
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginUser(email, password);
      toast.success("Logged in successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      await registerUser(email, password);
      toast.success("Account created successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      return false;
    }
  };

  const googleSignIn = async (): Promise<boolean> => {
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
      return false;
    }
  };

  const addToFavorites = async (location: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newFavorites = [...favorites, location];
      const success = await addFavorite(user.uid, location);
      
      if (success) {
        setFavorites(newFavorites);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      return false;
    }
  };

  const removeFromFavorites = async (location: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newFavorites = favorites.filter(fav => fav !== location);
      const success = await removeFavorite(user.uid, location);
      
      if (success) {
        setFavorites(newFavorites);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      return false;
    }
  };

  const saveUserSettings = async (newSettings: {
    unitSystem?: 'metric' | 'imperial';
    theme?: 'light' | 'dark';
    notificationEnabled?: boolean;
    email?: string;
  }): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedSettings = { ...settings, ...newSettings };
      const success = await updateUserSettings(user.uid, updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving settings:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      favorites,
      settings,
      login,
      register,
      logout,
      signInWithGoogle: googleSignIn,
      addToFavorites,
      removeFromFavorites,
      saveUserSettings,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
