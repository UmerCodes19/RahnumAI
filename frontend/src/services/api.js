import mockApi from './mockApi';

// Check if we're in development mode and should use mock data
  // const USE_MOCK_API = !import.meta.env.VITE_API_BASE_URL || 
  //                      import.meta.env.VITE_USE_MOCK_API === 'true' ||
  //                      process.env.NODE_ENV === 'development';

// Base API configuration
const USE_MOCK_API = false;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Token helpers for backward compatibility with older keys
const AUTH_KEYS = ['authToken', 'authToken1'];
function readAuthToken() {
  for (const k of AUTH_KEYS) {
    const t = localStorage.getItem(k);
    if (t) return t;
  }
  return null;
}
function setAuthToken(token) {
  if (!token) return;
  // Write token to both keys for backward compatibility
  for (const k of AUTH_KEYS) localStorage.setItem(k, token);
}
function removeAuthToken() {
  for (const k of AUTH_KEYS) localStorage.removeItem(k);
}

// Generic API client for real backend
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.refreshTimeout = null;
    // Initialize schedule based on stored token
    try {
      this._scheduleTokenRefresh();
    } catch (e) {
      // ignore scheduling errors
      console.warn('Failed to schedule token refresh on init', e);
    }
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
    const token = readAuthToken();
    // If the token is near expiry, proactively attempt refresh
    try {
      const expMs = this._getTokenExpiry(token);
      if (expMs && expMs - Date.now() < (65 * 1000)) {
        await this._attemptRefresh();
      }
    } catch (err) {
      // ignore parsing/refresh errors, the reactive flow will handle it
    }
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

    let response;
    try {
      response = await fetch(url, config);
      
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
        // If unauthorized, attempt token refresh then retry once
        if (response.status === 401) {
          try {
            const refreshed = await this._attemptRefresh();
            if (refreshed) {
              // Update Authorization header and retry original request once
              const newToken = readAuthToken();
              if (newToken) {
                config.headers.Authorization = `Bearer ${newToken}`;
              }
              const retryResp = await fetch(url, config);
              const contentType2 = retryResp.headers.get('content-type');
              let retryData;
              if (contentType2 && contentType2.includes('application/json')) retryData = await retryResp.json();
              else retryData = await retryResp.text();

              if (!retryResp.ok) {
                const m2 = (retryData && (retryData.detail || retryData.message)) || JSON.stringify(retryData) || retryResp.statusText;
                const err2 = new Error(m2 || 'API request failed after token refresh');
                err2.status = retryResp.status;
                err2.data = retryData;
                throw err2;
              }
              return retryData;
            }
          } catch (refreshError) {
            // Fall through to throw original or refresh error
            console.error('Token refresh failed or not possible:', refreshError);
            // If refresh failed, proceed to sign out/clear tokens
            removeAuthToken();
            localStorage.removeItem('refreshToken');
            throw refreshError;
          }
        }
        throw err;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async _attemptRefresh() {
    // Single-flight refresh to avoid concurrent refreshes
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return false;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const url = `${this.baseURL}/token/refresh/`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (!res.ok) {
          const dt = res.headers.get('content-type') && res.headers.get('content-type').includes('application/json') ? await res.json() : await res.text();
          throw new Error((dt && (dt.detail || dt.message)) || JSON.stringify(dt) || res.statusText);
        }
        const data = await res.json();
        if (data.access) {
          setAuthToken(data.access);
          // Schedule next refresh based on token expiry
          try { this._scheduleTokenRefresh(); } catch (e) { /* ignore */ }
        }
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }
        return true;
      } catch (e) {
        console.error('refresh token error', e);
        // clear tokens on refresh failure
        removeAuthToken();
        localStorage.removeItem('refreshToken');
        try { this._clearRefreshTimeout(); } catch (err) {}
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  _parseJwt(token) {
    // Basic JWT parse to get payload JSON (no signature verification)
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(payload + '==='.slice((payload.length + 3) % 4));
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

  _getTokenExpiry(token) {
    const p = this._parseJwt(token);
    if (!p || !p.exp) return null;
    return p.exp * 1000; // convert to ms
  }

  _clearRefreshTimeout() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  _scheduleTokenRefresh() {
    // Clear any existing timers
    this._clearRefreshTimeout();
    const token = readAuthToken();
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token || !refreshToken) return; // nothing to schedule
    const expMs = this._getTokenExpiry(token);
    if (!expMs) return;
    const now = Date.now();
    // schedule refresh 60 seconds before expiry or earlier if token is very close to expiry
    const millisUntilRefresh = Math.max(5000, expMs - now - (60 * 1000));
    if (millisUntilRefresh <= 0) {
      // Token is expired or about to expire — attempt refresh immediately
      this._attemptRefresh();
      return;
    }
    this.refreshTimeout = setTimeout(() => {
      this._attemptRefresh();
    }, millisUntilRefresh);
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
        if (data.access) setAuthToken(data.access);
        else if (data.token) setAuthToken(data.token);
        if (data.refresh) localStorage.setItem('refreshToken', data.refresh);
        if (data.user) localStorage.setItem('userData', JSON.stringify(data.user));
        // Schedule refresh based on JWT exp if available
        try { apiClient._scheduleTokenRefresh(); } catch (e) { console.warn('Failed to schedule token refresh', e); }
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
          if (data.access) setAuthToken(data.access);
          else if (data.token) setAuthToken(data.token);
          if (data.refresh) localStorage.setItem('refreshToken', data.refresh);
          if (data.user) {
            localStorage.setItem('userData', JSON.stringify(data.user));
            if (data.user.role) localStorage.setItem('userRole', data.user.role);
          }
        }

        // Schedule token refresh if available
        try { apiClient._scheduleTokenRefresh(); } catch (e) { /* ignore */ }
        return data;
      },
      logout: async () => {
        removeAuthToken();
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        try { apiClient._clearRefreshTimeout(); } catch (e) { /* ignore */ }
        return { success: true };
      }
      ,
      forceRefresh: async () => {
        try { 
          const r = await apiClient._attemptRefresh();
          return { refreshed: r };
        } catch (e) {
          return { refreshed: false, error: e.message };
        }
      }
    },
    users: {
      getProfile: async () => {
        return apiClient.get('/profile/');
      },
      logout: async () => {
        removeAuthToken();
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        return { success: true };
      }
    },
    courses: {
      getCourses: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiClient.get(`/courses/${queryParams ? ('?' + queryParams) : ''}`);
      },
      getAssignments: async (courseId) => {
        return apiClient.get(`/courses/${courseId}/assignments/`);
      },
      getMaterials: async (courseId) => {
        return apiClient.get(`/courses/${courseId}/materials/`);
      },
      uploadMaterial: async (courseId, formData) => {
        formData.append('course', courseId);
        return apiClient.postForm(`/courses/${courseId}/materials/`, formData);
      },
      getStudents: async (courseId) => {
        return apiClient.get(`/courses/${courseId}/students/`);
      },
      getAttendance: async (courseId, params = {}) => {
        const qs = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
        return apiClient.get(`/courses/${courseId}/attendance/${qs}`);
      },
      recordAttendance: async (courseId, payload) => {
        return apiClient.post(`/courses/${courseId}/attendance/`, payload);
      },
      enroll: async (courseIds = []) => {
        return apiClient.post('/courses/enroll/', { course_ids: courseIds });
      },
      enrollCourse: async (courseId) => {
        return apiClient.post(`/courses/${courseId}/enroll/`, {});
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
      predictGrades: async (payload = null) => {
        if (payload) {
          // payload is a dict of features -> convert to query params
          const qs = new URLSearchParams(payload).toString();
          return apiClient.get(`/ai/predict-grades/?${qs}`);
        }
        return apiClient.get('/ai/predict-grades/');
      },
      analyzeWellBeing: async (text) => {
        if (!text) return apiClient.get('/ai/analyze-well-being/');
        const qs = new URLSearchParams({ text }).toString();
        return apiClient.get(`/ai/analyze-well-being/?${qs}`);
      },
      generateExamPaper: async (courseId, payload) => apiClient.post(`/ai/generate-exam-paper/${courseId}/`, payload),
      modelsStatus: async () => apiClient.get('/ai/models/status/'),
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
        if (data.token) setAuthToken(data.token);
        // For mock flows, provide a fake refresh token to demonstrate refresh scheduling
        if (!localStorage.getItem('refreshToken')) localStorage.setItem('refreshToken', 'mock-refresh-token');
        if (data.user) localStorage.setItem('userData', JSON.stringify(data.user));
        return data;
      },
      signUp: async (userData) => {
        console.log('Mock API: Signup attempt', userData);
        return mockApi.signUp(userData);
      },
      forceRefresh: async () => {
        // Mock always 'refreshes' successfully by returning a new fake access token
        const fakeToken = 'mock-access-token';
        setAuthToken(fakeToken);
        return { refreshed: true };
      }
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
      enroll: async (courseIds = []) => {
        console.log('Mock API: enrolling in courses', courseIds);
        return mockApi.enroll(courseIds);
      },
      enrollCourse: async (courseId) => {
        console.log('Mock API: enrolling in single course', courseId);
        return mockApi.enrollCourse(courseId);
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
      modelsStatus: async () => ({ knn: false, random_forest: false, nb_model: false, transformers: false }),
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