// networkUtils.ts
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'network_stats_cache';
const SAMPLE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
//const TEST_FILE_URL = 'https://speed.hetzner.de/100MB.bin';
const TEST_FILE_URL = 'https://speed.cloudflare.com/__down?bytes=5000000';


export type NetworkSample = {
  timestamp: number;
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
};

export type NetworkData = {
  type: string;
  isConnected: boolean;
  isInternetReachable: boolean | null;
  signalStrength: number | null;
  downloadSpeed: number;
  downloadStatus: string;
  uploadSpeed: number;
  uploadStatus: string;
  latency: number;
  latencyStatus: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
  dailySummary: NetworkSample[];
};

export const getCurrentNetworkInfo = async (): Promise<NetworkData> => {
  try {
    const netInfo = await NetInfo.fetch();
    console.log('NetInfo:', netInfo);

    const signalStrength = Platform.OS === 'android' ? -65 : null; // TODO: Replace with actual fetch on Android
    console.log('Signal Strength:', signalStrength);

    const location = await getCurrentLocation();
    console.log('Location:', location);

    const downloadSpeed = await measureDownloadSpeed();
    console.log('Download Speed (Mbps):', downloadSpeed);

    const uploadSpeed = await estimateUploadSpeed();
    console.log('Upload Speed (Mbps):', uploadSpeed);

    const latency = await measureLatency();
    console.log('Latency (ms):', latency);

    const downloadStatus = classifySpeed(downloadSpeed);
    const uploadStatus = classifySpeed(uploadSpeed);
    const latencyStatus = classifyLatency(latency);

    const cached = await getCachedData();
    const timestamp = Date.now();
    const newSample: NetworkSample = {
      timestamp,
      downloadSpeed,
      uploadSpeed,
      latency,
      location,
    };

    const updatedSummary = [...cached?.dailySummary || [], newSample];

    const updated: NetworkData = {
      type: netInfo.type,
      isConnected: netInfo.isConnected ?? false,
      isInternetReachable: netInfo.isInternetReachable ?? null,
      signalStrength,
      downloadSpeed,
      downloadStatus,
      uploadSpeed,
      uploadStatus,
      latency,
      latencyStatus,
      location,
      dailySummary: updatedSummary,
    };

    console.log('Final NetworkData:', updated);

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data: updated, timestamp }));
    return updated;
  } catch (error) {
    console.error('Error in getCurrentNetworkInfo:', error);
    throw error;
  }
};


const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number; accuracy: number; } | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permission not granted');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy ?? 0,
    };
  } catch (error) {
    console.warn('Failed to get location', error);
    return null;
  }
};

const measureDownloadSpeed = async (): Promise<number> => {
  try {
    const startTime = Date.now();
    const response = await fetch(TEST_FILE_URL, {
      method: 'GET',
      headers: { Range: 'bytes=0-5000000' }, // 5MB
    });

    if (!response.ok) throw new Error('Failed to fetch download test file');

    const blob = await response.blob();
    const endTime = Date.now();

    const sizeBytes = blob.size;
    const sizeMB = sizeBytes / (1024 * 1024); // convert to MB
    const durationSec = (endTime - startTime) / 1000;

    const speedMbps = sizeMB / durationSec;
    console.log('Measured download size:', sizeMB, 'MB in', durationSec, 'sec');
    return Number(speedMbps.toFixed(2));
  } catch (e) {
    console.warn('Download speed test failed:', e);
    return 0;
  }
};


const estimateUploadSpeed = async (): Promise<number> => {
  try {
    const data = new Uint8Array(5 * 1024 * 1024); // 5MB buffer
    data.fill(97); // fill with letter 'a'

    const start = Date.now();
    const response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: data,
    });

    if (!response.ok) throw new Error('Failed to upload test data');

    const end = Date.now();
    const sizeMB = data.length / (1024 * 1024);
    const durationSec = (end - start) / 1000;

    const speedMbps = sizeMB / durationSec;
    console.log('Upload size:', sizeMB, 'MB in', durationSec, 'sec');
    return Number(speedMbps.toFixed(2));
  } catch (e) {
    console.warn('Upload speed test failed:', e);
    return 0;
  }
};


const measureLatency = async (): Promise<number> => {
  try {
    const start = Date.now();
    await fetch('https://www.google.com/generate_204');
    const end = Date.now();
    return end - start;
  } catch {
    return 0;
  }
};

