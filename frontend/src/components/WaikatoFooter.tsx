import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../config/content';

const waikatoLogo = '/Ko te Tangata | For the People.svg';
const maoriPattern = '/footer-decoration.png';

export function WaikatoFooter() {
  const { t } = useLanguage();
  const [windowWidth, setWindowWidth] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1920; // Default to large screen for SSR
  });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isXl = windowWidth >= 1280;
  const isMd = windowWidth >= 768;

  return (
    <footer style={{ backgroundColor: '#f5f5f5' }}>
      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-12 py-20" style={{ backgroundColor: '#f5f5f5' }}>
        
        {/* Layout 1: Desktop Large (xl+) - Logo left, 4 columns right, NO divider */}
        {isXl && (
        <div className="flex items-start">
          <div className="flex-shrink-0" style={{ marginRight: '128px' }}>
            <img 
              src={waikatoLogo} 
              alt="University of Waikato - For the People" 
              className="w-56 object-contain"
            />
          </div>
          <div className="flex-1 grid grid-cols-4" style={{ gap: '40px' }}>
            {/* Useful Links */}
            <div>
              <h3 className="text-black" style={{ fontSize: '14px', fontWeight: 900, lineHeight: '1.2', marginBottom: '12px', letterSpacing: '0.01em' }}>Useful links</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Find a Mentor</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Become a Mentor</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>How to apply</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Programme guide</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black" style={{ fontSize: '14px', fontWeight: 900, lineHeight: '1.2', marginBottom: '12px', letterSpacing: '0.01em' }}>Popular links</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Mentoring types</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Success stories</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Events</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Resources</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black" style={{ fontSize: '14px', fontWeight: 900, lineHeight: '1.2', marginBottom: '12px', letterSpacing: '0.01em' }}>About us</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Our story</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>News and events</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Alumni network</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Contact us</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black" style={{ fontSize: '13px', fontWeight: 700, lineHeight: '1.2', marginBottom: '8px' }}>In New Zealand</h3>
              <p style={{ fontSize: '13px', fontWeight: 400, lineHeight: '1.5', marginBottom: '20px' }}>
                <svg className="inline-block" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '6px', color: '#D50000' }}>
                  <path d="M22 16.92v3.02a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3.02a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>
                </svg>
                <a href="tel:0800WAIKATO" style={{ textDecoration: 'underline', color: '#4a4a4a' }}>0800 WAIKATO</a>
              </p>
              <h3 className="text-black" style={{ fontSize: '13px', fontWeight: 700, lineHeight: '1.2', marginBottom: '8px' }}>International</h3>
              <p style={{ fontSize: '13px', fontWeight: 400, lineHeight: '1.5' }}>
                <svg className="inline-block" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '6px', color: '#D50000' }}>
                  <path d="M22 16.92v3.02a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3.02a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>
                </svg>
                <a href="tel:+6477880688" style={{ textDecoration: 'underline', color: '#4a4a4a' }}>+64 7788 0688</a>
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Layout 2: Tablet (md to lg) - Logo top WITH divider, 2x2 grid */}
        {isMd && !isXl && (
        <div>
          <div className="mb-6">
            <img 
              src={waikatoLogo} 
              alt="University of Waikato - For the People" 
              className="w-56 object-contain"
            />
          </div>
          <div className="border-b border-gray-300 mb-12"></div>
          <div className="grid grid-cols-2" style={{ gap: '128px 96px' }}>
            {/* Useful Links */}
            <div>
              <h3 className="text-black" style={{ fontSize: '14px', fontWeight: 900, lineHeight: '1.2', marginBottom: '12px', letterSpacing: '0.01em' }}>Useful links</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Find a Mentor</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Become a Mentor</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>How to apply</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Programme guide</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black" style={{ fontSize: '14px', fontWeight: 900, lineHeight: '1.2', marginBottom: '12px', letterSpacing: '0.01em' }}>Popular links</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Mentoring types</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Success stories</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Events</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Resources</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black" style={{ fontSize: '14px', fontWeight: 900, lineHeight: '1.2', marginBottom: '12px', letterSpacing: '0.01em' }}>About us</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Our story</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>News and events</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Alumni network</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Contact us</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black" style={{ fontSize: '13px', fontWeight: 700, lineHeight: '1.2', marginBottom: '8px' }}>In New Zealand</h3>
              <p style={{ fontSize: '13px', fontWeight: 400, lineHeight: '1.5', marginBottom: '20px' }}>
                <svg className="inline-block" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '6px', color: '#D50000' }}>
                  <path d="M22 16.92v3.02a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3.02a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>
                </svg>
                <a href="tel:0800WAIKATO" style={{ textDecoration: 'underline', color: '#4a4a4a' }}>0800 WAIKATO</a>
              </p>
              <h3 className="text-black" style={{ fontSize: '13px', fontWeight: 700, lineHeight: '1.2', marginBottom: '8px' }}>International</h3>
              <p style={{ fontSize: '13px', fontWeight: 400, lineHeight: '1.5' }}>
                <svg className="inline-block" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '6px', color: '#D50000' }}>
                  <path d="M22 16.92v3.02a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3.02a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>
                </svg>
                <a href="tel:+6477880688" style={{ textDecoration: 'underline', color: '#4a4a4a' }}>+64 7788 0688</a>
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Layout 3: Mobile (<md) - Logo top WITH divider, vertical stack */}
        {!isMd && (
        <div>
          <div className="mb-6">
            <img 
              src={waikatoLogo} 
              alt="University of Waikato - For the People" 
              className="w-48 object-contain"
            />
          </div>
          <div className="border-b border-gray-300 mb-12"></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Useful Links */}
            <div>
              <h3 className="text-black" style={{ fontSize: '14px', fontWeight: 900, lineHeight: '1.2', marginBottom: '12px', letterSpacing: '0.01em' }}>Useful links</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Find a Mentor</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Become a Mentor</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>How to apply</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Programme guide</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black" style={{ fontSize: '14px', fontWeight: 900, lineHeight: '1.2', marginBottom: '12px', letterSpacing: '0.01em' }}>Popular links</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Mentoring types</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Success stories</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Events</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Resources</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black" style={{ fontSize: '14px', fontWeight: 900, lineHeight: '1.2', marginBottom: '12px', letterSpacing: '0.01em' }}>About us</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Our story</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>News and events</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Alumni network</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Contact us</a></li>
                <li style={{ marginBottom: '6px' }}><a href="#" className="text-gray-700" style={{ fontSize: '13px', fontWeight: 400, textDecoration: 'underline', lineHeight: '1.5', color: '#4a4a4a' }}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black" style={{ fontSize: '13px', fontWeight: 700, lineHeight: '1.2', marginBottom: '8px' }}>In New Zealand</h3>
              <p style={{ fontSize: '13px', fontWeight: 400, lineHeight: '1.5', marginBottom: '20px' }}>
                <svg className="inline-block" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '6px', color: '#D50000' }}>
                  <path d="M22 16.92v3.02a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3.02a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>
                </svg>
                <a href="tel:0800WAIKATO" style={{ textDecoration: 'underline', color: '#4a4a4a' }}>0800 WAIKATO</a>
              </p>
              <h3 className="text-black" style={{ fontSize: '13px', fontWeight: 700, lineHeight: '1.2', marginBottom: '8px' }}>International</h3>
              <p style={{ fontSize: '13px', fontWeight: 400, lineHeight: '1.5' }}>
                <svg className="inline-block" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '6px', color: '#D50000' }}>
                  <path d="M22 16.92v3.02a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3.02a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>
                </svg>
                <a href="tel:+6477880688" style={{ textDecoration: 'underline', color: '#4a4a4a' }}>+64 7788 0688</a>
              </p>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Maori Pattern Border */}
      <div className="w-full bg-[#f5f5f5]">
        <img 
          src={maoriPattern} 
          alt="Maori Tukutuku Pattern" 
          className="w-full h-auto"
        />
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#2c2c2c] text-white py-6">
        <div className="max-w-[1440px] mx-auto px-12 flex flex-row justify-between items-center">
          <div className="flex gap-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
              Copyright and legal statement
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
              Privacy policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
              Accessibility statement
            </a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="text-black text-lg">f</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="text-black text-lg">in</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="text-black text-lg">Li</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="text-black text-lg">X</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="text-black text-lg">Y</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
