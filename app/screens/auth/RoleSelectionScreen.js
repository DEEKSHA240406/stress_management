import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { USER_ROLES } from '../../../constants';

const { width } = Dimensions.get('window');

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [scaleStudent] = useState(new Animated.Value(1));
  const [scaleAdmin] = useState(new Animated.Value(1));

  // Animation on press
  const handlePressIn = (role) => {
    const scale = role === USER_ROLES.STUDENT ? scaleStudent : scaleAdmin;
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (role) => {
    const scale = role === USER_ROLES.STUDENT ? scaleStudent : scaleAdmin;
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    
    // Navigate to register with pre-selected role after a short delay
    setTimeout(() => {
      navigation.navigate('Register', { selectedRole: role });
    }, 200);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome! 👋</Text>
        <Text style={styles.title}>Who are you?</Text>
        <Text style={styles.subtitle}>
          Choose your role to get started on your mental wellness journey
        </Text>
      </View>

      {/* Role Cards */}
      <View style={styles.rolesContainer}>
        {/* Student Card */}
        <Animated.View
          style={[
            styles.roleCardWrapper,
            { transform: [{ scale: scaleStudent }] },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.roleCard,
              styles.studentCard,
              selectedRole === USER_ROLES.STUDENT && styles.roleCardSelected,
            ]}
            onPress={() => handleRoleSelect(USER_ROLES.STUDENT)}
            onPressIn={() => handlePressIn(USER_ROLES.STUDENT)}
            onPressOut={() => handlePressOut(USER_ROLES.STUDENT)}
            activeOpacity={0.9}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.roleIcon}>🎓</Text>
            </View>
            
            <Text style={styles.roleTitle}>Student</Text>
            <Text style={styles.roleDescription}>
              Take assessments, track your mental health, and access resources
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Mental health assessments</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Progress tracking</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Wellness resources</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Continue as Student</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Admin Card */}
        <Animated.View
          style={[
            styles.roleCardWrapper,
            { transform: [{ scale: scaleAdmin }] },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.roleCard,
              styles.adminCard,
              selectedRole === USER_ROLES.ADMIN && styles.roleCardSelected,
            ]}
            onPress={() => handleRoleSelect(USER_ROLES.ADMIN)}
            onPressIn={() => handlePressIn(USER_ROLES.ADMIN)}
            onPressOut={() => handlePressOut(USER_ROLES.ADMIN)}
            activeOpacity={0.9}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.roleIcon}>👨‍💼</Text>
            </View>
            
            <Text style={styles.roleTitle}>Admin</Text>
            <Text style={styles.roleDescription}>
              Monitor student wellness, view analytics, and generate reports
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Student analytics</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Data visualization</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Report generation</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Continue as Admin</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  rolesContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  roleCardWrapper: {
    width: '100%',
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  studentCard: {
    borderColor: '#6366F1',
  },
  adminCard: {
    borderColor: '#EC4899',
  },
  roleCardSelected: {
    borderWidth: 4,
    shadowOpacity: 0.2,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  roleIcon: {
    fontSize: 48,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 8,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 8,
  },
  arrow: {
    fontSize: 18,
    color: '#1F2937',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  footerLink: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default RoleSelectionScreen