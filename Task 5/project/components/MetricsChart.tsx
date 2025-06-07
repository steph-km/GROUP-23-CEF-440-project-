import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LineChart } from '@/components/LineChart';

interface MetricsChartProps {
  data: any;
  width: number;
  height: number;
  chartType: string;
}

export function MetricsChart({ data, width, height, chartType }: MetricsChartProps) {
  const { colors } = useTheme();
  
  const getChartConfig = () => {
    let primaryColor = colors.primary;
    
    // Adjust color based on chart type
    switch (chartType) {
      case 'signal':
        primaryColor = colors.success;
        break;
      case 'speed':
        primaryColor = colors.primary;
        break;
      case 'latency':
        primaryColor = colors.warning;
        break;
      case 'reliability':
        primaryColor = colors.secondary;
        break;
      default:
        primaryColor = colors.primary;
    }
    
    return {
      backgroundColor: 'transparent',
      backgroundGradientFrom: 'transparent',
      backgroundGradientTo: 'transparent',
      decimalPlaces: chartType === 'latency' ? 0 : 1,
      color: () => primaryColor,
      labelColor: () => colors.textSecondary,
      propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: primaryColor
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
        chartConfig={getChartConfig()}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withHorizontalLabels={true}
        withVerticalLabels={true}
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