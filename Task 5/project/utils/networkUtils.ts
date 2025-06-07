import { Platform } from 'react-native';

// Mock network types for the demo
const NETWORK_TYPES = ['wifi', 'cellular', '5g', '4g', '3g', '2g', 'none'];

// Get current network type (in a real app, this would use NetInfo)
export const getCurrentNetworkType = async (): Promise<string> => {
  // Mock implementation - in a real app this would use NetInfo
  if (Platform.OS === 'web') {
    // For web, we can use the navigator.connection API if available
    if (navigator && 'connection' in navigator) {
      // @ts-ignore - TS doesn't know about navigator.connection
      const connectionType = navigator.connection.type;
      return connectionType || 'wifi';
    }
    return 'wifi'; // Default for web
  }
  
  // For the demo, return a random network type
  const randomIndex = Math.floor(Math.random() * (NETWORK_TYPES.length - 1)); // Exclude 'none'
  return NETWORK_TYPES[randomIndex];
};

// Mock network stats for the demo
export const getNetworkStats = async () => {
  // In a real app, this would get real network metrics
  return {
    signalStrength: '-78 dBm',
    signalStatus: getRandomStatus(),
    downloadSpeed: (Math.random() * 100).toFixed(1),
    downloadStatus: getRandomStatus(),
    uploadSpeed: (Math.random() * 20).toFixed(1),
    uploadStatus: getRandomStatus(),
    latency: Math.round(Math.random() * 100),
    latencyStatus: getRandomStatus(),
    dailySummary: generateDailySummary(),
  };
};

// Helper function to generate a random status
const getRandomStatus = (): 'excellent' | 'good' | 'fair' | 'poor' => {
  const statuses: Array<'excellent' | 'good' | 'fair' | 'poor'> = [
    'excellent',
    'good',
    'good',
    'fair',
    'fair',
    'poor',
  ];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};

// Helper function to generate mock daily summary data
const generateDailySummary = () => {
  const hours = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM'];
  return hours.map(hour => ({
    hour,
    download: Math.round(Math.random() * 100),
    upload: Math.round(Math.random() * 30),
    latency: Math.round(Math.random() * 100),
  }));
};