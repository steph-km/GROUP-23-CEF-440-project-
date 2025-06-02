import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function WelcomeScreen() {
  const { colors } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4277088/pexels-photo-4277088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
            style={styles.logoImage}
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            NetQuality
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Help improve your mobile network experience by sharing anonymous performance data
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              Monitor your network quality in real-time
            </Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              Share feedback to improve service in your area
            </Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              View personalized network performance insights
            </Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              Track your usage patterns and optimize your experience
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
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
        
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          By continuing, you agree to our{' '}
          <Text style={[styles.termsLink, { color: colors.primary }]}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={[styles.termsLink, { color: colors.primary }]}>
            Privacy Policy
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 32,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
    marginTop: 24,
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '500',
  },
});