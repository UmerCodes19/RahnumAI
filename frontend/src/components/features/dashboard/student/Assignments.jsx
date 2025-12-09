// src/pages/dashboard/Assignments.jsx
import React, { useState, useEffect } from 'react';
import { FileText, Upload, Clock, AlertCircle, CheckCircle, Download, Eye } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import StatsCard from '@/components/common/ui/cards/StatsCard';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import api from '@/services/api';
import { toast } from 'react-toastify';

const Assignments = () => {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('all');

  // Fetch assignments from API on mount
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await api.assignments.submitAssignment ? 
          await api.courses.getAssignments(1) : // Fetch for a sample course
          [];
        const assignmentList = Array.isArray(response) ? response : (response.assignments || []);
        setAssignments(assignmentList);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        // Use empty array on error (will show no assignments)
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const stats = [
    { title: "Due This Week", value: assignments.filter(a => a.status === 'pending').length.toString(), subtitle: "Assignments pending", icon: Clock, color: "orange" },
    { title: "Submitted", value: assignments.filter(a => a.submitted).length.toString(), subtitle: "Completed assignments", icon: CheckCircle, color: "green" },
    { title: "Average Grade", value: "B+", subtitle: "Current performance", icon: FileText, color: "blue" },
    { title: "Late Submissions", value: "0", subtitle: "On track", icon: AlertCircle, color: "purple" }
  ];

  const handleSubmit = async (assignmentId) => {
    try {
      const formData = new FormData();
      formData.append('assignment_id', assignmentId);
      formData.append('content', 'Assignment submission');
      
      await api.assignments.submitAssignment(formData);
      
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'submitted', submitted: true }
          : assignment
      ));
      toast.success('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment');
    }
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