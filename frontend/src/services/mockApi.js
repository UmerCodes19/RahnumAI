// Mock API service for development
class MockApiService {
  constructor() {
    this.delay = 1000; // Simulate network delay
    this.users = this.loadUsers();
  }

  loadUsers() {
    const stored = localStorage.getItem('mockUsers');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default mock users for testing
    const defaultUsers = {
      student: [
        {
          id: 1,
          enroll: '2023001',
          password: 'student123',
          name: 'John Student',
          email: 'john@student.edu',
          institute: 'bahria-karachi',
          relation: 'child',
          role: 'student'
        }
      ],
      faculty: [
        {
          id: 1,
          username: 'professor',
          password: 'faculty123',
          name: 'Dr. Sarah Professor',
          email: 'sarah@faculty.edu',
          department: 'Computer Science',
          role: 'faculty'
        }
      ],
      admin: [
        {
          id: 1,
          email: 'admin@university.edu',
          password: 'admin123',
          name: 'Admin User',
          role: 'admin'
        }
      ]
    };
    
    localStorage.setItem('mockUsers', JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  saveUsers() {
    localStorage.setItem('mockUsers', JSON.stringify(this.users));
  }

  // Simulate API delay
  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  // Auth methods
  async login(credentials) {
    await this.simulateDelay();
    
    const { role, identifier, password } = credentials;
    const userList = this.users[role] || [];
    
    const user = userList.find(u => {
      if (role === 'student') return u.enroll === identifier && u.password === password;
      if (role === 'faculty') return u.username === identifier && u.password === password;
      if (role === 'admin') return u.email === identifier && u.password === password;
      return false;
    });

    if (user) {
      const { password: _, ...userWithoutPassword } = user; // Remove password from response
      return {
        success: true,
        token: `mock-jwt-token-${Date.now()}`,
        user: userWithoutPassword
      };
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async signUp(userData) {
    await this.simulateDelay();
    
    const { role, password, ...userInfo } = userData;
    const newUser = {
      id: Date.now(),
      ...userInfo,
      password: password, // In real app, this would be hashed
      role: role
    };

    if (!this.users[role]) {
      this.users[role] = [];
    }

    this.users[role].push(newUser);
    this.saveUsers();

    return {
      success: true,
      message: 'User registered successfully'
    };
  }

  // Mock data for dashboard
  async getDashboardStats(role) {
    await this.simulateDelay();
    
    const stats = {
      student: {
        active_courses: 5,
        courses_in_progress: 3,
        average_grade: 87,
        grade_trend: '+2% from last month',
        ai_sessions: 12,
        upcoming_schedule: [
          {
            subject: 'Mathematics',
            time: 'Tomorrow, 10:00 AM',
            type: 'Live Class'
          },
          {
            subject: 'Science Lab',
            time: 'Nov 21, 2:00 PM',
            type: 'Practical'
          }
        ]
      },
      faculty: {
        active_classes: 4,
        assignments_to_grade: 8,
        student_performance: 84,
        upcoming_sessions: 6,
        recent_activities: [
          {
            action: 'Graded Math Quiz',
            time: '2 hours ago',
            class: 'MATH101'
          }
        ]
      },
      admin: {
        total_users: 1247,
        active_courses: 89,
        system_uptime: '99.9%',
        support_tickets: 23,
        pending_approvals: 12
      }
    };

    return stats[role] || stats.student;
  }

  // Mock courses data
  async getCourses(filters = {}) {
    await this.simulateDelay();
    
    const courses = [
      {
        id: 1,
        name: 'Mathematics 101',
        code: 'MATH101',
        instructor: 'Dr. Smith',
        progress: 75,
        enrolled: 45,
        duration: '15 weeks',
        description: 'Fundamental concepts of mathematics and algebra.'
      },
      {
        id: 2,
        name: 'Computer Science',
        code: 'CS101',
        instructor: 'Prof. Johnson',
        progress: 60,
        enrolled: 32,
        duration: '16 weeks',
        description: 'Introduction to programming and computer science principles.'
      },
      {
        id: 3,
        name: 'Physics Fundamentals',
        code: 'PHY101',
        instructor: 'Dr. Wilson',
        progress: 45,
        enrolled: 28,
        duration: '14 weeks',
        description: 'Basic principles of physics and their applications.'
      }
    ];

    return { courses };
  }

  // Mock assignments data
  async getAssignments(filters = {}) {
    await this.simulateDelay();
    
    const assignments = [
      {
        id: 1,
        title: 'Math Problem Set',
        course: 'MATH101',
        dueDate: '2024-12-20',
        status: 'pending',
        type: 'AI Generated',
        description: 'Solve the following calculus problems and show your work.',
        points: 100,
        submitted: false
      },
      {
        id: 2,
        title: 'Programming Project',
        course: 'CS101',
        dueDate: '2024-12-25',
        status: 'submitted',
        type: 'AI Generated',
        description: 'Create a web application using React and Node.js.',
        points: 150,
        submitted: true,
        grade: 'A-'
      }
    ];

    return assignments;
  }

  // Mock AI endpoints
  async chatWithAI(prompt) {
    await this.simulateDelay();
    return {
      id: Date.now(),
      user_id: 1,
      prompt: prompt,
      response: `AI Response to "${prompt}": This is a helpful response generated by the AI tutor.`,
      timestamp: new Date().toISOString()
    };
  }

  async generateLearningPath(userId) {
    await this.simulateDelay();
    return {
      id: Date.now(),
      user_id: userId,
      path_data: {
        steps: [
          { step: 1, title: 'Learn Fundamentals', duration: '1 week' },
          { step: 2, title: 'Practice Exercises', duration: '2 weeks' },
          { step: 3, title: 'Advanced Concepts', duration: '2 weeks' },
          { step: 4, title: 'Master Topics', duration: '1 week' }
        ]
      },
      created_at: new Date().toISOString()
    };
  }

  async predictGrades(userId) {
    await this.simulateDelay();
    return {
      id: Date.now(),
      user_id: userId,
      prediction_data: {
        Math: 'A',
        Science: 'B+',
        English: 'A-',
        History: 'B',
        ComputerScience: 'A+'
      },
      confidence: 0.85,
      created_at: new Date().toISOString()
    };
  }

  async analyzeWellBeing(userId) {
    await this.simulateDelay();
    return {
      id: Date.now(),
      user_id: userId,
      analysis_data: {
        status: 'positive',
        stress_level: 'moderate',
        recommendations: [
          'Take a 10-minute break every hour',
          'Connect with classmates in study groups',
          'Practice mindfulness meditation daily',
          'Maintain regular sleep schedule'
        ],
        overall_score: 7.5
      },
      created_at: new Date().toISOString()
    };
  }

  async generateExamPaper(courseId) {
    await this.simulateDelay();
    return {
      id: Date.now(),
      course_id: courseId,
      paper_data: {
        questions: [
          { number: 1, type: 'multiple-choice', content: 'Sample question 1?', options: ['A', 'B', 'C', 'D'], points: 5 },
          { number: 2, type: 'short-answer', content: 'Sample question 2?', points: 10 },
          { number: 3, type: 'essay', content: 'Sample question 3?', points: 15 },
          { number: 4, type: 'problem-solving', content: 'Sample question 4?', points: 20 }
        ],
        total_points: 50,
        duration_minutes: 120
      },
      created_at: new Date().toISOString()
    };
  }

  async submitAssignment(formData) {
    await this.simulateDelay();
    // Extract data from FormData
    const assignment_id = formData.get('assignment_id');
    const content = formData.get('content');
    
    return {
      id: Date.now(),
      assignment_id: assignment_id,
      student_id: 1,
      content: content || 'Submission received',
      submitted_at: new Date().toISOString(),
      status: 'submitted'
    };
  }
}

// Create singleton instance
const mockApi = new MockApiService();

export default mockApi;