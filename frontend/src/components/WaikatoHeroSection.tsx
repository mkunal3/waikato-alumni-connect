import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { content } from '../config/content';

const campusImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=600&fit=crop&q=80';

export function WaikatoHeroSection() {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isFindMentorHovered, setIsFindMentorHovered] = useState(false);
  const [isBecomeMentorHovered, setIsBecomeMentorHovered] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <img
        src={campusImage}
        alt="University of Waikato Graduates"
        className="w-full h-full object-cover"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1440px] mx-auto px-12 w-full">
          <div className="max-w-[700px]">
            {/* Heading */}
            <h1 className="text-white mb-6">
              {t(content.hero.welcome.en, content.hero.welcome.mi)}
            </h1>
            
            {/* Sub-text */}
            <p className="text-white text-xl mb-10">
              {t(content.hero.tagline.en, content.hero.tagline.mi)}
            </p>

            {/* Error Message */}
            {errorMessage && (
              <div style={{ 
                backgroundColor: '#fee2e2', 
                border: '1px solid #fecaca', 
                borderRadius: '0.5rem', 
                padding: '0.75rem 1rem', 
                marginBottom: '1rem',
                color: '#dc2626',
                fontSize: '0.875rem'
              }}>
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-12">
              <button 
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  if (isAuthenticated && user) {
                    if (user.role === 'student') {
                      navigate('/student/dashboard');
                    } else {
                      setErrorMessage('Please log in as a student to find a mentor.');
                    }
                  } else {
                    navigate('/login');
                  }
                }}
                className="px-2 py-4 rounded-xl text-white transition-colors font-medium"
                style={{ 
                  border: '2px solid #FFFFFF',
                  backgroundColor: isFindMentorHovered ? '#D50000' : 'rgba(0, 0, 0, 0)',
                  width: '235px',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setIsFindMentorHovered(true)}
                onMouseLeave={() => setIsFindMentorHovered(false)}>
                {t(content.hero.findMentor.en, content.hero.findMentor.mi)}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  if (isAuthenticated && user) {
                    if (user.role === 'alumni') {
                      navigate('/mentor/dashboard');
                    } else {
                      setErrorMessage('Please log in as an alumni to become a mentor.');
                    }
                  } else {
                    navigate('/login');
                  }
                }}
                className="px-2 py-4 rounded-xl text-white transition-colors font-medium"
                style={{ 
                  border: '2px solid #FFFFFF',
                  backgroundColor: isBecomeMentorHovered ? '#D50000' : 'rgba(0, 0, 0, 0)',
                  width: '235px',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setIsBecomeMentorHovered(true)}
                onMouseLeave={() => setIsBecomeMentorHovered(false)}>
                {t(content.hero.becomeMentor.en, content.hero.becomeMentor.mi)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
