import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileStatsCard } from '@/components/ProfileStatsCard';
import { ChevronRight, MapPin, Phone, Mail } from 'lucide-react-native';
import { router } from 'expo-router';
import { getItem } from '@/utils/storage';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { signOut } = useAuth();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const raw = await getItem('userData');

        if (!raw) {
          Alert.alert('Authentication Error', 'User data not found. Please sign in again.');
          signOut();
          router.replace('/auth/sign-in');
          return;
        }

        const parsed: any = JSON.parse(raw);

        setUserData({
          id: parsed._id || parsed.id || 'N/A',
          name: parsed.name || 'N/A',
          email: parsed.email || 'N/A',
          phone: parsed.phone || 'N/A',
          location: parsed.location || 'N/A',
        });
      } catch (error) {
        console.error('Error reading user data from storage:', error);
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [signOut]);

  const profileStats = [
    { label: 'Feedback Provided', value: '24' },
    { label: 'Days Active', value: '73' },
    { label: 'Data Shared', value: '128MB' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader title="My Profile" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader title="My Profile" />
        <View style={styles.centered}>
          <Text style={{ color: colors.textSecondary }}>No user data available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader title="My Profile" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.profileImage}
          />

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>{userData.name}</Text>
            <Text style={[styles.profileId, { color: colors.textSecondary }]}>ID: {userData.id}</Text>
          </View>
        </View>

        <ProfileStatsCard stats={profileStats} />

        <View style={styles.contactSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>

          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoRow}>
              <Phone size={20} color={colors.textSecondary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: colors.text }]}>{userData.phone}</Text>
            </View>

            <View style={styles.infoRow}>
              <Mail size={20} color={colors.textSecondary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: colors.text }]}>{userData.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={20} color={colors.textSecondary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: colors.text }]}>{userData.location}  </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Actions</Text>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]} onPress={() => {}}>
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Edit Profile</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]} onPress={() => {}}>
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Data Sharing Preferences</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]} onPress={() => {}}>
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Notification Settings</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: colors.danger }]}
          onPress={() => {
            signOut();
            router.replace('/auth/welcome');
          }}
        >
          <Text style={[styles.signOutText, { color: colors.danger }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 16 },
  profileImage: { width: 72, height: 72, borderRadius: 36 },
  profileInfo: { marginLeft: 16 },
  profileName: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  profileId: { fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, marginTop: 24 },
  contactSection: { marginTop: 8 },
  infoCard: { borderRadius: 12, padding: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoIcon: { marginRight: 12 },
  infoText: { fontSize: 16 },
  actionsSection: { marginTop: 8 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, marginBottom: 8 },
  actionButtonText: { fontSize: 16, fontWeight: '500' },
  signOutButton: { alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, marginTop: 24, borderWidth: 1 },
  signOutText: { fontSize: 16, fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
