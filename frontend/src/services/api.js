import mockApi from './mockApi';

// Check if we're in development mode and should use mock data
  // const USE_MOCK_API = !import.meta.env.VITE_API_BASE_URL || 
  //                      import.meta.env.VITE_USE_MOCK_API === 'true' ||
  //                      process.env.NODE_ENV === 'development';

// Base API configuration
const USE_MOCK_API = false;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Generic API client for real backend
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    if (USE_MOCK_API) {
      // For mock API, we'll handle this differently
      throw new Error('Using mock API - real API client not available');
    }

    const url = `${this.baseURL}${endpoint}`;
    // If body is FormData, don't set Content-Type (browser will set boundary)
    const isFormData = options && options.body && (options.body instanceof FormData);
    const config = {
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken1');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debugging: log whether token is present and partially mask it
    try {
      const authHeader = config.headers && config.headers.Authorization;
      if (authHeader) {
        const masked = authHeader.length > 12 ? authHeader.slice(0, 12) + '...' : authHeader;
        console.debug('API auth header present:', masked);
      } else {
        console.debug('API auth header not present');
      }
    } catch (err) {
      // ignore logging errors
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Log full response for easier debugging
        console.error('API request failed', { url, status: response.status, data });
        // Throw a detailed error so callers can inspect `error.message`
        const message = (data && (data.detail || data.message)) || JSON.stringify(data) || response.statusText;
        const err = new Error(message || 'API request failed');
        err.status = response.status;
        err.data = data;
        throw err;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Post with FormData (multipart)
  postForm(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Real API functions (for when backend is ready)
const createRealAPI = () => {
  const apiClient = new ApiClient();

  return {
    auth: {
      login: async (credentials) => {
        const data = await apiClient.post('/login/', credentials);
        // Support both JWT pair and single-token responses
        console.log(data.access);
        console.log(data.token);
        if (data.access) localStorage.setItem('authToken1', data.access);
        else if (data.token) localStorage.setItem('authToken', data.token);
        if (data.refresh) localStorage.setItem('refreshToken', data.refresh);
        if (data.user) localStorage.setItem('userData', JSON.stringify(data.user));
        return data;
      },
      signUp: async (userData) => {
        let data;
        if (userData instanceof FormData) {
          data = await apiClient.postForm('/signup/', userData);
        } else {
          data = await apiClient.post('/signup/', userData);
        }

        // Persist tokens and user data if returned by backend
        if (data) {
          if (data.access) localStorage.setItem('authToken', data.access);
          else if (data.token) localStorage.setItem('authToken', data.token);
          if (data.refresh) localStorage.setItem('refreshToken', data.refresh);
          if (data.user) {
            localStorage.setItem('userData', JSON.stringify(data.user));
            if (data.user.role) localStorage.setItem('userRole', data.user.role);
          }
        }

        return data;
      },
    },
    users: {
      getProfile: async () => {
        return apiClient.get('/profile/');
      },
    },
    courses: {
      getCourses: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiClient.get(`/courses/${queryParams ? ('?' + queryParams) : ''}`);
      },
      getAssignments: async (courseId) => {
        return apiClient.get(`/courses/${courseId}/assignments/`);
      },
    },
    assignments: {
      submitAssignment: async (formData) => {
        return apiClient.postForm('/assignments/submit/', formData);
      },
    },
    analytics: {
      getDashboardStats: async () => {
        return apiClient.get('/dashboard/stats/');
      },
    },
    ai: {
      chatWithAI: async (payload) => apiClient.post('/ai/chat/', payload),
      generateLearningPath: async (payload) => apiClient.post('/ai/generate-learning-path/', payload),
      predictGrades: async () => apiClient.get('/ai/predict-grades/'),
      analyzeWellBeing: async () => apiClient.get('/ai/analyze-well-being/'),
      generateExamPaper: async (courseId, payload) => apiClient.post(`/ai/generate-exam-paper/${courseId}/`, payload),
    },
  };
};

// Mock API functions (for development)
const createMockAPI = () => {
  return {
    auth: {
      login: async (credentials) => {
        console.log('Mock API: Login attempt', credentials);
        const data = await mockApi.login(credentials);
        if (data.token) localStorage.setItem('authToken1', data.token);
        if (data.user) localStorage.setItem('userData1', JSON.stringify(data.user));
        return data;
      },
      signUp: async (userData) => {
        console.log('Mock API: Signup attempt', userData);
        return mockApi.signUp(userData);
      },
    },
    users: {
      getProfile: async () => {
        console.log('Mock API: Getting user profile');
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
      },
    },
    courses: {
      getCourses: async (filters = {}) => {
        console.log('Mock API: Getting courses', filters);
        return mockApi.getCourses(filters);
      },
      getAssignments: async (courseId) => {
        console.log('Mock API: Getting assignments for course', courseId);
        return mockApi.getAssignments({ courseId });
      },
    },
    assignments: {
      submitAssignment: async (formData) => {
        console.log('Mock API: Submitting assignment (mock)', formData);
        // Simulate success
        return { success: true, message: 'Submission received (mock)' };
      },
    },
    analytics: {
      getDashboardStats: async () => {
        console.log('Mock API: Getting dashboard stats');
        const userRole = localStorage.getItem('userRole') || 'student';
        return mockApi.getDashboardStats(userRole);
      },
    },
    ai: {
      chatWithAI: async (payload) => {
        console.log('Mock API: chatWithAI', payload);
        return { response: `Echo: ${payload.prompt}` };
      },
      generateLearningPath: async (payload) => {
        console.log('Mock API: generateLearningPath', payload);
        return { steps: ['Learn A', 'Practice B', 'Master C'] };
      },
      predictGrades: async () => {
        console.log('Mock API: predictGrades');
        return { Math: 'A', Science: 'B+' };
      },
      analyzeWellBeing: async () => {
        console.log('Mock API: analyzeWellBeing');
        return { status: 'positive', recommendations: ['Take a break'] };
      },
      generateExamPaper: async (courseId, payload) => {
        console.log('Mock API: generateExamPaper', courseId, payload);
        return { questions: ['Q1 (mock)', 'Q2 (mock)'] };
      },
    },
    // Mock-specific methods
    mock: {
      resetData: () => {
        localStorage.removeItem('mockUsers');
        window.location.reload();
      },
    },
  };
};

// Choose which API to use based on environment
const api = USE_MOCK_API ? createMockAPI() : createRealAPI();

// Log which API we're using
console.log(`Using ${USE_MOCK_API ? 'MOCK' : 'REAL'} API service`);
console.log('API Base URL:', USE_MOCK_API ? 'MOCK' : API_BASE_URL);

export default api;