import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';


export default function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Top Content */}
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/4277088/pexels-photo-4277088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              }}
              style={styles.logoImage}
            />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Trackify</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Experience your network smarter by sharing and viewing anonymous performance data
          </Text>

          <View style={styles.featuresContainer}>
            {[
              'Monitor your network quality in real-time',
              'Share feedback to improve service in your area',
              'View personalized network performance insights',
              'Track your usage patterns and optimize your experience',
            ].map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomSection}>
           <TouchableOpacity
  style={styles.continueButton}
  onPress={() => router.push('/(tabs)/feedback')}
>
  <Text style={styles.continueButtonText}>Continue to Trackify</Text>
</TouchableOpacity>

          <View style={styles.authButtonsWrapper}>
            <Link href="/auth/sign-in" asChild>
              <TouchableOpacity style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.primaryButtonText}>Sign In</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/auth/sign-up" asChild>
              <TouchableOpacity style={[styles.button, styles.secondaryButton, { borderColor: colors.primary }]}>
                <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Create Account</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Text style={[styles.termsText, { color: colors.textSecondary }]}>
            By continuing, you agree to our{' '}
            <Text style={[styles.termsLink, { color: colors.primary }]}>Terms of Service</Text> and{' '}
            <Text style={[styles.termsLink, { color: colors.primary }]}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 24,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  bottomSection: {
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: '#E6E6E6',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  authButtonsWrapper: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '500',
  },
});
