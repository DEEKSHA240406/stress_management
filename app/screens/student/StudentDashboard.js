import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../store/slices/authSlice';

const StudentDashboard = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  
  const [refreshing, setRefreshing] = useState(false);
  const [lastAssessment, setLastAssessment] = useState(null);
  const [totalAssessments, setTotalAssessments] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const assessmentHistory = await AsyncStorage.getItem('@assessment_history');
      if (assessmentHistory) {
        const history = JSON.parse(assessmentHistory);
        setTotalAssessments(history.length);
        if (history.length > 0) {
          setLastAssessment(history[history.length - 1]);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleStartAssessment = () => {
    navigation.navigate('Welcome');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  const handleViewResources = () => {
    navigation.navigate('Resources');
  };

  const handleProfile = () => {
    Alert.alert('Profile', `Name: ${user?.name}\nEmail: ${user?.email}\nRole: ${user?.role}`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              console.log('🔓 Starting logout process...');
              
              // Clear AsyncStorage
              await AsyncStorage.removeItem('@auth_token');
              await AsyncStorage.removeItem('@user_data');
              console.log('✅ AsyncStorage cleared');
              
              // Dispatch logout action
              dispatch(logout());
              console.log('✅ Redux logout dispatched');
              
              // Show success message
              Alert.alert('Success', 'Logged out successfully!');
              
            } catch (error) {
              console.error('❌ Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}! 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfile}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

      

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to Your Mental Wellness Hub 🌟</Text>
          <Text style={styles.welcomeText}>
            Your mental health matters. Take a moment to check in with yourself today.
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalAssessments}</Text>
            <Text style={styles.statLabel}>Assessments</Text>
            <Text style={styles.statIcon}>📊</Text>
          </View>
          {/* <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {lastAssessment ? lastAssessment.score || 'N/A' : '0'}
            </Text>
            <Text style={styles.statLabel}>Last Score</Text>
            <Text style={styles.statIcon}>⭐</Text>
          </View> */}
        </View>

        {/* Start Assessment Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartAssessment}
        >
          <View style={styles.startButtonContent}>
            <View>
              <Text style={styles.startButtonTitle}>Start New Assessment</Text>
              <Text style={styles.startButtonSubtitle}>
                Take 5-10 minutes to check your mental health
              </Text>
            </View>
            <Text style={styles.startButtonIcon}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={handleViewHistory}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📈</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Assessment History</Text>
              <Text style={styles.actionDescription}>
                View your past assessments and track progress
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleViewResources}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📚</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Wellness Resources</Text>
              <Text style={styles.actionDescription}>
                Access helpful mental health resources
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Tip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Tip 💡</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              "Remember to take breaks and practice self-care. Your mental health is just as important as your physical health."
            </Text>
          </View>
        </View>

        {/* Emergency Card */}
        {/* <View style={styles.emergencyCard}>
          <Text style={styles.emergencyIcon}>🆘</Text>
          <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
          <Text style={styles.emergencyText}>
            If you're in crisis or need urgent support, please reach out to a professional.
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View> */}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    fontSize: 24,
  },
  mockBadge: {
    backgroundColor: '#DBEAFE',
    marginHorizontal: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  mockBadgeText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  welcomeCard: {
    backgroundColor: '#EEF2FF',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6366F1',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  startButton: {
    backgroundColor: '#6366F1',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startButtonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  startButtonSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  startButtonIcon: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  actionArrow: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  tipCard: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  emergencyCard: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FEE2E2',
    marginBottom: 24,
  },
  emergencyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default StudentDashboard;