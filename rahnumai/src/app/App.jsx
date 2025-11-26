import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/common/theme/ThemeProvider";
import LoginWrapper from "@/components/features/auth/LoginWrapper";
import EnhancedLogin from "@/components/features/auth/EnhancedLogin";
import Dashboard from "@/components/common/layout/Dashboard";
import { Home, Tools, Reports, Billing, Settings, Support, NotFound } from "@/components/features/shared/";
import LandingPage from "@/pages/LandingPage";

import StudentHome from "@/components/features/dashboard/student/StudentHome";
import Courses from "@/components/features/dashboard/student/Courses";
import Assignments from "@/components/features/dashboard/student/Assignments";
import Quizzes from "@/components/features/dashboard/student/Quizzes";
import Announcements from "@/components/features/dashboard/student/Announcements";
import TaskBoard from "@/components/features/dashboard/student/TaskBoard";
import Leaderboard from '../components/features/dashboard/student/Leaderboard';

import FacultyHome from "@/components/features/dashboard/faculty/FacultyHome";
import FacultyStudents from "@/components/features/dashboard/faculty/FacultyStudents";
import FacultyAttendance from "@/components/features/dashboard/faculty/FacultyAttendance";
import FacultyAnalytics from "@/components/features/dashboard/faculty/FacultyAnalytics";
import ClassPerformance from '@/components/features/dashboard/faculty/FacultyClassPerformance';

// Admin Components
import AdminHome from '@/components/features/dashboard/admin/AdminHome';
import AdminApprovals from '@/components/features/dashboard/admin/AdminApprovals';
import AdminFaculty from '@/components/features/dashboard/admin/AdminFaculty';
import AdminAnalytics from '@/components/features/dashboard/admin/AdminAnalytics';
import AdminUsers from '@/components/features/dashboard/admin/AdminUsers';
import AdminCourses from '@/components/features/dashboard/admin/AdminCourses';


import PersonalizedLearning from '@/components/features/ai/PersonalizedLearning';
import GradePredictor from '@/components/features/ai/GradePredictor';
import PaperGenerator from '@/components/features/ai/PaperGenerator';
import ChatSystem from '@/components/features/social/ChatSystem';


import { ApiProvider } from '@/contexts/ApiContext';
import StudentAttendance from '../components/features/dashboard/student/StudentAttendance';


const AdminRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin' ? children : <Navigate to="/dashboard" />;
};

function ResetButton({ onReset }) {
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === "r") {
        onReset();
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [onReset]);

  return (
    <div className="fixed top-2 right-2 z-50">
      <button
        onClick={onReset}
        className="px-3 py-1 text-xs bg-red-500 text-white rounded opacity-50 hover:opacity-100 transition-opacity"
        title="Press 'R' to reset experience"
      >
        Reset (R)
      </button>
    </div>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isFirstTime, setIsFirstTime] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userRole, setUserRole] = React.useState('');

  React.useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    const authToken = localStorage.getItem("authToken");
    const storedUserRole = localStorage.getItem("userRole");
    
    if (hasVisited) {
      setIsFirstTime(false);
    }
    if (authToken && storedUserRole) {
      setIsAuthenticated(true);
      setUserRole(storedUserRole);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("authToken", userData.token || "demo-token");
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("hasVisitedBefore", "true");
    setIsAuthenticated(true);
    setUserRole(userData.role);
    setIsFirstTime(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUserRole('');
  };

  const resetExperience = () => {
    localStorage.removeItem("hasVisitedBefore");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUserRole('');
    setIsFirstTime(true);
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <Router>
        <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
          {/* Reset Button */}
          {(isAuthenticated || !isFirstTime) && (
            <ResetButton onReset={resetExperience} />
          )}

          <Routes>
            {/* Auth Routes */}
            <Route
              path="/first-login"
              element={
                !isAuthenticated ? (
                  <LoginWrapper onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            <Route
              path="/landing"
              element={<LandingPage />}
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <EnhancedLogin onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            {/* Main Dashboard Route */}
            <Route
              path="/dashboard/*"
              element={
                isAuthenticated ? (
                  <Dashboard onLogout={handleLogout} />
                ) : (
                  <Navigate to={isFirstTime ? "/first-login" : "/login"} replace />
                )
              }
            >
              <Route index element={
                userRole === 'student' ? <StudentHome /> :
                userRole === 'faculty' ? <FacultyHome /> :
                userRole === 'admin' ? <AdminHome /> : <Home />
              } />
              
              {/* Student Routes */}
              <Route path="courses" element={<Courses />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="taskboard" element={<TaskBoard />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="student-attendance" element={<StudentAttendance/>} />

              {/* Faculty Routes */}
              <Route path="students" element={<FacultyStudents />} />
              <Route path="attendance" element={<FacultyAttendance />} />
              <Route path="analytics" element={<FacultyAnalytics />} />
              <Route path="class-performance" element={<ClassPerformance />} />

              {/* Admin Routes */}
              <Route path="admin/approvals" element={
                <AdminRoute>
                  <AdminApprovals />
                </AdminRoute>
              } />
              <Route path="admin/faculty" element={
                <AdminRoute>
                  <AdminFaculty />
                </AdminRoute>
              } />
              <Route path="admin/analytics" element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              } />
              <Route path="admin/users" element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } />

              <Route path="admin/courses" element={
  <AdminRoute>
    <AdminCourses />
  </AdminRoute>
} />
              
              <Route path="learning" element={<PersonalizedLearning />} />
<Route path="predictions" element={<GradePredictor />} />
<Route path="generator" element={<PaperGenerator />} />
<Route path="chat" element={<ChatSystem />} />
            

<Route path="settings" element={<Settings />} />


            </Route>

            {/* Root Route */}
            <Route
              path="/"
              element={
                isAuthenticated
                  ? <Navigate to="/dashboard" replace />
                  : isFirstTime
                  ? <Navigate to="/first-login" replace />
                  : <Navigate to="/landing" replace />
              }
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
        </main>
      </Router>
    </Theme>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ApiProvider>
        <AppContent />
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;