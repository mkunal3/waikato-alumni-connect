import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { WaikatoNavigation } from '../components/WaikatoNavigation';
import { apiRequest, API_ENDPOINTS } from '../config/api';

export function StudentRegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    emailPrefix: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendCode = async () => {
    if (!formData.emailPrefix.trim()) {
      setError('Please enter your email prefix first');
      return;
    }

    // Validate email prefix format
    const emailPrefixRegex = /^[a-zA-Z0-9._-]+$/;
    if (!emailPrefixRegex.test(formData.emailPrefix.trim())) {
      setError('Email prefix can only contain letters, numbers, dots, underscores, and hyphens');
      return;
    }

    const fullEmail = `${formData.emailPrefix.trim()}@students.waikato.ac.nz`;
    setIsSendingCode(true);
    setError(null);

    try {
      await apiRequest(API_ENDPOINTS.sendVerificationCode, {
        method: 'POST',
        body: JSON.stringify({ email: fullEmail }),
      });
      setCodeSent(true);
    } catch (err) {
      console.error('Send code error:', err);
      let errorMessage = 'Failed to send verification code. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your first and last name');
      return;
    }

    if (!formData.studentId.trim()) {
      setError('Please enter your student ID');
      return;
    }

    if (!formData.emailPrefix.trim()) {
      setError('Please enter your student email prefix');
      return;
    }

    // Validate email prefix format (alphanumeric and dots/underscores)
    const emailPrefixRegex = /^[a-zA-Z0-9._-]+$/;
    if (!emailPrefixRegex.test(formData.emailPrefix.trim())) {
      setError('Email prefix can only contain letters, numbers, dots, underscores, and hyphens');
      return;
    }

    // Combine prefix with domain
    const fullEmail = `${formData.emailPrefix.trim()}@students.waikato.ac.nz`;

    // Validate verification code
    if (!formData.verificationCode.trim()) {
      setError('Please enter the verification code sent to your email');
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
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);
    const hasInvalidChar = /[\s<>]/.test(formData.password); // No spaces, <, or >

    if (!hasUppercase) {
      setError('Password must include at least one uppercase letter');
      return;
    }
    
    if (!hasNumber) {
      setError('Password must include at least one number');
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
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      
      await apiRequest<{ message: string; user: any }>(
        API_ENDPOINTS.register,
        {
          method: 'POST',
          body: JSON.stringify({
            name: fullName,
            email: fullEmail,
            studentId: formData.studentId.trim(),
            password: formData.password,
            role: 'student',
            verificationCode: formData.verificationCode.trim()
          }),
        }
      );

      // Registration successful - show success message and redirect to login
      alert('Registration successful! Your account is pending admin approval. You can now log in to complete your profile.');
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
                Student Registration
              </h1>
              <p style={{ color: '#6B7280' }}>
                Create your account to connect with alumni mentors
              </p>
            </div>

            {error && (
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '8px', color: '#EF4444', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* First Name */}
              <div>
                <label htmlFor="firstName" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Student ID */}
              <div>
                <label htmlFor="studentId" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  Student ID *
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter your student ID"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="emailPrefix" style={{ display: 'block', color: '#4B5563', marginBottom: '8px', fontWeight: '500' }}>
                  Student Email *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid #D1D5DB', borderRadius: '8px', overflow: 'hidden' }}>
                  <input
                    type="text"
                    id="emailPrefix"
                    name="emailPrefix"
                    value={formData.emailPrefix}
                    onChange={handleChange}
                    placeholder="abc123"
                    style={{ 
                      flex: 1, 
                      padding: '12px 16px', 
                      border: 'none', 
                      outline: 'none',
                      borderRadius: '8px 0 0 8px'
                    }}
                    required
                    disabled={isLoading}
                  />
                  <span style={{ 
                    padding: '12px 16px', 
                    backgroundColor: '#F3F4F6', 
                    color: '#6B7280', 
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    borderLeft: '1px solid #D1D5DB'
                  }}>
                    @students.waikato.ac.nz
                  </span>
                </div>
                {formData.emailPrefix && (
                  <p style={{ marginTop: '6px', fontSize: '12px', color: '#6B7280' }}>
                    Your email: <strong>{formData.emailPrefix.trim()}@students.waikato.ac.nz</strong>
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSendingCode || !formData.emailPrefix.trim() || isLoading}
                  style={{
                    marginTop: '8px',
                    padding: '8px 16px',
                    backgroundColor: codeSent ? '#10B981' : '#D50000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (isSendingCode || !formData.emailPrefix.trim() || isLoading) ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: (isSendingCode || !formData.emailPrefix.trim() || isLoading) ? 0.5 : 1
                  }}
                >
                  {isSendingCode ? 'Sending...' : codeSent ? 'Code Sent ✓' : 'Send Verification Code'}
                </button>
                {codeSent && (
                  <p style={{ marginTop: '6px', fontSize: '12px', color: '#10B981' }}>
                    Verification code sent! Please check your email.
                  </p>
                )}
              </div>

              {/* Verification Code */}
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
                  placeholder="Enter the 6-digit code from your email"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none' }}
                  required
                  disabled={isLoading}
                  maxLength={6}
                />
                <p style={{ marginTop: '6px', fontSize: '12px', color: '#6B7280' }}>
                  Enter the 6-digit verification code sent to your student email
                </p>
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
                {isLoading ? 'Registering...' : 'Register'}
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

