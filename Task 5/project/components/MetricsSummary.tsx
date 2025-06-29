import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LineChart } from '@/components/LineChart';
import { getNetworkStatsFromServer } from '@/utils/networkUtils';
import { useEffect, useState } from 'react';

interface MetricsSummaryProps {
  data: any[];
}

export function MetricsSummary({ data }: MetricsSummaryProps) {
  const { colors } = useTheme();

  const [fetchedNetworkStats, setFetchedNetworkStats] = useState<any>({});

  useEffect(() => {
    fetchingStats();
  }, []);

  const fetchingStats = async () => {
    try {
      const fetched = await getNetworkStatsFromServer();
      setFetchedNetworkStats(fetched.data);
    } catch (error) {
      console.error('Failed to fetch network stats:', error);
    }
  };

  const formatNumber = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) return '--';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(2) + 'K';
    return value.toFixed(2);
  };

  // Mock data for the chart
  const mockData = {
    labels: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM'],
    datasets: [
      {
        data: [25, 45, 28, 80, 99, 43],
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.chartContainer}>
        <LineChart
          data={mockData}
          width={300}
          height={160}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: 'transparent',
            backgroundGradientTo: 'transparent',
            decimalPlaces: 0,
            color: () => colors.primary,
            labelColor: () => colors.textSecondary,
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: colors.primary,
            },
            propsForLabels: {
              fontSize: 10,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {formatNumber(fetchedNetworkStats.avgDownloadSpeed)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Avg. Download
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {formatNumber(fetchedNetworkStats.avgUploadSpeed)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Avg. Upload
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {formatNumber(fetchedNetworkStats.avgLatency)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Avg. Latency
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  chartContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
});
