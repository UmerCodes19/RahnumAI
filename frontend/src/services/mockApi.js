// Mock API service for development
class MockApiService {
  constructor() {
    this.delay = 1000; // Simulate network delay
    this.users = this.loadUsers();
    this.enrollments = this.loadEnrollments();
    this.performances = this.loadPerformances();
    this.assignmentsData = this.loadAssignments();
    this.submissions = this.loadSubmissions();
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

  loadEnrollments() {
    const stored = localStorage.getItem('mockEnrollments');
    if (stored) return JSON.parse(stored);
    // default: store enrollments by user id
    return {};
  }

  loadPerformances() {
    const stored = localStorage.getItem('mockPerformances');
    if (stored) return JSON.parse(stored);
    // structure: { courseId: [{ student_id, score, remark, updated_by, created_at, updated_at }, ...] }
    return {};
  }

  savePerformances() {
    localStorage.setItem('mockPerformances', JSON.stringify(this.performances));
  }

  saveEnrollments() {
    localStorage.setItem('mockEnrollments', JSON.stringify(this.enrollments));
  }

  // Persistent assignments in localStorage
  loadAssignments() {
    const stored = localStorage.getItem('mockAssignments');
    if (stored) return JSON.parse(stored);
    const assignments = {};
    localStorage.setItem('mockAssignments', JSON.stringify(assignments));
    return assignments;
  }

  saveAssignments() {
    localStorage.setItem('mockAssignments', JSON.stringify(this.assignmentsData));
  }

  // Persistent submissions in localStorage (organized by assignment id)
  loadSubmissions() {
    const stored = localStorage.getItem('mockSubmissions');
    if (stored) return JSON.parse(stored);
    const submissions = {};
    localStorage.setItem('mockSubmissions', JSON.stringify(submissions));
    return submissions;
  }

  saveSubmissions() {
    localStorage.setItem('mockSubmissions', JSON.stringify(this.submissions));
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
  async getDashboardStats(role = 'student') {
    await this.simulateDelay();

    // Simple mocked stats per role
    const stats = {
      student: {
        active_courses: 5,
        courses_in_progress: 3,
        average_grade: 87,
        grade_trend: '+2% from last month',
        ai_sessions: 12,
        upcoming_schedule: [
          { subject: 'Mathematics', time: 'Tomorrow, 10:00 AM', type: 'Live Class' },
          { subject: 'Science Lab', time: 'Nov 21, 2:00 PM', type: 'Practical' }
        ]
      },
      faculty: {
        active_classes: 4,
        assignments_to_grade: 8,
        student_performance: 84,
        upcoming_sessions: 6,
        recent_activity: [
          { action: 'Graded Math Quiz', time: '2 hours ago', class: 'MATH101' }
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

  async createAssignment(courseId, data) {
    await this.simulateDelay();
    if (!this.assignmentsData[courseId]) this.assignmentsData[courseId] = [];
    const now = new Date().toISOString();
    const newAssignment = {
      id: Date.now(),
      course: courseId,
      title: data.get ? data.get('title') : (data.title || 'New Assignment'),
      description: data.get ? data.get('description') : (data.description || ''),
      due_date: data.get ? data.get('due_date') : (data.due_date || null),
      file: data.get ? (data.get('file') ? `mock://${Date.now()}-file` : null) : null,
      created_by: { id: 1, username: 'teacher_1' },
      created_at: now,
    };
    this.assignmentsData[courseId].push(newAssignment);
    this.saveAssignments();
    return newAssignment;
  }

  async getAssignmentSubmissions(assignmentId) {
    await this.simulateDelay();
    // normalize key to string
    const aid = String(assignmentId);
    return this.submissions[aid] || [];
  }

  async updateSubmission(submissionId, payload) {
    await this.simulateDelay();
    // payload may include { grade: 95 }
    for (const aid of Object.keys(this.submissions)) {
      const list = this.submissions[aid] || [];
      const idx = list.findIndex(s => String(s.id) === String(submissionId) || s.id === submissionId);
      if (idx !== -1) {
        const existing = list[idx];
        const updated = { ...existing, ...payload };
        this.submissions[aid][idx] = updated;
        this.saveSubmissions();
        return updated;
      }
    }
    throw new Error('Submission not found');
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
        teacher_id: 1,
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
        teacher_id: 2,
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
        teacher_id: 1,
        progress: 45,
        enrolled: 28,
        duration: '14 weeks',
        description: 'Basic principles of physics and their applications.'
      }
    ];

    // Support taught filter (for faculty). Mark which courses the current user is enrolled in
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData && userData.id;
      const userEnrolls = (this.enrollments[userId] || []);
      let mapped = courses.map(c => ({
        ...c,
        is_enrolled: userEnrolls.includes(c.id),
      }));
      // If taught filter is provided, try to return only the teacher's courses
      if (filters && (filters.taught === 'true' || filters.taught === true)) {
        mapped = mapped.filter(c => c.teacher_id && c.teacher_id === userId);
      }
      return { courses: mapped };
    } catch (e) {
      return { courses };
    }
  }

  async getMaterials(courseId) {
    await this.simulateDelay();
    // Return mock materials per course
    const materials = [
      { id: 1, title: 'Lecture 1 Slides', description: 'Intro slides', file: '/public/img/sample.pdf' },
      { id: 2, title: 'Lecture 2 Slides', description: 'Advanced topics', file: '/public/img/sample.pdf' }
    ];
    return materials;
  }

  async enroll(courseIds = []) {
    await this.simulateDelay();
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData && userData.id;
    if (!userId) throw new Error('Not authenticated');
    if (!this.enrollments[userId]) this.enrollments[userId] = [];
    courseIds.forEach(id => {
      if (!this.enrollments[userId].includes(id)) {
        this.enrollments[userId].push(id);
      }
    });
    this.saveEnrollments();
    return { enrolled: this.enrollments[userId] };
  }

  async enrollCourse(courseId) {
    await this.simulateDelay();
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData && userData.id;
    if (!userId) throw new Error('Not authenticated');
    if (!this.enrollments[userId]) this.enrollments[userId] = [];
    if (!this.enrollments[userId].includes(courseId)) this.enrollments[userId].push(courseId);
    this.saveEnrollments();
    return { enrolled: this.enrollments[userId] };
  }

  // Mock assignments data
  async getAssignments(filters = {}) {
    await this.simulateDelay();

    // Support filters.courseId (or courseId) to retrieve stored assignments for a course
    const courseId = filters && (filters.courseId || filters.course || null);
    if (courseId && this.assignmentsData[courseId]) {
      return this.assignmentsData[courseId];
    }

    // Fallback sample assignments
    const sampleAssignments = [
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

    return sampleAssignments;
  }

  async getStudents(courseId) {
    await this.simulateDelay();
    return [
      { id: 1, username: 'john_student', email: 'john@student.edu' },
      { id: 2, username: 'sarah_student', email: 'sarah@student.edu' }
    ];
  }

  async getPerformance(courseId) {
    await this.simulateDelay();
    const perfList = (this.performances[courseId] || []).map(p => ({
      id: p.id || null,
      course: courseId,
      student: { id: p.student_id, username: `student_${p.student_id}` },
      score: p.score,
      remark: p.remark || '',
      traits: p.traits || {},
      updated_by: p.updated_by ? { id: p.updated_by, username: `teacher_${p.updated_by}` } : null,
      created_at: p.created_at || new Date().toISOString(),
      updated_at: p.updated_at || new Date().toISOString(),
    }));
    const scores = perfList.filter(p => p.score != null).map(p => p.score);
    const overall_avg = scores.length ? scores.reduce((a,b)=>a+b,0) / scores.length : null;
    return { performances: perfList, overall_avg };
  }

  async assignPerformance(courseId, payload) {
    await this.simulateDelay();
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const now = new Date().toISOString();
    const entries = Array.isArray(payload) ? payload : [payload];
    if (!this.performances[courseId]) this.performances[courseId] = [];
    entries.forEach(e => {
      const sid = e.student_id || (e.student && e.student.id);
      if (!sid) return;
      const existing = this.performances[courseId].find(p => p.student_id == sid);
      if (existing) {
        existing.score = e.score;
        existing.remark = e.remark || existing.remark;
        existing.updated_by = currentUser.id || existing.updated_by;
        existing.updated_at = now;
        if (e.traits && typeof e.traits === 'object') existing.traits = e.traits;
      } else {
        this.performances[courseId].push({ id: Date.now(), student_id: sid, score: e.score, remark: e.remark || '', updated_by: currentUser.id || null, traits: e.traits || {}, created_at: now, updated_at: now });
      }
    });
    this.savePerformances();
    return { success: true };
  }

  async getAttendance(courseId, params = {}) {
    await this.simulateDelay();
    const sessions = [
      { id: 1, session_date: '2025-06-01', created_by: { id: 2, username: 'professor' }, records: [ { student: { id: 1, username: 'john_student'}, status: 'present' }, { student: { id: 2, username: 'sarah_student'}, status: 'absent' } ] },
      { id: 2, session_date: '2025-06-02', created_by: { id: 2, username: 'professor' }, records: [ { student: { id: 1, username: 'john_student'}, status: 'present' }, { student: { id: 2, username: 'sarah_student'}, status: 'present' } ] }
    ];
    const recordsFlat = sessions.flatMap(s => s.records);
    const presentCount = recordsFlat.filter(r => r.status === 'present').length;
    const overall = { present: presentCount, records: recordsFlat.length, percent: Math.round((presentCount / Math.max(1, recordsFlat.length)) * 100) };
    return { sessions, overall };
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
    const assignment_id = formData.get('assignment_id') || formData.get('assignment');
    const contentRaw = formData.get('content');
    // If the content is a File, convert to a mock URL
    let content;
    if (contentRaw instanceof File || (contentRaw && contentRaw.name)) {
      content = `mock://submission-${Date.now()}-${(contentRaw.name || 'file')}`;
    } else {
      content = contentRaw;
    }
    // Try to use currently logged-in user from localStorage if present
    let sid = 1;
    let username = `student_${sid}`;
    try {
      const saved = JSON.parse(localStorage.getItem('userData') || '{}');
      if (saved && saved.id) {
        sid = saved.id;
        username = saved.username || saved.name || `student_${sid}`;
      }
    } catch (e) {
      // ignore parse errors
    }
    const user = { id: sid, username };
    const newSubmission = {
      id: Date.now(),
      assignment: Number(assignment_id),
      student: user,
      content: content || 'Submission received',
      submitted_at: new Date().toISOString(),
      grade: null,
      status: 'submitted'
    };
    const key = String(newSubmission.assignment);
    if (!this.submissions[key]) this.submissions[key] = [];
    this.submissions[key].push(newSubmission);
    this.saveSubmissions();
    return newSubmission;
  }
}

// Create singleton instance
const mockApi = new MockApiService();

export default mockApi;