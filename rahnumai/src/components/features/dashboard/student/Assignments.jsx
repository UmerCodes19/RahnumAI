// src/pages/dashboard/Assignments.jsx
import React, { useState } from 'react';
import { FileText, Upload, Clock, AlertCircle, CheckCircle, Download, Eye } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import StatsCard from '@/components/common/ui/cards/StatsCard';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

const Assignments = () => {

  const { theme } = useThemeGlobal();
      const darkMode = theme === 'dark';
  const [assignments, setAssignments] = useState([
    { 
      id: 1, 
      title: 'Math Problem Set', 
      course: 'MATH101', 
      dueDate: '2024-12-20', 
      status: 'pending', 
      type: 'AI Generated',
      description: 'Solve the following calculus problems and show your work.',
      points: 100,
      submitted: false
    },
    { 
      id: 2, 
      title: 'Programming Project', 
      course: 'CS101', 
      dueDate: '2024-12-25', 
      status: 'submitted', 
      type: 'AI Generated',
      description: 'Create a web application using React and Node.js.',
      points: 150,
      submitted: true,
      grade: 'A-'
    },
    { 
      id: 3, 
      title: 'Physics Lab Report', 
      course: 'PHY101', 
      dueDate: '2024-12-18', 
      status: 'pending', 
      type: 'Regular',
      description: 'Write a comprehensive report on the pendulum experiment.',
      points: 80,
      submitted: false
    },
    { 
      id: 4, 
      title: 'Literature Essay', 
      course: 'ENG201', 
      dueDate: '2024-12-22', 
      status: 'graded', 
      type: 'Regular',
      description: 'Analyze the themes in Shakespeare\'s Macbeth.',
      points: 100,
      submitted: true,
      grade: 'B+'
    }
  ]);

  const [courseFilter, setCourseFilter] = useState('all');
  

  const stats = [
    { title: "Due This Week", value: "3", subtitle: "Assignments pending", icon: Clock, color: "orange" },
    { title: "Submitted", value: "2", subtitle: "Completed assignments", icon: CheckCircle, color: "green" },
    { title: "Average Grade", value: "B+", subtitle: "Current performance", icon: FileText, color: "blue" },
    { title: "Late Submissions", value: "0", subtitle: "On track", icon: AlertCircle, color: "purple" }
  ];

  const handleSubmit = (assignmentId) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, status: 'submitted', submitted: true }
        : assignment
    ));
  };
  

  return (
  <div className={`min-h-screen space-y-6 p-6 ${darkMode ? '' : ''}`}>
    <div className="flex items-center justify-between">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>Assignments</h1>
        <p className={darkMode ? '' : ''}>
          Manage and submit your course assignments
        </p>
      </div>
      <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2">
        <Upload className="w-4 h-4" />
        <span>Upload Assignment</span>
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

    <div className="grid grid-cols-1 gap-6">
      {assignments.map((assignment) => (
        <div key={assignment.id} className={`rounded-xl p-6 transition-all duration-300 border ${
          darkMode 
            ? 'bg-slate-800 border-slate-700 hover:border-orange-500' 
            : 'bg-white border-slate-200 hover:border-orange-400'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {assignment.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full border ${
                  assignment.type === 'AI Generated'
                    ? darkMode
                      ? 'bg-orange-900/20 text-orange-400 border-orange-800'
                      : 'bg-orange-100 text-orange-600 border-orange-200'
                    : darkMode
                    ? 'bg-blue-900/20 text-blue-400 border-blue-800'
                    : 'bg-blue-100 text-blue-600 border-blue-200'
                }`}>
                  {assignment.type}
                </span>
              </div>
              <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {assignment.course} • Due: {assignment.dueDate}
              </p>
              <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                {assignment.description}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 text-sm rounded-full border ${
                assignment.status === 'submitted' || assignment.status === 'graded'
                  ? darkMode
                    ? 'bg-green-900/20 text-green-400 border-green-800'
                    : 'bg-green-100 text-green-600 border-green-200'
                  : darkMode
                  ? 'bg-orange-900/20 text-orange-400 border-orange-800'
                  : 'bg-orange-100 text-orange-600 border-orange-200'
              }`}>
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </span>
              {assignment.grade && (
                <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Grade: {assignment.grade}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Points: {assignment.points}</span>
              <span className={`flex items-center space-x-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <Clock className="w-4 h-4" />
                <span>Due in 3 days</span>
              </span>
            </div>
            <div className="flex space-x-2">
              <button className={`flex items-center space-x-1 px-3 py-2 transition-colors ${
                darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'
              }`}>
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              {!assignment.submitted && (
                <button
                  onClick={() => handleSubmit(assignment.id)}
                  className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
                >
                  <Upload className="w-4 h-4" />
                  <span>Submit</span>
                </button>
              )}
              {assignment.submitted && (
                <button className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default Assignments;