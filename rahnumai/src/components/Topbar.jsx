import React, { useState } from 'react';
import { Search, Bell, User, Moon, Sun, LogOut, Settings, Menu } from 'lucide-react';
import { useThemeGlobal } from "@/components/ThemeProvider";

const Topbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, text: 'API usage at 80% of monthly limit', time: '2 hours ago', type: 'warning' },
    { id: 2, text: 'New feature: Bulk keyword analysis', time: '1 day ago', type: 'info' },
    { id: 3, text: 'Monthly report ready for download', time: '2 days ago', type: 'success' }
  ];

  return (
    <header className={`border-b px-4 lg:px-6 py-4 backdrop-blur-md transition-colors duration-300 ${
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
              placeholder="Search tools, reports, or keywords..."
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all backdrop-blur-sm ${
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
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg transition-colors relative ${
                darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg border z-50 transition-colors duration-300 ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className={`p-4 border-b ${
                  darkMode ? 'border-slate-700' : 'border-slate-200'
                }`}>
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border-b last:border-b-0 transition-colors ${
                      darkMode
                        ? 'border-slate-700 hover:bg-slate-700'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}>
                      <p className="mb-1">{notification.text}</p>
                      <p className={`text-xs ${
                        darkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden md:block">
                <p className={`text-sm font-medium ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  John Doe
                </p>
                <p className={`text-xs ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Pro Plan
                </p>
              </div>
            </button>
            
            {showUserMenu && (
              <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border z-50 transition-colors duration-300 ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="p-2">
                  <button className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    darkMode
                      ? 'text-slate-300 hover:bg-slate-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}>
                    <Settings className="w-4 h-4" />
                    <span>Account Settings</span>
                  </button>
                  <button className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    darkMode
                      ? 'text-red-400 hover:bg-red-900/20'
                      : 'text-red-600 hover:bg-red-50'
                  }`}>
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;