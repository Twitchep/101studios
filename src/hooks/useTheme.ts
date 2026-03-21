import { useState, useEffect } from "react";

export type Theme = "light" | "dark" | "christmas" | "halloween" | "newyear" | "easter" | "summer" | "autumn";

function getCurrentEventTheme(): Theme {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  const day = now.getDate();

  // Christmas: December 1-31
  if (month === 12) {
    return "christmas";
  }

  // Halloween: October 15-31
  if (month === 10 && day >= 15) {
    return "halloween";
  }

  // New Year: January 1-15
  if (month === 1 && day <= 15) {
    return "newyear";
  }

  // Easter: March 20-April 15 (approximate)
  if (month === 3 && day >= 20) {
    return "easter";
  }
  if (month === 4 && day <= 15) {
    return "easter";
  }

  // Summer: June-August
  if (month >= 6 && month <= 8) {
    return "summer";
  }

  // Autumn: September-November
  if (month >= 9 && month <= 11) {
    return "autumn";
  }

  // Default to light theme for spring and other times
  return "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme;
      if (saved && ["light", "dark", "christmas", "halloween", "newyear", "easter", "summer", "autumn"].includes(saved)) {
        return saved;
      }
      // Auto-detect event theme on first visit
      return getCurrentEventTheme();
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("light", "dark", "christmas", "halloween", "newyear", "easter", "summer", "autumn");

    // Add current theme class
    root.classList.add(theme);

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const isDark = theme === "dark" || theme === "halloween";

  return {
    theme,
    isDark,
    setTheme: setThemeValue,
    themes: ["light", "dark", "christmas", "halloween", "newyear", "easter", "summer", "autumn"] as const,
    getCurrentEventTheme,
  };
}
