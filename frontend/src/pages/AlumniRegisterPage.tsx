import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { WaikatoNavigation } from '../components/WaikatoNavigation';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export function AlumniRegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    invitationCode: '',
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendCode = async () => {
    setError(null);
    
    if (!formData.invitationCode.trim()) {
      setError('Please enter invitation code first');
      return;
    }

    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setSendingCode(true);

    try {
      // TODO: Call backend API to send verification code
      // const response = await fetch(`${API_BASE_URL}/auth/send-verification-code`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: formData.email, invitationCode: formData.invitationCode })
      // });
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCodeSent(true);
      alert('Verification code sent to your email!');
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.invitationCode.trim()) {
      setError('Invitation code is required');
      return;
    }

    if (!codeSent) {
      setError('Please send verification code first');
      return;
    }

    if (!formData.verificationCode.trim()) {
      setError('Please enter verification code');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationCode: formData.invitationCode,
          email: formData.email,
          verificationCode: formData.verificationCode,
          password: formData.password,
          role: 'alumni'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful - show success message and redirect to login
      alert('Registration successful! You can now log in to your account.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F7F7F7' }}>
      <WaikatoNavigation />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'black', marginBottom: '8px' }}>
                Alumni Registration
              </h1>
              <p style={{ color: '#6B7280' }}>
                Create your account to mentor current students
              </p>
            </div>

            {error && (
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '8px', color: '#EF4444', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Invitation Code */}
              <div>
                <label htmlFor="invitationCode" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  Invitation Code *
                </label>
                <input
                  type="text"
                  id="invitationCode"
                  name="invitationCode"
                  value={formData.invitationCode}
                  onChange={handleChange}
                  placeholder="Enter your invitation code"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  Email Address *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    style={{ flex: 1, padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                    required
                    disabled={isLoading || codeSent}
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={sendingCode || codeSent || isLoading}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: codeSent ? '#10B981' : '#D50000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: (sendingCode || codeSent || isLoading) ? 'not-allowed' : 'pointer',
                      opacity: (sendingCode || codeSent || isLoading) ? 0.6 : 1,
                      whiteSpace: 'nowrap',
                      fontWeight: '500'
                    }}
                  >
                    {sendingCode ? 'Sending...' : codeSent ? 'Code Sent' : 'Send Code'}
                  </button>
                </div>
              </div>

              {/* Verification Code */}
              {codeSent && (
                <div>
                  <label htmlFor="verificationCode" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                    Verification Code *
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    style={{ width: '100%', padding: '12px 48px 12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', cursor: 'pointer', background: 'none', border: 'none' }}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  Confirm Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    style={{ width: '100%', padding: '12px 48px 12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', cursor: 'pointer', background: 'none', border: 'none' }}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  backgroundColor: '#D50000', 
                  color: 'white', 
                  padding: '14px 0', 
                  borderRadius: '8px', 
                  fontWeight: '500', 
                  border: 'none', 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                  marginTop: '8px'
                }}
              >
                {isLoading ? 'Registering...' : 'Register as Alumni'}
              </button>

              {/* Login Link */}
              <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>
                  Already have an account?{' '}
                  <a 
                    href="/login" 
                    style={{ color: '#D50000', textDecoration: 'none', fontWeight: '500' }}
                  >
                    Login here
                  </a>
                </p>
              </div>
            </form>
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

