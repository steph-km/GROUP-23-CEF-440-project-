import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ChartPeriodSelector } from '@/components/ChartPeriodSelector';
import { MetricsChart } from '@/components/MetricsChart';
import { MetricsTable } from '@/components/MetricsTable';
import { FilterButton } from '@/components/FilterButton';

const CHART_TYPES = ['signal', 'speed', 'latency', 'reliability'];
const TIME_PERIODS = ['day', 'week', 'month', 'year'];

export default function MetricsScreen() {
  const { colors } = useTheme();
  const [activeChart, setActiveChart] = useState(CHART_TYPES[0]);
  const [activePeriod, setActivePeriod] = useState(TIME_PERIODS[1]); // default to week
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock data for the selected metric and time period
  const getChartData = () => {
    // This would fetch real data based on activeChart and activePeriod
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [65, 72, 84, 78, 56, 60, 70],
          color: () => colors.primary,
        },
      ],
    };
  };
  
  const chartData = getChartData();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader 
        title="Network Metrics" 
        rightComponent={
          <FilterButton 
            onPress={() => setShowFilters(!showFilters)}
            active={showFilters}
          />
        }
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <ChartPeriodSelector
          periods={TIME_PERIODS}
          activePeriod={activePeriod}
          onSelectPeriod={setActivePeriod}
        />
        
        <View style={styles.chartContainer}>
          <View style={styles.chartTypeSelector}>
            {CHART_TYPES.map((type) => (
              <Text
                key={type}
                style={[
                  styles.chartTypeOption,
                  { 
                    color: activeChart === type ? colors.primary : colors.textSecondary,
                    borderBottomColor: activeChart === type ? colors.primary : 'transparent',
                  }
                ]}
                onPress={() => setActiveChart(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            ))}
          </View>
          
          <MetricsChart 
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartType={activeChart}
          />
        </View>
        
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Statistics
          </Text>
          <MetricsTable 
            metricType={activeChart}
            period={activePeriod}
          />
        </View>
        
        <View style={styles.notesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notes
          </Text>
          <View style={[styles.noteCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.noteText, { color: colors.text }]}>
              Data is collected in the background while you use your device. The more you use the app, the more accurate your network metrics will be.
            </Text>
          </View>
        </View>
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  chartContainer: {
    marginVertical: 16,
    backgroundColor: 'transparent',
  },
  chartTypeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chartTypeOption: {
    marginRight: 16,
    paddingBottom: 4,
    fontSize: 16,
    fontWeight: '500',
    borderBottomWidth: 2,
  },
  statsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  notesSection: {
    marginTop: 24,
  },
  noteCard: {
    padding: 16,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});