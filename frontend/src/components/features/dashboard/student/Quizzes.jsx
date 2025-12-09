// src/pages/dashboard/Quizzes.jsx
import React, { useState } from 'react';
import { HelpCircle, Clock, Award, Play, CheckCircle, XCircle } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import StatsCard from '@/components/common/ui/cards/StatsCard';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

const Quizzes = () => {

 const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';

  const [quizzes, setQuizzes] = useState([
    { 
      id: 1, 
      title: 'Math Quiz - Chapter 3', 
      course: 'MATH101', 
      duration: '30 mins', 
      questions: 20, 
      status: 'available', 
      type: 'AI Tailored',
      difficulty: 'Medium',
      attempts: 1
    },
    { 
      id: 2, 
      title: 'CS Fundamentals', 
      course: 'CS101', 
      duration: '45 mins', 
      questions: 25, 
      status: 'completed', 
      type: 'AI Tailored',
      difficulty: 'Hard',
      score: '85%',
      attempts: 2
    },
    { 
      id: 3, 
      title: 'Physics Midterm', 
      course: 'PHY101', 
      duration: '60 mins', 
      questions: 30, 
      status: 'upcoming', 
      type: 'Regular',
      difficulty: 'Hard',
      availableFrom: '2024-12-20'
    },
    { 
      id: 4, 
      title: 'Literature Review', 
      course: 'ENG201', 
      duration: '25 mins', 
      questions: 15, 
      status: 'available', 
      type: 'Regular',
      difficulty: 'Easy',
      attempts: 0
    }
  ]);

const [courseFilter, setCourseFilter] = useState('all');


  const stats = [
    { title: "Available Quizzes", value: "2", subtitle: "Ready to take", icon: Play, color: "green" },
    { title: "Average Score", value: "82%", subtitle: "Overall performance", icon: Award, color: "blue" },
    { title: "Completed", value: "1", subtitle: "Quizzes finished", icon: CheckCircle, color: "orange" },
    { title: "Upcoming", value: "1", subtitle: "Scheduled quizzes", icon: Clock, color: "purple" }
  ];

  const handleStartQuiz = (quizId) => {
    // Simulate starting a quiz
    alert(`Starting quiz: ${quizzes.find(q => q.id === quizId)?.title}`);
  };

const filteredQuizzes = quizzes.filter(quiz => 
  courseFilter === 'all' || quiz.course === courseFilter
);

  return (
  <div className={`min-h-screen space-y-6 p-6 ${darkMode ? '' : ''}`}>
    <div className="flex items-center justify-between">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>Quizzes</h1>
        <p className={darkMode ? '' : ''}>
          Test your knowledge with interactive quizzes
        </p>
      </div>
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
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="all">All Courses</option>
            <option value="MATH101">Mathematics 101</option>
            <option value="CS101">Computer Science</option>
            <option value="PHY101">Physics</option>
          </select>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {quizzes.map((quiz) => (
        <div key={quiz.id} className={`rounded-xl p-6 transition-all duration-300 border ${
          darkMode 
            ? 'bg-slate-800 border-slate-700 hover:border-orange-500' 
            : 'bg-white border-slate-200 hover:border-orange-400'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className={`font-semibold text-lg group-hover:text-orange-600 transition-colors ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {quiz.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full border ${
                  quiz.type === 'AI Tailored'
                    ? darkMode
                      ? 'bg-orange-900/20 text-orange-400 border-orange-800'
                      : 'bg-orange-100 text-orange-600 border-orange-200'
                    : darkMode
                    ? 'bg-blue-900/20 text-blue-400 border-blue-800'
                    : 'bg-blue-100 text-blue-600 border-blue-200'
                }`}>
                  {quiz.type}
                </span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{quiz.course}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              quiz.difficulty === 'Easy'
                ? darkMode
                  ? 'bg-green-900/20 text-green-400'
                  : 'bg-green-100 text-green-600'
                : quiz.difficulty === 'Medium'
                ? darkMode
                  ? 'bg-orange-900/20 text-orange-400'
                  : 'bg-orange-100 text-orange-600'
                : darkMode
                ? 'bg-red-900/20 text-red-400'
                : 'bg-red-100 text-red-600'
            }`}>
              {quiz.difficulty}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Duration</span>
              <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{quiz.duration}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Questions</span>
              <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{quiz.questions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Status</span>
              <span className={`flex items-center space-x-1 ${
                quiz.status === 'available' ? 'text-green-600 dark:text-green-400' :
                quiz.status === 'completed' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
              }`}>
                {quiz.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                {quiz.status === 'upcoming' && <Clock className="w-4 h-4" />}
                {quiz.status === 'available' && <Play className="w-4 h-4" />}
                <span>{quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}</span>
              </span>
            </div>
            {quiz.score && (
              <div className="flex justify-between text-sm">
                <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Your Score</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{quiz.score}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => handleStartQuiz(quiz.id)}
            disabled={quiz.status === 'upcoming'}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
              quiz.status === 'available'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg'
                : quiz.status === 'completed'
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                : darkMode
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-slate-200 text-slate-600 cursor-not-allowed'
            }`}
          >
            {quiz.status === 'available' ? 'Start Quiz' :
             quiz.status === 'completed' ? 'View Results' : 'Coming Soon'}
          </button>
        </div>
      ))}
    </div>
  </div>
);
};

export default Quizzes;