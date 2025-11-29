import React, { useState } from 'react';
import { Users, Search, Mail, Phone, Award, TrendingUp, Filter, Download } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

const FacultyStudents = () => {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const [students, setStudents] = useState([
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@student.edu', 
      enrollment: '2023001', 
      course: 'MATH101',
      performance: 92,
      attendance: 95,
      assignments: 8,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah.j@student.edu', 
      enrollment: '2023002', 
      course: 'CS101',
      performance: 87,
      attendance: 88,
      assignments: 7,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      email: 'm.brown@student.edu', 
      enrollment: '2023003', 
      course: 'PHY101',
      performance: 78,
      attendance: 82,
      assignments: 6,
      status: 'at-risk'
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      email: 'emily.d@student.edu', 
      enrollment: '2023004', 
      course: 'ENG201',
      performance: 95,
      attendance: 98,
      assignments: 9,
      status: 'excellent'
    }
  ]);

  const stats = [
    { title: "Total Students", value: "120", subtitle: "Across all classes", icon: Users, color: "blue" },
    { title: "Average Performance", value: "85%", subtitle: "Class average", icon: Award, color: "green" },
    { title: "Attendance Rate", value: "92%", subtitle: "This semester", icon: TrendingUp, color: "orange" },
    { title: "Assignments Due", value: "23", subtitle: "To be graded", icon: Mail, color: "purple" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'active': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      case 'at-risk': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400';
      default: return 'bg-slate-100 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className={`min-h-screen space-y-4 sm:space-y-6 p-4 sm:p-6 ${darkMode ? '' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>Students</h1>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage and monitor your students' progress
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className={`touch-button flex items-center justify-center space-x-2 px-3 py-2 border rounded-xl transition-colors ${
            darkMode
              ? 'border-slate-600 text-slate-400 hover:bg-slate-700'
              : 'border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}>
            <Filter className="w-4 h-4" />
            <span className="text-sm sm:text-base">Filter</span>
          </button>
          <button className={`touch-button flex items-center justify-center space-x-2 px-3 py-2 border rounded-xl transition-colors ${
            darkMode
              ? 'border-slate-600 text-slate-400 hover:bg-slate-700'
              : 'border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}>
            <Download className="w-4 h-4" />
            <span className="text-sm sm:text-base">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="responsive-grid gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={stat.title} className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
              </div>
              <div>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.title}</p>
                <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search students by name, email, or enrollment..."
              className={`responsive-input w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>
          <select className={`responsive-input px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            darkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <option value="">All Courses</option>
            <option value="MATH101">Mathematics 101</option>
            <option value="CS101">Computer Science</option>
            <option value="PHY101">Physics</option>
          </select>
          <select className={`responsive-input px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            darkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <option value="">All Status</option>
            <option value="excellent">Excellent</option>
            <option value="active">Active</option>
            <option value="at-risk">At Risk</option>
          </select>
        </div>
      </div>

      {/* Students Grid */}
      <div className="responsive-grid gap-4 sm:gap-6">
        {students.map((student) => (
          <div
            key={student.id}
            className={`rounded-xl p-4 sm:p-6 transition-all duration-300 group border ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 hover:border-purple-500' 
                : 'bg-white border-slate-200 hover:border-purple-400'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-base sm:text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {student.name}
                </h3>
                <p className={`text-xs sm:text-sm truncate ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{student.course}</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>ID: {student.enrollment}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full self-start ${getStatusColor(student.status)}`}>
                {student.status}
              </span>
            </div>
            
            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Performance</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{student.performance}%</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Attendance</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{student.attendance}%</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Assignments</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{student.assignments}/10</span>
              </div>
            </div>
            
            <div className={`flex items-center justify-between pt-3 sm:pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <button className={`touch-button flex items-center space-x-1 text-xs sm:text-sm transition-colors ${
                darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
              }`}>
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Contact</span>
              </button>
              <button className={`touch-button flex items-center space-x-1 text-xs sm:text-sm transition-colors ${
                darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'
              }`}>
                <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>View Progress</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyStudents;