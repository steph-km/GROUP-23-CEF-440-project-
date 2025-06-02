import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Stat {
  label: string;
  value: string;
}

interface ProfileStatsCardProps {
  stats: Stat[];
}

export function ProfileStatsCard({ stats }: ProfileStatsCardProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {stats.map((stat, index) => (
        <View 
          key={stat.label} 
          style={[
            styles.statItem, 
            index < stats.length - 1 && { 
              borderRightWidth: 1, 
              borderRightColor: colors.border 
            }
          ]}
        >
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {stat.value}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});