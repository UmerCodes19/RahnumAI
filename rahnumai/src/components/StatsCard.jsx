// src/components/StatsCard.jsx (Optimized for White Mode)
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeGlobal } from "@/components/ThemeProvider";

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'violet', 
  progress, 
  trend,
  animationDelay = 0 
}) => {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced color system for better white mode
  const colorConfig = {
    violet: {
      gradient: 'from-violet-500 to-purple-600',
      light: {
        bg: 'bg-violet-50',
        text: 'text-violet-700',
        border: 'border-violet-200'
      },
      dark: {
        bg: 'bg-violet-900/20',
        text: 'text-violet-400',
        border: 'border-violet-800'
      }
    },
    blue: {
      gradient: 'from-blue-500 to-cyan-600',
      light: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200'
      },
      dark: {
        bg: 'bg-blue-900/20',
        text: 'text-blue-400',
        border: 'border-blue-800'
      }
    },
    green: {
      gradient: 'from-green-500 to-emerald-600',
      light: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200'
      },
      dark: {
        bg: 'bg-green-900/20',
        text: 'text-green-400',
        border: 'border-green-800'
      }
    },
    orange: {
      gradient: 'from-orange-500 to-amber-600',
      light: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200'
      },
      dark: {
        bg: 'bg-orange-900/20',
        text: 'text-orange-400',
        border: 'border-orange-800'
      }
    }
  };

  const currentColor = colorConfig[color] || colorConfig.violet;
  const themeStyles = darkMode ? currentColor.dark : currentColor.light;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-xl p-4 transition-all duration-200 backdrop-blur-sm border ${
        darkMode
          ? 'bg-slate-800/80 border-slate-700'
          : 'bg-white/95 border-slate-200'
      } ${isHovered ? 'shadow-lg' : 'shadow-sm'}`}
      style={{
        transform: `translateY(${isHovered ? '-2px' : '0px'})`,
      }}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-1 ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mb-1 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-sm ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {subtitle}
            </p>
          )}
          
          {progress !== undefined && (
            <div className="mt-3">
              <div className={`flex justify-between text-xs mb-1 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className={`w-full rounded-full h-1.5 ${
                darkMode ? 'bg-slate-700' : 'bg-slate-200'
              }`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-1.5 rounded-full bg-gradient-to-r ${currentColor.gradient}`}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className={`p-2 rounded-lg ${themeStyles.bg} ${themeStyles.border} border`}>
          <Icon className={`w-5 h-5 ${themeStyles.text}`} />
        </div>
      </div>

      {trend && (
        <div className={`mt-3 pt-3 border-t ${
          darkMode ? 'border-slate-700' : 'border-slate-200'
        } relative z-10`}>
          <span className={`text-xs font-medium flex items-center space-x-1 ${
            trend.positive
              ? darkMode ? 'text-green-400' : 'text-green-600'
              : darkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            <span>{trend.positive ? '↗' : '↘'}</span>
            <span>{trend.value} from last month</span>
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;