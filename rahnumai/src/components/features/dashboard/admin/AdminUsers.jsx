import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Mail, Phone, MapPin, Edit, Trash2, UserPlus } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

export default function AdminUsers() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@university.edu',
      phone: '+1 (555) 123-4567',
      role: 'student',
      department: 'Computer Science',
      status: 'active',
      joinDate: '2023-09-01'
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      email: 'sarah@university.edu',
      phone: '+1 (555) 987-6543',
      role: 'faculty',
      department: 'Mathematics',
      status: 'active',
      joinDate: '2022-08-15'
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@university.edu',
      phone: '+1 (555) 456-7890',
      role: 'admin',
      department: 'Administration',
      status: 'active',
      joinDate: '2021-01-10'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter === 'all' || user.role === roleFilter)
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'faculty': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'student': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              User Management
            </h1>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-2`}>
              Manage all users across the platform
            </p>
          </div>
          <button className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <UserPlus size={20} />
            Add User
          </button>
        </div>

        {/* Filters */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-6 mb-6`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search users by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                }`}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {user.name}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
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
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-slate-400" />
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-slate-400" />
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{user.department}</span>
                  </div>
                </div>

                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                  <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    Joined: {user.joinDate}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              No users found
            </h3>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              Try adjusting your search terms or add new users.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}