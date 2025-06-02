import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface MetricsTableProps {
  metricType: string;
  period: string;
}

export function MetricsTable({ metricType, period }: MetricsTableProps) {
  const { colors } = useTheme();
  
  // Mock data to display based on metric type and period
  const getStatsData = () => {
    // This would be replaced with real data in a production app
    switch (metricType) {
      case 'signal':
        return {
          average: '-78 dBm',
          peak: '-65 dBm',
          low: '-102 dBm',
          stability: '86%',
        };
      case 'speed':
        return {
          average: '42.5 Mbps',
          peak: '87.2 Mbps',
          low: '12.8 Mbps',
          stability: '92%',
        };
      case 'latency':
        return {
          average: '38 ms',
          peak: '12 ms',
          low: '97 ms',
          stability: '89%',
        };
      case 'reliability':
        return {
          average: '94%',
          peak: '99%',
          low: '78%',
          stability: '95%',
        };
      default:
        return {
          average: 'N/A',
          peak: 'N/A',
          low: 'N/A',
          stability: 'N/A',
        };
    }
  };
  
  const stats = getStatsData();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Average
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {stats.average}
        </Text>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Peak
        </Text>
        <Text style={[styles.value, { color: colors.success }]}>
          {stats.peak}
        </Text>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Lowest
        </Text>
        <Text style={[styles.value, { color: colors.error }]}>
          {stats.low}
        </Text>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Stability
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {stats.stability}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    fontSize: 15,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});