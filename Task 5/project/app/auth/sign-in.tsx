import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function SignInScreen() {
  const { colors } = useTheme();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation();
  
  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Sign In
          </Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/4277088/pexels-photo-4277088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={styles.logoImage}
            />
            <Text style={[styles.logoText, { color: colors.text }]}>
              Trackify
            </Text>
          </View>
          
          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: colors.errorBackground }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            </View>
          ) : null}
          
          <View style={styles.formContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Email
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            
            <Text style={[styles.inputLabel, { color: colors.text, marginTop: 16 }]}>
              Password
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.signInButton,
              { backgroundColor: colors.primary },
              isLoading && { opacity: 0.7 }
            ]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.signInButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.signUpContainer}>
            <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
              Don't have an account?
            </Text>
            <Link href="/auth/sign-up" asChild>
              <TouchableOpacity>
                <Text style={[styles.signUpLink, { color: colors.primary }]}>
                  {' Sign Up'}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomContainer: {
    padding: 24,
  },
  signInButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 16,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '500',
  },
});