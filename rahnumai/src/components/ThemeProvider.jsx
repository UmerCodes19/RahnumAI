import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    }
    return "light";
  });

  // Performance optimization: Debounce theme changes
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("theme", theme);
      const root = document.documentElement;
      
      if (theme === "dark") {
        root.classList.add("dark");
        root.style.setProperty('color-scheme', 'dark');
      } else {
        root.classList.remove("dark");
        root.style.setProperty('color-scheme', 'light');
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const value = {
    theme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeGlobal() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeGlobal must be used within a ThemeProvider");
  }
  return context;
}