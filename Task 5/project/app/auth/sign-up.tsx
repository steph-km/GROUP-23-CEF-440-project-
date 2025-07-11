// ✅ Final Updated Version of SignUpScreen with API, NetInfo, and Device ID

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react-native';
import NetInfo from '@react-native-community/netinfo';
import * as Device from 'expo-device';
import axios from 'axios';
import { getObject, setObject, removeItem } from '@/utils/storage';

const FORM_KEY = 'signUpFormData';
const API_BASE = 'https://trackify-i4hx.onrender.com/api';

export default function SignUpScreen() {
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [network, setNetwork] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadForm = async () => {
      const saved = await getObject(FORM_KEY);
      if (saved && typeof saved === 'object') {
        const form = saved as {
          name?: string;
          email?: string;
          password?: string;
          confirmPassword?: string;
          phoneNumber?: string;
          location?: string;
        };
        setName(form.name || '');
        setEmail(form.email || '');
        setPassword(form.password || '');
        setConfirmPassword(form.confirmPassword || '');
        setPhoneNumber(form.phoneNumber || '');
        setLocation(form.location || '');
      }
    };

    const fetchDeviceAndNetwork = async () => {
      const netState = await NetInfo.fetch();
      let carrier = 'Unknown';
      if (netState.type === 'cellular' && 'carrier' in (netState.details ?? {})) {
        carrier = (netState.details as { carrier?: string | null }).carrier || 'Unknown';
      }
      const id = Device.osBuildId || `device-${Date.now()}`;

      console.log('Network:', carrier);
      console.log('Device ID:', id);

      setNetwork(carrier);
      setDeviceId(id);
    };

    loadForm();
    fetchDeviceAndNetwork();
  }, []);

  const persistForm = (newState: Partial<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    location: string;
  }>) => {
    setObject(FORM_KEY, {
      name,
      email,
      password,
      confirmPassword,
      phoneNumber,
      location,
      ...newState,
    });
  };

  const validatePassword = (pass: string) => pass.length >= 8;
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateCameroonPhone = (phone: string) => /^(?:\+237|0)(6[579]|2[23])\d{7}$/.test(phone);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword || !phoneNumber || !location) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validateCameroonPhone(phoneNumber)) {
      setError('Enter a valid Cameroonian phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post(`${API_BASE}/auth/register`, {
        name,
        email,
        password,
        deviceId,
        preferences: {
          network,
          anonymize: false,
          dataSharing: true,
        },
      });

      console.log('User registered:', { name, email, deviceId, network });
      await removeItem(FORM_KEY);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Sign-up error:', err);
      setError('Failed to create account. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Create Account</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Join Trackify</Text>
          <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>Create an account to help improve network service in your area</Text>

          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: colors.errorBackground }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.formContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  persistForm({ name: text });
                }}
              />
            </View>

            <Text style={[styles.inputLabel, { color: colors.text, marginTop: 16 }]}>Email</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  persistForm({ email: text });
                }}
              />
            </View>

            <Text style={[styles.inputLabel, { color: colors.text, marginTop: 16 }]}>Phone Number</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="e.g. 6XX XXX XXX or +2376XX XXX XXX"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  persistForm({ phoneNumber: text });
                }}
              />
            </View>

            <Text style={[styles.inputLabel, { color: colors.text, marginTop: 16 }]}>Location</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your city or town"
                placeholderTextColor={colors.textSecondary}
                value={location}
                onChangeText={(text) => {
                  setLocation(text);
                  persistForm({ location: text });
                }}
              />
            </View>

            <Text style={[styles.inputLabel, { color: colors.text, marginTop: 16 }]}>Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Create a password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  persistForm({ password: text });
                }}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.text, marginTop: 16 }]}>Confirm Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  persistForm({ confirmPassword: text });
                }}
              />
              {password && confirmPassword && password === confirmPassword ? <Check size={20} color={colors.success} /> : null}
            </View>

            <View style={styles.passwordRequirements}>
              <View style={styles.requirementRow}>
                <View style={[styles.requirementDot, { backgroundColor: password.length >= 8 ? colors.success : colors.textSecondary }]} />
                <Text style={[styles.requirementText, { color: colors.textSecondary }]}>At least 8 characters</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, { backgroundColor: colors.primary }, isLoading && { opacity: 0.7 }]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>{isLoading ? 'Creating Account...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>By signing up, you agree to our <Text style={[styles.termsLink, { color: colors.primary }]}>Terms of Service</Text> and <Text style={[styles.termsLink, { color: colors.primary }]}>Privacy Policy</Text></Text>
          </View>

          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: colors.textSecondary }]}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/auth/sign-in')}>
              <Text style={[styles.signInLink, { color: colors.primary }]}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  placeholder: { width: 40 },
  scrollView: { flex: 1 },
  contentContainer: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitleText: { fontSize: 16, marginBottom: 32, lineHeight: 24 },
  errorContainer: { padding: 12, borderRadius: 8, marginBottom: 24 },
  errorText: { fontSize: 14, fontWeight: '500' },
  formContainer: { width: '100%', marginBottom: 24 },
  inputLabel: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: { flex: 1, fontSize: 16, height: '100%' },
  eyeIcon: { padding: 8 },
  passwordRequirements: { marginTop: 16 },
  requirementRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  requirementDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  requirementText: { fontSize: 14 },
  signUpButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  signUpButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  termsContainer: { marginBottom: 24 },
  termsText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  termsLink: { fontWeight: '500' },
  signInContainer: { flexDirection: 'row', justifyContent: 'center' },
  signInText: { fontSize: 16 },
  signInLink: { fontSize: 16, fontWeight: '500' },
});
