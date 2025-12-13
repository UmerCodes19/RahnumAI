# Frontend API Integration Summary

## Overview
All frontend components have been successfully updated to use the integrated backend APIs from `frontend/src/services/api.js`. Components now fetch real data from the Django backend instead of using hardcoded mock data.

---

## Updated Components

### 1. **Authentication Components**

#### `src/components/features/auth/EnhancedLogin.jsx`
- **Changes:**
  - Replaced `useApi` context with direct `api` service import
  - Updated login to call `api.auth.login()` with proper credentials
  - Updated signup to call `api.auth.signUp()` with FormData for file uploads
  - Automatic token storage in localStorage
  - Error handling with toast notifications

- **API Calls:**
  ```javascript
  await api.auth.login(loginData)
  await api.auth.signUp(formData)
  ```

---

### 2. **Student Dashboard Components**

#### `src/components/features/dashboard/student/Courses.jsx`
- **Changes:**
  - Fetch courses on component mount using `useEffect`
  - Dynamic stats calculation based on fetched data
  - Loading state management
  - Error handling with toast notifications

- **API Calls:**
  ```javascript
  await api.courses.getCourses()
  ```

- **Features:**
  - Displays all enrolled courses
  - Shows real-time statistics (total courses, in progress, completion rate)
  - Progress bars for each course

#### `src/components/features/dashboard/student/Assignments.jsx`
- **Changes:**
  - Fetch assignments on component mount
  - Dynamic stats based on assignment status
  - Submit assignment functionality with API integration
  - Loading and error states

- **API Calls:**
  ```javascript
  await api.courses.getAssignments(courseId)
  await api.assignments.submitAssignment(formData)
  ```

- **Features:**
  - List all assignments with status
  - Filter by course
  - Submit assignments with feedback

---

### 3. **AI Feature Components**

#### `src/components/features/dashboard/common/AIAssistant.jsx`
- **Changes:**
  - Replaced hardcoded responses with real API calls
  - Integrated `api.ai.chatWithAI()` for actual AI responses
  - Fallback to keyword-based responses on API failure
  - Loading states while waiting for AI response

- **API Calls:**
  ```javascript
  await api.ai.chatWithAI({ prompt: userMessage })
  ```

- **Features:**
  - Real-time chat with AI tutor
  - Personalized responses
  - Integration with student context

#### `src/components/features/ai/GradePredictor.jsx`
- **Changes:**
  - Fetch grade predictions from backend AI
  - Fetch well-being analysis
  - Transform API responses to match component expectations
  - Loading and error states

- **API Calls:**
  ```javascript
  await api.ai.predictGrades()
  await api.ai.analyzeWellBeing()
  ```

- **Features:**
  - Shows predicted grades for all courses
  - Displays well-being analysis
  - Provides AI-driven recommendations

#### `src/components/features/ai/PaperGenerator.jsx`
- **Changes:**
  - Integrated exam paper generation with backend AI
  - Pass configuration to API for custom paper generation
  - Display generated questions and sections

- **API Calls:**
  ```javascript
  await api.ai.generateExamPaper(courseId, config)
  ```

- **Features:**
  - Configure exam parameters (difficulty, duration, marks)
  - Generate AI-powered exam papers
  - Download generated papers

#### `src/components/features/ai/PersonalizedLearning.jsx`
- **Changes:**
  - Fetch personalized learning paths from AI
  - Display learning journey with real data
  - Track progress with actual learning steps

- **API Calls:**
  ```javascript
  await api.ai.generateLearningPath({})
  ```

- **Features:**
  - AI-generated learning paths
  - Step-by-step guidance
  - Progress tracking

---

## API Service Architecture

### Main Service File: `src/services/api.js`

**Features:**
- Dual mode: Mock API (development) and Real API (production)
- Automatic token management (JWT/Bearer)
- FormData support for file uploads
- Comprehensive error handling
- Environment-based configuration

**Environment Variables:**
```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false
```

### Available API Methods

#### Authentication
```javascript
api.auth.login(credentials)           // Login with username/password
api.auth.signUp(formData)             // Sign up with optional file uploads
```

#### Users
```javascript
api.users.getProfile()                // Get current user profile
```

#### Courses
```javascript
api.courses.getCourses(filters)       // Get all courses
api.courses.getAssignments(courseId)  // Get assignments for a course
api.courses.getMaterials(courseId)    // Get materials for a course (students enrolled or course teacher)
api.courses.uploadMaterial(courseId, formData) // Upload material (teacher only)
api.courses.getStudents(courseId)     // Get students enrolled in a course (teacher/admin)
api.courses.getAttendance(courseId)   // Get attendance sessions + overall stats for a course
api.courses.recordAttendance(courseId, payload) // Create attendance session with records (teacher only)
```

