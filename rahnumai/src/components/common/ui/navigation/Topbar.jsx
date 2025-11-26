import React, { useState, useRef } from 'react';
import { Search, Bell, User, Moon, Sun, LogOut, Settings, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ onMenuClick, onLogout }) => {
  const { theme, toggleTheme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userRole = localStorage.getItem('userRole') || 'student';

  const notifications = [
    { id: 1, text: 'New assignment posted in Mathematics', time: '2 hours ago', type: 'info' },
    { id: 2, text: 'Your submission has been graded', time: '1 day ago', type: 'success' },
    { id: 3, text: 'Upcoming deadline: Calculus Quiz', time: '2 days ago', type: 'warning' }
  ];

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    navigate('/dashboard/settings');
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    onLogout();
  };

  const notificationVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 }
  };

  const userMenuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 }
  };

  return (
    <header className={`border-b px-4 lg:px-6 py-4 backdrop-blur-md transition-colors duration-300 relative z-50 ${
      darkMode
        ? 'bg-slate-800/80 border-slate-700 text-white'
        : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className={`p-2 rounded-lg transition-colors lg:hidden ${
            darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
          }`}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-slate-400' : 'text-slate-400'
            }`} />
            <input
              type="text"
              placeholder={
                userRole === 'student'
                  ? "Search courses, assignments..."
                  : userRole === 'faculty'
                  ? "Search students, materials..."
                  : "Search users, courses..."
              }
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all backdrop-blur-sm ${
                darkMode
                  ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-slate-50/50 border-slate-200 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg transition-colors relative ${
                darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
              aria-label="Notifications"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  variants={notificationVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg border z-[60] ${
                    darkMode
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                  style={{ zIndex: 1000 }}
                >
                  <div className={`p-4 border-b ${
                    darkMode ? 'border-slate-700' : 'border-slate-200'
                  }`}>
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b last:border-b-0 transition-colors ${
                          darkMode
                            ? 'border-slate-700 hover:bg-slate-700'
                            : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <p className="mb-1 text-sm">{notification.text}</p>
                        <p className={`text-xs ${
                          darkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className={`p-2 border-t ${
                    darkMode ? 'border-slate-700' : 'border-slate-200'
                  }`}>
                    <button className={`w-full text-center py-2 text-sm rounded-lg transition-colors ${
                      darkMode
                        ? 'text-slate-300 hover:bg-slate-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}>
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  variants={userMenuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border z-[60] ${
                    darkMode
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                  style={{ zIndex: 1000 }}
                >
                  <div className="p-2">
                    <div className={`px-3 py-2 border-b ${
                      darkMode ? 'border-slate-700' : 'border-slate-200'
                    }`}>
                      <p className="font-medium text-sm capitalize">
                        {userData.name || userRole}
                      </p>
                      <p className={`text-xs ${
                        darkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {userRole}
                      </p>
                    </div>
                    
                    <button 
                      onClick={handleSettingsClick}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors mt-1 ${
                        darkMode
                          ? 'text-slate-300 hover:bg-slate-700'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    
                    <button 
                      onClick={handleLogoutClick}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors mt-1 ${
                        darkMode
                          ? 'text-red-400 hover:bg-red-900/20'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;