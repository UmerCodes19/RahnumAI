import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, BarChart3, FileText, Settings, LogOut, Menu,
  LayoutDashboard, Bell, HelpCircle, Trello, Clock, Award, Brain,
  Calendar, Upload, UserCheck, Shield, GraduationCap, MessageCircle, TrendingUp,UserCog,UserPlus, User, Sparkles
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
    student: { primary: "#f39c12", gradient: "from-orange-500 to-amber-500", glass: "rgba(243, 156, 18, 0.1)" },
    faculty: { primary: "#8311f2", gradient: "from-purple-600 to-violet-500", glass: "rgba(131, 17, 242, 0.1)" },
    admin: { primary: "#f21311", gradient: "from-red-500 to-rose-500", glass: "rgba(242, 19, 17, 0.1)" }
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
  const currentRoleColor = roleColors[userRole] || roleColors.student;
  const accentColor = currentRoleColor.primary;
  const gradientClass = currentRoleColor.gradient;

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen relative overflow-hidden transition-colors duration-5 ${
      darkMode ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      {/* Enhanced Aurora Background with Role-based Colors */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={[accentColor, accentColor, accentColor]}
          blend={0.3}
          amplitude={0.4}
          speed={0.2}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${
          darkMode 
            ? 'from-slate-900/80 via-slate-900/60 to-slate-900/80' 
            : 'from-white/60 via-white/40 to-white/60'
        } backdrop-blur-[2px]`} />
      </div>

      {/* Enhanced Role Switcher */}
      <motion.button
        onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
        className={`fixed top-20 right-6 z-50 p-3 rounded-2xl backdrop-blur-xl border-2 shadow-2xl transition-all duration-300 ${
          darkMode
            ? 'bg-slate-800/60 border-slate-600/50 text-white hover:bg-slate-700/60 hover:border-slate-500'
            : 'bg-white/60 border-slate-200/50 text-slate-900 hover:bg-white/80 hover:border-slate-300'
        }`}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        title="Quick Role Switcher"
      >
        <Sparkles className="w-5 h-5" />
      </motion.button>

      {/* Enhanced Role Switcher Panel */}
      <AnimatePresence>
        {showRoleSwitcher && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed top-32 right-6 z-50 w-56 rounded-2xl shadow-2xl border-2 backdrop-blur-xl ${
              darkMode
                ? 'bg-slate-800/80 border-slate-600/50 text-white'
                : 'bg-white/80 border-slate-200/50 text-slate-900'
            }`}
          >
            <div className="p-3">
              <div className={`px-3 py-2 border-b ${
                darkMode ? 'border-slate-600/50' : 'border-slate-200/50'
              }`}>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Switch Role
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quick test different views</p>
              </div>
              {['student', 'faculty', 'admin'].map((role) => {
                const Icon = roleIcons[role];
                const roleColor = roleColors[role];
                return (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 text-sm rounded-xl transition-all duration-300 mt-2 group ${
                      userRole === role
                        ? `bg-gradient-to-r ${roleColor.gradient} text-white shadow-lg`
                        : darkMode
                        ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="capitalize font-medium">{role}</span>
                    {userRole === role && (
                      <span className="ml-auto text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm">
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

      {/* Enhanced Sidebar with Glass Morphism */}
      <motion.div 
        className={`backdrop-blur-xl border-r-2 transition-all duration-500 ease-out ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${mobileSidebarOpen ? 'fixed left-0 top-0 h-full z-50' : 'hidden lg:flex'} flex-col relative z-30 ${
          darkMode
            ? 'bg-slate-800/70 border-slate-600/30 text-white shadow-2xl'
            : 'bg-white/70 border-slate-200/30 text-slate-900 shadow-2xl'
        }`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Enhanced Sidebar Header */}
        <div className="p-6 border-b border-slate-200/30 dark:border-slate-600/30 flex items-center justify-between">
          {!sidebarCollapsed && (
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg bg-gradient-to-r ${gradientClass}`}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}>
                  RahnumAI
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{userRole}</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-2 rounded-xl transition-all duration-300 backdrop-blur-sm ${
              darkMode 
                ? 'hover:bg-slate-700/50 border border-slate-600/30' 
                : 'hover:bg-slate-100/50 border border-slate-200/30'
            }`}
          >
            {sidebarCollapsed ? 
              <Menu className="w-4 h-4" /> : 
              <span className="text-sm font-semibold">← Collapse</span>
            }
          </button>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 p-4 space-y-2 sidebar-content overflow-y-auto smooth-scroll">
          {currentItems.map((item, index) => (
            <motion.button
  key={item.path}
  onClick={() => handleNavigation(item.path)}
  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group w-full text-left relative overflow-hidden
    ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}
    ${
      isActive(item.path)
        ? 'shadow-lg scale-[1.02]'
        : darkMode
        ? 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-100 hover:scale-[1.01]'
        : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 hover:scale-[1.01]'
    }
  `}
  style={{
    backgroundColor: isActive(item.path) ? `${accentColor}15` : 'transparent',
    border: isActive(item.path) ? `1px solid ${accentColor}30` : '1px solid transparent',
    color: isActive(item.path) ? accentColor : ''
  }}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  {/* ICON - Always visible with proper sizing */}
  <item.icon
    className={`
      flex-shrink-0
      ${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
      transition-all duration-300
      ${isActive(item.path) ? 'scale-110' : 'scale-100'}
    `}
  />

  {/* LABEL - Only when not collapsed */}
  {!sidebarCollapsed && (
    <motion.span
      className="font-medium text-sm flex-1 truncate"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      {item.label}
    </motion.span>
  )}

 

  {/* HOVER EFFECT - Subtle background glow */}
  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
    darkMode ? 'bg-white/5' : 'bg-black/3'
  }`} />
</motion.button>
          ))}
        </nav>

       
      </motion.div>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-20">
        <Topbar
          onMenuClick={() => setMobileSidebarOpen(true)}
          onLogout={onLogout}
          roleColor={currentRoleColor}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 relative z-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Enhanced AI Assistant */}
      {userRole === 'student' && <AIAssistant roleColor={currentRoleColor} />}
    </div>
  );
}