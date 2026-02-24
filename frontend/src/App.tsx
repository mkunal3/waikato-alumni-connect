import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { MessageNotificationProvider } from './contexts/MessageNotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardRedirect } from './components/DashboardRedirect';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { RegisterSelectPage } from './pages/RegisterSelectPage';
import { StudentRegisterPage } from './pages/StudentRegisterPage';
import { AlumniRegisterPage } from './pages/AlumniRegisterPage';
import { AdminRegisterPage } from './pages/AdminRegisterPage';
import { AdminInviteRegisterPage } from './pages/AdminInviteRegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { BrowseMentorsPage } from './pages/BrowseMentorsPage';
import { MentorDashboard } from './pages/MentorDashboard';
import { MentorProfilePage } from './pages/MentorProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ChatPage } from './pages/ChatPage';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MessageNotificationProvider>
          <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Registration routes */}
            <Route path="/register" element={<RegisterSelectPage />} />
            <Route path="/register/student" element={<StudentRegisterPage />} />
            <Route path="/register/alumni" element={<AlumniRegisterPage />} />
            <Route path="/register/admin" element={<AdminRegisterPage />} />
            <Route path="/register/admin-invite" element={<AdminInviteRegisterPage />} />
            
            {/* Dashboard redirect - automatically routes based on user role */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              } 
            />
            
            {/* Role-specific dashboard routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']} redirectTo="/login">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={['student']} redirectTo="/login">
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/browse-mentors"
              element={
                <ProtectedRoute allowedRoles={['student']} redirectTo="/login">
                  <BrowseMentorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['alumni']} redirectTo="/login">
                  <MentorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentor/profile"
              element={
                <ProtectedRoute allowedRoles={['alumni']} redirectTo="/login">
                  <MentorProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:matchId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']} redirectTo="/login">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        </MessageNotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}