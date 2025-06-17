import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { getItem } from '@/utils/storage';
import { registerBackgroundTask } from '@/utils/networkBackgroundTask';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // ✅ Register the background task on mount
  useEffect(() => {
    registerBackgroundTask().catch(console.error);
  }, []);

  // ✅ Check authentication on mount
  useEffect(() => {
    async function checkAuthStatus() {
      const token = await getItem('userToken');
      setIsAuthenticated(!!token);
    }
    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/auth/welcome" />
  );
}
