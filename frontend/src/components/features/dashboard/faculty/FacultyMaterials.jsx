import React, { useState, useEffect } from 'react';
import { Upload, Download, FileText } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import api from '@/services/api';
import Card from '@/components/common/ui/cards/Card';
import { toast } from 'react-toastify';

export default function FacultyMaterials() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const cs = await api.courses.getCourses({ taught: 'true' });
        console.debug('FacultyMaterials | GET courses?taught=true ->', cs);
        const courseList = Array.isArray(cs) ? cs : (cs.courses || []);
        setCourses(courseList);
        if (courseList.length > 0) setSelectedCourseId(Number(courseList[0].id));
        else toast.info('You are not assigned as teacher for any course');
      } catch (e) {
        console.error('Failed to load teacher courses', e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadMaterials = async () => {
      if (!selectedCourseId) return;
      try {
        const mats = await api.courses.getMaterials(selectedCourseId);
        setMaterials(Array.isArray(mats) ? mats : (mats.materials || []));
      } catch (e) {
        console.error('Failed to load materials', e);
      }
    };
    loadMaterials();
  }, [selectedCourseId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedCourseId) return toast.error('Select a file and course');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    console.log(selectedCourseId)
    try {
      await api.courses.uploadMaterial(selectedCourseId, fd);
      toast.success('Uploaded material');
      setFile(null); setTitle('');
      const mats = await api.courses.getMaterials(selectedCourseId);
      setMaterials(Array.isArray(mats) ? mats : (mats.materials || []));
    } catch (err) {
      console.error('Upload failed', err);
      toast.error('Upload failed');
    }
  };

  return (
    <div className={`min-h-screen space-y-4 sm:space-y-6 p-4 sm:p-6 ${darkMode ? '' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>Materials</h1>
          <p className={darkMode ? '' : ''}>Manage course materials</p>
        </div>
      </div>

      <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <select value={selectedCourseId || ''} onChange={(e) => setSelectedCourseId(Number(e.target.value))} className="px-3 py-2 border rounded-lg">
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <form onSubmit={handleUpload} className="flex items-center space-x-2">
              <input  type="text" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} className="px-3 py-2 border rounded-lg" />
              <input className="px-3 py-2 border rounded-lg" placeholder='File' type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </form>
          </div>
          <div className="space-y-2">
            {materials.length === 0 && (<p>No materials found</p>)}
            {materials.map(m => (
              <Card key={m.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{m.title || m.file.split('/').pop()}</p>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{m.description || 'Uploaded'}</p>
                  </div>
                  <div>
                    <a href={'http://localhost:8000/'+ m.file} download className="px-3 py-2 rounded-lg border text-sm flex items-center space-x-2">
                      <Download className="w-4 h-4" /> <span>Download</span>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
