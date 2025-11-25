// src/pages/dashboard/FacultyAttendance.jsx
import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, Download, Upload } from 'lucide-react';
import Card from '@/components/Card';
import StatsCard from '@/components/StatsCard';

const FacultyAttendance = () => {
  const [attendance, setAttendance] = useState([
    { 
      id: 1, 
      date: '2024-12-15', 
      class: 'MATH101', 
      present: 28, 
      absent: 4, 
      total: 32,
      status: 'completed'
    },
    { 
      id: 2, 
      date: '2024-12-14', 
      class: 'CS101', 
      present: 25, 
      absent: 3, 
      total: 28,
      status: 'completed'
    },
    { 
      id: 3, 
      date: '2024-12-13', 
      class: 'PHY101', 
      present: 30, 
      absent: 5, 
      total: 35,
      status: 'completed'
    },
    { 
      id: 4, 
      date: '2024-12-16', 
      class: 'MATH101', 
      present: 0, 
      absent: 0, 
      total: 32,
      status: 'upcoming'
    }
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: 'John Smith', status: 'present', lastAttendance: '2024-12-15' },
    { id: 2, name: 'Sarah Johnson', status: 'absent', lastAttendance: '2024-12-14' },
    { id: 3, name: 'Michael Brown', status: 'present', lastAttendance: '2024-12-15' },
    { id: 4, name: 'Emily Davis', status: 'present', lastAttendance: '2024-12-15' }
  ]);

  const stats = [
    { title: "Overall Attendance", value: "92%", subtitle: "This semester", icon: Users, color: "green" },
    { title: "Classes Taken", value: "45", subtitle: "Total sessions", icon: Calendar, color: "blue" },
    { title: "Average Present", value: "28", subtitle: "Per class", icon: CheckCircle, color: "orange" },
    { title: "Absent Today", value: "3", subtitle: "Across all classes", icon: XCircle, color: "purple" }
  ];

  const markAttendance = (studentId, status) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, status, lastAttendance: new Date().toISOString().split('T')[0] }
        : student
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Attendance</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track and manage student attendance
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-600 transition-all duration-300">
            <Upload className="w-4 h-4" />
            <span>Take Attendance</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Today's Attendance
            </h2>
            <span className="px-3 py-1 text-sm bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full">
              MATH101 - 10:00 AM
            </span>
          </div>

          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{student.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Last: {student.lastAttendance}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => markAttendance(student.id, 'present')}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      student.status === 'present'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => markAttendance(student.id, 'absent')}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      student.status === 'absent'
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-600 transition-all duration-300">
              Save Attendance
            </button>
          </div>
        </Card>

        {/* Attendance History */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Attendance History
          </h2>
          <div className="space-y-4">
            {attendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {record.class} - {record.date}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{record.present} present</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>{record.absent} absent</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    record.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                  }`}>
                    {record.status}
                  </span>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {Math.round((record.present / record.total) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FacultyAttendance;