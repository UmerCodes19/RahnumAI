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
}

// Create singleton instance
const mockApi = new MockApiService();

export default mockApi;