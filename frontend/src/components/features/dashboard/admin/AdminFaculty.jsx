import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Mail, Phone, MapPin, Edit, Trash2, BookOpen } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

export default function AdminFaculty() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  
  const [faculty, setFaculty] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah@university.edu',
      phone: '+1 (555) 123-4567',
      department: 'Computer Science',
      courses: ['CS101', 'CS301'],
      status: 'active',
      joinDate: '2022-08-15'
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      email: 'michael@university.edu',
      phone: '+1 (555) 987-6543',
      department: 'Mathematics',
      courses: ['MATH201', 'MATH401'],
      status: 'active',
      joinDate: '2021-01-10'
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      email: 'emily@university.edu',
      phone: '+1 (555) 456-7890',
      department: 'Physics',
      courses: ['PHY101', 'PHY301'],
      status: 'on-leave',
      joinDate: '2023-03-20'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaculty = faculty.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const cardClasses = `rounded-xl shadow-sm border overflow-hidden ${
    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  }`;

  const inputClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
    darkMode 
      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
  }`;

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? '' : ''}`}>
              Faculty Management
            </h1>
            <p className={`${darkMode ? '' : ''} mt-2`}>
              Manage faculty members and their assignments
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Faculty
          </button>
        </div>

        {/* Search */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-6 mb-6`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search faculty by name, department, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inputClasses.replace('px-4', 'pl-10 pr-4')}
            />
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cardClasses}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} text-lg`}>
                      {member.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full mt-2 inline-block ${getStatusColor(member.status)}`}>
                      {member.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className={`p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50'
                    }`}>
                      <Edit size={16} />
                    </button>
                    <button className={`p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'
                    }`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-slate-400" />
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-slate-400" />
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-slate-400" />
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{member.department}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Assigned Courses:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {member.courses.map((course, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                  <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    Joined: {member.joinDate}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFaculty.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              No faculty members found
            </h3>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              Try adjusting your search terms or add new faculty members.
            </p>
          </div>
        )}

        {/* Add Faculty Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4`}
          >
            <div className={`${cardClasses} w-full max-w-md`}>
              <div className="p-6">
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Add New Faculty
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Full Name
                    </label>
                    <input type="text" className={inputClasses} placeholder="Dr. John Smith" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Email
                    </label>
                    <input type="email" className={inputClasses} placeholder="john@university.edu" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Department
                    </label>
                    <select className={inputClasses}>
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors">
                    Add Faculty
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
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
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}