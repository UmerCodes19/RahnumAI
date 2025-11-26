// src/pages/dashboard/Assignments.jsx
import React, { useState } from 'react';
import { FileText, Upload, Clock, AlertCircle, CheckCircle, Download, Eye } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import StatsCard from '@/components/common/ui/cards/StatsCard';

const Assignments = () => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Assignments</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage and submit your course assignments
          </p>
        </div>
        <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Upload Assignment</span>
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

      <Card className="p-4">
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="flex-1">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Filter by Course
      </label>
      <select
        value={courseFilter}
        onChange={(e) => setCourseFilter(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="all">All Courses</option>
        <option value="MATH101">Mathematics 101</option>
        <option value="CS101">Computer Science</option>
        <option value="PHY101">Physics</option>
      </select>
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Filter by Status
      </label>
      <select
        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="all">All Status</option>
        <option value="available">Available</option>
        <option value="completed">Completed</option>
        <option value="upcoming">Upcoming</option>
      </select>
    </div>
  </div>
</Card>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 gap-6">
        {assignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="p-6 hover:shadow-lg transition-all duration-300"
            spotlightColor="#f39c12"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                    {assignment.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    assignment.type === 'AI Generated' 
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                      : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  }`}>
                    {assignment.type}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {assignment.course} • Due: {assignment.dueDate}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  {assignment.description}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  assignment.status === 'submitted' || assignment.status === 'graded'
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                }`}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
                {assignment.grade && (
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">
                    Grade: {assignment.grade}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                <span>Points: {assignment.points}</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Due in 3 days</span>
                </span>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assignments;