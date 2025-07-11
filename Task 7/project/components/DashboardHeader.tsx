import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/ThemeContext';
import { Bell } from 'lucide-react-native';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { router } from 'expo-router';

interface DashboardHeaderProps {
  lastRefreshed: Date;
}

export function DashboardHeader({ lastRefreshed }: DashboardHeaderProps) {
  const { colors } = useTheme();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUserName(parsed?.name || 'User');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Hello, {userName}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Trackify Dashboard
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.notificationButton, { backgroundColor: colors.card }]}
          onPress={() => router.navigate('/About/notifications')}
        >
          <Bell size={20} color={colors.text} />
          <View style={[styles.notificationBadge, { backgroundColor: colors.primary }]} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
        Last updated {formatDistanceToNow(lastRefreshed)} ago
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lastUpdated: {
    fontSize: 12,
    marginTop: 8,
  },
});
