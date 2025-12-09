import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Link, Zap, BarChart3, Code } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

const QuickActions = () => {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  
  const actions = [
    { icon: Search, label: 'Keyword Research', color: 'violet', path: '/tools/keyword-content' },
    { icon: FileText, label: 'Generate FAQ Schema', color: 'blue', path: '/tools/keyword-content' },
    { icon: Link, label: 'Check Redirects', color: 'green', path: '/tools/technical-seo' },
    { icon: Zap, label: 'Page Speed Test', color: 'orange', path: '/tools/technical-seo' },
    { icon: BarChart3, label: 'Create Report', color: 'indigo', path: '/reports' },
    { icon: Code, label: 'Validate Robots.txt', color: 'cyan', path: '/tools/technical-seo' }
  ];

  const colorClasses = {
    violet: 'from-violet-600 to-indigo-500',
    blue: 'from-blue-600 to-cyan-500',
    green: 'from-green-600 to-emerald-500',
    orange: 'from-orange-600 to-red-500',
    indigo: 'from-indigo-600 to-purple-500',
    cyan: 'from-cyan-600 to-blue-500'
  };

  const ActionButton = ({ action, index }) => {
    return (
      <motion.button
        key={action.label}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`relative rounded-lg sm:rounded-xl overflow-hidden p-3 sm:p-4 bg-gradient-to-br ${colorClasses[action.color]} text-white transition-all duration-200 group backdrop-blur-sm hover:scale-105`}
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        }}
      >
        <action.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mb-1 lg:mb-2 group-hover:scale-110 transition-transform mx-auto relative z-10" />
        <p className="text-xs sm:text-sm font-medium text-center relative z-10 leading-tight sm:leading-normal">{action.label}</p>
      </motion.button>
    );
  };

  return (
    <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border backdrop-blur-sm ${
      darkMode
        ? 'bg-slate-800/80 border-slate-700'
        : 'bg-white/80 border-slate-200'
    }`}>
      <h2 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
        darkMode ? 'text-white' : 'text-slate-900'
      }`}>
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {actions.map((action, index) => (
          <ActionButton key={action.label} action={action} index={index} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;