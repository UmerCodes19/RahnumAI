import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, Download, Upload } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

const FacultyAttendance = () => {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';

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
    <div className={`min-h-screen space-y-4 sm:space-y-6 p-4 sm:p-6 ${darkMode ? '' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>Attendance</h1>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Track and manage student attendance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className={`touch-button flex items-center justify-center space-x-2 px-3 py-2 border rounded-xl transition-colors ${
            darkMode
              ? 'border-slate-600 text-slate-400 hover:bg-slate-700'
              : 'border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}>
            <Download className="w-4 h-4" />
            <span className="text-sm sm:text-base">Export</span>
          </button>
          <button className="touch-button flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-600 transition-all duration-300">
            <Upload className="w-4 h-4" />
            <span className="text-sm sm:text-base">Take Attendance</span>
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

      {/* Today's Attendance and History */}
      <div className="responsive-grid-2 gap-4 sm:gap-6">
        {/* Today's Attendance */}
        <div className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
            <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Today's Attendance
            </h2>
            <span className={`px-2 py-1 text-xs rounded-full text-center ${
              darkMode 
                ? 'bg-orange-900/20 text-orange-400' 
                : 'bg-orange-100 text-orange-600'
            }`}>
              MATH101 - 10:00 AM
            </span>
          </div>
          
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2 ${
                darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex-1">
                  <p className={`font-medium text-sm sm:text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>{student.name}</p>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    Last: {student.lastAttendance}
                  </p>
                </div>
                <div className="flex space-x-2 justify-end sm:justify-start">
                  <button
                    onClick={() => markAttendance(student.id, 'present')}
                    className={`touch-button px-3 py-2 text-sm rounded-lg transition-colors min-w-[80px] ${
                      student.status === 'present'
                        ? 'bg-green-500 text-white'
                        : darkMode
                        ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => markAttendance(student.id, 'absent')}
                    className={`touch-button px-3 py-2 text-sm rounded-lg transition-colors min-w-[80px] ${
                      student.status === 'absent'
                        ? 'bg-red-500 text-white'
                        : darkMode
                        ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <button className="touch-button w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-600 transition-all duration-300">
              Save Attendance
            </button>
          </div>
        </div>

        {/* Attendance History */}
        <div className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Attendance History
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {attendance.map((record) => (
              <div key={record.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2 ${
                darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm sm:text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {record.class} - {record.date}
                  </p>
                  <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm mt-1">
                    <span className={`flex items-center space-x-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      <span>{record.present} present</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      <span>{record.absent} absent</span>
                    </span>
                  </div>
                </div>
                <div className="text-right min-w-0">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    record.status === 'completed'
                      ? darkMode
                        ? 'bg-green-900/20 text-green-400'
                        : 'bg-green-100 text-green-600'
                      : darkMode
                      ? 'bg-orange-900/20 text-orange-400'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {record.status}
                  </span>
                  <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {Math.round((record.present / record.total) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAttendance;