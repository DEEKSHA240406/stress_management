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
    navigation.navigate('Profile');
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
            await AsyncStorage.removeItem('@auth_token');
            await AsyncStorage.removeItem('@user_data');
            dispatch(logout());
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
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}! 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfile}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to Your Mental Wellness Hub 🌟</Text>
          <Text style={styles.welcomeText}>
            Your mental health matters. Take a moment to check in with yourself today.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalAssessments}</Text>
            <Text style={styles.statLabel}>Assessments</Text>
            <Text style={styles.statIcon}>📊</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {lastAssessment ? lastAssessment.score || 'N/A' : '0'}
            </Text>
            <Text style={styles.statLabel}>Last Score</Text>
            <Text style={styles.statIcon}>⭐</Text>
          </View>
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Tip 💡</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              "Remember to take breaks and practice self-care. Your mental health is just as important as your physical health."
            </Text>
          </View>
        </View>

        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyIcon}>🆘</Text>
          <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
          <Text style={styles.emergencyText}>
            If you're in crisis or need urgent support, please reach out to a professional.
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
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
  },
  profileIcon: {
    fontSize: 24,
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default StudentDashboard;
