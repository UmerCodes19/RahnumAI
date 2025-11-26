import { useState, useEffect } from 'react';
import { Brain, BookOpen, Target, Clock, CheckCircle } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import Card from '@/components/common/ui/cards/Card';
import { useApi } from '@/contexts/ApiContext';

export default function PersonalizedLearning() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const { chatWithAI } = useApi();
  
  const [learningPath, setLearningPath] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [progress, setProgress] = useState(0);

  const learningModules = [
    {
      id: 1,
      title: 'Introduction to Calculus',
      description: 'Fundamental concepts of differential calculus',
      duration: '2 hours',
      difficulty: 'Beginner',
      progress: 75,
      resources: ['Video Lectures', 'Practice Problems', 'AI Tutor'],
      prerequisites: ['Basic Algebra']
    },
    {
      id: 2,
      title: 'Advanced Programming Concepts',
      description: 'Object-oriented programming and data structures',
      duration: '4 hours',
      difficulty: 'Intermediate',
      progress: 30,
      resources: ['Interactive Coding', 'Code Reviews', 'AI Assistant'],
      prerequisites: ['Programming Basics']
    }
  ];

  const askAI = async (question) => {
    try {
      const response = await chatWithAI(question, { context: 'learning' });
      return response;
    } catch (error) {
      console.error('AI Learning Assistant error:', error);
    }
  };

  return (
  <div className={`min-h-screen space-y-6 p-6 ${darkMode ? '' : ''}`}>
    <div className="flex items-center justify-between">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>
          Personalized Learning
        </h1>
        <p className={darkMode ? '' : ''}>
          AI-powered learning path tailored just for you
        </p>
      </div>
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
        darkMode ? 'bg-orange-900/20' : 'bg-orange-100'
      }`}>
        <Brain className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
        <span className={`font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
          AI Active
        </span>
      </div>
    </div>

    <div className={`rounded-xl p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Your Learning Journey
        </h2>
        <span className={`px-3 py-1 text-sm rounded-full ${
          darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-600'
        }`}>
          {progress}% Complete
        </span>
      </div>
      <div className={`w-full rounded-full h-3 mb-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
        <div
          className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>5</div>
          <div className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Modules</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>12</div>
          <div className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Hours</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>3</div>
          <div className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Completed</div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {learningModules.map((module) => (
        <div key={module.id} className={`rounded-xl p-6 transition-all duration-300 border ${
          darkMode 
            ? 'bg-slate-800 border-slate-700 hover:border-orange-500' 
            : 'bg-white border-slate-200 hover:border-orange-400'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {module.title}
              </h3>
              <p className={`text-sm mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {module.description}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              module.difficulty === 'Beginner'
                ? darkMode
                  ? 'bg-green-900/20 text-green-400'
                  : 'bg-green-100 text-green-600'
                : darkMode
                ? 'bg-orange-900/20 text-orange-400'
                : 'bg-orange-100 text-orange-600'
            }`}>
              {module.difficulty}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Progress</span>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {module.progress}%
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={`flex items-center space-x-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <Clock className="w-4 h-4" />
                <span>{module.duration}</span>
              </span>
              <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{module.resources.length} resources</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
              Continue
            </button>
            <button className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
              darkMode
                ? 'bg-orange-900/20 text-orange-400 border-orange-800 hover:bg-orange-900/30'
                : 'bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200'
            }`}>
              Resources
            </button>
          </div>
        </div>
      ))}
    </div>

    <div className={`rounded-xl p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Brain className={`w-6 h-6 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          AI Learning Assistant
        </h2>
      </div>
      <p className={`mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        Ask questions about your learning materials and get instant AI-powered explanations.
      </p>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Ask about calculus, programming, or any subject..."
          className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            darkMode 
              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
          }`}
        />
        <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
          Ask AI
        </button>
      </div>
    </div>
  </div>
);
}