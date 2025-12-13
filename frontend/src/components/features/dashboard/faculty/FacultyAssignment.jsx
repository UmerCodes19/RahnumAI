import React, { useState, useEffect } from 'react';
// no icons required here
import api from '@/services/api';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

const FacultyAssignment = () => {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';

  // previously used selectedClass state was removed
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const [assignTitle, setAssignTitle] = useState('');
  const [assignDescription, setAssignDescription] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignFile, setAssignFile] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [editingGrades, setEditingGrades] = useState({});
  const [savingGrades, setSavingGrades] = useState({});

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const cs = await api.courses.getCourses({ taught: 'true' });
        const courseList = Array.isArray(cs) ? cs : (cs.courses || []);
        setCourses(courseList);
        if (courseList.length > 0) setSelectedCourseId(Number(courseList[0].id));
      } catch (e) {
        console.error('Failed to load courses', e);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    const loadAssignments = async () => {
      if (!selectedCourseId) return;
      try {
        const res = await api.courses.getAssignments(selectedCourseId);
        setAssignments(Array.isArray(res) ? res : (res || []));
      } catch (err) {
        console.error('Failed to load assignments', err);
      }
    };
    loadAssignments();
  }, [selectedCourseId]);

  const onCreateAssignment = async () => {
    if (!selectedCourseId || !assignTitle || !assignDueDate) {
      return alert('Please choose a course, provide a title and a due date');
    }
    try {
      const formData = new FormData();
      formData.append('title', assignTitle);
      formData.append('description', assignDescription);
      formData.append('course', String(selectedCourseId));
      formData.append('due_date', assignDueDate);
      if (assignFile) formData.append('file', assignFile);
      const res = await api.courses.createAssignment(selectedCourseId, formData);
      setAssignments(prev => [res, ...prev]);
      setAssignTitle(''); setAssignDescription(''); setAssignDueDate(''); setAssignFile(null);
      alert('Assignment created');
    } catch (err) {
      console.error('Failed to create assignment', err);
      try {
        if (err && err.data) {
          const details = Object.entries(err.data).map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`).join('\n');
          return alert(`Failed to create assignment:\n${details}`);
        }
      } catch (e) {}
      alert('Failed to create assignment');
    }
  };

  const loadSubmissionsFor = async (assignmentId) => {
    try {
      const res = await api.assignments.getSubmissions(assignmentId);
      setSubmissions(Array.isArray(res) ? res : (res.submissions || []));
      setSelectedAssignment(assignmentId);
      // Initialize editing grades state with existing grades if present
      const returned = Array.isArray(res) ? res : (res.submissions || []);
      const gradeInitial = {};
      returned.forEach(s => { if (s && s.id) gradeInitial[s.id] = s.grade ?? ''; });
      setEditingGrades(gradeInitial);
    } catch (err) {
      console.error('Failed to load submissions', err);
    }
  };

  const onGradeChange = (submissionId, value) => {
    setEditingGrades(prev => ({ ...prev, [submissionId]: value }));
  };

  const saveGrade = async (submission) => {
    const gradeVal = editingGrades[submission.id];
    if (gradeVal == null || gradeVal === '') return alert('Please enter a grade');
    setSavingGrades(prev => ({ ...prev, [submission.id]: true }));
    try {
      const res = await api.assignments.updateSubmission(submission.id, { grade: Number(gradeVal) });
      setSubmissions(prev => prev.map(s => s.id === res.id ? res : s));
      alert('Grade saved');
    } catch (err) {
      console.error('Failed to save grade', err);
      alert('Failed to save grade');
    } finally {
      setSavingGrades(prev => {
        const next = { ...prev };
        delete next[submission.id];
        return next;
      });
    }
  };

  return (
    <div className={`min-h-screen space-y-4 sm:space-y-6 p-4 sm:p-6 ${darkMode ? '' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>Assignment</h1>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage assignments and submissions for your classes</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select value={selectedCourseId || ''} onChange={(e) => setSelectedCourseId(Number(e.target.value))} className={`responsive-input px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name || c.title || c.code}</option>
            ))}
          </select>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className={`responsive-input px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="semester">This Semester</option>
          </select>
        </div>
      </div>

      {/* Assignment Uploader & Submissions */}
      <div className="responsive-grid gap-4 sm:gap-6">
        <div className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Assignment Uploader</h2>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input value={assignTitle} onChange={(e) => setAssignTitle(e.target.value)} placeholder="Assignment Title" className="px-3 py-2 border rounded flex-1" />
              <input type="date" value={assignDueDate} onChange={(e) => setAssignDueDate(e.target.value)} className="px-3 py-2 border rounded" />
            </div>
            <textarea value={assignDescription} onChange={(e) => setAssignDescription(e.target.value)} placeholder="Description" rows={3} className="w-full px-3 py-2 border rounded"></textarea>
            <div className="flex items-center gap-2">
              <input type="file" onChange={(e) => setAssignFile(e.target.files?.[0] || null)} />
              {assignFile && <div className="text-xs text-slate-500">{assignFile.name}</div>}
              <button onClick={onCreateAssignment} className="px-4 py-2 rounded bg-purple-600 text-white">Upload Assignment</button>
            </div>
          </div>
        </div>
        <div className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Assignments</h2>
          <div className="space-y-3">
            {assignments.length === 0 && <div className="text-xs text-slate-400">No assignments found for this course.</div>}
            {assignments.map(a => (
              <div key={a.id} className={`p-3 border rounded flex justify-between items-center ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
                <div>
                  <div className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{a.title}</div>
                  <div className="text-xs text-slate-500">Due: {(a.due_date || a.dueDate) ? new Date((a.due_date || a.dueDate)).toLocaleDateString() : 'N/A'}</div>
                </div>
                <div className="flex items-center gap-2">
                  {a.file && <a href={a.file} target="_blank" rel="noreferrer" className="text-xs underline">Download</a>}
                  <button onClick={() => loadSubmissionsFor(a.id)} className="px-3 py-2 rounded border text-xs">View Submissions</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions Panel */}
      {selectedAssignment && (
        <div className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Submissions</h3>
          {submissions.length === 0 && <div className="text-xs text-slate-400">No submissions yet.</div>}
          <div className="space-y-2">
            {submissions.map(s => (
              <div key={s.id} className={`p-3 border rounded flex items-center justify-between ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
                <div>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{s.student ? (s.student.username || s.student.first_name || 'Student') : `Student ${s.student_id}`}</div>
                  <div className="text-xs text-slate-500">Submitted: {s.submitted_at ? new Date(s.submitted_at).toLocaleString() : '—'}</div>
                </div>
                <div className="flex items-center gap-2">
                  {s.content && <a href={s.content} target="_blank" rel="noreferrer" className="text-sm underline">Download</a>}
                  <div className="text-sm flex items-center gap-2">Grade: <input type="number" min={0} max={100} value={editingGrades[s.id] ?? (s.grade ?? '')} onChange={(e) => onGradeChange(s.id, e.target.value)} className="w-20 px-2 py-1 border rounded" /></div>
                  <button onClick={() => saveGrade(s)} disabled={Boolean(savingGrades[s.id])} className={`px-3 py-1 rounded ${savingGrades[s.id] ? 'bg-green-400 opacity-60 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white text-xs`}>Save</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default FacultyAssignment;
