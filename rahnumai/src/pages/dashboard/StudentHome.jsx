// src/pages/dashboard/StudentHome.jsx (FIXED)
import React from 'react';
import { BookOpen, Users, BarChart3, Award, Clock, Calendar, Eye, Brain } from 'lucide-react';
import { useThemeGlobal } from "@/components/ThemeProvider";
import StatsCard from '@/components/StatsCard';
import QuickActions from '@/components/QuickActions';
import RecentActivity from '@/components/RecentActivity';

export default function StudentHome() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';

  const stats = [
    { title: "Active Courses", value: "5", subtitle: "3 in progress", icon: BookOpen, color: "blue" },
    { title: "Assignments Due", value: "3", subtitle: "Next: Math - Tomorrow", icon: Clock, color: "orange" },
    { title: "Average Grade", value: "87%", subtitle: "+2% from last month", icon: Award, color: "green" },
    { title: "AI Sessions", value: "12", subtitle: "This week", icon: Users, color: "purple" }
  ];

  const studentQuickActions = [
    { icon: Eye, label: 'View Attendance', description: 'Check your attendance record', color: 'blue' },
    { icon: Brain, label: 'Resume AI Session', description: 'Continue with AI tutor', color: 'green' },
    { icon: Calendar, label: 'Class Schedule', description: 'View upcoming classes', color: 'orange' },
    { icon: BarChart3, label: 'Recent Grades', description: 'Check your performance', color: 'purple' }
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="space-y-6">
      {/* Header - FIXED */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-white'
        }`}>
          Welcome back, Student! 👋
        </h1>
        <p className={`${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Here's your learning overview for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Quick Actions - FIXED */}
      <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
        darkMode
          ? 'bg-slate-800/80 border-slate-700'
          : 'bg-white/80 border-slate-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {studentQuickActions.map((action, index) => (
            <button
              key={action.label}
              className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[action.color]} text-white transition-all duration-200 hover:scale-105 group text-left`}
            >
              <action.icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold mb-1">{action.label}</p>
              <p className="text-sm opacity-90">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <RecentActivity />
        
        {/* Upcoming Schedule - FIXED */}
        <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
          darkMode
            ? 'bg-slate-800/80 border-slate-700'
            : 'bg-white/80 border-slate-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Upcoming Schedule
          </h2>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', time: 'Tomorrow, 10:00 AM', type: 'Live Class' },
              { subject: 'Science Lab', time: 'Nov 21, 2:00 PM', type: 'Practical' },
              { subject: 'English Literature', time: 'Nov 22, 11:00 AM', type: 'Discussion' }
            ].map((schedule, index) => (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
              }`}>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {schedule.subject}
                  </p>
                  <p className={`text-sm ${
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