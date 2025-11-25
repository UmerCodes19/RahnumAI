import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, BarChart3, FileText, Settings, LogOut, Menu,
  LayoutDashboard, Bell, HelpCircle, Trello, Clock, Award, Brain,
  Calendar, Upload, UserCheck, Shield, GraduationCap
} from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';
import ThemeToggle from '@/components/ThemeToggle';
import Aurora from '@/components/Aurora';
import { useThemeGlobal } from '@/components/ThemeProvider';

export default function Dashboard({ onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';

  const userRole = localStorage.getItem('userRole') || 'student';
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  const roleColors = {
    student: "#f39c12", // Orange
    faculty: "#8311f2", // Purple
    admin: "#f21311"    // Red
  };

  const menuItems = {
    student: [
      { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
      { icon: BookOpen, label: 'My Courses', path: '/dashboard/courses' },
      { icon: FileText, label: 'Assignments', path: '/dashboard/assignments' },
      { icon: HelpCircle, label: 'Quizzes', path: '/dashboard/quizzes' },
      { icon: Bell, label: 'Announcements', path: '/dashboard/announcements' },
      { icon: Trello, label: 'TaskBoard', path: '/dashboard/taskboard' },
      { icon: Brain, label: 'AI Assistant', path: '/dashboard/assistant' },
    ],
    faculty: [
      { icon: BookOpen, label: 'My Classes', path: '/dashboard' },
      { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
      { icon: Users, label: 'Students', path: '/dashboard/students' },
      { icon: FileText, label: 'Attendance', path: '/dashboard/attendance' },
      { icon: Upload, label: 'Materials', path: '/dashboard/materials' },
      { icon: Bell, label: 'Announcements', path: '/dashboard/announcements' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: UserCheck, label: 'Approvals', path: '/dashboard/admin/approvals' },
      { icon: Users, label: 'User Management', path: '/dashboard/admin/users' },
      { icon: GraduationCap, label: 'Faculty', path: '/dashboard/admin/faculty' },
      { icon: BookOpen, label: 'Course Management', path: '/dashboard/admin/courses' },
      { icon: BarChart3, label: 'Analytics', path: '/dashboard/admin/analytics' },
      { icon: Shield, label: 'System Settings', path: '/dashboard/admin/settings' },
    ]
  };

  const currentItems = menuItems[userRole] || menuItems.student;
  const accentColor = roleColors[userRole] || "#f39c12";

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen relative overflow-hidden transition-colors duration-300 ${
      darkMode ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={[accentColor, accentColor, accentColor]}
          blend={0.5}
          amplitude={0.6}
          speed={0.3}
        />
      </div>

      {/* Sidebar */}
      <div className={`backdrop-blur-md border-r transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } ${mobileSidebarOpen ? 'fixed left-0 top-0 h-full z-50' : 'hidden lg:flex'} flex-col relative z-30 ${
        darkMode
          ? 'bg-slate-800/90 border-slate-700 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900'
      }`}>
        
        {/* Logo Section */}
        <div className="p-4 border-b flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: accentColor }}
              >
                R
              </div>
              <span className="font-bold text-lg">RahnumAI</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-1.5 rounded-lg transition-colors hidden lg:block ${
              darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {currentItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group w-full text-left ${
                isActive(item.path)
                  ? 'bg-opacity-20'
                  : darkMode
                  ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              style={{
                backgroundColor: isActive(item.path) ? `${accentColor}20` : 'transparent',
                color: isActive(item.path) ? accentColor : ''
              }}
            >
              <item.icon className="w-5 h-5" />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: accentColor }}
            >
              {userRole.charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium capitalize">
                  {userData.name || userRole}
                </p>
                <button
                  onClick={onLogout}
                  className={`text-xs flex items-center space-x-1 transition-colors ${
                    darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <LogOut size={12} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-20">
        {/* Topbar */}
        <header className={`backdrop-blur-md border-b px-4 lg:px-6 py-4 transition-colors duration-300 ${
          darkMode
            ? 'bg-slate-800/80 border-slate-700 text-white'
            : 'bg-white/80 border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={`p-2 rounded-lg transition-colors lg:hidden ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    userRole === 'student'
                      ? "Search courses, assignments, or students..."
                      : userRole === 'faculty'
                      ? "Search students, classes, or materials..."
                      : "Search users, courses, or system settings..."
                  }
                  className={`w-full pl-4 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all backdrop-blur-sm ${
                    darkMode
                      ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:ring-red-500 focus:border-transparent'
                      : 'bg-slate-50/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:ring-red-500 focus:border-transparent'
                  }`}
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium capitalize">
                  Welcome, {userData.name || userRole}
                </p>
                <p className={`text-xs ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 relative z-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* AI Assistant for Students */}
      {userRole === 'student' && <AIAssistant />}
    </div>
  );
}