# API Usage Examples

This document shows how to use all the backend APIs that have been integrated into the frontend service.

## Setup

Import the API service in any component:

```javascript
import api from '@/services/api';
```

## Authentication APIs

### Login
```javascript
// Login with credentials
const response = await api.auth.login({
  username: 'user@example.com',
  password: 'password123'
});

// Response includes: { access, refresh, user } or { token, user }
// Token is automatically saved to localStorage as 'authToken'
```

### Sign Up
```javascript
// Method 1: JSON data
const response = await api.auth.signUp({
  username: 'newuser',
  email: 'user@example.com',
  password: 'password123',
  role: 'student'
});

// Method 2: FormData (for file uploads like profile_pic)
const formData = new FormData();
formData.append('username', 'newuser');
formData.append('email', 'user@example.com');
formData.append('password', 'password123');
formData.append('role', 'student');
formData.append('profile_pic', fileObject); // File input

const response = await api.auth.signUp(formData);
```

## User APIs

### Get User Profile
```javascript
// Get current user profile (requires authentication)
const profile = await api.users.getProfile();

// Response: { id, user, role, profile_pic, ... }
```

## Course APIs

### Get All Courses
```javascript
// Get all courses
const response = await api.courses.getCourses();

// With filters (optional)
const response = await api.courses.getCourses({
  instructor: 'Dr. Smith',
  status: 'active'
});

// Response: { courses: [...] }
```

### Get Course Assignments
```javascript
// Get assignments for a specific course
const assignments = await api.courses.getAssignments(courseId);

// Response: [{ id, title, course, dueDate, ... }]
```

### Enroll in Courses
```javascript
// Enroll current user in a list of courses
const response = await api.courses.enroll([1, 2, 3]);

// Or enroll in a single course
const responseSingle = await api.courses.enrollCourse(courseId);
```

## Assignment APIs

### Submit Assignment
```javascript
// Submit an assignment using FormData
const formData = new FormData();
formData.append('assignment_id', assignmentId);
formData.append('content', 'Student submission content');
formData.append('submission_file', fileObject); // Optional file upload

const response = await api.assignments.submitAssignment(formData);

// Response: { id, assignment_id, student_id, content, submitted_at, ... }
```

## Analytics/Dashboard APIs

### Get Dashboard Statistics
```javascript
// Get dashboard stats for current user
const stats = await api.analytics.getDashboardStats();

// Student Response: 
// { courses_enrolled, assignments_due, overall_grade, ... }

// Faculty Response:
// { active_classes, assignments_to_grade, student_performance, ... }

// Admin Response:
// { total_users, active_courses, system_uptime, support_tickets, ... }
```

## AI Feature APIs

### Chat with AI
```javascript
// Send a message to the AI tutor
const response = await api.ai.chatWithAI({
  prompt: 'Explain quantum mechanics'
});

// Response: { id, user_id, prompt, response, timestamp }
```

### Generate Learning Path
```javascript
// Generate a personalized learning path
const response = await api.ai.generateLearningPath({
  topic: 'Calculus',
  level: 'intermediate'
});

// Response: { id, user_id, path_data: { steps: [...] }, created_at }
```

### Predict Grades
```javascript
// Get AI-predicted grades based on performance
// You can pass a feature payload to predict grades
const response = await api.ai.predictGrades({
  attendance: 0.92,
  avg_score: 78,
  assignments_completed: 0.85,
  participation: 0.6,
  homework_completion: 0.7
});

// Response: 
// { 
//   id, user_id, 
//   prediction_data: { Math: 'A', Science: 'B+', ... },
//   confidence: 0.85,
//   created_at
// }
```

### Analyze Well-Being
```javascript
// Get AI analysis of student well-being (send text for analysis)
const response = await api.ai.analyzeWellBeing('I have been sleeping poorly and feeling overwhelmed by studies');

// Response:
// {
//   id, user_id,
//   analysis_data: {
//     status: 'positive',
//     stress_level: 'moderate',
//     recommendations: [...],
//     overall_score: 7.5
//   },
//   created_at
// }
```

### Generate Exam Paper
```javascript
// Generate an exam paper for a course
const response = await api.ai.generateExamPaper(courseId, {
  num_questions: 10,
  difficulty: 'intermediate',
  duration_minutes: 120
});

// Response:
// {
//   id, course_id,
//   paper_data: {
//     questions: [...],
//     total_points: 50,
//     duration_minutes: 120
//   },
//   created_at
// }
```

## Error Handling

All API calls are wrapped in async/await. Handle errors like this:

```javascript
try {
  const data = await api.auth.login(credentials);
  // Process data
} catch (error) {
  console.error('Login failed:', error.message);
  // Show error to user
}
```

## Token Refresh Behavior

The frontend now automatically attempts to refresh the access token using the `refreshToken` stored in `localStorage` when a 401 (Unauthorized) response is returned. If refresh succeeds, the original request is retried with the new token. If refresh fails, tokens are cleared and the user should be redirected to login.

Note: ensure the backend is configured with the refresh endpoint (`/api/token/refresh/`).

You can also manually trigger a refresh (useful in dev):
```javascript
await api.auth.forceRefresh(); // returns { refreshed: true }
```

To sign out and clear scheduled refresh:
```javascript
await api.auth.logout();
```

### AI Models Status
```javascript
// Check which ML models are currently loaded on backend
// This is read-only and useful for confirming that models were loaded from train_ML_Model/models
const status = await api.ai.modelsStatus();
// Example response: { knn: true, random_forest: true, nb_model: true, transformers: false }
```

## Mock vs Real API

The service automatically switches between mock and real APIs based on environment:

- **Development (default)**: Uses mock API with simulated responses
- **Production**: Uses real backend API at `http://localhost:8000/api`

To switch to real API, set environment variable:
```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false
```

## Authentication Token Management

Authentication tokens are automatically:
- Stored in `localStorage` as `authToken` and `refreshToken`
- Added to all API requests in the `Authorization: Bearer <token>` header
- Retrieved from `localStorage` before each request

To logout:
```javascript
localStorage.removeItem('authToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('userData');
```

## Example Component Usage

```javascript
import api from '@/services/api';
import { useState, useEffect } from 'react';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.analytics.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Courses: {stats.courses_enrolled}</p>
      <p>Grade: {stats.overall_grade}</p>
    </div>
  );
}
```
