import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/ThemeProvider";
import LoginWrapper from "@/pages/auth/LoginWrapper";
import EnhancedLogin from "@/pages/auth/EnhancedLogin";
import Dashboard from "@/layouts/Dashboard";
import { Home, Tools, Reports, Billing, Settings, Support, NotFound } from "@/pages/dashboard";
import LandingPage from "@/pages/LandingPage";
import StudentHome from "@/pages/dashboard/StudentHome";
import Courses from "@/pages/dashboard/Courses";
import Assignments from "@/pages/dashboard/Assignments";
import Quizzes from "@/pages/dashboard/Quizzes";
import Announcements from "@/pages/dashboard/Announcements";
import TaskBoard from "@/pages/dashboard/TaskBoard";
import FacultyHome from "@/pages/dashboard/FacultyHome";
import FacultyStudents from "@/pages/dashboard/FacultyStudents";
import FacultyAttendance from "@/pages/dashboard/FacultyAttendance";
import FacultyAnalytics from "@/pages/dashboard/FacultyAnalytics";

// Admin Components
import AdminHome from '@/pages/dashboard/AdminHome';
import AdminApprovals from '@/pages/dashboard/AdminApprovals';
import AdminFaculty from '@/pages/dashboard/AdminFaculty';
import AdminAnalytics from '@/pages/dashboard/AdminAnalytics';
import AdminUsers from '@/pages/dashboard/AdminUsers';
import AdminCourses from '@/pages/dashboard/AdminCourses';

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
              
              {/* Faculty Routes */}
              <Route path="students" element={<FacultyStudents />} />
              <Route path="attendance" element={<FacultyAttendance />} />
              <Route path="analytics" element={<FacultyAnalytics />} />
              
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
      <AppContent />
    </ThemeProvider>
  );
}

export default App;