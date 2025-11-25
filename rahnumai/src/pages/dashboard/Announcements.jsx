// src/pages/dashboard/Announcements.jsx
import React, { useState } from 'react';
import { Bell, Megaphone, Calendar, User, Pin, BookOpen } from 'lucide-react';
import Card from '@/components/Card';
import StatsCard from '@/components/StatsCard';

const Announcements = () => {
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

  const stats = [
    { title: "Total Announcements", value: "12", subtitle: "This month", icon: Bell, color: "blue" },
    { title: "High Priority", value: "3", subtitle: "Important updates", icon: Megaphone, color: "orange" },
    { title: "Unread", value: "2", subtitle: "New announcements", icon: BookOpen, color: "green" },
    { title: "Pinned", value: "2", subtitle: "Important notices", icon: Pin, color: "purple" }
  ];

  const categories = ['All', 'General', 'Academic', 'Resources', 'Events'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Announcements</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Stay updated with important notices and updates
          </p>
        </div>
      </div>

      {/* Stats */}
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

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card
            key={announcement.id}
            className="p-6 hover:shadow-lg transition-all duration-300 group"
            spotlightColor="#f39c12"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {announcement.pinned && <Pin className="w-4 h-4 text-orange-500" />}
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {announcement.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    announcement.priority === 'high' 
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                      : announcement.priority === 'medium'
                      ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                  }`}>
                    {announcement.priority}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800">
                    {announcement.category}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <span className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>By: {announcement.author}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{announcement.date}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {announcement.content}
            </p>
            
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium transition-colors">
                Mark as Read
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Announcements;