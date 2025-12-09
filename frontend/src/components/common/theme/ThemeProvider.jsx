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

  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    // Get user role from localStorage
    const storedRole = localStorage.getItem('userRole') || 'student';
    setUserRole(storedRole);
  }, []);

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

      // Set role class for role-based styling
      root.classList.remove('role-student', 'role-faculty', 'role-admin');
      root.classList.add(`role-${userRole}`);
    }, 50);

    return () => clearTimeout(timer);
  }, [theme, userRole]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const getRoleColor = () => {
    const colors = {
      student: '#f39c12',
      faculty: '#8311f2',
      admin: '#f21311'
    };
    return colors[userRole] || colors.student;
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    userRole,
    setUserRole,
    roleColor: getRoleColor()
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