// src/pages/dashboard/FacultyStudents.jsx
import React, { useState } from 'react';
import { Users, Search, Mail, Phone, Award, TrendingUp, Filter, Download } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import StatsCard from '@/components/common/ui/cards/StatsCard';

const FacultyStudents = () => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Students</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage and monitor your students' progress
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
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

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students by name, email, or enrollment..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            <option value="">All Courses</option>
            <option value="MATH101">Mathematics 101</option>
            <option value="CS101">Computer Science</option>
            <option value="PHY101">Physics</option>
          </select>
          <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="excellent">Excellent</option>
            <option value="active">Active</option>
            <option value="at-risk">At Risk</option>
          </select>
        </div>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card
            key={student.id}
            className="p-6 hover:shadow-lg transition-all duration-300 group"
            spotlightColor="#8311f2"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {student.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{student.course}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">ID: {student.enrollment}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(student.status)}`}>
                {student.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Performance</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{student.performance}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Attendance</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{student.attendance}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Assignments</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{student.assignments}/10</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <button className="flex items-center space-x-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </button>
              <button className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                <Award className="w-4 h-4" />
                <span>View Progress</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FacultyStudents;