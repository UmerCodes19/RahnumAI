import React from 'react';
import { BookOpen, Users, BarChart3, Award, Clock, Calendar, Upload, FileText, MessageSquare } from 'lucide-react';
import { useThemeGlobal } from "@/components/common/theme/ThemeProvider";
import { useNavigate } from 'react-router-dom';
import StatsCard from '@/components/common/ui/cards/StatsCard';
import Card from '@/components/common/ui/cards/Card';

export default function FacultyHome() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';

  const navigate = useNavigate();
  const stats = [
    { title: "Active Classes", value: "4", subtitle: "120 total students", icon: BookOpen, color: "blue" },
    { title: "Assignments to Grade", value: "8", subtitle: "From 3 classes", icon: Clock, color: "orange" },
    { title: "Student Performance", value: "84%", subtitle: "Class average", icon: BarChart3, color: "green" },
    { title: "Upcoming Sessions", value: "6", subtitle: "This week", icon: Calendar, color: "purple" }
  ];

  const quickActions = [
    { icon: Upload, label: 'Upload Material', description: 'Share course materials', color: 'blue' },
    { icon: FileText, label: 'Create Assignment', description: 'New learning material', color: 'green' },
    { icon: FileText, label: 'Manage Assignments', description: 'Class assignments', color: 'purple' },
    { icon: MessageSquare, label: 'Post Announcement', description: 'Class updates', color: 'orange' }
  ];

  const recentActivities = [
    { action: 'Graded Math Quiz', time: '2 hours ago', class: 'MATH101' },
    { action: 'Uploaded Lecture Notes', time: '1 day ago', class: 'CS101' },
    { action: 'Created New Assignment', time: '2 days ago', class: 'PHY101' }
  ];

  const upcomingClasses = [
    { subject: 'Mathematics', time: 'Tomorrow, 10:00 AM', type: 'Lecture', students: 32 },
    { subject: 'Computer Science', time: 'Tomorrow, 2:00 PM', type: 'Lab', students: 28 },
    { subject: 'Physics', time: 'Nov 21, 11:00 AM', type: 'Discussion', students: 35 }
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-8 text-center sm:text-left">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Welcome back, Professor! 👋
        </h1>
        <p className={`text-sm sm:text-base ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Here's your teaching overview for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="responsive-grid gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            responsive
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border backdrop-blur-sm ${
        darkMode
          ? 'bg-slate-800/80 border-slate-700'
          : 'bg-white/80 border-slate-200'
      }`}>
        <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <button
              key={action.label}
              onClick={() => { if (action.label === 'Upload Material') navigate('/dashboard/materials'); }}
              className={`touch-button p-3 sm:p-4 rounded-xl bg-gradient-to-br ${colorClasses[action.color]} text-white transition-all duration-200 hover:scale-105 group text-left`}
            >
              <action.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-sm sm:text-base mb-1">{action.label}</p>
              <p className="text-xs sm:text-sm opacity-90">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity and Upcoming Classes */}
      <div className="responsive-grid-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card className="p-4 sm:p-6">
          <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Recent Activity
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg transition-colors gap-2 ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
              }`}>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm sm:text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {activity.action}
                  </p>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {activity.time} • {activity.class}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full self-start sm:self-auto ${
                  darkMode 
                    ? 'bg-blue-900/20 text-blue-400' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  Completed
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Classes */}
        <Card className="p-4 sm:p-6">
          <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Upcoming Classes
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {upcomingClasses.map((classItem, index) => (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
              }`}>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm sm:text-base truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {classItem.subject}
                  </p>
                  <p className={`text-xs sm:text-sm truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {classItem.time}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    darkMode 
                      ? 'bg-orange-900/20 text-orange-400' 
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {classItem.type}
                  </span>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {classItem.students} students
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}