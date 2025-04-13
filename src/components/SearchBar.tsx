
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Locate, History, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchBarProps {
  onSearch: (location: string) => void;
  isLoading?: boolean;
  onDetectLocation: () => void;
}

const SearchBar = ({ onSearch, isLoading = false, onDetectLocation }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("city");
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : ["San Francisco", "New York", "London"];
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Add to search history if not already included
      if (!searchHistory.includes(query)) {
        const updatedHistory = [query, ...searchHistory].slice(0, 5);
        setSearchHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      }
      onSearch(query);
    } else {
      toast({
        title: "Search Error",
        description: "Please enter a location to search",
        variant: "destructive",
      });
    }
  };

  const handleSelectHistory = (item: string) => {
    setQuery(item);
    onSearch(item);
    setShowHistory(false);
  };

  const handleClearInput = () => {
    setQuery("");
  };

  const handleGeolocate = () => {
    onDetectLocation();
    setShowHistory(false);
  };

  return (
    <div className="w-full max-w-lg relative">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search city or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 pr-8"
            disabled={isLoading}
            onFocus={() => setShowHistory(true)}
          />
          {query && (
            <button
              type="button"
              onClick={handleClearInput}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select
          value={searchFilter}
          onValueChange={setSearchFilter}
        >
          <SelectTrigger className="w-28 h-10">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="city">City</SelectItem>
            <SelectItem value="postcode">Postcode</SelectItem>
            <SelectItem value="ip">IP Address</SelectItem>
            <SelectItem value="coords">Coordinates</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" size="icon" className="h-10 w-10" disabled={isLoading}>
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={handleGeolocate}
          disabled={isLoading}
          title="Use my current location"
        >
          <Locate className="h-4 w-4" />
        </Button>
      </form>

      {/* Recent searches */}
      {showHistory && searchHistory.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-100 animate-fade-in">
          <Command>
            <CommandInput placeholder="Search history..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Recent Searches">
                {searchHistory.map((item, index) => (
                  <CommandItem 
                    key={index} 
                    onSelect={() => handleSelectHistory(item)}
                    className="flex items-center cursor-pointer"
                  >
                    <History className="h-4 w-4 mr-2 text-gray-400" />
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
