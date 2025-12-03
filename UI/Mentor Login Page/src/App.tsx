import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap, Briefcase, Users } from 'lucide-react';
import waikatoLogo from 'figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png';
import heroImage from 'figma:asset/0b6d7c69384b330ee1216c39b2be1c798fcf9f79.png';

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', { email, staySignedIn });
    // Handle login logic here
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F7F7', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header with Logo */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-[120px] py-4">
          <img src={waikatoLogo} alt="University of Waikato" className="h-20" />
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden" style={{ height: '520px' }}>
        {/* Hero Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="University of Waikato professionals"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 35%' }}
          />
          {/* Soft White Gradient Overlay (bottom to top, 35% opacity) */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%)',
            }}
          />
        </div>

        {/* Hero Text (Centered) */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4">
            <h1 style={{ fontSize: '48px', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px', lineHeight: 1.2 }}>
              Mentor Login
            </h1>
            <p style={{ fontSize: '20px', fontWeight: 400, color: '#FFFFFF', opacity: 0.95 }}>
              Takiuru Kaitohutohu
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Section with Cards Side by Side */}
      <div className="max-w-[1440px] mx-auto px-[120px] py-16">
        <div className="flex items-center justify-center gap-8">
          {/* Why Become a Mentor Box - LEFT SIDE */}
          <div
            className="bg-white shadow-lg flex-shrink-0"
            style={{
              width: '340px',
              padding: '32px 24px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <h3 style={{ marginBottom: '24px', color: '#1A1A1A', fontWeight: 600, fontSize: '20px' }}>
              Why Become a Mentor
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: '#D50000' 
                  }}
                >
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', color: '#1A1A1A', marginBottom: '4px', fontWeight: 500 }}>
                    Support future graduates
                  </p>
                  <p style={{ fontSize: '13px', color: '#777777' }}>
                    Tautoko i ngā paetahi o āpōpō
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: '#D50000' 
                  }}
                >
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', color: '#1A1A1A', marginBottom: '4px', fontWeight: 500 }}>
                    Share real-world experience
                  </p>
                  <p style={{ fontSize: '13px', color: '#777777' }}>
                    Tuari i ngā wheako o te ao tūturu
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: '#D50000' 
                  }}
                >
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', color: '#1A1A1A', marginBottom: '4px', fontWeight: 500 }}>
                    Stay connected to Waikato
                  </p>
                  <p style={{ fontSize: '13px', color: '#777777' }}>
                    Noho tonu hei hoa o Waikato
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Card - RIGHT SIDE */}
          <div
            className="bg-white shadow-lg flex-shrink-0"
            style={{
              width: '440px',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: '#1A1A1A', fontSize: '14px' }}>
                  Email Address / Wāhitau Īmēra
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email / Tuhia tō īmēra"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D50000] transition-colors"
                  style={{ color: '#1A1A1A', fontSize: '15px' }}
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: '#1A1A1A', fontSize: '14px' }}>
                  Password / Kupuhipa
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password / Tuhia tō kupuhipa"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D50000] transition-colors pr-12"
                    style={{ color: '#1A1A1A', fontSize: '15px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    id="staySignedIn"
                    type="checkbox"
                    checked={staySignedIn}
                    onChange={(e) => setStaySignedIn(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-[#D50000]"
                  />
                  <label htmlFor="staySignedIn" style={{ fontSize: '13px', color: '#1A1A1A' }}>
                    Stay signed in
                  </label>
                </div>
                <a
                  href="#forgot-password"
                  className="hover:underline transition-all"
                  style={{ fontSize: '13px', color: '#D50000' }}
                >
                  Forgot Password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full rounded-lg transition-all hover:shadow-lg"
                style={{
                  height: '52px',
                  backgroundColor: '#D50000',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '15px',
                  boxShadow: '0 2px 8px rgba(213, 0, 0, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B50000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#D50000';
                }}
              >
                Sign in as Mentor / Takiuru hei Kaitohutohu
              </button>

              {/* Bottom Link */}
              <div className="text-center pt-2">
                <p style={{ fontSize: '14px', color: '#1A1A1A' }}>
                  New mentor?{' '}
                  <a href="#create-account" className="hover:underline" style={{ color: '#D50000', fontWeight: 500 }}>
                    Create an account
                  </a>
                </p>
                <p style={{ fontSize: '12px', marginTop: '4px', color: '#777777' }}>
                  He kaitohutohu hou koe? Waihanga pūkete
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-[1440px] mx-auto px-[120px] py-8">
          <div className="text-center">
            <p style={{ fontSize: '14px', color: '#888888' }}>
              © 2025 University of Waikato / Te Whare Wānanga o Waikato. All rights reserved.
            </p>
            <p style={{ fontSize: '14px', marginTop: '8px', color: '#888888' }}>
              Waikato Alumni Connect
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}