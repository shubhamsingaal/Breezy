
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full bg-opacity-20 transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-300 animate-in fade-in duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 animate-in fade-in duration-300" />
      )}
    </Button>
  );
};

export default ThemeToggle;
