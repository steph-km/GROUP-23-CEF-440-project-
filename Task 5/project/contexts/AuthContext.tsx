import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getItem, setItem, removeItem } from '@/utils/storage';

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
    phone: string,
    location: string
  ) => Promise<void>;
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

  // Load user from storage if already signed in
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

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: 'Jamison Lii',
        email,
        phone: '+237 695 425 977',
        location: 'Check Point, Buea',
      };

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

  // Updated sign up function with phone and location
  const signUp = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    location: string
  ) => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        phone,
        location,
      };

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
      await removeItem('userToken');
      await removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const value: AuthContextType = {
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
