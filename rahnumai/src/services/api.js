import mockApi from './mockApi';

// Check if we're in development mode and should use mock data
const USE_MOCK_API = !import.meta.env.VITE_API_BASE_URL || 
                     import.meta.env.VITE_USE_MOCK_API === 'true' ||
                     process.env.NODE_ENV === 'development';

// Base API configuration
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
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
        throw new Error(data.message || data.detail || 'API request failed');
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
        return apiClient.post('/auth/login/', credentials);
      },
      signUp: async (userData) => {
        return apiClient.post('/auth/register/', userData);
      },
    },
    users: {
      getProfile: async () => {
        return apiClient.get('/users/profile/');
      },
    },
    courses: {
      getCourses: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiClient.get(`/courses/?${queryParams}`);
      },
    },
    assignments: {
      getAssignments: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiClient.get(`/assignments/?${queryParams}`);
      },
    },
    analytics: {
      getDashboardStats: async () => {
        return apiClient.get('/analytics/dashboard/');
      },
    },
  };
};

// Mock API functions (for development)
const createMockAPI = () => {
  return {
    auth: {
      login: async (credentials) => {
        console.log('Mock API: Login attempt', credentials);
        return mockApi.login(credentials);
      },
      signUp: async (userData) => {
        console.log('Mock API: Signup attempt', userData);
        return mockApi.signUp(userData);
      },
    },
    users: {
      getProfile: async () => {
        console.log('Mock API: Getting user profile');
        // Get current user from localStorage
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
      },
    },
    courses: {
      getCourses: async (filters = {}) => {
        console.log('Mock API: Getting courses', filters);
        return mockApi.getCourses(filters);
      },
    },
    assignments: {
      getAssignments: async (filters = {}) => {
        console.log('Mock API: Getting assignments', filters);
        return mockApi.getAssignments(filters);
      },
    },
    analytics: {
      getDashboardStats: async () => {
        console.log('Mock API: Getting dashboard stats');
        const userRole = localStorage.getItem('userRole') || 'student';
        return mockApi.getDashboardStats(userRole);
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