#### Assignments
```javascript
api.assignments.submitAssignment(formData) // Submit assignment
```

#### Analytics/Dashboard
```javascript
api.analytics.getDashboardStats()     // Get dashboard statistics
```

#### AI Features
```javascript
api.ai.chatWithAI(payload)            // Chat with AI tutor
api.ai.generateLearningPath(payload)  // Generate learning path
api.ai.predictGrades()                // Predict student grades
api.ai.analyzeWellBeing()             // Analyze student well-being
api.ai.generateExamPaper(courseId, payload) // Generate exam papers
```

---

## Error Handling Strategy

All components now implement proper error handling:

```javascript
try {
  const data = await api.courses.getCourses();
  // Use data
} catch (error) {
  console.error('Error:', error);
  toast.error('Failed to load courses'); // User-friendly message
}
```

---

## Mock API Fallback

The service includes a comprehensive mock API for development:

- **Location:** `src/services/mockApi.js`
- **Features:**
  - Simulates realistic delays (1-2 seconds)
  - Returns properly structured mock data
  - Supports all endpoints
  - Perfect for UI development without backend

**Toggle Mock API:**
```bash
# Development (uses mock)
npm run dev

# Production (uses real API)
VITE_USE_MOCK_API=false npm run dev
```

---

## Token Management

Tokens are automatically handled:

**Storage Locations:**
- `localStorage.authToken` - JWT access token
- `localStorage.refreshToken` - JWT refresh token (if applicable)
- `localStorage.userData` - Current user data (JSON)

**Automatic Features:**
- Tokens added to all authenticated requests as `Authorization: Bearer <token>`
- Retrieved before each request
- Persisted across page reloads

**Logout:**
```javascript
localStorage.removeItem('authToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('userData');
```

---

## Usage Example in Components

```javascript
import api from '@/services/api';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

export function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.courses.getCourses();
        setData(result);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {/* Render data */}
    </div>
  );
}
```

---

## Backend Requirements

**Required Endpoints (all implemented):**
- `POST /api/login/` - User login
- `POST /api/signup/` - User registration
- `GET /api/profile/` - Get user profile
- `GET /api/courses/` - List courses
- `GET /api/courses/{id}/assignments/` - Get course assignments
- `POST /api/assignments/submit/` - Submit assignment
- `GET /api/dashboard/stats/` - Dashboard statistics
- `POST /api/ai/chat/` - AI chat
- `POST /api/ai/generate-learning-path/` - Learning path generation
- `GET /api/ai/predict-grades/` - Grade prediction
- `GET /api/ai/analyze-well-being/` - Well-being analysis
- `POST /api/ai/generate-exam-paper/{id}/` - Exam paper generation

---

## Testing the Integration

1. **Start the backend:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test endpoints:**
   - Login/Signup at `/auth`
   - View courses at `/dashboard/courses`
   - View assignments at `/dashboard/assignments`
   - Test AI features in respective sections

---

## Next Steps

1. **Backend Development:** Ensure all endpoints return expected data structures
2. **Testing:** Test all API calls with real backend
3. **Authentication:** Implement JWT refresh token logic if needed
4. **Error Handling:** Enhance error messages based on API responses
5. **Loading States:** Add skeleton loaders for better UX
6. **Caching:** Implement response caching for frequently accessed data

---

## Summary of Changes

| Component | File | API Calls | Status |
|-----------|------|-----------|--------|
| EnhancedLogin | auth/EnhancedLogin.jsx | login, signUp | ✅ Complete |
| Courses | dashboard/student/Courses.jsx | getCourses | ✅ Complete |
| Assignments | dashboard/student/Assignments.jsx | getAssignments, submitAssignment | ✅ Complete |
| AIAssistant | dashboard/common/AIAssistant.jsx | chatWithAI | ✅ Complete |
| GradePredictor | ai/GradePredictor.jsx | predictGrades, analyzeWellBeing | ✅ Complete |
## Token Refresh Integration

- The frontend `ApiClient` will proactively refresh expiring access tokens using the `/api/token/refresh/` backend endpoint.
- It schedules a refresh 60 seconds before token expiry and tries refreshing on 401 responses as a fallback.
- Tokens are stored in `localStorage` as `authToken` (access) and `refreshToken`.
- Call `api.auth.logout()` to clear tokens and cancel the scheduled refresh.

| PaperGenerator | ai/PaperGenerator.jsx | generateExamPaper | ✅ Complete |
| PersonalizedLearning | ai/PersonalizedLearning.jsx | generateLearningPath | ✅ Complete |

All components are now fully integrated with the backend API service!
