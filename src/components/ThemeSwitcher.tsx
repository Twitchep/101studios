import { useState } from "react";
import { Palette, ChevronDown, Sparkles } from "lucide-react";
import { useTheme, Theme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themeNames: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  christmas: "Christmas",
  halloween: "Halloween",
  newyear: "New Year",
  easter: "Easter",
  summer: "Summer",
  autumn: "Autumn",
};

const themeEmojis: Record<Theme, string> = {
  light: "☀️",
  dark: "🌙",
  christmas: "🎄",
  halloween: "🎃",
  newyear: "🎉",
  easter: "🐰",
  summer: "🏖️",
  autumn: "🍂",
};

export function ThemeSwitcher() {
  const { theme, setTheme, themes, getCurrentEventTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleAutoDetect = () => {
    const eventTheme = getCurrentEventTheme();
    setTheme(eventTheme);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 px-0"
          aria-label="Switch theme"
        >
          <Palette className="h-4 w-4" />
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handleAutoDetect} className="cursor-pointer">
          <Sparkles className="h-4 w-4 mr-2" />
          Auto-detect Event
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption}
            onClick={() => {
              setTheme(themeOption);
              setIsOpen(false);
            }}
            className={`cursor-pointer ${
              theme === themeOption ? "bg-accent" : ""
            }`}
          >
            <span className="mr-2">{themeEmojis[themeOption]}</span>
            {themeNames[themeOption]}
            {theme === themeOption && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}