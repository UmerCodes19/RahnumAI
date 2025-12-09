import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

export default function AdminAnalytics() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const [timeRange, setTimeRange] = useState('month');

  const stats = [
    { label: 'Total Users', value: '1,307', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Active Courses', value: '67', change: '+3%', icon: BookOpen, color: 'green' },
    { label: 'Faculty Members', value: '45', change: '+5%', icon: Users, color: 'purple' },
    { label: 'System Uptime', value: '99.9%', change: '+0.1%', icon: TrendingUp, color: 'orange' }
  ];

  const departmentData = [
    { department: 'Computer Science', students: 320, faculty: 8, courses: 15 },
    { department: 'Engineering', students: 280, faculty: 6, courses: 12 },
    { department: 'Mathematics', students: 180, faculty: 5, courses: 10 },
    { department: 'Physics', students: 150, faculty: 4, courses: 8 },
    { department: 'Chemistry', students: 120, faculty: 3, courses: 6 }
  ];

  const cardClasses = `rounded-xl shadow-sm border p-4 sm:p-6 ${
    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  }`;

  const statCardClasses = `rounded-xl p-4 sm:p-6 ${
    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  } border shadow-sm`;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="text-center sm:text-left">
            <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? '' : ''}`}>
              System Analytics
            </h1>
            <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-2`}>
              Comprehensive overview of your institution's performance
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <div className="flex flex-wrap gap-2">
              {['week', 'month', 'quarter', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`touch-button px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-red-600 text-white'
                      : `${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-50'} border ${darkMode ? 'border-slate-600' : 'border-slate-300'}`
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <button className={`touch-button px-3 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${
              darkMode 
                ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}>
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="responsive-grid gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={statCardClasses}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-xl sm:text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs sm:text-sm mt-1 ${
                    stat.change.startsWith('+')
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change} from last period
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ml-3 ${
                  stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                  stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  <stat.icon className={`${
                    stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    'text-orange-600 dark:text-orange-400'
                  }`} size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="responsive-grid-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Department Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cardClasses}
          >
            <h3 className={`text-base sm:text-lg font-semibold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Department Overview
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {departmentData.map((dept, index) => (
                <div key={dept.department} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg ${
                  darkMode ? 'bg-slate-700/50' : 'bg-slate-50'
                }`}>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm sm:text-base truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {dept.department}
                    </h4>
                    <div className={`flex flex-wrap gap-2 sm:gap-4 mt-1 text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <span>{dept.students} students</span>
                      <span>{dept.faculty} faculty</span>
                      <span>{dept.courses} courses</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {Math.round((dept.students / 1050) * 100)}%
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      of total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cardClasses}
          >
            <h3 className={`text-base sm:text-lg font-semibold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              System Health
            </h3>
            <div className="space-y-4 sm:space-y-6">
              {[
                { metric: 'Server Uptime', value: 99.9, status: 'excellent' },
                { metric: 'Response Time', value: 120, status: 'good', unit: 'ms' },
                { metric: 'Active Sessions', value: 843, status: 'normal' },
                { metric: 'Storage Usage', value: 68, status: 'warning', unit: '%' }
              ].map((item, index) => (
                <div key={item.metric}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.metric}
                    </span>
                    <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {item.value}{item.unit || ''}
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className={`h-2 rounded-full ${
                        item.status === 'excellent' ? 'bg-green-500' :
                        item.status === 'good' ? 'bg-blue-500' :
                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(item.value, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mt-6 sm:mt-8 ${cardClasses}`}
        >
          <h3 className={`text-base sm:text-lg font-semibold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Performance Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { label: 'Course Completion Rate', value: '78%', trend: 'up' },
              { label: 'Student Satisfaction', value: '4.2/5', trend: 'up' },
              { label: 'Faculty Response Time', value: '2.1h', trend: 'down' }
            ].map((metric, index) => (
              <div key={index} className={`text-center p-3 sm:p-4 rounded-lg ${
                darkMode ? 'bg-slate-700/50' : 'bg-slate-50'
              }`}>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {metric.label}
                </p>
                <p className={`text-xl sm:text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {metric.value}
                </p>
                <div className={`flex items-center justify-center mt-2 text-xs sm:text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? '↗ Improving' : '↘ Needs Attention'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}