
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem("dms-theme") as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // Auto switch based on time of day
      const currentHour = new Date().getHours();
      const isDark = currentHour < 6 || currentHour >= 18; // Dark from 6 PM to 6 AM
      setTheme(isDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("dms-theme", isDark ? "dark" : "light");
    }
  }, []);

  const updateTheme = (newTheme: Theme) => {
    localStorage.setItem("dms-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    setTheme(newTheme);
  };

  // Check time and update theme every hour
  useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-update if user hasn't manually set theme
      if (!localStorage.getItem("dms-theme-manual")) {
        const currentHour = new Date().getHours();
        const shouldBeDark = currentHour < 6 || currentHour >= 18;
        
        if ((shouldBeDark && theme === "light") || (!shouldBeDark && theme === "dark")) {
          updateTheme(shouldBeDark ? "dark" : "light");
        }
      }
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(interval);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
