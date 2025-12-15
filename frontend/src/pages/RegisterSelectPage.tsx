import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users } from 'lucide-react';
import { WaikatoNavigation } from '../components/WaikatoNavigation';

export function RegisterSelectPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F7F7F7' }}>
      <WaikatoNavigation />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'black', marginBottom: '12px' }}>
              Join Waikato Alumni Connect
            </h1>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>
              Choose your registration type to get started
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Student Registration Card */}
            <div 
              onClick={() => navigate('/register/student')}
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                padding: '40px', 
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D50000';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(213, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#FEF2F2',
                  borderRadius: '50%',
                  marginBottom: '24px'
                }}>
                  <GraduationCap size={40} color="#D50000" />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'black', marginBottom: '16px' }}>
                  Current Student
                </h2>
                <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                  Register as a current University of Waikato student to connect with experienced alumni mentors
                </p>
                <ul style={{ textAlign: 'left', color: '#6B7280', fontSize: '14px', lineHeight: '1.8', listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '8px' }}>✓ Connect with alumni mentors</li>
                  <li style={{ marginBottom: '8px' }}>✓ Get career guidance</li>
                  <li style={{ marginBottom: '8px' }}>✓ Expand your network</li>
                  <li>✓ Access exclusive resources</li>
                </ul>
              </div>
            </div>

            {/* Alumni Registration Card */}
            <div 
              onClick={() => navigate('/register/alumni')}
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                padding: '40px', 
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D50000';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(213, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#FEF2F2',
                  borderRadius: '50%',
                  marginBottom: '24px'
                }}>
                  <Users size={40} color="#D50000" />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'black', marginBottom: '16px' }}>
                  Alumni Mentor
                </h2>
                <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                  Register as a University of Waikato alumnus to mentor current students and give back to the community
                </p>
                <ul style={{ textAlign: 'left', color: '#6B7280', fontSize: '14px', lineHeight: '1.8', listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '8px' }}>✓ Share your experience</li>
                  <li style={{ marginBottom: '8px' }}>✓ Guide the next generation</li>
                  <li style={{ marginBottom: '8px' }}>✓ Strengthen your network</li>
                  <li>✓ Give back to Waikato</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>
              Already have an account?{' '}
              <a 
                href="/login" 
                style={{ color: '#D50000', textDecoration: 'none', fontWeight: '500' }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                Login here
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #E5E7EB', marginTop: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#4B5563' }}>
            © 2025 University of Waikato / Te Whare Wānanga o Waikato. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

