import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, UserCheck, XCircle, Eye, FileText } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

export default function AdminApprovals() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  
  const [requests, setRequests] = useState([
    {
      id: 1,
      user: { name: 'John Doe', email: 'john@university.edu', role: 'faculty' },
      type: 'Faculty Registration',
      submitted: '2024-01-15',
      department: 'Computer Science',
      documents: ['cv.pdf', 'degrees.pdf'],
      status: 'pending'
    },
    {
      id: 2,
      user: { name: 'Sarah Wilson', email: 'sarah@student.edu', role: 'student' },
      type: 'Student Registration',
      submitted: '2024-01-14',
      department: 'Engineering',
      documents: ['transcript.pdf'],
      status: 'pending'
    },
    {
      id: 3,
      user: { name: 'Dr. Mike Chen', email: 'mike@university.edu', role: 'faculty' },
      type: 'Faculty Registration',
      submitted: '2024-01-13',
      department: 'Mathematics',
      documents: ['cv.pdf', 'publications.pdf'],
      status: 'pending'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = requests.filter(req =>
    req.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleReject = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
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
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? '' : ''}`}>
            Registration Approvals
          </h1>
          <p className={`${darkMode ? '' : ''} mt-2`}>
            Review and manage pending registration requests
          </p>
        </div>

        {/* Search and Filters */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-6 mb-6`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={inputClasses.replace('px-4', 'pl-10 pr-4')}
              />
            </div>
            <button className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}>
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cardClasses}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {request.user.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {request.user.email}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-slate-500' : 'text-slate-500'}>Role:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'} capitalize`}>
                      {request.user.role}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-slate-500' : 'text-slate-500'}>Department:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {request.department}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-slate-500' : 'text-slate-500'}>Submitted:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {request.submitted}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Documents:
                  </h4>
                  <div className="space-y-1">
                    {request.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <FileText size={14} className="text-slate-400" />
                        <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{doc}</span>
                        <button className="ml-auto text-blue-600 hover:text-blue-700">
                          <Eye size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <UserCheck size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <UserCheck size={48} className="mx-auto" />
            </div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
              No pending requests
            </h3>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-400'}>
              All registration requests have been processed.
            </p>
          </div>
        )}

        {/* Request Details Modal */}
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className={`${cardClasses} w-full max-w-2xl`}>
              <div className="p-6">
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Request Details
                </h3>
                {/* Add detailed request view here */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className={`flex-1 py-2 px-4 border rounded-lg transition-colors ${
                      darkMode 
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Close
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