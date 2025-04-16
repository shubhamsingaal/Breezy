
import { useState, useEffect } from 'react';
import { Heart, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from "sonner";

interface FavLocationsProps {
  favorites: string[];
  currentLocation: string;
  onSelect: (location: string) => void;
  onAdd: () => void;
  onRemove: (location: string) => void;
}

const FavLocations = ({ favorites, currentLocation, onSelect, onAdd, onRemove }: FavLocationsProps) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, favorites: userFavorites, addToFavorites, removeFromFavorites } = useAuth();
  const [displayedFavorites, setDisplayedFavorites] = useState<string[]>(favorites);

  useEffect(() => {
    // If user is logged in, use their saved favorites
    if (user && userFavorites.length > 0) {
      setDisplayedFavorites(userFavorites);
    } else {
      setDisplayedFavorites(favorites);
    }
  }, [user, userFavorites, favorites]);

  const isFavorite = displayedFavorites.includes(currentLocation);

  const handleAddToFavorites = async () => {
    if (user) {
      const success = await addToFavorites(currentLocation);
      if (success) {
        toast.success(`Added ${currentLocation} to favorites`);
      }
    } else {
      onAdd();
    }
  };

  const handleRemoveFromFavorites = async (location: string) => {
    if (user) {
      const success = await removeFromFavorites(location);
      if (success) {
        toast.success(`Removed ${location} from favorites`);
      }
    } else {
      onRemove(location);
    }
  };

  return (
    <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'} shadow-md transition-all duration-300 hover:shadow-lg`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Heart className={`mr-2 h-5 w-5 text-red-500 ${isFavorite ? 'fill-red-500' : ''}`} />
            Favorite Locations
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={isFavorite ? "outline" : "default"} 
              size="sm"
              onClick={handleAddToFavorites}
              disabled={isFavorite}
              className="text-xs flex items-center"
            >
              {isFavorite ? (
                <>
                  <Heart className="h-4 w-4 mr-1 text-red-500 fill-red-500" /> Saved
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" /> Add Current
                </>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 ${isExpanded ? '' : 'max-h-14 overflow-hidden'}`}>
          {displayedFavorites.length === 0 ? (
            <div className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
              No favorite locations saved yet. Add locations to see them here.
            </div>
          ) : (
            displayedFavorites.map((fav) => (
              <Button 
                key={fav} 
                variant={fav === currentLocation ? "default" : "outline"}
                size="sm" 
                className={`text-xs justify-between group ${
                  theme === 'dark' 
                    ? (fav === currentLocation ? '' : 'hover:bg-slate-700') 
                    : ''
                }`}
                onClick={() => onSelect(fav)}
              >
                <span className="truncate mr-2">{fav}</span>
                {fav !== currentLocation && (
                  <Heart 
                    className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-red-500 hover:fill-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromFavorites(fav);
                    }}
                  />
                )}
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavLocations;
