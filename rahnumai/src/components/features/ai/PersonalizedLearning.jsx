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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Personalized Learning
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            AI-powered learning path tailored just for you
          </p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
          <Brain className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <span className="text-orange-600 dark:text-orange-400 font-medium">
            AI Active
          </span>
        </div>
      </div>

      {/* Learning Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Your Learning Journey
          </h2>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm">
            {progress}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">5</div>
            <div className="text-slate-600 dark:text-slate-400">Modules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</div>
            <div className="text-slate-600 dark:text-slate-400">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">3</div>
            <div className="text-slate-600 dark:text-slate-400">Completed</div>
          </div>
        </div>
      </Card>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningModules.map((module) => (
          <Card key={module.id} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg mb-2">
                  {module.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                  {module.description}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                module.difficulty === 'Beginner' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  : 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
              }`}>
                {module.difficulty}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Progress</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {module.progress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{module.duration}</span>
                </span>
                <span>{module.resources.length} resources</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
                Continue
              </button>
              <button className="flex-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors border border-orange-200 dark:border-orange-800">
                Resources
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Learning Assistant */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            AI Learning Assistant
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Ask questions about your learning materials and get instant AI-powered explanations.
        </p>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Ask about calculus, programming, or any subject..."
            className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
            Ask AI
          </button>
        </div>
      </Card>
    </div>
  );
}