import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LineChart } from 'react-native-chart-kit';

interface MetricsChartProps {
  data: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  width: number;
  height: number;
  chartType: string;
}

export function MetricsChart({ data, width, height, chartType }: MetricsChartProps) {
  const { colors } = useTheme();

  const getPrimaryColor = () => {
    switch (chartType) {
      case 'signal':
        return colors.success;
      case 'speed':
        return colors.primary;
      case 'latency':
        return colors.warning;
      case 'reliability':
        return colors.secondary;
      default:
        return colors.primary;
    }
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: chartType === 'latency' ? 0 : 1,
    color: (opacity = 1) => getPrimaryColor(),
    labelColor: (opacity = 1) => colors.textSecondary,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: getPrimaryColor(),
    },
    propsForLabels: {
      fontSize: 12,
    },
    propsForBackgroundLines: {
      stroke: colors.border,
      strokeDasharray: '5, 5',
      strokeWidth: 1,
    },
  };

  const getChartMetric = () => {
    switch (chartType) {
      case 'signal':
        return 'Signal Strength (dBm)';
      case 'speed':
        return 'Speed (Mbps)';
      case 'latency':
        return 'Latency (ms)';
      case 'reliability':
        return 'Reliability (%)';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
        {getChartMetric()}
      </Text>

      <LineChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines
        withOuterLines={false}
        withHorizontalLabels
        withVerticalLabels
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
