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
      case 'needs_attention': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
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
    if (value >= 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const filteredStudents = students.filter(student => 
    selectedCourse === 'all' || student.course === selectedCourse
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Class Performance
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Monitor student performance and provide targeted support
        </p>
      </div>

      {/* Course Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Filter by Course
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              View performance for specific courses
            </p>
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.students} students)
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredStudents.map(student => (
            <Card 
              key={student.id} 
              className={`p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                selectedStudent?.id === student.id ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {student.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {student.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {student.course}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(student.status)}`}>
                    {getStatusIcon(student.status)}
                    <span>{student.performance}%</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <span>Attendance: {student.attendance}%</span>
                    <span>Assignments: {student.assignments}/10</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Student Details Panel */}
        <div className="space-y-6">
          {selectedStudent ? (
            <Card className="p-6 sticky top-6">
              {/* Student Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {selectedStudent.avatar}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedStudent.course}
                  </p>
                </div>
                <div className={`px-3 py-2 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(selectedStudent.status)}`}>
                  {getStatusIcon(selectedStudent.status)}
                  <span>{selectedStudent.performance}%</span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Attendance</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedStudent.attendance}%
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assignments</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedStudent.assignments}/10
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quizzes</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedStudent.quizzes}/8
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Participation</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedStudent.participation}%
                  </p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="flex items-center space-x-2 text-sm font-semibold text-green-700 dark:text-green-400 mb-3">
                    <Zap className="w-4 h-4" />
                    <span>Strengths</span>
                  </h3>
                  <ul className="space-y-2">
                    {selectedStudent.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center space-x-2 text-sm font-semibold text-orange-700 dark:text-orange-400 mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Areas for Improvement</span>
                  </h3>
                  <ul className="space-y-2">
                    {selectedStudent.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Student Traits */}
              <div>
                <h3 className="flex items-center space-x-2 text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  <Heart className="w-4 h-4" />
                  <span>Student Traits</span>
                </h3>
                <div className="space-y-3">
                  {Object.entries(selectedStudent.traits).map(([trait, value]) => (
                    <div key={trait} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                        {trait}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium w-8 ${getTraitColor(value)}`}>
                          {value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Select a Student
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Click on a student card to view detailed performance metrics and insights
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}