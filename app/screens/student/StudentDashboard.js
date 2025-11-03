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
  Modal,
  TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../store/slices/authSlice';
import {
  QUESTION_CATEGORIES,
  GENDER_TYPES,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_NAMES,
  detectAgeGroup,
  getAllCategoriesInfo,
} from '../../../constants/questionCategories';

const StudentDashboard = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  
  const [refreshing, setRefreshing] = useState(false);
  const [lastAssessment, setLastAssessment] = useState(null);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileForm, setProfileForm] = useState({
    age: '',
    gender: GENDER_TYPES.PREFER_NOT_TO_SAY,
  });
  const [categoryStats, setCategoryStats] = useState({});

  useEffect(() => {
    loadDashboardData();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem('@user_profile');
      if (profile) {
        setUserProfile(JSON.parse(profile));
      } else {
        // Show profile setup modal if no profile exists
        setShowProfileSetup(true);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const saveUserProfile = async () => {
    if (!profileForm.age || parseInt(profileForm.age) < 1 || parseInt(profileForm.age) > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 1 and 120');
      return;
    }

    try {
      const profile = {
        age: parseInt(profileForm.age),
        gender: profileForm.gender,
        ageGroup: detectAgeGroup(parseInt(profileForm.age)),
        updatedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('@user_profile', JSON.stringify(profile));
      setUserProfile(profile);
      setShowProfileSetup(false);
      Alert.alert('Profile Saved', 'Your profile has been set up successfully! 🎉');
    } catch (error) {
      console.error('Error saving user profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const loadDashboardData = async () => {
    try {
      const assessmentHistory = await AsyncStorage.getItem('@assessment_history');
      if (assessmentHistory) {
        const history = JSON.parse(assessmentHistory);
        setTotalAssessments(history.length);
        if (history.length > 0) {
          setLastAssessment(history[history.length - 1]);
          calculateCategoryStats(history);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const calculateCategoryStats = (history) => {
    const stats = {};
    
    // Initialize stats for each category
    Object.values(QUESTION_CATEGORIES).forEach(category => {
      stats[category] = {
        total: 0,
        completed: 0,
        lastDate: null,
      };
    });

    // Calculate from history
    history.forEach(assessment => {
      if (assessment.answers) {
        assessment.answers.forEach(answer => {
          if (answer.category && stats[answer.category]) {
            stats[answer.category].completed++;
            stats[answer.category].lastDate = assessment.date;
          }
        });
      }
    });

    setCategoryStats(stats);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    await loadUserProfile();
    setRefreshing(false);
  };

  const handleStartAssessment = () => {
    if (!userProfile) {
      Alert.alert(
        'Profile Setup Required',
        'Please set up your profile first to get personalized questions.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Set Up Profile', onPress: () => setShowProfileSetup(true) },
        ]
      );
      return;
    }

    navigation.navigate('WelcomeScreen', { userProfile });
  };

  const handleViewHistory = () => {
    navigation.navigate('HistoryScreen');
  };

  const handleViewResources = () => {
    navigation.navigate('ResourcesScreen');
  };

  const handleProfile = () => {
    navigation.navigate('ProfileScreen', { userProfile });
  };

  const handleEditProfile = () => {
    if (userProfile) {
      setProfileForm({
        age: userProfile.age.toString(),
        gender: userProfile.gender,
      });
    }
    setShowProfileSetup(true);
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
              
              await AsyncStorage.removeItem('@auth_token');
              await AsyncStorage.removeItem('@user_data');
              console.log('✅ AsyncStorage cleared');
              
              dispatch(logout());
              console.log('✅ Redux logout dispatched');
              
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

  const getGenderEmoji = (gender) => {
    switch (gender) {
      case GENDER_TYPES.MALE:
        return '👨';
      case GENDER_TYPES.FEMALE:
        return '👩';
      case GENDER_TYPES.NON_BINARY:
        return '🧑';
      default:
        return '👤';
    }
  };

  const getAgeGroupLabel = (ageGroup) => {
    const labels = {
      child: 'Child',
      teen: 'Teenager',
      young_adult: 'Young Adult',
      adult: 'Adult',
      middle_age: 'Middle Age',
      senior: 'Senior',
    };
    return labels[ageGroup] || 'Unknown';
  };

  const renderProfileSetupModal = () => (
    <Modal
      visible={showProfileSetup}
      animationType="slide"
      transparent={true}
      onRequestClose={() => !userProfile && setShowProfileSetup(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {userProfile ? 'Update Your Profile' : 'Set Up Your Profile'} 👤
          </Text>
          <Text style={styles.modalSubtitle}>
            Help us personalize your experience
          </Text>

          {/* Age Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              keyboardType="numeric"
              value={profileForm.age}
              onChangeText={(text) => setProfileForm({ ...profileForm, age: text })}
              maxLength={3}
            />
          </View>

          {/* Gender Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>How do you identify?</Text>
            <View style={styles.genderContainer}>
              {[
                { value: GENDER_TYPES.MALE, label: 'Male', emoji: '👨' },
                { value: GENDER_TYPES.FEMALE, label: 'Female', emoji: '👩' },
                { value: GENDER_TYPES.NON_BINARY, label: 'Non-binary', emoji: '🧑' },
                { value: GENDER_TYPES.PREFER_NOT_TO_SAY, label: 'Prefer not to say', emoji: '👤' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    profileForm.gender === option.value && styles.genderOptionSelected,
                  ]}
                  onPress={() => setProfileForm({ ...profileForm, gender: option.value })}
                >
                  <Text style={styles.genderEmoji}>{option.emoji}</Text>
                  <Text
                    style={[
                      styles.genderLabel,
                      profileForm.gender === option.value && styles.genderLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <Text style={styles.privacyText}>
              🔒 Your information is private and helps us provide personalized questions
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.modalButtons}>
            {userProfile && (
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowProfileSetup(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.modalSaveButton, !userProfile && styles.modalSaveButtonFull]}
              onPress={saveUserProfile}
            >
              <Text style={styles.modalSaveButtonText}>
                {userProfile ? 'Update Profile' : 'Save & Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderCategoryCards = () => {
    const categories = getAllCategoriesInfo();
    
    // return (
    //   <View style={styles.section}>
    //     <Text style={styles.sectionTitle}>Assessment Categories</Text>
    //     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    //       {categories.map((category) => {
    //         const stats = categoryStats[category.key] || { completed: 0 };
    //         return (
    //           <View
    //             key={category.key}
    //             style={[styles.categoryCard, { borderColor: category.color }]}
    //           >
    //             <Text style={styles.categoryCardIcon}>{category.icon}</Text>
    //             <Text style={styles.categoryCardName}>{category.name}</Text>
    //             <Text style={styles.categoryCardDescription}>
    //               {category.description}
    //             </Text>
    //             <View style={styles.categoryCardStats}>
    //               <Text style={[styles.categoryCardStatsText, { color: category.color }]}>
    //                 {stats.completed} completed
    //               </Text>
    //             </View>
    //           </View>
    //         );
    //       })}
    //     </ScrollView>
    //   </View>
    // );
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
            <Text style={styles.profileIcon}>
              {userProfile ? getGenderEmoji(userProfile.gender) : '👤'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* User Profile Badge */}
        {userProfile && (
          <TouchableOpacity 
            style={styles.profileBadge}
            onPress={handleEditProfile}
          >
            <Text style={styles.profileBadgeText}>
              {getGenderEmoji(userProfile.gender)} {userProfile.age} years • {getAgeGroupLabel(userProfile.ageGroup)}
            </Text>
            <Text style={styles.profileBadgeEdit}>✏️ Edit</Text>
          </TouchableOpacity>
        )}

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Welcome to Your Mental Wellness Hub 🌟
          </Text>
          <Text style={styles.welcomeText}>
            Your mental health matters. Take a moment to check in with yourself today.
            {userProfile && ' We\'ve personalized questions just for you!'}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalAssessments}</Text>
            <Text style={styles.statLabel}>Total Assessments</Text>
            <Text style={styles.statIcon}>📊</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Object.keys(QUESTION_CATEGORIES).length}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
            <Text style={styles.statIcon}>📋</Text>
          </View>
        </View>

        {/* Start Assessment Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartAssessment}
        >
          <View style={styles.startButtonContent}>
            <View>
              <Text style={styles.startButtonTitle}>
                {userProfile ? 'Start Personalized Assessment' : 'Start New Assessment'}
              </Text>
              <Text style={styles.startButtonSubtitle}>
                Take 5-10 minutes to check your mental health
              </Text>
            </View>
            <Text style={styles.startButtonIcon}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Category Cards */}
        {renderCategoryCards()}

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

          {!userProfile && (
            <TouchableOpacity 
              style={[styles.actionCard, styles.setupProfileCard]} 
              onPress={() => setShowProfileSetup(true)}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionIcon}>⚙️</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Set Up Profile</Text>
                <Text style={styles.actionDescription}>
                  Get personalized questions based on your profile
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          )}
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

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Profile Setup Modal */}
      {renderProfileSetupModal()}
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
  profileBadge: {
    backgroundColor: '#EEF2FF',
    marginHorizontal: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  profileBadgeText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  profileBadgeEdit: {
    fontSize: 12,
    color: '#6366F1',
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
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
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
    textAlign: 'center',
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
  categoryCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryCardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  categoryCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  categoryCardDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 12,
  },
  categoryCardStats: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  categoryCardStatsText: {
    fontSize: 12,
    fontWeight: '600',
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
  setupProfileCard: {
    borderWidth: 2,
    borderColor: '#FBBF24',
    backgroundColor: '#FFFBEB',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  genderContainer: {
    gap: 12,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  genderOptionSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  genderEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  genderLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  genderLabelSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  privacyNote: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  privacyText: {
    fontSize: 12,
    color: '#065F46',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveButtonFull: {
    flex: 1,
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default StudentDashboard;