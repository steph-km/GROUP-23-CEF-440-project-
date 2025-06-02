import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ChartPeriodSelectorProps {
  periods: string[];
  activePeriod: string;
  onSelectPeriod: (period: string) => void;
}

export function ChartPeriodSelector({ 
  periods, 
  activePeriod, 
  onSelectPeriod 
}: ChartPeriodSelectorProps) {
  const { colors } = useTheme();
  
  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'day':
        return 'Day';
      case 'week':
        return 'Week';
      case 'month':
        return 'Month';
      case 'year':
        return 'Year';
      default:
        return period.charAt(0).toUpperCase() + period.slice(1);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            activePeriod === period && { 
              backgroundColor: colors.primary,
            }
          ]}
          onPress={() => onSelectPeriod(period)}
        >
          <Text
            style={[
              styles.periodText,
              { color: activePeriod === period ? colors.white : colors.text }
            ]}
          >
            {getPeriodLabel(period)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
});