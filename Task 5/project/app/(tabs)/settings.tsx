import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Info, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [backgroundEnabled, setBackgroundEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader title="Settings" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Network Monitoring
        </Text>
        
        <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Background Tracking
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Monitor network quality when app is in background
              </Text>
            </View>
            <Switch
              value={backgroundEnabled}
              onValueChange={setBackgroundEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Location Services
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Use location to map network quality
              </Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.batterySection}>
            <Info size={16} color={colors.info} style={styles.infoIcon} />
            <Text style={[styles.batteryInfo, { color: colors.textSecondary }]}>
              Battery impact: {backgroundEnabled ? 'Medium' : 'Low'}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Data & Privacy
        </Text>
        
        <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Data Collection
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Share anonymous network statistics
              </Text>
            </View>
            <Switch
              value={trackingEnabled}
              onValueChange={setTrackingEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => {/* Navigate to data management */}}
          >
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Manage My Data
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Download or delete your collected data
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Preferences
        </Text>
        
        <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Notifications
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Receive alerts and feedback requests
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Dark Theme
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Use dark colors for the interface
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        <View style={styles.aboutSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          
          <TouchableOpacity 
            style={[styles.aboutButton, { backgroundColor: colors.card }]}
            onPress={() => {router.navigate('/About/helpCenter')}} 
          >
            <Text style={[styles.aboutButtonText, { color: colors.text }]}>
              Help Center
            </Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.aboutButton, { backgroundColor: colors.card }]}
            onPress={() => {router.navigate('/About/privacyPolicy')}}
          >
            <Text style={[styles.aboutButtonText, { color: colors.text }]}>
              Privacy Policy
            </Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.aboutButton, { backgroundColor: colors.card }]}
            onPress={() => {router.navigate('/About/termsOfService')}}
          >
            <Text style={[styles.aboutButtonText, { color: colors.text }]}>
              Terms of Service
            </Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 24,
  },
  settingsCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  settingLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  batterySection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIcon: {
    marginRight: 8,
  },
  batteryInfo: {
    fontSize: 14,
  },
  aboutSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  aboutButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },
});