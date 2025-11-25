// src/pages/dashboard/Courses.jsx
import React, { useState } from 'react';
import { BookOpen, Plus, X, Download, Users, Clock } from 'lucide-react';
import Card from '@/components/Card';
import StatsCard from '@/components/StatsCard';

const Courses = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Mathematics 101', code: 'MATH101', instructor: 'Dr. Smith', progress: 75, enrolled: 45, duration: '15 weeks' },
    { id: 2, name: 'Computer Science', code: 'CS101', instructor: 'Prof. Johnson', progress: 60, enrolled: 32, duration: '16 weeks' },
    { id: 3, name: 'Physics Fundamentals', code: 'PHY101', instructor: 'Dr. Wilson', progress: 45, enrolled: 28, duration: '14 weeks' },
    { id: 4, name: 'English Literature', code: 'ENG201', instructor: 'Dr. Brown', progress: 90, enrolled: 38, duration: '12 weeks' }
  ]);

  const [showRegister, setShowRegister] = useState(false);

  const stats = [
    { title: "Total Courses", value: "4", subtitle: "All enrolled courses", icon: BookOpen, color: "blue" },
    { title: "In Progress", value: "3", subtitle: "Active this semester", icon: Clock, color: "orange" },
    { title: "Completion Rate", value: "67%", subtitle: "Overall progress", icon: Users, color: "green" },
    { title: "Credits Earned", value: "12", subtitle: "This semester", icon: Download, color: "purple" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">My Courses</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your enrolled courses and track progress
          </p>
        </div>
        <button 
          onClick={() => setShowRegister(true)}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register Courses</span>
        </button>
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

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            spotlightColor="#f39c12"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {course.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{course.code}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  Instructor: {course.instructor}
                </p>
              </div>
              <span className="px-3 py-1 text-sm bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full">
                {course.progress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{course.enrolled} students</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
                View Course
              </button>
              <button className="flex-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors border border-orange-200 dark:border-orange-800">
                Materials
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Register Courses Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300">
          <Card className="w-full max-w-md p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Register for Courses</h3>
              <button onClick={() => setShowRegister(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">Select courses to register for the upcoming semester:</p>
              <div className="space-y-2">
                {['Advanced Mathematics', 'Data Structures', 'Digital Electronics', 'Business Communication'].map((course, index) => (
                  <label key={index} className="flex items-center space-x-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500" />
                    <span className="text-slate-900 dark:text-slate-100">{course}</span>
                  </label>
                ))}
              </div>
              <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
                Register Selected Courses
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Courses;