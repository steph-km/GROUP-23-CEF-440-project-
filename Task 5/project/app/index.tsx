import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { getItem } from '@/utils/storage';
import { registerBackgroundTask} from '@/utils/networkBackgroundTask';

useEffect(() => {
  registerBackgroundTask();
}, []);


export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuthStatus() {
      const token = await getItem('userToken');
      setIsAuthenticated(!!token);
    }
    
    checkAuthStatus();
  }, []);

  // Show nothing while checking authentication status
  if (isAuthenticated === null) {
    return null;
  }

  // Redirect based on authentication status
  return isAuthenticated ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/auth/welcome" />
  );
}