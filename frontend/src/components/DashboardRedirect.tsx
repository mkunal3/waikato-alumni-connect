import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

export function DashboardRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Map user role to dashboard route
  const roleDashboardMap: Record<UserRole, string> = {
    student: '/student/dashboard',
    alumni: '/mentor/dashboard',
    admin: '/admin/dashboard',
  };

  const dashboardRoute = roleDashboardMap[user.role] || '/login';
  return <Navigate to={dashboardRoute} replace />;
}

