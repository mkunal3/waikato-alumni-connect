import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { MentorDashboard } from './components/MentorDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { MentorBrowse } from './components/MentorBrowse';
import { MentorshipPlatform } from './components/MentorshipPlatform';
import { MentoringRoom } from './components/MentoringRoom';
import { AdminDashboard } from './components/AdminDashboard';

type PageType = 'landing' | 'alumni-dashboard' | 'student-dashboard' | 'directory' | 'mentorship' | 'mentoring-room' | 'admin-dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [userType, setUserType] = useState<'alumni' | 'student' | 'admin' | null>(null);

  const handleNavigation = (page: PageType, type?: 'alumni' | 'student' | 'admin') => {
    setCurrentPage(page);
    if (type) setUserType(type);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={handleNavigation} />;
      case 'alumni-dashboard':
        return <MentorDashboard onNavigate={handleNavigation} />;
      case 'student-dashboard':
        return <StudentDashboard onNavigate={handleNavigation} />;
      case 'directory':
        return <MentorBrowse onNavigate={handleNavigation} userType={userType as 'alumni' | 'student' | null} />;
      case 'mentorship':
        return <MentorshipPlatform onNavigate={handleNavigation} userType={userType as 'alumni' | 'student' | null} />;
      case 'mentoring-room':
        return <MentoringRoom onNavigate={handleNavigation} userType={userType as 'student' | 'mentor'} matchId="1" />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={handleNavigation} />;
      default:
        return <Landing onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
    </div>
  );
}