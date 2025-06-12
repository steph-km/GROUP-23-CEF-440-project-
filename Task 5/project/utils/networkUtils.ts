// networkUtils.ts
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'network_stats_cache';
const SAMPLE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const TEST_FILE_URL = 'https://speed.hetzner.de/100MB.bin';

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
  const netInfo = await NetInfo.fetch();
  const signalStrength = Platform.OS === 'android' ? -65 : null; // Mock for now

  const location = await getCurrentLocation();
  const downloadSpeed = await measureDownloadSpeed();
  const uploadSpeed = await estimateUploadSpeed();
  const latency = await measureLatency();

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

  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data: updated, timestamp }));
  return updated;
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
    const res = await fetch(TEST_FILE_URL, { method: 'GET', headers: { Range: 'bytes=0-1000000' } });
    if (!res.ok) throw new Error('Failed to fetch');
    await res.blob();
    const endTime = Date.now();
    const sizeMB = 1 / 1024; // ~1 MB in MB (approx)
    const durationSec = (endTime - startTime) / 1000;
    return Number((sizeMB / durationSec).toFixed(2));
  } catch {
    return 0;
  }
};

const estimateUploadSpeed = async (): Promise<number> => {
  try {
    const start = Date.now();
    const blob = new Blob(['x'.repeat(1000000)]); // ~1MB
    await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: blob,
    });
    const end = Date.now();
    const sizeMB = 1 / 1024;
    const timeSec = (end - start) / 1000;
    return Number((sizeMB / timeSec).toFixed(2));
  } catch {
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

