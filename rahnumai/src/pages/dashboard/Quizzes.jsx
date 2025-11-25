// src/pages/dashboard/Quizzes.jsx
import React, { useState } from 'react';
import { HelpCircle, Clock, Award, Play, CheckCircle, XCircle } from 'lucide-react';
import Card from '@/components/Card';
import StatsCard from '@/components/StatsCard';

const Quizzes = () => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Quizzes</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test your knowledge with interactive quizzes
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="p-6 hover:shadow-lg transition-all duration-300 group"
            spotlightColor="#f39c12"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {quiz.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    quiz.type === 'AI Tailored' 
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                      : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  }`}>
                    {quiz.type}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{quiz.course}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                quiz.difficulty === 'Easy' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  : quiz.difficulty === 'Medium'
                  ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              }`}>
                {quiz.difficulty}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Duration</span>
                <span>{quiz.duration}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Questions</span>
                <span>{quiz.questions}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Status</span>
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
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Your Score</span>
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
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              {quiz.status === 'available' ? 'Start Quiz' : 
               quiz.status === 'completed' ? 'View Results' : 'Coming Soon'}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;