import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { WaikatoNavigation } from './components/WaikatoNavigation';
import { WaikatoHeroSection } from './components/WaikatoHeroSection';
import { WaikatoFooter } from './components/WaikatoFooter';

export default function App() {
  return (
    <LanguageProvider children={
      <div className="min-h-screen bg-white">
        <WaikatoNavigation />
        <main className="mb-32">
          <WaikatoHeroSection />
        </main>
        <WaikatoFooter />
      </div>
    } />
  );
}
