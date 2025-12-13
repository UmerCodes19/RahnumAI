// src/pages/dashboard/Assignments.jsx
import React, { useState, useEffect } from 'react';
import { FileText, Upload, Clock, AlertCircle, CheckCircle, Download, Eye } from 'lucide-react';
// imports trimmed: Card and StatsCard not used in this component
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import api from '@/services/api';
import { toast } from 'react-toastify';

const Assignments = () => {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const [assignments, setAssignments] = useState([]);
  const [studentSubmissions, setStudentSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [uploadFiles, setUploadFiles] = useState({});
  const [submitting, setSubmitting] = useState({});

  // Fetch assignments from API on mount
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        // Load student's enrolled courses
        const cs = await api.courses.getCourses();
        const courseList = Array.isArray(cs) ? cs : (cs.courses || []);
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData && userData.id;
        // Filter courses where the student is enrolled. Mock API returns is_enrolled flag.
        const enrolled = (Array.isArray(courseList) ? courseList : []).filter(c => Boolean(c.is_enrolled));
        setCourses(enrolled);
        const initialCourseId = selectedCourseId || (enrolled.length ? Number(enrolled[0].id) : null);
        setSelectedCourseId(initialCourseId);
        let response = [];
        if (initialCourseId) {
          response = await api.courses.getAssignments(initialCourseId);
        } else {
          response = [];
        }
        const assignmentList = Array.isArray(response) ? response : (response.assignments || []);
        setAssignments(assignmentList);
        // Fetch student's submissions for any assignments that are marked as submitted
        try {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          const sid = userData && userData.id;
          if (sid && assignmentList.length) {
            const submissionsMap = {};
            for (const a of assignmentList) {
              try {
                const subs = await api.assignments.getSubmissions(a.id);
                const list = Array.isArray(subs) ? subs : (subs.submissions || []);
                const yours = list.find(s => (s.student && s.student.id === sid) || s.student_id === sid);
                if (yours) submissionsMap[a.id] = yours;
              } catch (e) { /* ignore */ }
            }
            setStudentSubmissions(submissionsMap);
            // mark assignments as submitted if it's present in the submissions map
            setAssignments(prev => prev.map(a => ({ ...a, submitted: !!submissionsMap[a.id] })));
          }
        } catch (e) { /* ignore parsing user */ }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        // Use empty array on error (will show no assignments)
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const refreshAssignments = async () => {
    setLoading(true);
    try {
      if (!selectedCourseId) {
        // reload across all enrolled
        const allAssignments = [];
        for (const c of courses) {
          try {
            const res = await api.courses.getAssignments(Number(c.id));
            const al = Array.isArray(res) ? res : (res.assignments || res || []);
            allAssignments.push(...al);
          } catch (e) {}
        }
        setAssignments(allAssignments.map(a => ({ ...a, submitted: !!(studentSubmissions && studentSubmissions[a.id]) })));
      } else {
        const res = await api.courses.getAssignments(selectedCourseId);
        const al = Array.isArray(res) ? res : (res.assignments || res || []);
        setAssignments(al.map(a => ({ ...a, submitted: !!(studentSubmissions && studentSubmissions[a.id]) })));
      }
    } catch (e) {
      console.error('Failed to refresh assignments', e);
    } finally { setLoading(false); }
  };

  // Also re-fetch assignments when selectedCourseId changes
  useEffect(() => {
    const loadForCourse = async () => {
      if (!selectedCourseId) {
        // Load assignments across all enrolled courses
        if (!courses || courses.length === 0) return;
        setLoading(true);
        try {
          const allAssignments = [];
          for (const c of courses) {
            try {
              const res = await api.courses.getAssignments(Number(c.id));
              const al = Array.isArray(res) ? res : (res.assignments || res || []);
              allAssignments.push(...al);
            } catch (err) { /* ignore per-course failure */ }
          }
          setAssignments(allAssignments);
          // load submissions for these assignments similarly
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          const sid = userData && userData.id;
          const submissionsMap = {};
          for (const a of allAssignments) {
            try {
              const subs = await api.assignments.getSubmissions(a.id);
              const list = Array.isArray(subs) ? subs : (subs.submissions || []);
              const yours = list.find(s => (s.student && s.student.id === sid) || s.student_id === sid);
              if (yours) submissionsMap[a.id] = yours;
            } catch (e) { /* ignore */ }
          }
          setStudentSubmissions(submissionsMap);
          setAssignments(prev => prev.map(a => ({ ...a, submitted: !!submissionsMap[a.id] })));
        } catch (err) {
          console.error('Failed to load assignments across all courses', err);
        } finally {
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      try {
        const res = await api.courses.getAssignments(selectedCourseId);
        const al = Array.isArray(res) ? res : (res.assignments || res || []);
        setAssignments(al);
        // load student submissions for these assignments
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const sid = userData && userData.id;
        const submissionsMap = {};
        for (const a of al) {
          try {
            const subs = await api.assignments.getSubmissions(a.id);
            const list = Array.isArray(subs) ? subs : (subs.submissions || []);
            const yours = list.find(s => (s.student && s.student.id === sid) || s.student_id === sid);
            if (yours) submissionsMap[a.id] = yours;
          } catch (e) { /* ignore */ }
        }
        setStudentSubmissions(submissionsMap);
        setAssignments(prev => prev.map(a => ({ ...a, submitted: !!submissionsMap[a.id] })));
      } catch (err) {
        console.error('Failed to load assignments for course', err);
      } finally {
        setLoading(false);
      }
    };
    loadForCourse();
  }, [selectedCourseId]);

  const stats = [
    { title: "Due This Week", value: assignments.filter(a => a.status === 'pending').length.toString(), subtitle: "Assignments pending", icon: Clock, color: "orange" },
    { title: "Submitted", value: assignments.filter(a => a.submitted).length.toString(), subtitle: "Completed assignments", icon: CheckCircle, color: "green" },
    { title: "Average Grade", value: "B+", subtitle: "Current performance", icon: FileText, color: "blue" },
    { title: "Late Submissions", value: "0", subtitle: "On track", icon: AlertCircle, color: "purple" }
  ];

  const handleSubmit = async (assignmentId) => {
    try {
      setSubmitting(prev => ({ ...prev, [assignmentId]: true }));
      const formData = new FormData();
      // API expects field name `assignment` (not assignment_id)
      formData.append('assignment', assignmentId);
      // If the user selected a file, include it as `content`.
      const file = uploadFiles[assignmentId];
      if (file) {
        formData.append('content', file);
      } else {
        formData.append('content', 'Assignment submission');
      }
      
      const response = await api.assignments.submitAssignment(formData);
      
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'submitted', submitted: true }
          : assignment
      ));
      // Save returned submission
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      setStudentSubmissions(prev => ({ ...prev, [assignmentId]: response }));
      setUploadFiles(prev => {
        const next = { ...prev };
        delete next[assignmentId];
        return next;
      });
      
      // clear submitting flag in a finally-like manner
      setSubmitting(prev => {
        const next = { ...prev };
        delete next[assignmentId];
        return next;
      });
      toast.success('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment');
      setSubmitting(prev => {
        const next = { ...prev };
        delete next[assignmentId];
        return next;
      });
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
      <button onClick={refreshAssignments} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2">
        <Upload className="w-4 h-4" />
        <span>Refresh</span>
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
            value={selectedCourseId || ''}
            onChange={(e) => setSelectedCourseId(Number(e.target.value) || null)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name || c.title || c.code}</option>
            ))}
          </select>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6">
      {assignments.map((assignment) => {
        const statusText = assignment && assignment.status ? assignment.status : 'pending';
        return (
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
                {assignment.course} • Due: {assignment.dueDate || assignment.due_date}
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
                {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
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
              <div className="flex items-center space-x-2">
              <button className={`flex items-center space-x-1 px-3 py-2 transition-colors ${
                darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'
              }`}>
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              {assignment.file && (
                <a href={assignment.file} target="_blank" rel="noreferrer" className="flex items-center space-x-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all duration-300">
                  <Download className="w-4 h-4" />
                  <span>Download Assignment</span>
                </a>
              )}
              </div>
              {!assignment.submitted && (
                <>
                  <label className="flex items-center space-x-2 cursor-pointer px-3 py-2 border rounded-lg" style={{ opacity: submitting[assignment.id] ? 0.7 : 1 }}>
                    <Upload className="w-4 h-4" />
                    <input type="file" className="hidden" disabled={Boolean(submitting[assignment.id])} onChange={(e) => setUploadFiles(prev => ({ ...prev, [assignment.id]: e.target.files?.[0] }))} />
                    <span className="text-sm">{uploadFiles[assignment.id] ? uploadFiles[assignment.id].name : 'Choose file'}</span>
                  </label>
                  <button
                    onClick={() => handleSubmit(assignment.id)}
                    disabled={Boolean(submitting[assignment.id])}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${submitting[assignment.id] ? 'bg-orange-400 cursor-not-allowed text-white' : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600'}`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>{submitting[assignment.id] ? 'Submitting...' : 'Submit'}</span>
                  </button>
                </>
              )}
              {(assignment.submitted || (studentSubmissions[assignment.id] && studentSubmissions[assignment.id].content)) && (
                <>
                  {studentSubmissions[assignment.id] && studentSubmissions[assignment.id].content ? (
                    <a href={studentSubmissions[assignment.id].content} target="_blank" rel="noreferrer" className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </a>
                  ) : (
                    <button className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}
                  {/* assignment file download shown above as part of action buttons */}
                </>
              )}
            </div>
          </div>
        </div>
      );
      })}
    </div>
  </div>
);
};

export default Assignments;