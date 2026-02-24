import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { WaikatoNavigation } from '../components/WaikatoNavigation';
import { apiRequest, API_ENDPOINTS } from '../config/api';

export function AdminRegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inviteCode: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.name.trim()) {
      return 'Name is required';
    }

    if (!formData.email.trim()) {
      return 'Email is required';
    }

    if (!formData.email.toLowerCase().endsWith('@waikato.ac.nz')) {
      return 'Email must end with @waikato.ac.nz';
    }

    if (!formData.inviteCode.trim()) {
      return 'Invitation code is required';
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password);

    if (!hasUppercase) {
      return 'Password must include at least one uppercase letter';
    }

    if (!hasSpecialChar) {
      return 'Password must include at least one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

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
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          inviteCode: formData.inviteCode.trim(),
        }),
      });

      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error('Admin registration error:', err);
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
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'black', marginBottom: '8px' }}>
                Admin Registration
              </h1>
              <p style={{ color: '#6B7280' }}>
                Register with your invite code to manage the platform
              </p>
            </div>

            {error && (
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '8px', color: '#EF4444', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label htmlFor="name" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="email" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  University Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.name@waikato.ac.nz"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="inviteCode" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  Invitation Code *
                </label>
                <input
                  type="text"
                  id="inviteCode"
                  name="inviteCode"
                  value={formData.inviteCode}
                  onChange={handleChange}
                  placeholder="Enter your invitation code"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setShowPasswordRequirements(true)}
                    onBlur={() => {
                      setTimeout(() => setShowPasswordRequirements(false), 200);
                    }}
                    placeholder="Enter your password"
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
                {showPasswordRequirements && (() => {
                  const hasUppercase = /[A-Z]/.test(formData.password);
                  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password);
                  return (
                    <div style={{
                      marginTop: '8px',
                      padding: '12px',
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      zIndex: 10
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#374151', fontSize: '14px' }}>
                        <span style={{ color: formData.password.length >= 8 ? '#10B981' : '#EF4444' }}>
                          • At least 8 characters
                        </span>
                        <span style={{ color: hasUppercase ? '#10B981' : '#EF4444' }}>
                          • At least one uppercase letter
                        </span>
                        <span style={{ color: hasSpecialChar ? '#10B981' : '#EF4444' }}>
                          • At least one special character
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <label htmlFor="confirmPassword" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  Confirm Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
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

              <button
                type="submit"
                disabled={isLoading}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#D50000', color: 'white', fontWeight: '600', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
              >
                {isLoading ? 'Registering...' : 'Register as Admin'}
              </button>
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
