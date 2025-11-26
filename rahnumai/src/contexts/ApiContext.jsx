import React, { createContext, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '@/services/api'; // Import the default export

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  // Generic API call with error handling
  const callAPI = useCallback(async (apiFunction, ...args) => {
    try {
      const response = await apiFunction(...args);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle specific error cases
      if (error.message.includes('401') || error.message.includes('token')) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      } else if (error.message.includes('Network Error')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.message || 'Something went wrong');
      }
      
      throw error;
    }
  }, []);

  // Auth methods
  const login = useCallback(async (credentials) => {
    return callAPI(api.auth.login, credentials);
  }, [callAPI]);

  const signUp = useCallback(async (userData) => {
    return callAPI(api.auth.signUp, userData);
  }, [callAPI]);

  // User methods
  const getProfile = useCallback(async () => {
    return callAPI(api.users.getProfile);
  }, [callAPI]);

  // Course methods
  const getCourses = useCallback(async (filters = {}) => {
    return callAPI(api.courses.getCourses, filters);
  }, [callAPI]);

  const createCourse = useCallback(async (courseData) => {
    return callAPI(api.courses.createCourse, courseData);
  }, [callAPI]);

  // Assignment methods
  const getAssignments = useCallback(async (filters = {}) => {
    return callAPI(api.assignments.getAssignments, filters);
  }, [callAPI]);

  const submitAssignment = useCallback(async (assignmentId, submissionData) => {
    return callAPI(api.assignments.submitAssignment, assignmentId, submissionData);
  }, [callAPI]);

  // Analytics methods
  const getDashboardStats = useCallback(async () => {
    return callAPI(api.analytics.getDashboardStats);
  }, [callAPI]);

  // AI methods
  const chatWithAI = useCallback(async (message, context = {}) => {
    return callAPI(api.ai.chat, message, context);
  }, [callAPI]);

  const value = {
    // Auth
    login,
    signUp,
    
    // Users
    getProfile,
    
    // Courses
    getCourses,
    createCourse,
    
    // Assignments
    getAssignments,
    submitAssignment,
    
    // Analytics
    getDashboardStats,
    
    // AI
    chatWithAI,
    
    // Raw API access (use sparingly)
    api,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};