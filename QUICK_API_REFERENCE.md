# Quick Reference: Using the API in Components

## Import the API Service

```javascript
import api from '@/services/api';
import { toast } from 'react-toastify';
```

---

## Authentication

### Login
```javascript
const response = await api.auth.login({
  username: 'user@example.com',
  password: 'password123'
});

// Token automatically saved to localStorage
// Response: { access, refresh, user } or { token, user }
```

### Sign Up
```javascript
// Method 1: Simple JSON
const response = await api.auth.signUp({
  username: 'newuser',
  email: 'user@example.com',
  password: 'password123',
  role: 'student'
});

// Method 2: With file upload
const formData = new FormData();
formData.append('username', 'newuser');
formData.append('email', 'user@example.com');
formData.append('password', 'password123');
formData.append('profile_pic', fileInput.files[0]);

const response = await api.auth.signUp(formData);
```

### Logout
```javascript
localStorage.removeItem('authToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('userData');
```

---

## User Management

### Get Current User Profile
```javascript
const profile = await api.users.getProfile();
// Response: { id, user, role, profile_pic, ... }
```

---

## Courses

### Fetch All Courses
```javascript
const response = await api.courses.getCourses();
// Response: [{ id, name, code, instructor, progress, ... }]

// With filters
const response = await api.courses.getCourses({
  instructor: 'Dr. Smith',
  status: 'active'
});
```

### Get Course Assignments
```javascript
const assignments = await api.courses.getAssignments(courseId);
// Response: [{ id, title, course, dueDate, status, ... }]
```

---

## Assignments

### Submit Assignment
```javascript
const formData = new FormData();
formData.append('assignment_id', assignmentId);
formData.append('content', 'Assignment content');
formData.append('submission_file', fileInput.files[0]); // Optional

const response = await api.assignments.submitAssignment(formData);
// Response: { id, assignment_id, student_id, content, submitted_at, ... }
```

---

## Dashboard/Analytics

### Get Dashboard Stats
```javascript
const stats = await api.analytics.getDashboardStats();

// Student Response:
// {
//   courses_enrolled: 5,
//   assignments_due: 3,
//   overall_grade: 'A',
//   ...
// }

// Faculty Response:
// {
//   active_classes: 4,
//   assignments_to_grade: 8,
//   student_performance: 84,
//   ...
// }

// Admin Response:
// {
//   total_users: 1247,
//   active_courses: 89,
//   system_uptime: '99.9%',
//   ...
// }
```

---

## AI Features

### Chat with AI
```javascript
const response = await api.ai.chatWithAI({
  prompt: 'Explain quantum mechanics'
});

// Response: { id, user_id, prompt, response, timestamp }
```

### Generate Learning Path
```javascript
const response = await api.ai.generateLearningPath({
  topic: 'Calculus',
  level: 'intermediate'
});

// Response: { 
//   id, user_id, 
//   path_data: { 
//     steps: [
//       { step: 1, title: 'Learn Fundamentals', duration: '1 week' },
//       { step: 2, title: 'Practice Exercises', duration: '2 weeks' },
//       ...
//     ]
//   }
// }
```

### Predict Grades
```javascript
const response = await api.ai.predictGrades();

// Response: {
//   id, user_id,
//   prediction_data: {
//     Math: 'A',
//     Science: 'B+',
//     English: 'A-',
//     ...
//   },
//   confidence: 0.85
// }
```

### Analyze Well-Being
```javascript
const response = await api.ai.analyzeWellBeing();

// Response: {
//   id, user_id,
//   analysis_data: {
//     status: 'positive',
//     stress_level: 'moderate',
//     recommendations: [
//       'Take a 10-minute break every hour',
//       'Connect with classmates',
//       ...
//     ],
//     overall_score: 7.5
//   }
// }
```

### Generate Exam Paper
```javascript
const response = await api.ai.generateExamPaper(courseId, {
  num_questions: 10,
  difficulty: 'intermediate',
  duration_minutes: 120
});

// Response: {
//   id, course_id,
//   paper_data: {
//     questions: [
//       { 
//         number: 1, 
//         type: 'multiple-choice', 
//         content: 'Question text?',
//         options: ['A', 'B', 'C', 'D'],
//         points: 5 
//       },
//       ...
//     ],
//     total_points: 50,
//     duration_minutes: 120
//   }
// }
```

---

## Complete Component Example

```javascript
import api from '@/services/api';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.analytics.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <p>Courses: {stats.courses_enrolled}</p>
        <p>Grade: {stats.overall_grade}</p>
        <p>Assignments Due: {stats.assignments_due}</p>
      </div>
    </div>
  );
}
```

---

## Error Handling Pattern

```javascript
try {
  const data = await api.courses.getCourses();
  // Process data
  console.log('Success:', data);
} catch (error) {
  // Handle error
  console.error('API Error:', error.message);
  toast.error(error.message || 'An error occurred');
  
  // Optionally retry or use fallback
  if (error.message.includes('network')) {
    toast.info('Please check your connection');
  }
}
```

---

## Loading States

```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  try {
    setLoading(true);
    const result = await api.someMethod();
    // Handle result
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false); // Always clear loading
  }
};

return (
  <button disabled={loading}>
    {loading ? 'Loading...' : 'Click Me'}
  </button>
);
```

---

## Mock vs Real API

The service automatically switches based on environment:

```bash
# Development (Mock API)
npm run dev

# Production (Real API)
VITE_API_BASE_URL=http://localhost:8000/api npm run dev
```

For testing, you can manually switch:

```javascript
// In dev console
localStorage.setItem('USE_MOCK_API', 'false');
location.reload();
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Token not found" | User not logged in. Check `localStorage.authToken` |
| "CORS error" | Backend CORS not configured. Check Django settings |
| "404 Not Found" | Wrong API endpoint. Check `VITE_API_BASE_URL` |
| "401 Unauthorized" | Token expired. User needs to login again |
| "Network error" | Backend not running. Check `http://localhost:8000` |

---

## Environment Setup

Create `.env.local` in frontend root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false
```

Or keep defaults:
- `VITE_API_BASE_URL=http://localhost:8000/api`
- `VITE_USE_MOCK_API=true` (for development)

---

## Token Format

Backend expects:

```
Authorization: Bearer <your_jwt_token>
```

Token is automatically added to all requests by the API client.

---

## Response Format

All API responses follow this pattern:

```javascript
{
  // Data fields specific to endpoint
  id: 123,
  name: 'Data',
  
  // For collections
  // [{ id: 1, ... }, { id: 2, ... }]
  
  // Status/Metadata
  status: 'success',
  timestamp: '2024-01-15T10:30:00Z'
}
```

---

## Next API Endpoint Checklist

- [ ] Test login with real backend
- [ ] Test signup with file upload
- [ ] Verify token persistence
- [ ] Test all AI endpoints
- [ ] Test course/assignment endpoints
- [ ] Implement refresh token logic (if needed)
- [ ] Add request/response logging
- [ ] Set up error tracking

---

This quick reference covers all available API methods. For more details, see `API_USAGE_EXAMPLES.md`
