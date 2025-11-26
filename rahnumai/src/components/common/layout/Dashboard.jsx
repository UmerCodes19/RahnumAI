import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, BarChart3, FileText, Settings, LogOut, Menu,
  LayoutDashboard, Bell, HelpCircle, Trello, Clock, Award, Brain,
  Calendar, Upload, UserCheck, Shield, GraduationCap, MessageCircle, TrendingUp,UserCog,UserPlus, User
} from 'lucide-react';
import AIAssistant from '@/components/features/dashboard/common/AIAssistant';
import ThemeToggle from '@/components/common/theme/ThemeToggle';
import Topbar from '@/components/common/ui/navigation/Topbar';
import Aurora from '@/components/visual/Aurora';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

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



  const roleIcons = {
    student: User,
    faculty: UserCog,
    admin: UserPlus
  };

  const menuItems = {
    student: [
      { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
      { icon: BookOpen, label: 'My Courses', path: '/dashboard/courses' },
            { icon: TrendingUp, label: 'Leaderboard', path: '/dashboard/leaderboard' },

      { icon: FileText, label: 'Assignments', path: '/dashboard/assignments' },
      { icon: HelpCircle, label: 'Quizzes', path: '/dashboard/quizzes' },
      { icon: Bell, label: 'Announcements', path: '/dashboard/announcements' },
      { icon: Trello, label: 'TaskBoard', path: '/dashboard/taskboard' },
      { icon: Brain, label: 'AI Assistant', path: '/dashboard/assistant' },
      { icon: Brain, label: 'AI Learning', path: '/dashboard/learning' },
      { icon: TrendingUp, label: 'Predictions', path: '/dashboard/predictions' },
      { icon: MessageCircle, label: 'Chat', path: '/dashboard/chat' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ],
    faculty: [
      { icon: BookOpen, label: 'My Classes', path: '/dashboard' },
      { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
      { icon: TrendingUp, label: 'Class Performance', path: '/dashboard/class-performance' },
      { icon: FileText, label: 'Paper Generator', path: '/dashboard/generator' },
      { icon: Users, label: 'Students', path: '/dashboard/students' },
      { icon: FileText, label: 'Attendance', path: '/dashboard/attendance' },
      { icon: Upload, label: 'Materials', path: '/dashboard/materials' },
      { icon: MessageCircle, label: 'Chat', path: '/dashboard/chat' },
      { icon: Bell, label: 'Announcements', path: '/dashboard/announcements' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: UserCheck, label: 'Approvals', path: '/dashboard/admin/approvals' },
      { icon: Users, label: 'User Management', path: '/dashboard/admin/users' },
      { icon: GraduationCap, label: 'Faculty', path: '/dashboard/admin/faculty' },
      { icon: BookOpen, label: 'Course Management', path: '/dashboard/admin/courses' },
      { icon: BarChart3, label: 'Analytics', path: '/dashboard/admin/analytics' },
      { icon: Shield, label: 'System Settings', path: '/dashboard/admin/settings' },
      { icon: Settings, label: 'Profile Settings', path: '/dashboard/settings' },
    ]
  };

  const switchRole = (newRole) => {
    const mockUsers = {
      student: {
        id: 1,
        enroll: '2023001',
        name: 'John Student',
        email: 'john@student.edu',
        institute: 'bahria-karachi',
        role: 'student'
      },
      faculty: {
        id: 2,
        username: 'professor',
        name: 'Dr. Sarah Professor',
        email: 'sarah@faculty.edu',
        department: 'Computer Science',
        role: 'faculty'
      },
      admin: {
        id: 3,
        email: 'admin@university.edu',
        name: 'Admin User',
        role: 'admin'
      }
    };

    const userData = mockUsers[newRole];
    localStorage.setItem('userRole', newRole);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('authToken', `mock-token-${newRole}-${Date.now()}`);
    
    setShowRoleSwitcher(false);
    window.location.reload();
  };

  // Smooth scroll for sidebar
  useEffect(() => {
    const sidebar = document.querySelector('.sidebar-content');
    if (sidebar) {
      const handleWheel = (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          sidebar.scrollTop += e.deltaY;
        }
      };
      
      sidebar.addEventListener('wheel', handleWheel, { passive: false });
      return () => sidebar.removeEventListener('wheel', handleWheel);
    }
  }, []);

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

  // Smooth scroll for sidebar
  useEffect(() => {
    const sidebar = document.querySelector('.sidebar-content');
    if (sidebar) {
      const handleWheel = (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          sidebar.scrollTop += e.deltaY;
        }
      };
      
      sidebar.addEventListener('wheel', handleWheel, { passive: false });
      return () => sidebar.removeEventListener('wheel', handleWheel);
    }
  }, []);

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

{/* Quick Role Switcher Button */}
      <motion.button
        onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
        className={`fixed top-20 right-6 z-50 p-3 rounded-xl backdrop-blur-md border shadow-lg transition-all duration-300 ${
          darkMode
            ? 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700/80'
            : 'bg-white/80 border-slate-200 text-slate-900 hover:bg-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Quick Role Switcher"
      >
        <UserCog className="w-5 h-5" />
      </motion.button>

      {/* Role Switcher Dropdown */}
      <AnimatePresence>
        {showRoleSwitcher && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-32 right-6 z-50 w-48 rounded-xl shadow-lg border backdrop-blur-md ${
              darkMode
                ? 'bg-slate-800/90 border-slate-700 text-white'
                : 'bg-white/90 border-slate-200 text-slate-900'
            }`}
          >
            <div className="p-2">
              <div className={`px-3 py-2 border-b ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <h3 className="font-semibold text-sm">Switch Role</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Quick test different views</p>
              </div>
              
              {['student', 'faculty', 'admin'].map((role) => {
                const Icon = roleIcons[role];
                return (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors mt-1 ${
                      userRole === role
                        ? darkMode
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-orange-500/20 text-orange-600'
                        : darkMode
                        ? 'text-slate-300 hover:bg-slate-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="capitalize">{role}</span>
                    {userRole === role && (
                      <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Sidebar */}
      <div className={`backdrop-blur-md border-r transition-all duration-300 ${
        sidebarCollapsed ? 'w-22' : 'w-64'
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
        <nav className="flex-1 p-4 space-y-2 sidebar-content overflow-y-auto smooth-scroll">
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
               <item.icon className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} /> {/* Larger icons when collapsed */}
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
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
        <Topbar 
          onMenuClick={() => setMobileSidebarOpen(true)} 
          onLogout={onLogout}
        />

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