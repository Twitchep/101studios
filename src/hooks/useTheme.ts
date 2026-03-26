import { useState, useEffect } from "react";

export const allThemes = [
  "light",
  "dark",
] as const;

export type Theme = (typeof allThemes)[number];

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme;
      if (saved && allThemes.includes(saved)) {
        return saved;
      }
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...allThemes);
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return {
    theme,
    isDark: theme === "dark",
    setTheme,
    themes: allThemes,
  };
}
