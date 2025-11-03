// app/screens/auth/RoleSelectionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const RoleSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Take assessments and track your mental health journey',
      icon: 'school',
      gradient: ['#6C63FF', '#5A52D5'],
      iconBg: '#F0EFFF',
      iconColor: '#6C63FF',
    },
    {
      id: 'mentor',
      title: 'Mentor',
      description: 'Guide and support up to 20 students on their wellness path',
      icon: 'account-heart',
      gradient: ['#FF6B9D', '#E8578E'],
      iconBg: '#FFF0F5',
      iconColor: '#FF6B9D',
    },
    {
      id: 'counselor',
      title: 'Counselor',
      description: 'Provide professional support to students in need',
      icon: 'hand-heart',
      gradient: ['#4ECDC4', '#44B8B0'],
      iconBg: '#E8FFFE',
      iconColor: '#4ECDC4',
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage system, view analytics, and oversee all operations',
      icon: 'shield-account',
      gradient: ['#FFA726', '#FB8C00'],
      iconBg: '#FFF8E1',
      iconColor: '#FFA726',
    },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    setTimeout(() => {
      navigation.navigate('Login', { role: roleId });
    }, 300);
  };

  const RoleCard = ({ role }) => {
    const isSelected = selectedRole === role.id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleRoleSelect(role.id)}
        style={styles.roleCardWrapper}
      >
        <Animated.View
          style={[
            styles.roleCard,
            isSelected && {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={role.gradient}
            style={styles.roleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Icon Container */}
            <View style={[styles.iconContainer, { backgroundColor: role.iconBg }]}>
              <Icon name={role.icon} size={40} color={role.iconColor} />
            </View>

            {/* Role Info */}
            <View style={styles.roleInfo}>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </View>

            {/* Arrow Icon */}
            <View style={styles.arrowContainer}>
              <Icon name="chevron-right" size={24} color="#FFF" />
            </View>

            {/* Selection Indicator */}
            {isSelected && (
              <View style={styles.selectedIndicator}>
                <Icon name="check-circle" size={24} color="#FFF" />
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#6C63FF', '#5A52D5']}
              style={styles.logoGradient}
            >
              <Icon name="brain" size={40} color="#FFF" />
            </LinearGradient>
          </View>
          
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select how you'd like to use the Mental Health & Stress Management platform
          </Text>
        </View>

        {/* Roles List */}
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <View style={styles.infoBox}>
            <Icon name="information-outline" size={20} color="#6C63FF" />
            <Text style={styles.infoText}>
              Your role determines your access level and features available to you
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  rolesContainer: {
    flex: 1,
    paddingTop: 10,
  },
  roleCardWrapper: {
    marginBottom: 16,
  },
  roleCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  roleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    minHeight: 100,
    position: 'relative',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
    paddingRight: 10,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 6,
  },
  roleDescription: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.9,
    lineHeight: 18,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 2,
  },
  footer: {
    paddingVertical: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#5D6D7E',
    marginLeft: 12,
    lineHeight: 18,
  },
});

export default RoleSelectionScreen;