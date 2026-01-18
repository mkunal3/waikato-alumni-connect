import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { WaikatoNavigation } from '../components/WaikatoNavigation';
import { WaikatoHeroSection } from '../components/WaikatoHeroSection';
import { WaikatoFooter } from '../components/WaikatoFooter';

export function HomePage() {
  // Show home page for all users (logged in or not)
  // The hero buttons will handle navigation based on auth state
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <WaikatoNavigation />
      <main>
        <WaikatoHeroSection />
      </main>
      <WaikatoFooter />
    </div>
  );
}

