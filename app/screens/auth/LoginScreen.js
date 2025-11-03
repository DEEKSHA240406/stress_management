import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../../services/mockAuthService';  // Using mock service
import { setUser } from '../../store/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const validateForm = () => {
    let newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log('🔐 Attempting mock login for:', email);

    try {
      const response = await loginUser(email, password);
      
      console.log('📥 Login response:', {
        success: response.success,
        hasToken: !!response.token,
        hasUser: !!response.user,
        message: response.message
      });

      if (response.success) {
        // Store authentication data
        await AsyncStorage.setItem('@auth_token', response.token);
        await AsyncStorage.setItem('@user_data', JSON.stringify(response.user));

        // Update Redux store
        dispatch(setUser(response.user));

        console.log('✅ Login successful, user stored');

        // Show success message
        // Alert.alert(
        //   'Welcome Back! 👋',
        //   `Hello ${response.user.name}!`,
        //   [
        //     {
        //       text: 'Continue',
        //       onPress: () => {
        //         // Navigate based on role
        //         switch (response.user.role) {
        //           case 'admin':
        //             navigation.replace('AdminDashboard');
        //             break;
        //           case 'mentor':
        //             navigation.replace('MentorDashboard');
        //             break;
        //           case 'counselor':
        //             navigation.replace('CounselorDashboard');
        //             break;
        //           case 'student':
        //           default:
        //             navigation.replace('StudentDashboard');
        //             break;
        //         }
        //       }
        //     }
        //   ]
        // );
      } else {
        // Handle login failure
        console.error('❌ Login failed:', response.message);
        
        Alert.alert('Login Failed', response.message, [
          { text: 'Try Again', style: 'default' }
        ]);
      }
    } catch (error) {
      console.error('💥 Unexpected login error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick fill for testing - NOW WITH ALL 4 ROLES
  const fillTestCredentials = (userType) => {
    switch (userType) {
      case 'student':
        setEmail('student@test.com');
        setPassword('password123');
        break;
      case 'mentor':
        setEmail('mentor@test.com');
        setPassword('mentor123');
        break;
      case 'counselor':
        setEmail('counselor@test.com');
        setPassword('counselor123');
        break;
      case 'admin':
        setEmail('admin@test.com');
        setPassword('admin123');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back! 👋</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your mental wellness journey
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: '' });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    errors.password && styles.inputError
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors({ ...errors, password: '' });
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Text style={styles.eyeIconText}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text style={styles.loadingText}>Signing in...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Test Credentials - ALL 4 ROLES */}
            <View style={styles.testCredentialsBox}>
              <Text style={styles.testTitle}>🧪 Quick Test Login:</Text>
              
              {/* First Row: Student & Mentor */}
              <View style={styles.testButtonsRow}>
                <TouchableOpacity
                  style={[styles.testButton, styles.studentButton]}
                  onPress={() => fillTestCredentials('student')}
                  disabled={loading}
                >
                  <Text style={styles.testButtonIcon}>👨‍🎓</Text>
                  <Text style={styles.testButtonText}>Student</Text>
                  <Text style={styles.testButtonSubtext}>password123</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.testButton, styles.mentorButton]}
                  onPress={() => fillTestCredentials('mentor')}
                  disabled={loading}
                >
                  <Text style={styles.testButtonIcon}>👨‍🏫</Text>
                  <Text style={styles.testButtonText}>Mentor</Text>
                  <Text style={styles.testButtonSubtext}>mentor123</Text>
                </TouchableOpacity>
              </View>

              {/* Second Row: Counselor & Admin */}
              <View style={styles.testButtonsRow}>
                <TouchableOpacity
                  style={[styles.testButton, styles.counselorButton]}
                  onPress={() => fillTestCredentials('counselor')}
                  disabled={loading}
                >
                  <Text style={styles.testButtonIcon}>👨‍⚕️</Text>
                  <Text style={styles.testButtonText}>Counselor</Text>
                  <Text style={styles.testButtonSubtext}>counselor123</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.testButton, styles.adminButton]}
                  onPress={() => fillTestCredentials('admin')}
                  disabled={loading}
                >
                  <Text style={styles.testButtonIcon}>👨‍💼</Text>
                  <Text style={styles.testButtonText}>Admin</Text>
                  <Text style={styles.testButtonSubtext}>admin123</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.testHint}>
                Tap any button to auto-fill test credentials
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
              >
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Extra spacing for keyboard */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  eyeIconText: {
    fontSize: 20,
  },
  loginButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#A5B4FC',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  testCredentialsBox: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  testTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
    marginBottom: 12,
    textAlign: 'center',
  },
  testButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  testButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentButton: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  mentorButton: {
    borderColor: '#FF6B9D',
    backgroundColor: '#FFF0F5',
  },
  counselorButton: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8FFFE',
  },
  adminButton: {
    borderColor: '#FFA726',
    backgroundColor: '#FFF8E1',
  },
  testButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  testButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  testButtonSubtext: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '500',
  },
  testHint: {
    fontSize: 11,
    color: '#16A34A',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  registerLink: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default LoginScreen;