// src/pages/dashboard/TaskBoard.jsx
import React, { useState } from 'react';
import { Trello, Plus, Clock, Calendar, BookOpen, Target, CheckCircle, MoreVertical } from 'lucide-react';
import Card from '@/components/common/ui/cards/Card';
import StatsCard from '@/components/common/ui/cards/StatsCard';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

const TaskBoard = () => {
   const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const [tasks, setTasks] = useState({
    todo: [
      { 
        id: 1, 
        title: 'Complete Math Assignment', 
        type: 'assignment', 
        dueDate: '2024-12-20',
        course: 'MATH101',
        priority: 'high',
        description: 'Solve calculus problems from chapter 5'
      },
      { 
        id: 2, 
        title: 'Study for Physics Quiz', 
        type: 'quiz', 
        dueDate: '2024-12-22',
        course: 'PHY101',
        priority: 'medium',
        description: 'Review chapters 1-4 for upcoming quiz'
      },
      { 
        id: 3, 
        title: 'Read Literature Chapters', 
        type: 'reading', 
        dueDate: '2024-12-19',
        course: 'ENG201',
        priority: 'low',
        description: 'Read Macbeth Act 1-3'
      }
    ],
    inProgress: [
      { 
        id: 4, 
        title: 'Programming Project', 
        type: 'project', 
        dueDate: '2024-12-25',
        course: 'CS101',
        priority: 'high',
        description: 'Build a React web application'
      }
    ],
    done: [
      { 
        id: 5, 
        title: 'Literature Essay', 
        type: 'assignment', 
        dueDate: '2024-12-10',
        course: 'ENG201',
        priority: 'medium',
        description: 'Analysis of Shakespearean themes'
      }
    ]
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const stats = [
    { title: "Total Tasks", value: "5", subtitle: "All categories", icon: Trello, color: "blue" },
    { title: "In Progress", value: "1", subtitle: "Currently working", icon: Clock, color: "orange" },
    { title: "Completed", value: "1", subtitle: "Finished tasks", icon: CheckCircle, color: "green" },
    { title: "Due Soon", value: "2", subtitle: "Next 3 days", icon: Calendar, color: "purple" }
  ];

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      type: 'custom',
      dueDate: 'No due date',
      course: 'General',
      priority: 'medium',
      description: 'New task to be completed'
    };
    setTasks(prev => ({
      ...prev,
      todo: [...prev.todo, newTask]
    }));
    setNewTaskTitle('');
  };

  const moveTask = (taskId, fromColumn, toColumn) => {
    const task = tasks[fromColumn].find(task => task.id === taskId);
    if (!task) return;
    setTasks(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(task => task.id !== taskId),
      [toColumn]: [...prev[toColumn], task]
    }));
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'orange', icon: BookOpen },
    { id: 'inProgress', title: 'In Progress', color: 'blue', icon: Clock },
    { id: 'done', title: 'Done', color: 'green', icon: CheckCircle }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'low': return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800';
      default: return 'bg-slate-100 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'assignment': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400';
      case 'quiz': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
      case 'project': return 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
      case 'reading': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      default: return 'bg-slate-100 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400';
    }
  };

  return (
  <div className={`min-h-screen space-y-6 p-6 ${darkMode ? '' : ''}`}>
    <div className="flex items-center justify-between">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? '' : ''}`}>
          Task Board
        </h1>
        <p className={darkMode ? '' : ''}>
          Organize and track your academic tasks
        </p>
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${
            darkMode 
              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
          }`}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button
          onClick={addTask}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
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

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.id} className={`rounded-xl p-4 min-h-96 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className={`flex items-center space-x-2 mb-4 p-2 rounded-lg ${
            darkMode
              ? `bg-${column.color}-900/20`
              : `bg-${column.color}-50`
          }`}>
            <column.icon className={`w-5 h-5 ${
              darkMode
                ? `text-${column.color}-400`
                : `text-${column.color}-600`
            }`} />
            <h3 className={`font-semibold ${
              darkMode
                ? `text-${column.color}-400`
                : `text-${column.color}-600`
            }`}>
              {column.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              darkMode ? 'bg-slate-700 text-white' : 'bg-white text-slate-900'
            }`}>
              {tasks[column.id].length}
            </span>
          </div>
          
          <div className="space-y-3">
            {tasks[column.id].map((task) => (
              <div
                key={task.id}
                className={`rounded-xl p-4 border cursor-pointer transition-all duration-200 group ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 hover:border-orange-500'
                    : 'bg-white border-slate-200 hover:border-orange-400'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`font-medium group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {task.title}
                  </h4>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <p className={`text-sm mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {task.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full ${getTypeColor(task.type)}`}>
                      {task.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <span className={darkMode ? 'text-slate-500' : 'text-slate-500'}>
                    {task.dueDate}
                  </span>
                </div>
                <div className={`mt-2 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  {task.course}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default TaskBoard;