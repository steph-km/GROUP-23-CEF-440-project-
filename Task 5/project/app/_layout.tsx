import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          <Stack.Screen name="About" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}