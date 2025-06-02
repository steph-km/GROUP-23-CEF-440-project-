import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getItem, setItem, removeItem } from '@/utils/storage';

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  // Add other user properties as needed
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userToken = await getItem('userToken');
        const userData = await getItem('userData');

        if (userToken && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // In a real app, this would make an API call to your authentication server
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Here, you would typically:
      // 1. Call your authentication API
      // 2. Validate credentials
      // 3. Receive a token and user data
      
      // Mock authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login (in a real app, this would come from your API)
      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: 'Sarah Johnson',
        email: email,
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
      };
      
      // Save authentication state
      const token = 'mock_token_' + Date.now();
      await setItem('userToken', token);
      await setItem('userData', JSON.stringify(mockUser));
      
      setUser(mockUser);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw new Error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // In a real app, this would create a new user account
  const signUp = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Here, you would typically:
      // 1. Call your user registration API
      // 2. Create a new user account
      // 3. Receive a token and user data
      
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        phone: '',
        location: '',
      };
      
      // Save authentication state
      const token = 'mock_token_' + Date.now();
      await setItem('userToken', token);
      await setItem('userData', JSON.stringify(mockUser));
      
      setUser(mockUser);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear authentication state
      await removeItem('userToken');
      await removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};