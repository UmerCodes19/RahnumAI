import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, Download, Upload } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

const FacultyAttendance = () => {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';

  const [attendance, setAttendance] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [students, setStudents] = useState([]);

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

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const cs = await api.courses.getCourses({ taught: 'true' });
        console.debug('GET /courses?taught=true response', cs);
        const courseList = Array.isArray(cs) ? cs : (cs.courses || []);
        setCourses(courseList);
        if (courseList.length > 0) setSelectedCourseId(Number(courseList[0].id));
        else console.debug('No courses found for teacher', localStorage.getItem('userData') || 'no-user');
      } catch (e) {
        console.error('Failed to load teacher courses', e);
        toast.error('Failed to load teacher courses');
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    const loadForCourse = async () => {
      if (!selectedCourseId) return;
      try {
        const studentsData = await api.courses.getStudents(selectedCourseId);
        setStudents(Array.isArray(studentsData) ? studentsData.map(s => ({ id: s.id, name: s.username, status: 'absent', lastAttendance: '' })) : []);
        const att = await api.courses.getAttendance(selectedCourseId);
        // att format currently is { sessions: [...], overall: {...} }
        const sessions = (att.sessions || []).map(s => {
          const present = (s.records || []).filter(r => r.status === 'present').length;
          const absent = (s.records || []).filter(r => r.status === 'absent').length;
          const total = (s.records || []).length;
          return { ...s, present, absent, total };
        });
        setAttendance(sessions);
      } catch (err) {
        console.error('Failed to load attendance for course', err);
      }
    };
    loadForCourse();
  }, [selectedCourseId]);

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
            <div className="flex items-center space-x-3">
                  <select value={selectedCourseId || ''} onChange={(e) => setSelectedCourseId(Number(e.target.value))} className="px-3 py-2 border rounded-lg">
                    {courses.length === 0 && <option value="">No classes found</option>}
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
            </div>
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
            <button
              onClick={async () => {
                try {
                  const records = students.map(s => ({ student_id: s.id, status: s.status || 'absent' }));
                  const payload = { session_date: new Date().toISOString().split('T')[0], records };
                  await api.courses.recordAttendance(selectedCourseId, payload);
                  toast.success('Attendance saved');
                  const att = await api.courses.getAttendance(selectedCourseId);
                  setAttendance(att.sessions || []);
                } catch (e) {
                  console.error('Failed to save attendance', e);
                  toast.error('Failed to save attendance');
                }
              }}
              className="touch-button w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-600 transition-all duration-300">
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