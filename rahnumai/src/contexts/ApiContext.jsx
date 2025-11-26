import React, { createContext, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '@/services/api';

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  // Generic API Handler
  const callAPI = useCallback(async (apiFunction, ...args) => {
    try {
      const response = await apiFunction(...args);
      return response;
    } catch (error) {
      console.error('API Error:', error);

      if (error.message?.includes('401') || error.message?.includes('token')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      } else if (error.message?.includes('Network Error')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.message || 'Something went wrong');
      }
      throw error;
    }
  }, []);

  // Auth
  const login = useCallback(
    (credentials) => callAPI(api.auth.login, credentials),
    [callAPI]
  );

  const signUp = useCallback(
    (userData) => callAPI(api.auth.signUp, userData),
    [callAPI]
  );

  // User
  const getProfile = useCallback(
    () => callAPI(api.users.getProfile),
    [callAPI]
  );

  // Courses
  const getCourses = useCallback(
    (filters = {}) => callAPI(api.courses.getCourses, filters),
    [callAPI]
  );

  const createCourse = useCallback(
    (courseData) => callAPI(api.courses.createCourse, courseData),
    [callAPI]
  );

  // Assignments
  const getAssignments = useCallback(
    (filters = {}) => callAPI(api.assignments.getAssignments, filters),
    [callAPI]
  );

  const submitAssignment = useCallback(
    (assignmentId, submissionData) =>
      callAPI(api.assignments.submitAssignment, assignmentId, submissionData),
    [callAPI]
  );

  // Analytics
  const getDashboardStats = useCallback(
    () => callAPI(api.analytics.getDashboardStats),
    [callAPI]
  );

  // AI – Chat
  const chatWithAI = useCallback(
    (message, context = {}) => callAPI(api.ai.chat, message, context),
    [callAPI]
  );

  // AI – Learning Path
  const generateLearningPath = useCallback(
    async (studentData, preferences) =>
      callAPI(async () => ({
        path: [
          {
            module: 'Mathematics Fundamentals',
            duration: '2 weeks',
            resources: ['Video Lectures', 'Practice Problems'],
            objectives: ['Master basic algebra', 'Understand functions'],
          },
        ],
      })),
    [callAPI]
  );

  // AI – Grade Prediction
  const predictGrades = useCallback(
    (studentPerformance) =>
      callAPI(async () => ({
        predictions: [
          { course: 'Mathematics', predictedGrade: 85, confidence: 0.92 },
          { course: 'Physics', predictedGrade: 78, confidence: 0.85 },
        ],
      })),
    [callAPI]
  );

  // AI – Well-being Analysis
  const analyzeWellBeing = useCallback(
    (studentData) =>
      callAPI(async () => ({
        score: 7.5,
        riskFactors: ['Sleep deprivation', 'High workload'],
        recommendations: ['Take regular breaks', 'Maintain sleep schedule'],
      })),
    [callAPI]
  );

  // AI – Exam Paper Generator
  const generateExamPaper = useCallback(
    (config) =>
      callAPI(async () => ({
        paper: {
          title: `${config.subject} Examination`,
          questions: Array.from(
            { length: config.totalQuestions },
            (_, i) => ({
              id: i + 1,
              text: `Sample question ${i + 1}`,
              marks: config.totalMarks / config.totalQuestions,
            })
          ),
        },
      })),
    [callAPI]
  );

  // Expose Everything
  const value = {
    login,
    signUp,
    getProfile,

    getCourses,
    createCourse,

    getAssignments,
    submitAssignment,

    getDashboardStats,

    chatWithAI,

    generateLearningPath,
    predictGrades,
    analyzeWellBeing,
    generateExamPaper,

    api, // raw access
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};
