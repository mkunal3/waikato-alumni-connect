import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { WaikatoNavigation } from '../components/WaikatoNavigation';
import { apiRequest, API_ENDPOINTS } from '../config/api';

export function AlumniRegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    invitationCode: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.invitationCode.trim()) {
      setError('Invitation code is required');
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

    // Password validation
    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);
    const hasInvalidChar = /[\s<>]/.test(formData.password); // No spaces, <, or >

    if (!hasUppercase) {
      setError('Password must include at least one uppercase letter');
      return;
    }

    if (!hasSpecialChar) {
      setError('Password must include at least one special character');
      return;
    }

    if (hasInvalidChar) {
      setError('Password cannot contain spaces, <, or > characters');
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest<{ message: string; user: any }>(
        API_ENDPOINTS.register,
        {
          method: 'POST',
          body: JSON.stringify({
            invitationCode: formData.invitationCode,
            email: formData.email,
            password: formData.password,
            role: 'alumni'
          }),
        }
      );

      // Registration successful - show success message and redirect to login
      alert('Registration successful! You can now log in to your account.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
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
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                />
              </div>

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
                    onFocus={() => setShowPasswordRequirements(true)}
                    onBlur={() => {
                      // Delay hiding to allow clicking on requirements
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
                {/* Password Requirements Popup */}
                {showPasswordRequirements && (() => {
                  const hasUppercase = /[A-Z]/.test(formData.password);
                  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);
                  const hasInvalidChar = /[\s<>]/.test(formData.password);
                  
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            display: 'inline-block',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: `2px solid ${formData.password.length >= 8 ? '#10B981' : '#D1D5DB'}`,
                            backgroundColor: formData.password.length >= 8 ? '#10B981' : 'transparent',
                            position: 'relative'
                          }}>
                            {formData.password.length >= 8 && (
                              <span style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>✓</span>
                            )}
                          </span>
                          <span style={{ fontSize: '14px', color: formData.password.length >= 8 ? '#10B981' : '#6B7280' }}>
                            At least 8 characters
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            display: 'inline-block',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: `2px solid ${hasUppercase ? '#10B981' : '#D1D5DB'}`,
                            backgroundColor: hasUppercase ? '#10B981' : 'transparent',
                            position: 'relative'
                          }}>
                            {hasUppercase && (
                              <span style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>✓</span>
                            )}
                          </span>
                          <span style={{ fontSize: '14px', color: hasUppercase ? '#10B981' : '#6B7280' }}>
                            At least one uppercase letter
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            display: 'inline-block',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: `2px solid ${hasSpecialChar ? '#10B981' : '#D1D5DB'}`,
                            backgroundColor: hasSpecialChar ? '#10B981' : 'transparent',
                            position: 'relative'
                          }}>
                            {hasSpecialChar && (
                              <span style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>✓</span>
                            )}
                          </span>
                          <span style={{ fontSize: '14px', color: hasSpecialChar ? '#10B981' : '#6B7280' }}>
                            At least one special character
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            display: 'inline-block',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: `2px solid ${!hasInvalidChar ? '#10B981' : '#EF4444'}`,
                            backgroundColor: !hasInvalidChar ? '#10B981' : 'transparent',
                            position: 'relative'
                          }}>
                            {!hasInvalidChar && (
                              <span style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>✓</span>
                            )}
                            {hasInvalidChar && (
                              <span style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: '#EF4444',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>✗</span>
                            )}
                          </span>
                          <span style={{ fontSize: '14px', color: !hasInvalidChar ? '#10B981' : '#EF4444' }}>
                            No spaces, &lt;, or &gt;
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
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

