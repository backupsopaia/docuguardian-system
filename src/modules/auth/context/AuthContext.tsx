
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { mockUsers } from '../data/users';
import { apiFetch } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  department: string;
  isActive: boolean;
  lastLogin: Date;
}

interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpiry: number | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create a JWT-like token (for demo purposes)
const createMockToken = (user: Omit<User, 'password'>, expiresIn = 3600): { token: string, expiry: number } => {
  // In a real app, this would be handled by a server
  const expiryTime = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds
  
  // Simulate JWT structure with header, payload, and signature
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Math.floor(expiryTime / 1000) // Expiry in seconds
  };
  
  // This is not a real JWT, just a mock for demonstration
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.mock-signature`;
  
  return { token, expiry: expiryTime };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    tokenExpiry: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Load auth state from localStorage on initial load
  useEffect(() => {
    const savedAuth = localStorage.getItem('dms_auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth) as AuthState;
        
        // Check if token is expired
        if (parsedAuth.tokenExpiry && parsedAuth.tokenExpiry > Date.now()) {
          setAuthState(parsedAuth);
          
          // Auto-refresh token if it's about to expire
          const timeToExpiry = parsedAuth.tokenExpiry - Date.now();
          if (timeToExpiry < 300000) { // Less than 5 minutes to expiry
            refreshToken(parsedAuth.user);
          }
        } else {
          // Token expired, clear storage
          localStorage.removeItem('dms_auth');
        }
      } catch (e) {
        console.error('Failed to parse saved auth state', e);
        localStorage.removeItem('dms_auth');
      }
    }
    setIsLoading(false);
  }, []);
  
  // Set up token refresh interval
  useEffect(() => {
    if (authState.user && authState.tokenExpiry) {
      const timeToExpiry = authState.tokenExpiry - Date.now();
      
      // If token expires in less than 5 minutes, refresh it now
      if (timeToExpiry < 300000 && timeToExpiry > 0) {
        refreshToken(authState.user);
      }
      
      // Set up auto-refresh for tokens
      const refreshInterval = setInterval(() => {
        if (authState.user) {
          refreshToken(authState.user);
        }
      }, 1000 * 60 * 15); // Refresh every 15 minutes
      
      return () => clearInterval(refreshInterval);
    }
  }, [authState.user, authState.tokenExpiry]);

  const refreshToken = async (user: User) => {
    console.log('Refreshing token for user:', user.email);
    
    try {
      // In a real implementation, this would call the refresh token endpoint
      // For now, we'll use our API utility with mock data
      const response = await apiFetch<{ token: string, expiry: number }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id }),
      }, authState.token);
      
      const { token, expiry } = response || createMockToken(user, 3600);
      
      setAuthState(prev => ({
        ...prev,
        token,
        tokenExpiry: expiry
      }));
      
      // Update localStorage if we're in a persistent session
      const savedAuth = localStorage.getItem('dms_auth');
      if (savedAuth) {
        localStorage.setItem('dms_auth', JSON.stringify({
          user,
          token,
          tokenExpiry: expiry
        }));
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Fall back to mock token for demo
      const { token, expiry } = createMockToken(user, 3600);
      
      setAuthState(prev => ({
        ...prev,
        token,
        tokenExpiry: expiry
      }));
      
      // Update localStorage
      const savedAuth = localStorage.getItem('dms_auth');
      if (savedAuth) {
        localStorage.setItem('dms_auth', JSON.stringify({
          user,
          token,
          tokenExpiry: expiry
        }));
      }
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to use the API first, fall back to mock data
      try {
        const response = await apiFetch<{
          user: User,
          token: string,
          expiry: number
        }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        
        if (response && response.user) {
          const { user, token, expiry } = response;
          
          const newAuthState = {
            user,
            token,
            tokenExpiry: expiry
          };
          
          setAuthState(newAuthState);
          
          if (rememberMe) {
            localStorage.setItem('dms_auth', JSON.stringify(newAuthState));
          }
          
          toast.success(`Welcome back, ${user.name || email}!`);
          
          if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
          return;
        }
      } catch (apiError) {
        console.log('API authentication failed, falling back to mock data:', apiError);
        // Continue to mock authentication if API fails
      }
      
      // Fall back to mock authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Create a mock JWT token
      const { token, expiry } = createMockToken(userWithoutPassword);
      
      // Log the login activity (in a real app, this would be sent to the server)
      console.log('Login activity:', {
        user: userWithoutPassword.email,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1', // Mock data
        device: 'Web Browser'
      });
      
      const newAuthState = {
        user: userWithoutPassword,
        token,
        tokenExpiry: expiry
      };
      
      setAuthState(newAuthState);
      
      if (rememberMe) {
        localStorage.setItem('dms_auth', JSON.stringify(newAuthState));
      }
      
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      
      if (userWithoutPassword.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Try to call logout API if the user is authenticated
    if (authState.token) {
      try {
        await apiFetch('/auth/logout', {
          method: 'POST'
        }, authState.token);
      } catch (error) {
        console.error('Failed to call logout API:', error);
      }
    }
    
    // Log the logout activity (in a real app, this would be sent to the server)
    if (authState.user) {
      console.log('Logout activity:', {
        user: authState.user.email,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1', // Mock data
        device: 'Web Browser'
      });
    }
    
    setAuthState({
      user: null,
      token: null,
      tokenExpiry: null
    });
    localStorage.removeItem('dms_auth');
    toast.success('You have been logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: !!authState.user,
        isLoading,
        token: authState.token,
        login,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
