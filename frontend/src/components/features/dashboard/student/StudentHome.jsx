import React from 'react';
import { BookOpen, Users, BarChart3, Award, Clock, Calendar, Eye, Brain } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import StatsCard from '@/components/common/ui/cards/StatsCard';
import QuickActions from '@/components/features/dashboard/common/QuickActions';
import RecentActivity from '@/components/features/dashboard/common/RecentActivity';
import { useDashboardStats, useAssignments } from '@/hooks/useApiData';
import Skeleton from '@/components/common/ui/utils/Skeleton';

export default function StudentHome() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  
  // Mock data for demonstration
  const statsData = {
    active_courses: 4,
    courses_in_progress: 3,
    average_grade: 82,
    grade_trend: '+2% from last month',
    ai_sessions: 12
  };

  const assignmentsData = [
    { id: 1, title: 'Math Assignment', due_date: '2024-12-20' },
    { id: 2, title: 'Physics Lab', due_date: '2024-12-22' }
  ];

  const stats = [
    { 
      title: "Active Courses", 
      value: statsData.active_courses.toString(), 
      subtitle: `${statsData.courses_in_progress} in progress`, 
      icon: BookOpen, 
      color: "blue" 
    },
    { 
      title: "Assignments Due", 
      value: assignmentsData?.length.toString() || "0", 
      subtitle: "Next assignment soon", 
      icon: Clock, 
      color: "orange" 
    },
    { 
      title: "Average Grade", 
      value: `${statsData.average_grade}%`, 
      subtitle: statsData.grade_trend, 
      icon: Award, 
      color: "green" 
    },
    { 
      title: "AI Sessions", 
      value: statsData.ai_sessions.toString(), 
      subtitle: "This week", 
      icon: Users, 
      color: "purple" 
    }
  ];

  const studentQuickActions = [
    { icon: Eye, label: 'View Attendance', description: 'Check your attendance record', color: 'blue', path: '/dashboard/student-attendance' },
    { icon: Brain, label: 'Resume AI Session', description: 'Continue with AI tutor', color: 'green', path: '/dashboard/assistant' },
    { icon: Calendar, label: 'Class Schedule', description: 'View upcoming classes', color: 'orange', path: '/dashboard/schedule' },
    { icon: BarChart3, label: 'Recent Grades', description: 'Check your performance', color: 'purple', path: '/dashboard/grades' },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
          darkMode ? 'text-white' : ''
        }`}>
          Welcome back, Student! 👋
        </h1>
        <p className={`text-sm sm:text-base ${
          darkMode ? '' : ''
        }`}>
          Here's your learning overview for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            animationDelay={index * 100}
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {studentQuickActions.map((action, index) => (
            <button
              key={action.label}
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br ${colorClasses[action.color]} text-white transition-all duration-200 hover:scale-105 group text-left`}
              onClick={() => window.location.href = action.path}
            >
              <action.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-sm sm:text-base mb-1">{action.label}</p>
              <p className="text-xs sm:text-sm opacity-90 hidden sm:block">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <RecentActivity />
        
        {/* Upcoming Schedule */}
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border backdrop-blur-sm ${
          darkMode
            ? 'bg-slate-800/80 border-slate-700'
            : 'bg-white/80 border-slate-200'
        }`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Upcoming Schedule
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {[
              { subject: 'Mathematics 101', time: '10:00 AM - 11:30 AM', type: 'Lecture' },
              { subject: 'Computer Science', time: '2:00 PM - 3:30 PM', type: 'Lab' },
              { subject: 'Physics Fundamentals', time: '4:00 PM - 5:30 PM', type: 'Tutorial' }
            ].map((schedule, index) => (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
              }`}>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className={`font-medium text-sm sm:text-base ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {schedule.subject}
                  </p>
                  <p className={`text-xs sm:text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {schedule.time}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  darkMode 
                    ? 'bg-blue-900/20 text-blue-400' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {schedule.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}