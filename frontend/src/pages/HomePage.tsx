import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { WaikatoNavigation } from '../components/WaikatoNavigation';
import { WaikatoHeroSection } from '../components/WaikatoHeroSection';
import { WaikatoFooter } from '../components/WaikatoFooter';

export function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // If user is logged in, redirect to their dashboard
  if (!isLoading && isAuthenticated && user) {
    const roleDashboardMap: Record<string, string> = {
      student: '/student/dashboard',
      alumni: '/mentor/dashboard',
      admin: '/admin/dashboard',
    };
    const dashboardRoute = roleDashboardMap[user.role] || '/dashboard';
    return <Navigate to={dashboardRoute} replace />;
  }

  // Show home page only for unauthenticated users
  return (
    <div className="min-h-screen bg-white">
      <WaikatoNavigation />
      <main>
        <WaikatoHeroSection />
      </main>
      <WaikatoFooter />
    </div>
  );
}

