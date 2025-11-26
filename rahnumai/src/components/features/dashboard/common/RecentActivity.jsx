// src/components/RecentActivity.jsx (FIXED)
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Link, FileText, BarChart3, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

const RecentActivity = () => {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  
  const activities = [
    {
      id: 1,
      type: 'keyword',
      icon: Search,
      title: 'Keyword Analysis',
      description: 'Analyzed 50 keywords for "digital marketing"',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: 2,
      type: 'links',
      icon: Link,
      title: 'Broken Link Scan',
      description: 'Scanned example.com - 3 broken links found',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: 3,
      type: 'schema',
      icon: FileText,
      title: 'FAQ Schema Generated',
      description: 'Created schema for 12 FAQ items',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: 4,
      type: 'report',
      icon: BarChart3,
      title: 'Monthly SEO Report',
      description: 'Generated comprehensive SEO audit report',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'completed'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return darkMode
          ? 'text-green-400 bg-green-900/20'
          : 'text-green-600 bg-green-50';
      case 'running':
        return darkMode
          ? 'text-blue-400 bg-blue-900/20'
          : 'text-blue-600 bg-blue-50';
      case 'failed':
        return darkMode
          ? 'text-red-400 bg-red-900/20'
          : 'text-red-600 bg-red-50';
      default:
        return darkMode
          ? 'text-slate-400 bg-slate-800'
          : 'text-slate-600 bg-slate-50';
    }
  };

  const ActivityItem = ({ activity, index }) => {
    return (
      <motion.div
        key={activity.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`relative rounded-xl p-3 transition-all duration-200 group backdrop-blur-sm border ${
          darkMode 
            ? 'border-slate-700 hover:border-orange-600' 
            : 'border-slate-200 hover:border-orange-400'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? 'bg-violet-900/20 group-hover:bg-violet-900/30'
              : 'bg-violet-50 group-hover:bg-violet-100'
          }`}>
            <activity.icon className={`w-4 h-4 ${
              darkMode ? 'text-violet-400' : 'text-violet-600'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium truncate ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {activity.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                {activity.status}
              </span>
            </div>
            <p className={`text-sm mt-1 truncate ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {activity.description}
            </p>
            <p className={`text-xs mt-1 ${
              darkMode ? 'text-slate-500' : 'text-slate-500'
            }`}>
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </p>
          </div>
          <button className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all ${
            darkMode
              ? 'hover:bg-slate-600'
              : 'hover:bg-slate-200'
          }`}>
            <RefreshCw className={`w-4 h-4 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`} />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
      darkMode
        ? 'bg-slate-800/80 border-slate-700'
        : 'bg-white/80 border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Recent Activity
        </h2>
        <button className={`text-sm font-medium ${
          darkMode
            ? 'text-violet-400 hover:text-violet-300'
            : 'text-violet-600 hover:text-violet-700'
        }`}>
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityItem key={activity.id} activity={activity} index={index} />
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;