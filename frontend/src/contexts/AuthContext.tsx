import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import { User, LoginRequest, LoginResponse, MeResponse } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify token is still valid by fetching user profile
        refreshUser().catch(() => {
          // Token invalid, clear storage
          logout();
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<User> => {
    try {
      const response = await apiRequest<LoginResponse>(
        API_ENDPOINTS.login,
        {
          method: 'POST',
          body: JSON.stringify(credentials),
        }
      );

      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
      
      // Return user for immediate use
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const refreshUser = async (): Promise<void> => {
    if (!token) return;

    try {
      const response = await apiRequest<MeResponse>(API_ENDPOINTS.me);
      setUser(response.user);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
    } catch (error) {
      console.error('Refresh user error:', error);
      // Token might be invalid, logout
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

