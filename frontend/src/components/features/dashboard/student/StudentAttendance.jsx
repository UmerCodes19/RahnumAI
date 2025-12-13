import { useState, useEffect } from 'react';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { Calendar, Clock, Users, BookOpen, TrendingUp, Download } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import Card from '@/components/common/ui/cards/Card';
import StatsCard from '@/components/common/ui/cards/StatsCard';

export default function StudentAttendance() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [coursesData, setCoursesData] = useState([]);
  
  const courses = coursesData.length ? coursesData : [];

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        const cs = await api.courses.getCourses({ enrolled: 'true' });
        const courseList = Array.isArray(cs) ? cs : (cs.courses || []);
        const enriched = [];
        for (const c of courseList) {
          try {
            const att = await api.courses.getAttendance(c.id);
            const percent = att && att.overall && att.overall.percent ? Math.round(att.overall.percent) : 0;
            enriched.push({ ...c, attendancePercentage: percent, attendedHours: 0, totalHours: 0 });
          } catch (e) {
            enriched.push({ ...c, attendancePercentage: 0, attendedHours: 0, totalHours: 0 });
          }
        }
        setCoursesData(enriched);
      } catch (e) {
        console.error('Failed to load enrolled courses and attendance', e);
        toast.error('Failed to load enrolled courses');
      }
    };
    loadEnrollments();
  }, []);

  const attendanceStats = [
    {
      title: "Overall Attendance",
      value: "83.7%",
      subtitle: "Across all courses",
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "Classes Attended",
      value: "130",
      subtitle: "Out of 155 total",
      icon: Calendar,
      color: "blue"
    },
    {
      title: "Perfect Attendance",
      value: "2",
      subtitle: "Courses with 90%+",
      icon: BookOpen,
      color: "purple"
    },
    {
      title: "Need Improvement",
      value: "1",
      subtitle: "Below 80%",
      icon: Clock,
      color: "orange"
    }
  ];

  const getStatusColor = (percentage) => {
    if (percentage >= 85) return 'text-green-600 dark:text-green-400';
    if (percentage >= 75) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusBgColor = (percentage) => {
    if (percentage >= 85) return 'bg-green-100 dark:bg-green-900/20';
    if (percentage >= 75) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
  <div className={`min-h-screen space-y-6 p-6 ${darkMode ? '' : ''}`}>
    <div>
      <h1 className={`text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>
        Course Attendance
      </h1>
      <p className={darkMode ? '' : ''}>
        Track your attendance across all enrolled courses
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {attendanceStats.map((stat, index) => (
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Filter by Course
          </h3>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            View attendance for specific courses
          </p>
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            darkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
          }`}
        >
          <option value="all">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="space-y-4">
      {courses
        .filter(course => selectedCourse === 'all' || course.id === selectedCourse)
        .map((course) => (
          <div key={course.id} className={`rounded-xl p-6 transition-all duration-300 border ${
            darkMode 
              ? 'bg-slate-800 border-slate-700 hover:border-orange-500' 
              : 'bg-white border-slate-200 hover:border-orange-400'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`font-semibold text-lg mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {course.code} - {course.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Faculty: {course.faculty}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(course.attendancePercentage)} ${getStatusColor(course.attendancePercentage)}`}>
                    {course.attendancePercentage}%
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Schedule</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{course.schedule}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Credits</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{course.credits}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Users className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Hours</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {course.attendedHours}/{course.totalHours}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Attendance Progress</span>
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{course.attendancePercentage}%</span>
                  </div>
                  <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        course.attendancePercentage >= 85
                          ? 'bg-green-500'
                          : course.attendancePercentage >= 75
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${course.attendancePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="lg:text-right">
                <div className="space-y-2">
                  <button className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
                    View Detailed Report
                  </button>
                  <button className={`w-full lg:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}>
                    Download Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>

    <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Good (85%+)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Satisfactory (75-84%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Needs Improvement (Below 75%)</span>
        </div>
      </div>
    </div>
  </div>
);
}