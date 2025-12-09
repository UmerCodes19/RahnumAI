// src/pages/dashboard/Home.jsx
import React from 'react';
import { BookOpen, Users, BarChart3, Award, Clock, Calendar } from 'lucide-react';

export default function Home() {
  const userRole = localStorage.getItem('userRole') || 'student';
  
  const stats = {
    student: [
      { title: "Active Courses", value: "5", subtitle: "3 in progress", icon: BookOpen, color: "blue" },
      { title: "Assignments Due", value: "3", subtitle: "Next: Math - Tomorrow", icon: Clock, color: "orange" },
      { title: "Average Grade", value: "87%", subtitle: "+2% from last month", icon: Award, color: "green" },
      { title: "AI Sessions", value: "12", subtitle: "This week", icon: Users, color: "purple" }
    ],
    faculty: [
      { title: "Active Classes", value: "4", subtitle: "120 total students", icon: BookOpen, color: "blue" },
      { title: "Assignments to Grade", value: "8", subtitle: "From 3 classes", icon: Clock, color: "orange" },
      { title: "Student Performance", value: "84%", subtitle: "Class average", icon: BarChart3, color: "green" },
      { title: "Upcoming Sessions", value: "6", subtitle: "This week", icon: Calendar, color: "purple" }
    ],
    admin: [
      { title: "Total Users", value: "1,247", subtitle: "45 new this week", icon: Users, color: "blue" },
      { title: "Active Courses", value: "89", subtitle: "12 pending approval", icon: BookOpen, color: "orange" },
      { title: "System Uptime", value: "99.9%", subtitle: "All systems normal", icon: BarChart3, color: "green" },
      { title: "Support Tickets", value: "23", subtitle: "8 awaiting response", icon: Award, color: "purple" }
    ]
  };

  const quickActions = {
    student: [
      { icon: BookOpen, label: 'Continue Learning', description: 'Resume your last course', color: 'blue' },
      { icon: Award, label: 'View Grades', description: 'Check your progress', color: 'green' },
      { icon: Users, label: 'AI Tutor', description: 'Get help with subjects', color: 'purple' },
      { icon: Calendar, label: 'Schedule', description: 'Upcoming classes', color: 'orange' }
    ],
    faculty: [
      { icon: BookOpen, label: 'Create Assignment', description: 'New learning material', color: 'blue' },
      { icon: BarChart3, label: 'Class Analytics', description: 'Student performance', color: 'green' },
      { icon: Users, label: 'Manage Students', description: 'Class roster', color: 'purple' },
      { icon: Calendar, label: 'Schedule Class', description: 'Plan new session', color: 'orange' }
    ]
  };

  const currentStats = stats[userRole] || stats.student;
  const currentActions = quickActions[userRole] || quickActions.student;

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600', 
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Here's what's happening in your {userRole} dashboard today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.subtitle}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentActions.map((action, index) => (
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { action: 'Completed Math Quiz', time: '2 hours ago', score: '92%' },
              { action: 'Joined AI Tutoring Session', time: '1 day ago', duration: '45 min' },
              { action: 'Submitted Science Project', time: '2 days ago', status: 'Graded' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{activity.action}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{activity.time}</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
                  {activity.score || activity.duration || activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Upcoming Schedule
          </h2>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', time: 'Tomorrow, 10:00 AM', type: 'Live Class' },
              { subject: 'Science Lab', time: 'Nov 21, 2:00 PM', type: 'Practical' },
              { subject: 'English Literature', time: 'Nov 22, 11:00 AM', type: 'Discussion' }
            ].map((schedule, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{schedule.subject}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{schedule.time}</p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
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