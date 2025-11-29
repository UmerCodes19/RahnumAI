import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Award, Download, Filter, Calendar } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

const FacultyAnalytics = () => {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';

  const [selectedClass, setSelectedClass] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  const stats = [
    { title: "Overall Performance", value: "84%", subtitle: "Class average", icon: BarChart3, color: "blue" },
    { title: "Top Performing", value: "12", subtitle: "Students >90%", icon: Award, color: "green" },
    { title: "Need Attention", value: "8", subtitle: "Students <70%", icon: Users, color: "orange" },
    { title: "Improvement Rate", value: "+5%", subtitle: "This month", icon: TrendingUp, color: "purple" }
  ];

  const performanceData = [
    { subject: 'Mathematics', average: 87, top: 95, low: 72, trend: 'up' },
    { subject: 'Computer Science', average: 82, top: 98, low: 65, trend: 'up' },
    { subject: 'Physics', average: 79, top: 92, low: 58, trend: 'down' },
    { subject: 'English', average: 88, top: 96, low: 75, trend: 'up' }
  ];

  const topStudents = [
    { name: 'Emily Davis', performance: 96, attendance: 98, assignments: 10 },
    { name: 'John Smith', performance: 94, attendance: 95, assignments: 9 },
    { name: 'Sarah Johnson', performance: 92, attendance: 92, assignments: 8 },
    { name: 'Michael Brown', performance: 89, attendance: 88, assignments: 7 }
  ];

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-500' : 'text-red-500';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '↗' : '↘';
  };

  return (
    <div className={`min-h-screen space-y-4 sm:space-y-6 p-4 sm:p-6 ${darkMode ? '' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>Analytics</h1>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Comprehensive insights into student performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className={`responsive-input px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="all">All Classes</option>
            <option value="MATH101">Mathematics 101</option>
            <option value="CS101">Computer Science</option>
            <option value="PHY101">Physics</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`responsive-input px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="semester">This Semester</option>
          </select>
          <button className={`touch-button flex items-center justify-center space-x-2 px-3 py-2 border rounded-xl transition-colors ${
            darkMode
              ? 'border-slate-600 text-slate-400 hover:bg-slate-700'
              : 'border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}>
            <Download className="w-4 h-4" />
            <span className="text-sm sm:text-base">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="responsive-grid gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={stat.title} className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
              </div>
              <div>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.title}</p>
                <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance and Top Students */}
      <div className="responsive-grid-2 gap-4 sm:gap-6">
        {/* Performance by Subject */}
        <div className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Performance by Subject
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {performanceData.map((subject, index) => (
              <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${
                darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className={`font-medium text-sm sm:text-base truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {subject.subject}
                    </h3>
                    <span className={`text-sm font-medium ${getTrendColor(subject.trend)}`}>
                      {getTrendIcon(subject.trend)} {subject.average}%
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${subject.average}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className={darkMode ? 'text-slate-500' : 'text-slate-500'}>Low: {subject.low}%</span>
                    <span className={darkMode ? 'text-slate-500' : 'text-slate-500'}>Top: {subject.top}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Top Performers
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {topStudents.map((student, index) => (
              <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${
                darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-medium text-sm sm:text-base truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {student.name}
                    </h3>
                    <p className={`text-xs sm:text-sm truncate ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                      {student.assignments}/10 assignments
                    </p>
                  </div>
                </div>
                <div className="text-right min-w-0">
                  <span className={`text-base sm:text-lg font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {student.performance}%
                  </span>
                  <p className={`text-xs sm:text-sm truncate ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    {student.attendance}% attendance
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
          <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Grade Distribution
          </h2>
          <span className={`px-2 py-1 text-xs rounded-full text-center ${
            darkMode 
              ? 'bg-purple-900/20 text-purple-400' 
              : 'bg-purple-100 text-purple-600'
          }`}>
            MATH101
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {[
            { grade: 'A+', count: 8, color: 'bg-green-500' },
            { grade: 'A', count: 12, color: 'bg-green-400' },
            { grade: 'B+', count: 15, color: 'bg-blue-400' },
            { grade: 'B', count: 10, color: 'bg-blue-300' },
            { grade: 'C+', count: 5, color: 'bg-orange-400' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className={`${item.color} rounded-lg p-3 sm:p-4 text-white mb-1 sm:mb-2`}>
                <span className="text-lg sm:text-2xl font-bold">{item.count}</span>
              </div>
              <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.grade}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyAnalytics;