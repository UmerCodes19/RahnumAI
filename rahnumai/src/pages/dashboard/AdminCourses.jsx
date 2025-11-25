import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Filter, BookOpen, Clock, Users, 
  Edit, Trash2, Save, X, Link, GraduationCap 
} from 'lucide-react';
import { useThemeGlobal } from '@/components/ThemeProvider';

export default function AdminCourses() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: 'CS101',
      name: 'Introduction to Computer Science',
      credits: 3,
      duration: '15 weeks',
      maxStudents: 50,
      prerequisites: [],
      department: 'Computer Science',
      status: 'active',
      description: 'Fundamental concepts of computer science and programming.'
    },
    // ... other courses
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    credits: 3,
    duration: '15 weeks',
    maxStudents: 30,
    prerequisites: [],
    department: '',
    description: ''
  });

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Engineering',
    'Business',
    'Arts'
  ];

  const allCourses = courses.filter(course => course.id !== editingCourse?.id);

  const filteredCourses = courses.filter(course =>
    (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
     course.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (departmentFilter === 'all' || course.department === departmentFilter)
  );

  const handleAddCourse = () => {
    if (!newCourse.code || !newCourse.name || !newCourse.department) {
      alert('Please fill in all required fields');
      return;
    }

    const course = {
      id: Date.now(),
      ...newCourse,
      status: 'active'
    };

    setCourses(prev => [...prev, course]);
    setNewCourse({
      code: '',
      name: '',
      credits: 3,
      duration: '15 weeks',
      maxStudents: 30,
      prerequisites: [],
      department: '',
      description: ''
    });
    setShowAddForm(false);
  };

  const handleEditCourse = (course) => {
    setEditingCourse({ ...course });
  };

  const handleSaveEdit = () => {
    if (!editingCourse.code || !editingCourse.name || !editingCourse.department) {
      alert('Please fill in all required fields');
      return;
    }

    setCourses(prev => prev.map(course => 
      course.id === editingCourse.id ? editingCourse : course
    ));
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(prev => prev.filter(course => course.id !== id));
    }
  };

  const addPrerequisite = (courseCode) => {
    if (courseCode && !editingCourse.prerequisites.includes(courseCode)) {
      setEditingCourse(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, courseCode]
      }));
    }
  };

  const removePrerequisite = (courseCode) => {
    setEditingCourse(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(code => code !== courseCode)
    }));
  };

  const inputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
    darkMode 
      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
  }`;

  const cardClasses = `rounded-xl shadow-sm border overflow-hidden ${
    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  }`;

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Course Management
            </h1>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-2`}>
              Create and manage courses across all departments
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Course
          </button>
        </div>

        {/* Filters */}
        <div className={cardClasses}>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search courses by name, code, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={inputClasses.replace('px-3 py-2', 'pl-10 pr-4 py-2')}
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className={inputClasses}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add Course Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cardClasses}
          >
            <div className="p-6 ">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Add New Course</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Course Code *
                  </label>
                  <input
                    type="text"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, code: e.target.value }))}
                    className={inputClasses}
                    placeholder="e.g., CS101"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Course Name *
                  </label>
                  <input
                    type="text"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                    className={inputClasses}
                    placeholder="e.g., Introduction to Computer Science"
                  />
                </div>
                {/* ... rest of the form fields with proper theme classes ... */}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddCourse}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  Add Course
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    darkMode 
                      ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cardClasses}
            >
              <div className="p-6">
                {editingCourse?.id === course.id ? (
                  /* Edit Form */
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingCourse.code}
                      onChange={(e) => setEditingCourse(prev => ({ ...prev, code: e.target.value }))}
                      className={`${inputClasses} font-semibold`}
                    />
                    <input
                      type="text"
                      value={editingCourse.name}
                      onChange={(e) => setEditingCourse(prev => ({ ...prev, name: e.target.value }))}
                      className={inputClasses}
                    />
                    
                    {/* Prerequisites */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Prerequisites
                      </label>
                      <div className="flex gap-2 mb-2">
                        <select
                          onChange={(e) => addPrerequisite(e.target.value)}
                          className={inputClasses}
                        >
                          <option value="">Add prerequisite...</option>
                          {allCourses.map(c => (
                            <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingCourse.prerequisites.map(prereq => (
                          <span key={prereq} className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm">
                            {prereq}
                            <button
                              onClick={() => removePrerequisite(prereq)}
                              className="hover:text-red-900 dark:hover:text-red-100"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCourse(null)}
                        className={`flex-1 py-2 px-3 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                            : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Course Display */
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {course.code}
                        </h3>
                        <h4 className={`${darkMode ? 'text-slate-300' : 'text-slate-700'} mt-1`}>
                          {course.name}
                        </h4>
                        <span className="inline-block px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full mt-2">
                          {course.department}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className={`p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50'
                          }`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className={`p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <BookOpen size={16} className="text-slate-400" />
                        <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{course.credits} credits</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock size={16} className="text-slate-400" />
                        <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Users size={16} className="text-slate-400" />
                        <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Max {course.maxStudents} students</span>
                      </div>
                      
                      {course.prerequisites.length > 0 && (
                        <div className="flex items-center gap-3 text-sm">
                          <Link size={16} className="text-slate-400" />
                          <div className="flex flex-wrap gap-1">
                            {course.prerequisites.map(prereq => (
                              <span key={prereq} className={`px-2 py-1 rounded-full text-xs ${
                                darkMode 
                                  ? 'bg-slate-700 text-slate-300' 
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {prereq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {course.description && (
                      <p className={`text-sm mt-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {course.description}
                      </p>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <BookOpen size={48} className="mx-auto" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              No courses found
            </h3>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              {searchTerm || departmentFilter !== 'all' 
                ? 'Try adjusting your search terms' 
                : 'Get started by adding your first course'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}