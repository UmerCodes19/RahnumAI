// src/pages/dashboard/Courses.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, X, Download, Users, Clock } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import StatsCard from '@/components/common/ui/cards/StatsCard';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import api from '@/services/api';
import { toast } from 'react-toastify';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState(new Set());
  const [availableCourses, setAvailableCourses] = useState([]);
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';

  // Fetch courses from API on mount
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        // Only fetch courses the current student is enrolled in
        const response = await api.courses.getCourses({ enrolled: 'true' });
        const courseList = Array.isArray(response) ? response : (response.courses || []);
        setCourses(courseList);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Open the register modal and compute available (non-enrolled) courses
  const openRegisterModal = async () => {
    setSelectedCourseIds(new Set());
    try {
      // Fetch all courses (not just enrolled) to display in the register modal
      const allResponse = await api.courses.getCourses();
      const allList = Array.isArray(allResponse) ? allResponse : (allResponse.courses || []);
      // Compute available courses by excluding those that are currently enrolled for this user
      // If backend provides `is_enrolled` flag, rely on that; otherwise, compare ids with the enrolled list
      const enrolledIds = new Set(courses.map(c => c.id));
      const available = allList.filter(c => {
        if (typeof c.is_enrolled === 'boolean') return !c.is_enrolled;
        return !enrolledIds.has(c.id);
      });
      setAvailableCourses(available);
    } catch (err) {
      console.error('Failed to load courses for registration', err);
      toast.error('Failed to load courses');
      setAvailableCourses([]);
    }
    setShowRegister(true);
  }

  const stats = [
    { title: "Total Courses", value: courses.length.toString(), subtitle: "All enrolled courses", icon: BookOpen, color: "blue" },
    { title: "In Progress", value: (courses.filter(c => c.progress < 100).length).toString(), subtitle: "Active this semester", icon: Clock, color: "orange" },
    { title: "Completion Rate", value: courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length) + '%' : '0%', subtitle: "Overall progress", icon: Users, color: "green" },
    { title: "Credits Earned", value: "12", subtitle: "This semester", icon: Download, color: "purple" }
  ];

  return (
  <div className={`min-h-screen space-y-6 p-6 ${darkMode ? '' : ''}`}>
    <div className="flex items-center justify-between">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>My Courses</h1>
        <p className={darkMode ? '' : ''}>
          Manage your enrolled courses and track progress
        </p>
      </div>
      <button
        onClick={openRegisterModal}
        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Register Courses</span>
      </button>
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

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {courses.map((course) => (
        <div key={course.id} className={`rounded-xl p-6 transition-all duration-300 cursor-pointer border ${
          darkMode 
            ? 'bg-slate-800 border-slate-700 hover:border-orange-500' 
            : 'bg-white border-slate-200 hover:border-orange-400'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className={`font-semibold text-lg group-hover:text-orange-600 transition-colors ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {course.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{course.code}</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Instructor: {course.teacher && course.teacher.first_name ? `${course.teacher.first_name} ${course.teacher.last_name || ''}` : (course.instructor || 'TBA')}
              </p>
              {course.is_enrolled && course.description && (
                <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{course.description}</p>
              )}
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${
              darkMode 
                ? 'bg-orange-900/20 text-orange-400' 
                : 'bg-orange-100 text-orange-600'
            }`}>
              {course.progress}%
            </span>
          </div>
          
          <div className={`w-full rounded-full h-2 mb-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center space-x-4">
              <span className={`flex items-center space-x-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <Users className="w-4 h-4" />
                <span>{course.enrolled} students</span>
              </span>
              <span className={`flex items-center space-x-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
              View Course
            </button>
            <button className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
              darkMode
                ? 'bg-orange-900/20 text-orange-400 border-orange-800 hover:bg-orange-900/30'
                : 'bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200'
            }`}>
              Materials {course.materials_count ? `(${course.materials_count})` : ''}
            </button>
          </div>
        </div>
      ))}
    </div>

    {showRegister && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300">
        <div className={`w-full max-w-md rounded-xl p-6 transition-all duration-300 ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Register for Courses</h3>
            <button onClick={() => setShowRegister(false)} className={darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Select courses to register for the upcoming semester:</p>
            <div className="space-y-2">
              {/* show available courses (non-enrolled) for registration */}
              {availableCourses.map((course) => {
                const isEnrolled = course.is_enrolled || false;
                const checked = selectedCourseIds.has(course.id);
                return (
                <label key={course.id} className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  darkMode
                    ? 'border-slate-700 hover:bg-slate-700'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    className="rounded text-orange-500 focus:ring-orange-500 mt-1"
                    checked={checked}
                    disabled={isEnrolled}
                    onChange={() => {
                      const next = new Set(selectedCourseIds);
                      if (next.has(course.id)) next.delete(course.id);
                      else next.add(course.id);
                      setSelectedCourseIds(next);
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={darkMode ? 'text-white font-semibold' : 'text-slate-900 font-semibold'}>{course.name || course.title}</span>
                      {isEnrolled && <span className="text-xs text-green-600">Enrolled</span>}
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{course.description}</p>
                  </div>
                </label>
              )})}
            </div>
            <button
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300 disabled:opacity-60"
              disabled={selectedCourseIds.size === 0}
                onClick={async () => {
                try {
                  const ids = Array.from(selectedCourseIds);
                  const res = await api.courses.enroll(ids);
                  toast.success('Registered for selected courses');
                  // Re-fetch enrolled courses only for the dashboard
                  const response = await api.courses.getCourses({ enrolled: 'true' });
                  const courseList = Array.isArray(response) ? response : (response.courses || []);
                  setCourses(courseList);
                  // Update the available courses to remove any newly enrolled ones
                  setAvailableCourses(prev => prev.filter(c => !ids.includes(c.id)));
                  setShowRegister(false);
                } catch (error) {
                  console.error('Failed to register courses', error);
                  toast.error('Failed to register courses');
                }
              }}
            >
              Register Selected Courses
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default Courses;