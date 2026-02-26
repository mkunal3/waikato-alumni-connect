import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { WaikatoNavigation } from '../components/WaikatoNavigation';
import { apiRequest, API_ENDPOINTS } from '../config/api';

export function AdminInviteRegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!fullName.trim()) return 'Full name is required';
    if (!email.trim()) return 'Email is required';
    if (!email.toLowerCase().endsWith('@waikato.ac.nz')) return 'Email must end with @waikato.ac.nz';
    if (!inviteCode.trim()) return 'Invitation code is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password);
    if (!hasUppercase) return 'Password must include at least one uppercase letter';
    if (!hasSpecialChar) return 'Password must include at least one special character';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiRequest(API_ENDPOINTS.registerAdmin, {
        method: 'POST',
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          inviteCode: inviteCode.trim(),
        }),
      });

      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error('Admin invite registration error:', err);
      let errorMessage = 'Registration failed. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F7F7F7' }}>
      <WaikatoNavigation />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: 'black', marginBottom: '8px' }}>
                Register as Admin (invite only)
              </h1>
              <p style={{ color: '#6B7280' }}>Use your staff email and invite code to create an admin account.</p>
            </div>

            {error && (
              <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '8px', color: '#EF4444', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="fullName" style={{ display: 'block', color: '#4B5563', marginBottom: '6px', fontWeight: 500 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Your Name"
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="email" style={{ display: 'block', color: '#4B5563', marginBottom: '6px', fontWeight: 500 }}>
                  Staff Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@waikato.ac.nz"
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="inviteCode" style={{ display: 'block', color: '#4B5563', marginBottom: '6px', fontWeight: 500 }}>
                  Invitation Code *
                </label>
                <input
                  type="text"
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Paste your admin invitation code"
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" style={{ display: 'block', color: '#4B5563', marginBottom: '6px', fontWeight: 500 }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    style={{ width: '100%', padding: '12px 44px 12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', cursor: 'pointer', background: 'none', border: 'none' }}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p style={{ marginTop: '6px', color: '#6B7280', fontSize: '12px' }}>
                  At least 8 characters, include an uppercase letter and a special character.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#9ca3af' : '#D50000',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '15px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? 'Registering...' : 'Register as Admin'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  backgroundColor: 'white',
                  color: '#374151',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '15px'
                }}
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
