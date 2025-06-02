import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { NetworkStatus } from '@/components/NetworkStatus';
import { DashboardHeader } from '@/components/DashboardHeader';
import { StatusCard } from '@/components/StatusCard';
import { MetricsSummary } from '@/components/MetricsSummary';
import { FeedbackPrompt } from '@/components/FeedbackPrompt';
import { getNetworkStats } from '@/utils/networkUtils';

type NetworkStats = {
  signalStrength: string;
  signalStatus: "excellent" | "good" | "fair" | "poor" | "unknown";
  downloadSpeed: string;
  downloadStatus: "excellent" | "good" | "fair" | "poor" | "unknown";
  uploadSpeed: string;
  uploadStatus: "excellent" | "good" | "fair" | "poor" | "unknown";
  latency: number;
  latencyStatus: "excellent" | "good" | "fair" | "poor" | "unknown";
  dailySummary: any[]; // Replace 'any' with a more specific type if available
};

export default function Dashboard() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    try {
      const stats = await getNetworkStats();
      setNetworkStats(stats);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Failed to load network data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNetworkData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <DashboardHeader lastRefreshed={lastRefreshed} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        <NetworkStatus />
        
        <View style={styles.cardsContainer}>
          <StatusCard 
            title="Signal Strength"
            value={networkStats?.signalStrength || 'N/A'}
            icon="signal"
            status={networkStats?.signalStatus || 'unknown'}
          />
          <StatusCard 
            title="Download Speed"
            value={networkStats?.downloadSpeed || 'N/A'}
            unit="Mbps"
            icon="download"
            status={networkStats?.downloadStatus || 'unknown'}
          />
        </View>
        
        <View style={styles.cardsContainer}>
          <StatusCard 
            title="Upload Speed"
            value={networkStats?.uploadSpeed || 'N/A'}
            unit="Mbps"
            icon="upload"
            status={networkStats?.uploadStatus || 'unknown'}
          />
          <StatusCard 
            title="Latency"
            value={networkStats?.latency || 'N/A'}
            unit="ms"
            icon="clock"
            status={networkStats?.latencyStatus || 'unknown'}
            lowerIsBetter
          />
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Overview</Text>
        <MetricsSummary data={networkStats?.dailySummary || []} />
        
        <FeedbackPrompt />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 16,
  },
});