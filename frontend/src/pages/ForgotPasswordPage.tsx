import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../config/api';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setMessage('If the email exists, a reset code has been sent.');
      setTimeout(() => navigate('/reset-password', { replace: true }), 500);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f7f7f7' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>Forgot password</h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Enter your account email to receive a reset code.
        </p>

        {message && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '8px', color: '#0f172a' }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#111827' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ padding: '0.9rem', borderRadius: '8px', border: 'none', backgroundColor: '#d50000', color: '#fff', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? 'Sending...' : 'Send reset code'}
          </button>
        </form>
      </div>
    </div>
  );
}
