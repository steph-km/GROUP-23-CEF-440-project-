import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { getItem, setItem } from '@/utils/storage';

// Define light and dark color schemes
const lightColors = {
  primary: '#0077FF',
  secondary: '#00BFA5',
  accent: '#FF9800',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6E6E6E',
  border: '#E0E0E0',
  white: '#FFFFFF',
  black: '#000000',
  danger: '#F44336',
  errorBackground: '#FFEBEE',
  successBackground: '#E8F5E9',
  warningBackground: '#FFF8E1',
  infoBackground: '#E3F2FD',
};

const darkColors = {
  primary: '#3B95FF',
  secondary: '#26DBC0',
  accent: '#FFB74D',
  success: '#66BB6A',
  warning: '#FFD54F',
  error: '#EF5350',
  info: '#42A5F5',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  white: '#FFFFFF',
  black: '#000000',
  danger: '#EF5350',
  errorBackground: '#421818',
  successBackground: '#18421C',
  warningBackground: '#423D18',
  infoBackground: '#183342',
};

// Define theme context types
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  colors: typeof lightColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme() as Theme || 'light';
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        } else {
          // If no saved preference, use system preference
          setTheme(systemColorScheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        setTheme(systemColorScheme);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  // Save theme preference when it changes
  useEffect(() => {
    if (isLoaded) {
      setItem('theme', theme);
    }
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const value = {
    theme,
    isDark,
    colors,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};