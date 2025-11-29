import { useState } from 'react';
import { Users, TrendingUp, TrendingDown, Award, AlertTriangle, BookOpen, Clock, Target, Zap, Shield, Heart } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import Card from '@/components/common/ui/cards/Card';

export default function ClassPerformance() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const courses = [
    { id: 'MATH101', name: 'Calculus I', students: 45 },
    { id: 'CS101', name: 'Computer Science', students: 32 },
    { id: 'PHY101', name: 'Physics Fundamentals', students: 28 }
  ];

  const students = [
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

  const filteredStudents = students.filter(student => 
    selectedCourse === 'all' || student.course === selectedCourse
  );

  return (
    <div className={`min-h-screen space-y-4 sm:space-y-6 p-4 sm:p-6 ${darkMode ? '' : ''}`}>
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>
          Class Performance
        </h1>
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
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={`responsive-input w-full sm:w-auto px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.students} students)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Students List */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
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
                    <span>{student.performance}%</span>
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
                  <span>{selectedStudent.performance}%</span>
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
                <div className="space-y-2 sm:space-y-3">
                  {Object.entries(selectedStudent.traits).map(([trait, value]) => (
                    <div key={trait} className="flex items-center justify-between">
                      <span className={`text-xs sm:text-sm font-medium capitalize min-w-0 truncate mr-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {trait}
                      </span>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className={`w-16 sm:w-24 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div
                            className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs sm:text-sm font-medium w-6 sm:w-8 text-right ${getTraitColor(value)}`}>
                          {value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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