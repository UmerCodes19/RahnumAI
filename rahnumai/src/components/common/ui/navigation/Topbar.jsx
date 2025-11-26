import React, { useState, useRef } from 'react';
import { Search, Bell, User, Moon, Sun, LogOut, Settings, Menu, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ onMenuClick, onLogout, roleColor }) => {
  const { theme, toggleTheme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userRole = localStorage.getItem('userRole') || 'student';
  
  const currentRoleColor = roleColor || { 
    primary: "#f39c12", 
    gradient: "from-orange-500 to-amber-500",
    glass: "rgba(243, 156, 18, 0.1)"
  };

  const notifications = [
    { id: 1, text: 'New assignment posted in Mathematics', time: '2 hours ago', type: 'info' },
    { id: 2, text: 'Your submission has been graded', time: '1 day ago', type: 'success' },
    { id: 3, text: 'Upcoming deadline: Calculus Quiz', time: '2 days ago', type: 'warning' }
  ];

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
    <motion.header 
      className={`border-b-2 px-6 py-4 backdrop-blur-xl transition-all duration-5 relative z-50 ${
        darkMode
          ? 'bg-slate-800/60 border-slate-600/30 text-white shadow-2xl'
          : 'bg-white/60 border-slate-200/30 text-slate-900 shadow-2xl'
      }`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <motion.button
          onClick={onMenuClick}
          className={`p-3 rounded-2xl transition-all duration-300 lg:hidden backdrop-blur-sm border ${
            darkMode 
              ? 'hover:bg-slate-700/50 text-slate-300 border-slate-600/30' 
              : 'hover:bg-slate-100/50 text-slate-600 border-slate-200/30'
          }`}
          aria-label="Open menu"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        {/* Enhanced Search Bar */}
        <div className="flex-1 max-w-2xl mx-6">
          <motion.div 
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
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
              className={`w-full pl-12 pr-6 py-3 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 backdrop-blur-sm text-lg ${
                darkMode
                  ? 'bg-slate-700/30 border-slate-600/30 text-white placeholder-slate-400 focus:border-slate-500 focus:ring-slate-500/20'
                  : 'bg-white/30 border-slate-200/30 text-slate-900 placeholder-slate-500 focus:border-slate-300 focus:ring-slate-500/20'
              }`}
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            />
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className={`p-3 rounded-2xl transition-all duration-300 backdrop-blur-sm border ${
              darkMode 
                ? 'hover:bg-slate-700/50 text-yellow-400 border-slate-600/30' 
                : 'hover:bg-slate-100/50 text-slate-600 border-slate-200/30'
            }`}
            aria-label="Toggle theme"
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>

          {/* Enhanced Notifications */}
          <div className="relative" ref={notificationsRef}>
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-3 rounded-2xl transition-all duration-300 backdrop-blur-sm border relative ${
                darkMode 
                  ? 'hover:bg-slate-700/50 text-slate-300 border-slate-600/30' 
                  : 'hover:bg-slate-100/50 text-slate-600 border-slate-200/30'
              }`}
              aria-label="Notifications"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5" />
              <motion.span 
                className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                style={{ 
                  borderColor: darkMode ? '#1e293b' : '#ffffff'
                }}
              />
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  variants={notificationVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                  className={`absolute right-0 mt-3 w-96 rounded-2xl shadow-2xl border-2 backdrop-blur-xl z-[60] overflow-hidden ${
                    darkMode
                      ? 'bg-slate-800/90 border-slate-600/50 text-white'
                      : 'bg-white/90 border-slate-200/50 text-slate-900'
                  }`}
                  style={{ zIndex: 1000 }}
                >
                  {/* Notification Header */}
                  <div className={`p-4 border-b ${
                    darkMode ? 'border-slate-600/50' : 'border-slate-200/50'
                  }`}>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                      <span className="ml-auto text-sm font-normal text-slate-500 dark:text-slate-400">
                        {notifications.length} new
                      </span>
                    </h3>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 border-b last:border-b-0 transition-all duration-300 group hover:scale-[1.02] ${
                          darkMode
                            ? 'border-slate-600/30 hover:bg-slate-700/50'
                            : 'border-slate-100 hover:bg-slate-50/80'
                        }`}
                      >
                        <p className="mb-2 text-sm font-medium">{notification.text}</p>
                        <p className={`text-xs ${
                          darkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {notification.time}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Notification Footer */}
                  <div className={`p-3 border-t ${
                    darkMode ? 'border-slate-600/50' : 'border-slate-200/50'
                  }`}>
                    <button className={`w-full text-center py-2 text-sm rounded-xl transition-all duration-300 font-medium ${
                      darkMode
                        ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}>
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced User Menu */}
          <div className="relative" ref={userMenuRef}>
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-3 p-2 rounded-2xl transition-all duration-300 backdrop-blur-sm border ${
                darkMode 
                  ? 'hover:bg-slate-700/50 border-slate-600/30' 
                  : 'hover:bg-slate-100/50 border-slate-200/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-r ${currentRoleColor.gradient}`}>
                <User className="w-5 h-5" />
              </div>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  variants={userMenuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                  className={`absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl border-2 backdrop-blur-xl z-[60] overflow-hidden ${
                    darkMode
                      ? 'bg-slate-800/90 border-slate-600/50 text-white'
                      : 'bg-white/90 border-slate-200/50 text-slate-900'
                  }`}
                  style={{ zIndex: 1000 }}
                >
                  {/* User Info */}
                  <div className={`p-4 border-b ${
                    darkMode ? 'border-slate-600/50' : 'border-slate-200/50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-r ${currentRoleColor.gradient}`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-sm capitalize">
                          {userData.name || userRole}
                        </p>
                        <p className={`text-xs ${
                          darkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {userRole} • {userData.institute || userData.department || 'Bahria University'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <motion.button
                      onClick={handleSettingsClick}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm rounded-xl transition-all duration-300 mb-1 ${
                        darkMode
                          ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings & Preferences</span>
                    </motion.button>

                    <motion.button
                      onClick={handleLogoutClick}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm rounded-xl transition-all duration-300 ${
                        darkMode
                          ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                          : 'text-red-600 hover:bg-red-50/80 hover:text-red-700'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Topbar;