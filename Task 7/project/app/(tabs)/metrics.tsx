import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ChartPeriodSelector } from '@/components/ChartPeriodSelector';
import { MetricsChart } from '@/components/MetricsChart';
import { MetricsTable } from '@/components/MetricsTable';
import { FilterButton } from '@/components/FilterButton';
import { useRouter } from 'expo-router';
import { generateChartData } from '@/utils/metricsChartUtils';
import { getCurrentNetworkInfo } from '@/utils/networkUtils';

const CHART_TYPES = ['signal', 'speed', 'latency', 'reliability'] as const;
const TIME_PERIODS = ['day', 'week', 'month', 'year'] as const;
const LOCATIONS = [
  'Molyko',
  'Mile 16',
  'Check Point',
  'Bonduma',
  'Sandpit',
  'South',
  'Bokwai',
  'Tarred Malingo',
  'Untarred Malingo',
];

export default function MetricsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [activeChart, setActiveChart] = useState<typeof CHART_TYPES[number]>('signal');
  const [activePeriod, setActivePeriod] = useState<typeof TIME_PERIODS[number]>('week');
  const [showFilters, setShowFilters] = useState(false);
  const [dailyNetworkStats, setDailyNetworkStats] = useState<any[]>([]);

  const getChartData = (location: string) => {
    const allData = dailyNetworkStats.filter(
      (entry) => entry.locationName === location
    );

    const rawChartData = generateChartData(allData, activeChart, activePeriod);

    const raw = rawChartData?.datasets?.[0]?.data || [];

    console.log(`📊 Raw data for ${location}:`, raw);

    if (!raw || raw.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }],
      };
    }

    const cleaned = raw.map((val: number) =>
      typeof val === 'number' && isFinite(val) && !isNaN(val) ? val : 0
    );

    return {
      labels: rawChartData.labels || Array(cleaned.length).fill(''),
      datasets: [{ data: cleaned }],
    };
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getCurrentNetworkInfo();
        if (response?.dailySummary) {
          console.log('📊 Raw daily summary data lamani:', response.dailySummary);
          const withLocationName = response.dailySummary.map((entry: any) => ({
            ...entry,
            locationName: 'Molyko', // ⚠️ placeholder
          }));
          console.log('✅ Fetched daily summary:', withLocationName);
          setDailyNetworkStats(withLocationName);
        }
      } catch (error) {
        console.error('Error fetching metrics data:', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userStatus = await AsyncStorage.getItem('userData');
        if (userStatus === null) {
          setIsSignedIn(false);
          return;
        }
        setIsSignedIn(true);
      } catch (error) {
        console.error('Error reading sign-in state:', error);
        setIsSignedIn(false);
      }
    };

    checkAuth();
  }, []);

  if (isSignedIn === null) {
    return (
      <SafeAreaView
        style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title="Network Metrics"
        rightComponent={
          <FilterButton onPress={() => setShowFilters(!showFilters)} active={showFilters} />
        }
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <ChartPeriodSelector
          periods={[...TIME_PERIODS]}
          activePeriod={activePeriod}
          onSelectPeriod={(period: string) =>
            setActivePeriod(period as typeof TIME_PERIODS[number])
          }
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
                  },
                ]}
                onPress={() => setActiveChart(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            ))}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.locationChartsWrapper}
          >
            {LOCATIONS.map((location, index) => {
              const chartData = getChartData(location);
              const locked = !isSignedIn && index > 0;

              return (
                <View key={location} style={styles.locationChartCard}>
                  <Text style={[styles.locationTitle, { color: colors.text }]}>
                    {location}
                  </Text>

                  {!locked ? (
                    <MetricsChart
                      data={chartData}
                      width={Dimensions.get('window').width - 64}
                      height={220}
                      chartType={activeChart}
                    />
                  ) : (
                    <View
                      style={[
                        styles.lockOverlay,
                        {
                          position: 'relative',
                          backgroundColor: 'transparent',
                          height: 220,
                        },
                      ]}
                    >
                      <Text style={styles.lockText}>Sign up to view more locations</Text>
                      <Pressable
                        style={styles.signupButton}
                        onPress={() => router.push('/auth/welcome')}
                      >
                        <Text style={styles.signupText}>Sign Up</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Statistics</Text>
          <MetricsTable metricType={activeChart} period={activePeriod} />
        </View>

        <View style={styles.notesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
          <View style={[styles.noteCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.noteText, { color: colors.text }]}>
              Data is collected in the background while you use your device. The more
              you use the app, the more accurate your network metrics will be.
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
  locationChartsWrapper: {
    paddingHorizontal: 4,
  },
  locationChartCard: {
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
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
  lockOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  lockText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  signupText: {
    color: '#fff',
    fontWeight: '600',
  },
});
