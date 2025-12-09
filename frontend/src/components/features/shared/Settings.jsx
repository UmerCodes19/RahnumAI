import React, { useState, useRef } from 'react';
import { User, Bell, Shield, Globe, Download, Trash2, Camera, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import Card from '@/components/common/ui/cards/Card';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, roleColor } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate student focused on learning and growth.',
    department: 'Computer Science',
    enrollmentId: '2023001',
    profilePhoto: null
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    assignments: true,
    grades: true,
    announcements: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, profilePhoto: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profile);
    alert('Profile updated successfully!');
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const inputClasses = `responsive-input w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${
    darkMode
      ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-slate-100'
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-slate-900'
  }`;

  const buttonClasses = `touch-button px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center sm:justify-start space-x-2 ${
    darkMode
      ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
      : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
  }`;

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Settings
        </h1>
        <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className={`flex flex-wrap sm:flex-nowrap gap-1 p-1 rounded-xl ${
        darkMode ? 'bg-slate-800' : 'bg-slate-100'
      }`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`touch-button flex items-center justify-center sm:justify-start space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex-1 min-w-0 ${
              activeTab === tab.id
                ? darkMode
                  ? 'bg-slate-700 text-slate-100 shadow-sm'
                  : 'bg-white text-slate-900 shadow-sm'
                : darkMode
                ? 'text-slate-400 hover:text-slate-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className="p-4 sm:p-6" spotlightColor={roleColor}>
        <AnimatePresence mode="wait">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className={`text-lg sm:text-xl font-semibold ${
                darkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Profile Information
              </h2>
              
              {/* Profile Photo */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="relative">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold"
                    style={{ backgroundColor: roleColor }}
                  >
                    {profile.profilePhoto ? (
                      <img
                        src={profile.profilePhoto}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      profile.name.charAt(0)
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="touch-button absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-colors"
                    style={{ 
                      backgroundColor: roleColor,
                      borderColor: darkMode ? '#1e293b' : '#ffffff'
                    }}
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className={`font-semibold text-sm sm:text-base ${
                    darkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    Profile Photo
                  </h3>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Upload a clear photo of yourself for better recognition
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="sm:col-span-2 sm:grid-cols-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div className="sm:col-span-2 sm:grid-cols-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div className="sm:col-span-2 sm:grid-cols-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div className="sm:col-span-2 sm:grid-cols-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
                <button className={buttonClasses}>
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="touch-button px-4 sm:px-6 py-2 rounded-lg font-medium text-white flex items-center justify-center sm:justify-start space-x-2 transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: roleColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className={`text-lg sm:text-xl font-semibold ${
                darkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Notification Preferences
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border ${
                    darkMode ? 'border-slate-700' : 'border-slate-200'
                  }`}>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-sm sm:text-base ${
                        darkMode ? 'text-slate-100' : 'text-slate-900'
                      } capitalize`}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </h3>
                      <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Receive notifications about {key.toLowerCase()}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-3">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={value}
                        onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                      />
                      <div className={`w-10 h-5 sm:w-11 sm:h-6 rounded-full peer ${
                        darkMode 
                          ? 'bg-slate-600 peer-checked:bg-blue-600' 
                          : 'bg-slate-300 peer-checked:bg-blue-500'
                      } transition-colors`}>
                        <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 sm:h-5 sm:w-5 transition-transform peer-checked:translate-x-5 sm:peer-checked:translate-x-5`} />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className={`text-lg sm:text-xl font-semibold ${
                darkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Security Settings
              </h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
                }`}>
                  <h3 className={`font-medium text-sm sm:text-base ${
                    darkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    Change Password
                  </h3>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                    Update your password regularly for better security
                  </p>
                  <button className={`touch-button mt-3 px-4 py-2 rounded-lg text-sm font-medium ${
                    darkMode 
                      ? 'bg-slate-700 text-slate-100 hover:bg-slate-600' 
                      : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                  }`}>
                    Change Password
                  </button>
                </div>

                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
                }`}>
                  <h3 className={`font-medium text-sm sm:text-base ${
                    darkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    Two-Factor Authentication
                  </h3>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                    Add an extra layer of security to your account
                  </p>
                  <button className={`touch-button mt-3 px-4 py-2 rounded-lg text-sm font-medium ${
                    darkMode 
                      ? 'bg-slate-700 text-slate-100 hover:bg-slate-600' 
                      : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                  }`}>
                    Enable 2FA
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <motion.div
              key="preferences"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className={`text-lg sm:text-xl font-semibold ${
                darkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Preferences
              </h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
                }`}>
                  <h3 className={`font-medium text-sm sm:text-base ${
                    darkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    Language & Region
                  </h3>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                    Choose your preferred language and region settings
                  </p>
                  <select className={`touch-button mt-3 w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-slate-100' 
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}>
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>

                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
                }`}>
                  <h3 className={`font-medium text-sm sm:text-base ${
                    darkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    Data & Privacy
                  </h3>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                    Manage your data and privacy settings
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <button className={`touch-button px-4 py-2 rounded-lg text-sm font-medium ${
                      darkMode 
                        ? 'bg-slate-700 text-slate-100 hover:bg-slate-600' 
                        : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                    }`}>
                      Export Data
                    </button>
                    <button className={`touch-button px-4 py-2 rounded-lg text-sm font-medium ${
                      darkMode 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default Settings;