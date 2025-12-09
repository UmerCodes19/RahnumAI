// src/pages/dashboard/Announcements.jsx
import React, { useState } from 'react';
import { Bell, Megaphone, Calendar, User, Pin, BookOpen } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import StatsCard from '@/components/common/ui/cards/StatsCard';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

const Announcements = () => {


   const { theme } = useThemeGlobal();
    const darkMode = theme === 'dark';

  const [announcements, setAnnouncements] = useState([
    { 
      id: 1, 
      title: 'Holiday Break Notice', 
      author: 'Admin Office', 
      date: '2024-12-15', 
      priority: 'high',
      category: 'General',
      content: 'The university will be closed for winter break from December 24th to January 2nd. All classes will resume on January 3rd, 2025.',
      pinned: true
    },
    { 
      id: 2, 
      title: 'New Library Resources Available', 
      author: 'Library Department', 
      date: '2024-12-10', 
      priority: 'medium',
      category: 'Resources',
      content: 'We have added new digital resources including access to JSTOR, IEEE Xplore, and additional e-books. Check the library portal for more information.',
      pinned: false
    },
    { 
      id: 3, 
      title: 'Math Tutoring Sessions Schedule', 
      author: 'Math Faculty', 
      date: '2024-12-08', 
      priority: 'low',
      category: 'Academic',
      content: 'Additional math tutoring sessions are now available every Tuesday and Thursday from 3-5 PM in Room 204. Sign up through the student portal.',
      pinned: false
    },
    { 
      id: 4, 
      title: 'Course Registration Reminder', 
      author: 'Registrar Office', 
      date: '2024-12-05', 
      priority: 'high',
      category: 'Academic',
      content: 'Spring semester course registration opens on January 10th, 2025. Please meet with your academic advisor before registering.',
      pinned: true
    }
  ]);

const [courseFilter, setCourseFilter] = useState('all');


  const stats = [
    { title: "Total Announcements", value: "12", subtitle: "This month", icon: Bell, color: "blue" },
    { title: "High Priority", value: "3", subtitle: "Important updates", icon: Megaphone, color: "orange" },
    { title: "Unread", value: "2", subtitle: "New announcements", icon: BookOpen, color: "green" },
    { title: "Pinned", value: "2", subtitle: "Important notices", icon: Pin, color: "purple" }
  ];

  const categories = ['All', 'General', 'Academic', 'Resources', 'Events'];

  return (
  <div className={`min-h-screen space-y-6 p-6 ${darkMode ? '' : ''}`}>
    <div className="flex items-center justify-between">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>Announcements</h1>
        <p className={darkMode ? '' : ''}>
          Stay updated with important notices and updates
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={stat.title} className={`rounded-xl p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <stat.icon className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.title}</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
              <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stat.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Filter by Course
          </label>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="all">All Courses</option>
            <option value="MATH101">Mathematics 101</option>
            <option value="CS101">Computer Science</option>
            <option value="PHY101">Physics</option>
          </select>
        </div>
      </div>
    </div>

    <div className="flex space-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
            darkMode
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>

    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div key={announcement.id} className={`rounded-xl p-6 transition-all duration-300 group border ${
          darkMode 
            ? 'bg-slate-800 border-slate-700 hover:border-orange-500' 
            : 'bg-white border-slate-200 hover:border-orange-400'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {announcement.pinned && <Pin className="w-4 h-4 text-orange-500" />}
                <h3 className={`font-semibold text-lg group-hover:text-orange-600 transition-colors ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {announcement.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full border ${
                  announcement.priority === 'high'
                    ? darkMode
                      ? 'bg-orange-900/20 text-orange-400 border-orange-800'
                      : 'bg-orange-100 text-orange-600 border-orange-200'
                    : announcement.priority === 'medium'
                    ? darkMode
                      ? 'bg-amber-900/20 text-amber-400 border-amber-800'
                      : 'bg-amber-100 text-amber-600 border-amber-200'
                    : darkMode
                    ? 'bg-green-900/20 text-green-400 border-green-800'
                    : 'bg-green-100 text-green-600 border-green-200'
                }`}>
                  {announcement.priority}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full border ${
                  darkMode 
                    ? 'bg-blue-900/20 text-blue-400 border-blue-800' 
                    : 'bg-blue-100 text-blue-600 border-blue-200'
                }`}>
                  {announcement.category}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm mb-3">
                <span className={`flex items-center space-x-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <User className="w-4 h-4" />
                  <span>By: {announcement.author}</span>
                </span>
                <span className={`flex items-center space-x-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Calendar className="w-4 h-4" />
                  <span>{announcement.date}</span>
                </span>
              </div>
            </div>
          </div>
          <p className={`leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {announcement.content}
          </p>
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <button className={`text-sm font-medium transition-colors ${
              darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'
            }`}>
              Mark as Read
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default Announcements;