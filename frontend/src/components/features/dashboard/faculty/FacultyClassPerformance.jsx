import { useState, useEffect } from 'react';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { Users, TrendingUp, TrendingDown, Award, AlertTriangle, BookOpen, Clock, Target, Zap, Shield, Heart } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import Card from '@/components/common/ui/cards/Card';

export default function ClassPerformance() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [scoreInput, setScoreInput] = useState('');
  const [remarkInput, setRemarkInput] = useState('');
  const [overallAvg, setOverallAvg] = useState(null);

  const defaultTraits = { intelligence: 75, creativity: 70, diligence: 72, collaboration: 75, speed: 70 };

  // default placeholders when no real API available
  const localPlaceholders = [
    {
      id: 1,
      name: 'Emily Davis',
      avatar: 'ED',
      course: 'MATH101',
      performance: 96,
      attendance: 98,
      assignments: 10,
      quizzes: 8,
      participation: 95,
      strengths: ['Quick Learner', 'Excellent Problem Solver', 'Active Participant'],
      weaknesses: ['Sometimes rushes through work', 'Could improve documentation'],
      traits: {
        intelligence: 95,
        creativity: 88,
        diligence: 92,
        collaboration: 85,
        speed: 78
      },
      status: 'excellent'
    },
    {
      id: 2,
      name: 'John Smith',
      avatar: 'JS',
      course: 'CS101',
      performance: 87,
      attendance: 95,
      assignments: 8,
      quizzes: 7,
      participation: 82,
      strengths: ['Strong technical skills', 'Good team player'],
      weaknesses: ['Struggles with theory', 'Needs to improve time management'],
      traits: {
        intelligence: 85,
        creativity: 82,
        diligence: 88,
        collaboration: 90,
        speed: 75
      },
      status: 'good'
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      avatar: 'SW',
      course: 'PHY101',
      performance: 72,
      attendance: 85,
      assignments: 6,
      quizzes: 5,
      participation: 70,
      strengths: ['Creative thinker', 'Persistent'],
      weaknesses: ['Struggles with complex concepts', 'Needs more practice'],
      traits: {
        intelligence: 75,
        creativity: 85,
        diligence: 80,
        collaboration: 78,
        speed: 70
      },
      status: 'needs_attention'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'good': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'needs_attention': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <Award className="w-4 h-4" />;
      case 'good': return <TrendingUp className="w-4 h-4" />;
      case 'needs_attention': return <AlertTriangle className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getTraitColor = (value) => {
    if (value >= 90) return 'text-green-600 dark:text-green-400';
    if (value >= 80) return 'text-blue-600 dark:text-blue-400';
    if (value >= 70) return 'text-purple-600 dark:text-purple-400';
    return 'text-red-600 dark:text-red-400';
  };

  const selectedCourseNormalized = (selectedCourse === 'all' || selectedCourse === '' || !selectedCourse) ? null : Number(selectedCourse);
  const filteredStudents = students.filter(student => {
    if (!selectedCourseNormalized) return true;
    // Compare by numeric course_id (normalized)
    return Number(student.course_id) === selectedCourseNormalized;
  });
  console.debug('FacClassPerf: selectedCourseNormalized ->', selectedCourseNormalized);
  console.debug('FacClassPerf: filteredStudents ->', filteredStudents.length, filteredStudents.map(s => ({ id: s.id, course_id: s.course_id })) );

  // Additional debug logging to surface potential mismatches in types and values
  console.debug('FacClassPerf: selectedCourse info:', { selectedCourse, selectedCourseType: typeof selectedCourse, selectedCourseRaw: String(selectedCourse) });
  console.debug('FacClassPerf: courses list:', courses.map(c => ({ id: c.id, name: c.name })));
  console.debug('FacClassPerf: students list (summary):', students.map(s => ({ id: s.id, course_id: s.course_id, name: s.name }))); 

  useEffect(() => {
    // Load taught courses for the teacher
    const loadCourses = async () => {
      try {
        const cs = await api.courses.getCourses({ taught: 'true' });
        console.debug('FacClassPerf: GET /courses?taught=true ->', cs);
        const courseList = Array.isArray(cs) ? cs : (cs.courses || []);
        setCourses(courseList);
        if (courseList.length > 0) setSelectedCourse(Number(courseList[0].id));
      } catch (e) {
        console.error('Failed to load teacher courses', e);
        toast.error('Failed to load courses');
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    const loadStudentsAndPerformance = async () => {
      if (!selectedCourse) return;
      try {
        const sRes = await api.courses.getStudents(selectedCourse);
        console.debug('FacClassPerf: GET /courses/:id/students ->', selectedCourse, sRes);
        // normalize studentsList
        let studentsList;
        if (!sRes) {
          studentsList = [];
        } else if (Array.isArray(sRes)) {
          studentsList = sRes;
        } else if (sRes.students && Array.isArray(sRes.students)) {
          studentsList = sRes.students;
        } else if (sRes.data && Array.isArray(sRes.data)) {
          studentsList = sRes.data;
        } else if (sRes.results && Array.isArray(sRes.results)) {
          studentsList = sRes.results;
        } else {
          // If it's an object with keys, attempt to convert entries
          studentsList = Object.values(sRes).filter(v => v && typeof v === 'object' && 'id' in v);
        }
        console.debug('FacClassPerf: normalized studentsList ->', studentsList);
        const pRes = await api.courses.getPerformance(selectedCourse);
        // attendance data for the course
        const aRes = await api.courses.getAttendance(selectedCourse);
        const perfList = (pRes && (pRes.performances || Array.isArray(pRes))) ? (pRes.performances || pRes) : (Array.isArray(pRes) ? pRes : []);
        console.debug('FacClassPerf: GET /courses/:id/performance ->', selectedCourse, perfList);
        if (pRes && typeof pRes.overall_avg !== 'undefined') setOverallAvg(pRes.overall_avg);
        const perfMap = new Map(perfList.map(p => [p.student.id, p]));
        // build attendance map
        const sessions = (aRes && aRes.sessions) ? aRes.sessions : [];
        const presentCount = {};
        sessions.forEach(sess => {
          (sess.records || []).forEach(r => {
            const sid = r.student && r.student.id;
            if (!sid) return;
            presentCount[sid] = (presentCount[sid] || 0) + (r.status === 'present' ? 1 : 0);
          });
        });
        const enriched = studentsList.map(s => ({
          id: s.id,
          username: s.username || s.name || `${s.first_name || ''} ${s.last_name || ''}`.trim(),
          name: s.first_name ? `${s.first_name} ${s.last_name || ''}`.trim() : (s.username || s.name),
          avatar: (s.first_name && s.last_name) ? `${s.first_name.slice(0,1)}${s.last_name.slice(0,1)}` : (s.username ? s.username.slice(0,2).toUpperCase() : 'NA'),
          course_id: Number(selectedCourse),
          course: courses.find(c => Number(c.id) === Number(selectedCourse))?.name || '',
          performance: perfMap.has(s.id) ? perfMap.get(s.id).score : null,
          remark: perfMap.has(s.id) ? perfMap.get(s.id).remark : '',
          attendance: sessions.length ? Math.round(((presentCount[s.id] || 0) / sessions.length) * 100) : null,
          assignments: 0,
          quizzes: 0,
          participation: 0,
          strengths: [],
          weaknesses: [],
          traits: perfMap.has(s.id) && perfMap.get(s.id).traits ? perfMap.get(s.id).traits : { intelligence: 75, creativity: 70, diligence: 72, collaboration: 75, speed: 70 },
          status: perfMap.has(s.id) ? (perfMap.get(s.id).score >= 90 ? 'excellent' : perfMap.get(s.id).score >= 75 ? 'good' : 'needs_attention') : 'unknown',
        }));
        setStudents(enriched);
        // Reset selectedStudent if it's not in the new list
        if (selectedStudent) {
          const exists = enriched.find(st => st.id === selectedStudent.id);
          if (!exists) setSelectedStudent(null);
          else {
            const updated = exists;
            setSelectedStudent(updated);
            setScoreInput(updated.performance != null ? String(updated.performance) : '');
            setRemarkInput(updated.remark || '');
          }
        }
      } catch (err) {
        console.error('Failed to load students or performance', err);
        toast.error('Failed to load students or performance');
        setStudents([]);
      }
    };
    loadStudentsAndPerformance();
  }, [selectedCourse, courses]);

  const handleTraitChange = (traitKey, value) => {
    const intVal = Number(value);
    console.debug(`FacClassPerf: trait change ${traitKey} ->`, intVal);
    setStudents(prev => prev.map(s => s.id === selectedStudent?.id ? { ...s, traits: { ...s.traits, [traitKey]: intVal } } : s));
    setSelectedStudent(prev => prev ? ({ ...prev, traits: { ...prev.traits, [traitKey]: intVal } }) : prev);
  };

  const initializeTraitsForSelected = (initial = defaultTraits) => {
    if (!selectedStudent) return;
    setSelectedStudent(prev => prev ? ({ ...prev, traits: { ...initial } }) : prev);
    setStudents(prev => prev.map(s => s.id === selectedStudent.id ? ({ ...s, traits: { ...initial } }) : s));
  };

  useEffect(() => {
    const ud = JSON.parse(localStorage.getItem('userData') || '{}' );
    const r = ud && (ud.role || localStorage.getItem('userRole'));
    // not storing in state because role is static in session. use local var for simplicity.
  }, []);

  // Debugging: log the current selectedStudent traits to verify structure
  useEffect(() => {
    if (!selectedStudent) return;
    try {
      console.debug('FacClassPerf: selectedStudent changed -> traits', selectedStudent.traits);
      // Ensure traits is a plain object to avoid rendering issues
      if (!selectedStudent.traits || typeof selectedStudent.traits !== 'object') {
        console.warn('FacClassPerf: selectedStudent.traits is not an object - forcing default trait values');
        setSelectedStudent(prev => prev ? ({ ...prev, traits: { intelligence: 75, creativity: 70, diligence: 72, collaboration: 75, speed: 70 } }) : prev);
      }
    } catch (err) {
      console.error('FacClassPerf: error while verifying traits', err);
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (!selectedStudent) {
      setScoreInput('');
      setRemarkInput('');
      return;
    }
    setScoreInput(selectedStudent.performance != null ? String(selectedStudent.performance) : '');
    setRemarkInput(selectedStudent.remark || '');
  }, [selectedStudent]);

  const onSavePerformance = async () => {
    if (!selectedCourse || !selectedStudent) return toast.error('No course or student selected');
    const scoreVal = scoreInput !== '' ? Number(scoreInput) : (selectedStudent.performance != null ? selectedStudent.performance : null);
    if (scoreInput !== '' && (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100)) return toast.error('Score must be a number between 0 and 100');
    const payload = { student_id: selectedStudent.id, score: scoreVal, remark: remarkInput, traits: selectedStudent.traits };
    try {
      await api.courses.assignPerformance(selectedCourse, payload);
      toast.success('Performance saved');
      // Optimistically update UI
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, performance: Number(scoreInput), remark: remarkInput, traits: selectedStudent.traits, status: Number(scoreInput) >= 90 ? 'excellent' : Number(scoreInput) >= 75 ? 'good' : 'needs_attention' } : s));
      setSelectedStudent(prev => prev ? ({ ...prev, performance: Number(scoreInput), remark: remarkInput, traits: selectedStudent.traits, status: Number(scoreInput) >= 90 ? 'excellent' : Number(scoreInput) >= 75 ? 'good' : 'needs_attention' }) : prev);
      // Reload overall average
      try {
        const pResNew = await api.courses.getPerformance(selectedCourse);
        if (pResNew && typeof pResNew.overall_avg !== 'undefined') setOverallAvg(pResNew.overall_avg);
      } catch (err) { /* ignore silently */ }
      // Refresh students & performance for the course to reflect persisted traits
      try {
        const sRes2 = await api.courses.getStudents(selectedCourse);
        const studentsList2 = Array.isArray(sRes2) ? sRes2 : (sRes2.students || sRes2.data || sRes2.results || Object.values(sRes2).filter(v => v && typeof v === 'object' && 'id' in v));
        const pRes2 = await api.courses.getPerformance(selectedCourse);
        const aRes2 = await api.courses.getAttendance(selectedCourse);
        const perfList2 = (pRes2 && (pRes2.performances || Array.isArray(pRes2))) ? (pRes2.performances || pRes2) : (Array.isArray(pRes2) ? pRes2 : []);
        if (pRes2 && typeof pRes2.overall_avg !== 'undefined') setOverallAvg(pRes2.overall_avg);
        const perfMap2 = new Map(perfList2.map(p => [p.student.id, p]));
        const sessions2 = (aRes2 && aRes2.sessions) ? aRes2.sessions : [];
        const presentCount2 = {};
        sessions2.forEach(sess => {
          (sess.records || []).forEach(r => {
            const sid = r.student && r.student.id;
            if (!sid) return;
            presentCount2[sid] = (presentCount2[sid] || 0) + (r.status === 'present' ? 1 : 0);
          });
        });
        const enriched2 = studentsList2.map(s => ({
          id: s.id,
          username: s.username || s.name || `${s.first_name || ''} ${s.last_name || ''}`.trim(),
          name: s.first_name ? `${s.first_name} ${s.last_name || ''}`.trim() : (s.username || s.name),
          avatar: (s.first_name && s.last_name) ? `${s.first_name.slice(0,1)}${s.last_name.slice(0,1)}` : (s.username ? s.username.slice(0,2).toUpperCase() : 'NA'),
          course_id: Number(selectedCourse),
          course: courses.find(c => Number(c.id) === Number(selectedCourse))?.name || '',
          performance: perfMap2.has(s.id) ? perfMap2.get(s.id).score : null,
          remark: perfMap2.has(s.id) ? perfMap2.get(s.id).remark : '',
          attendance: sessions2.length ? Math.round(((presentCount2[s.id] || 0) / sessions2.length) * 100) : null,
          assignments: 0,
          quizzes: 0,
          participation: 0,
          strengths: [],
          weaknesses: [],
          traits: perfMap2.has(s.id) && perfMap2.get(s.id).traits ? perfMap2.get(s.id).traits : { intelligence: 75, creativity: 70, diligence: 72, collaboration: 75, speed: 70 },
          status: perfMap2.has(s.id) ? (perfMap2.get(s.id).score >= 90 ? 'excellent' : perfMap2.get(s.id).score >= 75 ? 'good' : 'needs_attention') : 'unknown',
        }));
        setStudents(enriched2);
        if (selectedStudent) {
          const exists2 = enriched2.find(st => st.id === selectedStudent.id);
          if (!exists2) setSelectedStudent(null);
          else {
            setSelectedStudent({ ...exists2 });
            setScoreInput(exists2.performance != null ? String(exists2.performance) : '');
            setRemarkInput(exists2.remark || '');
          }
        }
      } catch (err2) {
        /* ignore refresh errors */
      }
    } catch (e) {
      console.error('Failed to save performance', e);
      toast.error('Failed to save performance');
    }
  };

  return (
    <div className={`min-h-screen space-y-4 sm:space-y-6 p-4 sm:p-6 ${darkMode ? '' : ''}`}>
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>
          Class Performance
        </h1>
        {selectedCourse && (
          <div className="inline-block mt-1 text-sm">
            <span className={`px-2 py-1 rounded-lg ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'}`}>Average Score: {overallAvg != null ? `${Math.round(overallAvg)}%` : '—'}</span>
          </div>
        )}
        <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Monitor student performance and provide targeted support
        </p>
      </div>

      {/* Filter Section */}
      <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h3 className={`font-semibold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Filter by Course
            </h3>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              View performance for specific courses
            </p>
          </div>
          <select
            value={selectedCourse || ''}
            onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : null)}
            className={`responsive-input w-full sm:w-auto px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.students} students)
              </option>
            ))}
          </select>
        </div>
          {import.meta.env.DEV && (
          <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border">
            <h4 className="text-xs mb-2">Debug: Students Raw State</h4>
            <pre className="text-xs overflow-auto">{JSON.stringify(students, null, 2)}</pre>
            <h4 className="text-xs mt-2 mb-2">Debug: Filtered Students & Mismatch</h4>
            <pre className="text-xs overflow-auto">{JSON.stringify({ selectedCourse, selectedCourseType: typeof selectedCourse, filteredStudentsSummary: filteredStudents.map(s => ({ id: s.id, course_id: s.course_id })) }, null, 2)}</pre>
            {students.length > 0 && filteredStudents.length === 0 && (
              <div className="mt-2 p-2 rounded bg-yellow-100 dark:bg-yellow-900/20">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">⚠️ Students are present but none match the selected course — there may be a type mismatch between course ids (string vs number) or the selected course is not set.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Students List */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {filteredStudents.length === 0 && (
            <div className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>No students found for this course.</p>
            </div>
          )}
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className={`rounded-xl p-4 sm:p-6 transition-all duration-300 cursor-pointer border ${
                selectedStudent?.id === student.id 
                  ? 'ring-2 ring-purple-600' 
                  : darkMode 
                  ? 'bg-slate-800 border-slate-700 hover:border-purple-600' 
                  : 'bg-white border-slate-200 hover:border-purple-400'
              }`}
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-600 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {student.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-semibold text-sm sm:text-base truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {student.name}
                    </h3>
                    <p className={`text-xs sm:text-sm truncate ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {student.course}
                    </p>
                  </div>
                </div>
                <div className="text-right min-w-0">
                  <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start space-x-1 ${getStatusColor(student.status)}`}>
                    {getStatusIcon(student.status)}
                    <span>{student.performance != null ? `${student.performance}%` : '—'}</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs mt-1 sm:mt-2">
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Attendance: {student.attendance}%</span>
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Assignments: {student.assignments}/10</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Student Details */}
        <div className="space-y-4 sm:space-y-6">
          {selectedStudent ? (
            <div className={`rounded-xl p-4 sm:p-6 sticky top-4 sm:top-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              {/* Student Header */}
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-600 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-xl">
                  {selectedStudent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-lg sm:text-xl font-bold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {selectedStudent.name}
                  </h2>
                  <p className={`text-xs sm:text-sm truncate ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {selectedStudent.course}
                  </p>
                </div>
                <div className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1 ${getStatusColor(selectedStudent.status)}`}>
                  {getStatusIcon(selectedStudent.status)}
                  <span>{selectedStudent.performance != null ? `${selectedStudent.performance}%` : '—'}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                    <Clock className={`w-3 h-3 sm:w-4 sm:h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                    <span className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Attendance</span>
                  </div>
                  <p className={`text-lg sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {selectedStudent.attendance}%
                  </p>
                </div>
                <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                    <BookOpen className={`w-3 h-3 sm:w-4 sm:h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                    <span className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Assignments</span>
                  </div>
                  <p className={`text-lg sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {selectedStudent.assignments}/10
                  </p>
                </div>
                <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                    <Target className={`w-3 h-3 sm:w-4 sm:h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                    <span className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Quizzes</span>
                  </div>
                  <p className={`text-lg sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {selectedStudent.quizzes}/8
                  </p>
                </div>
                <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                    <Users className={`w-3 h-3 sm:w-4 sm:h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                    <span className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Participation</span>
                  </div>
                  <p className={`text-lg sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {selectedStudent.participation}%
                  </p>
                </div>
              </div>

              {/* Assign Performance */}
              <div className="mb-4">
                <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Assign Performance</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    className="px-3 py-2 border rounded-lg w-24"
                  />
                  <input
                    type="text"
                    placeholder="Optional remark"
                    value={remarkInput}
                    onChange={(e) => setRemarkInput(e.target.value)}
                    className="px-3 py-2 border rounded-lg flex-1"
                  />
                  <button
                    onClick={onSavePerformance}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 text-white"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <h3 className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 mb-2 sm:mb-3">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Strengths</span>
                  </h3>
                  <ul className="space-y-1 sm:space-y-2">
                    {selectedStudent.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center space-x-2 text-xs sm:text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2 sm:mb-3">
                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Areas for Improvement</span>
                  </h3>
                  <ul className="space-y-1 sm:space-y-2">
                    {selectedStudent.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-center space-x-2 text-xs sm:text-sm">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full flex-shrink-0"></div>
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Student Traits */}
                <div>
                  <h3 className="flex items-center space-x-2 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className={darkMode ? 'text-white' : 'text-slate-900'}>Student Traits</span>
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {/* Debug: trait summary */}
                    {import.meta.env.DEV && (
                      <div className="text-xs text-slate-400 mb-2">Trait keys: {Object.keys(selectedStudent.traits || {}).join(', ') || '(none)'}</div>
                    )}
                    {Object.entries(selectedStudent.traits || {}).map(([trait, value]) => (
                      <div key={trait} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-xs sm:text-sm font-medium capitalize min-w-0 truncate ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{trait}</span>
                        </div>
                        <div className="flex-1 flex items-center gap-3">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={(typeof value === 'number' && !isNaN(value)) ? value : (Number(value) || 0)}
                            onChange={(e) => handleTraitChange(trait, Math.max(0, Math.min(100, Number(e.target.value || 0))))}
                            className="w-full h-2 accent-purple-500"
                            aria-label={`${trait} slider`}
                            title={`${trait} (${value}%)`}
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={(typeof value === 'number' && !isNaN(value)) ? value : (Number(value) || 0)}
                            onChange={(e) => handleTraitChange(trait, Math.max(0, Math.min(100, Number(e.target.value || 0))))}
                            className="w-16 px-2 py-1 border rounded"
                          />
                          <span className={`text-xs sm:text-sm font-medium w-8 text-right ${getTraitColor(value)}`}>{value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(!selectedStudent.traits || Object.keys(selectedStudent.traits).length === 0) && (
                    <div className="mt-3 p-3 rounded bg-slate-50 dark:bg-slate-800 border">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs">No traits configured for this student.</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => initializeTraitsForSelected()} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">Initialize Traits</button>
                          <button onClick={() => { initializeTraitsForSelected(defaultTraits); }} className="px-3 py-1 rounded border text-sm">Reset to Defaults</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
            </div>
          ) : (
            <div className={`rounded-xl p-6 sm:p-12 text-center ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-3 sm:mb-4" />
              <h3 className={`text-base sm:text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Select a Student
              </h3>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Click on a student card to view detailed performance metrics and insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}