import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../config/content';
import { WaikatoNavigation } from '../components/WaikatoNavigation';

export function LoginPage() {
  const { t } = useLanguage();
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const roleDashboardMap: Record<string, string> = {
        student: '/student/dashboard',
        alumni: '/mentor/dashboard',
        admin: '/admin/dashboard',
      };
      const dashboardRoute = roleDashboardMap[user.role] || '/dashboard';
      navigate(dashboardRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const loggedInUser = await login({ email, password });
      
      // Navigate directly based on user role
      const roleDashboardMap: Record<string, string> = {
        student: '/student/dashboard',
        alumni: '/mentor/dashboard',
        admin: '/admin/dashboard',
      };
      const dashboardRoute = roleDashboardMap[loggedInUser.role] || '/dashboard';
      navigate(dashboardRoute, { replace: true });
    } catch (err) {
      console.error('Login error details:', err);
      let errorMessage = 'Login failed. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        // Check for common error scenarios
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (err.message.includes('401') || err.message.includes('Invalid')) {
          errorMessage = 'Invalid email or password. Please try again.';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7F7F7' }}>
      <WaikatoNavigation />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '480px', backgroundColor: 'white', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            {/* Heading */}
            <div style={{ marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black', marginBottom: '0.5rem' }}>Login</h1>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                Access your Waikato Alumni Connect account
              </p>
            </div>

            {/* Subtitle */}
            <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Sign in to access your dashboard and connect with mentors or students.
              </p>
            </div>

            {error && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" style={{ display: 'block', color: '#111827', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@waikato.ac.nz"
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" style={{ display: 'block', color: '#111827', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ width: '100%', padding: '0.75rem 3rem 0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div style={{ textAlign: 'right' }}>
                <a 
                  href="#" 
                  style={{ color: '#D50000', fontSize: '0.875rem', textDecoration: 'none' }}
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Implement forgot password
                  }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', backgroundColor: '#D50000', color: 'white', fontWeight: '500', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1 }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              {/* Register Link */}
              <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Don't have an account?
                </p>
                <a 
                  href="#" 
                  style={{ color: '#D50000', fontSize: '0.875rem', textDecoration: 'none' }}
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Navigate to register page
                  }}
                >
                  Register here
                </a>
              </div>
            </form>
          </div>
      </main>
      {/* Simple Footer for Login Page */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              © 2025 University of Waikato / Te Whare Wānanga o Waikato. All rights reserved.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Waikato Alumni Connect
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

