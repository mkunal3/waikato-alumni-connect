import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../config/content';

const campusImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=600&fit=crop&q=80';

export function WaikatoHeroSection() {
  const { t } = useLanguage();
  const [isFindMentorHovered, setIsFindMentorHovered] = React.useState(false);
  const [isBecomeMentorHovered, setIsBecomeMentorHovered] = React.useState(false);
  
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

            {/* Action Buttons */}
            <div className="flex gap-4 mb-12">
              <button 
                className="px-2 py-4 rounded-xl text-white transition-colors font-medium"
                style={{ 
                  border: '2px solid #FFFFFF',
                  backgroundColor: isFindMentorHovered ? '#D50000' : 'rgba(0, 0, 0, 0)',
                  width: '235px'
                }}
                onMouseEnter={() => setIsFindMentorHovered(true)}
                onMouseLeave={() => setIsFindMentorHovered(false)}>
                {t(content.hero.findMentor.en, content.hero.findMentor.mi)}
              </button>
              <button 
                className="px-2 py-4 rounded-xl text-white transition-colors font-medium"
                style={{ 
                  border: '2px solid #FFFFFF',
                  backgroundColor: isBecomeMentorHovered ? '#D50000' : 'rgba(0, 0, 0, 0)',
                  width: '235px'
                }}
                onMouseEnter={() => setIsBecomeMentorHovered(true)}
                onMouseLeave={() => setIsBecomeMentorHovered(false)}>
                {t(content.hero.becomeMentor.en, content.hero.becomeMentor.mi)}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-[600px]">
              <input
                type="text"
                placeholder={t(content.hero.searchPlaceholder.en, content.hero.searchPlaceholder.mi)}
                className="w-full px-6 py-4 rounded-2xl bg-white/95 backdrop-blur-sm border-0 shadow-xl focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