const classifySpeed = (speed: number): string => {
  if (speed > 25) return 'excellent';
  if (speed > 10) return 'good';
  if (speed > 2) return 'fair';
  return 'poor';
};

const classifyLatency = (latency: number): string => {
  if (latency < 50) return 'excellent';
  if (latency < 100) return 'good';
  if (latency < 200) return 'fair';
  return 'poor';
};

export const getCachedData = async (): Promise<NetworkData | null> => {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  return raw ? JSON.parse(raw).data : null;
};

// Background polling every 5 minutes
let backgroundInterval: ReturnType<typeof setInterval> | null = null;

export const startBackgroundNetworkMonitor = () => {
  if (backgroundInterval) return;
  backgroundInterval = setInterval(() => {
    getCurrentNetworkInfo().catch(console.warn);
  }, SAMPLE_INTERVAL_MS);
};

export const stopBackgroundNetworkMonitor = () => {
  if (backgroundInterval) {
    clearInterval(backgroundInterval);
    backgroundInterval = null;
  }
};

export const getCurrentNetworkType = async (): Promise<string> => {
  try {
    const netInfo = await NetInfo.fetch();
    return netInfo.type;
  } catch (error) {
    console.warn('Failed to get network type:', error);
    return 'unknown';
  }
};

export const getNetworkStats = async (): Promise<NetworkData | null> => {
  try {
    return await getCachedData();
  } catch (error) {
    console.warn('Failed to load network data:', error);
    return null;
  }
};



export const logDailyNetworkSummary = async () => {
  const cached = await getCachedData();
  if (!cached || !cached.dailySummary || cached.dailySummary.length === 0) {
    console.log('No network data available for daily summary.');
    return;
  }

  const today = new Date().toDateString();

  const todaySamples = cached.dailySummary.filter(sample => {
    const sampleDate = new Date(sample.timestamp).toDateString();
    return sampleDate === today;
  });

  if (todaySamples.length === 0) {
    console.log('No samples for today yet.');
    return;
  }

  const average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const downloadSpeeds = todaySamples.map(s => s.downloadSpeed);
  const uploadSpeeds = todaySamples.map(s => s.uploadSpeed);
  const latencies = todaySamples.map(s => s.latency);

  const avgDownload = average(downloadSpeeds).toFixed(2);
  const avgUpload = average(uploadSpeeds).toFixed(2);
  const avgLatency = average(latencies).toFixed(2);

  console.log('📊 Daily Network Summary for', today);
  console.log('Samples:', todaySamples.length);
  console.log('Avg Download Speed (Mbps):', avgDownload);
  console.log('Avg Upload Speed (Mbps):', avgUpload);
  console.log('Avg Latency (ms):', avgLatency);
};

export const submitNetworkMetrics = async () => {
  try {
    console.log('📡 Collecting current network info...');
    const data = await getCurrentNetworkInfo();

    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.warn('User token not found. Cannot submit network metrics.');
      return;
    }

    const payload = {
      deviceId: `device-${Platform.OS}`, // Optional: could use device-specific UUID if available
      timestamp: new Date().toISOString(),
      connectionType: data.type,
      isConnected: data.isConnected,
      isInternetReachable: data.isInternetReachable ?? false,
      signalStrength: data.signalStrength ?? -100, // fallback for null
      downloadSpeed: data.downloadSpeed,
      downloadStatus: data.downloadStatus,
      uploadSpeed: data.uploadSpeed,
      uploadStatus: data.uploadStatus,
      latency: data.latency,
      latencyStatus: data.latencyStatus,
      location: data.location ? {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        accuracy: data.location.accuracy
      } : { latitude: 0, longitude: 0, accuracy: 0 }
    };

    console.log('📤 Payload to be sent:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://trackify-i4hx.onrender.com/api/network-metrics', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('🚨 Error submitting metrics:', result);
    } else {
      console.log('✅ Network metrics submitted successfully:', result);
    }
  } catch (err) {
    console.error('❌ Failed to submit network metrics:', err);
  }
};



// networkApi.ts
export const getNetworkStatsFromServer = async () => {
  const token = await AsyncStorage.getItem('userToken');
  try {
    const response = await fetch('https://trackify-i4hx.onrender.com/api/network-metrics/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn("❌ Failed to fetch stats:", error);
      throw new Error(error.message || 'Failed to fetch network stats');
    }

    const stats = await response.json();
    console.log("📊 Network stats fetched:", stats);
    return stats;
  } catch (error) {
    console.error("🚨 Error in getNetworkStatsFromServer:", error);
    throw error;
  }
};
