// src/components/ThemeToggle.jsx (Optimized)
import { Moon, Sun } from "lucide-react";
import { useThemeGlobal } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeGlobal();
  const darkMode = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl border backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 ${
        darkMode
          ? 'border-slate-600 bg-slate-800/70 hover:bg-slate-700/70 text-amber-200'
          : 'border-slate-300 bg-white/80 hover:bg-white text-amber-600'
      }`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}