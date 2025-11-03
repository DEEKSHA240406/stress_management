// app/screens/mentor/MentorProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../store/slices/authSlice';

const MentorProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚪 Logging out...');
              
              // Clear AsyncStorage
              await AsyncStorage.removeItem('@auth_token');
              await AsyncStorage.removeItem('@user_data');
              console.log('✅ Storage cleared');
              
              // Dispatch logout action to Redux
              dispatch(logout());
              console.log('✅ Redux state cleared');
              
              // Reset navigation to Login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
              console.log('✅ Navigated to Login');
            } catch (error) {
              console.error('❌ Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon!');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Help center feature coming soon!');
  };

  const ProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={['#6C63FF', '#5A52D5']}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>
            {user?.name?.split(' ').map(n => n[0]).join('') || 'M'}
          </Text>
        </LinearGradient>
        <TouchableOpacity style={styles.editAvatarButton}>
          <Icon name="camera" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.profileName}>{user?.name || 'Dr. Ananya Sharma'}</Text>
      <Text style={styles.profileEmail}>{user?.email || 'ananya.sharma@university.edu'}</Text>
      <Text style={styles.profileDesignation}>
        {user?.designation || 'Senior Mental Health Mentor'}
      </Text>

      <TouchableOpacity 
        style={styles.editProfileButton}
        onPress={handleEditProfile}
      >
        <Icon name="pencil" size={16} color="#6C63FF" />
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const StatsCard = ({ icon, value, label, color }) => (
    <View style={styles.statsCard}>
      <View style={[styles.statsIcon, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
  );

  const SettingItem = ({ icon, title, subtitle, rightComponent }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon name={icon} size={22} color="#6C63FF" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
      </View>
    </View>
  );

  const MenuButton = ({ icon, title, onPress, color = '#2C3E50', danger = false }) => (
    <TouchableOpacity 
      style={styles.menuButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuButtonLeft}>
        <View style={[
          styles.menuIcon,
          { backgroundColor: danger ? '#FFEBEE' : '#F0EFFF' }
        ]}>
          <Icon name={icon} size={22} color={danger ? '#D32F2F' : color} />
        </View>
        <Text style={[styles.menuButtonText, danger && { color: '#D32F2F' }]}>
          {title}
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color="#95A5A6" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      {/* Header */}
      <LinearGradient
        colors={['#6C63FF', '#5A52D5']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <ProfileSection />

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatsCard
            icon="account-group"
            value={user?.assignedStudents || "20"}
            label="Students"
            color="#6C63FF"
          />
          <StatsCard
            icon="chart-line"
            value="156"
            label="Assessments"
            color="#4CAF50"
          />
          <StatsCard
            icon="notebook"
            value="42"
            label="Notes"
            color="#FF6B9D"
          />
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="bell"
              title="Push Notifications"
              subtitle="Receive notifications about your students"
              rightComponent={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#E8E8E8', true: '#B4AFFF' }}
                  thumbColor={notificationsEnabled ? '#6C63FF' : '#f4f3f4'}
                />
              }
            />
            <View style={styles.divider} />
            <SettingItem
              icon="email"
              title="Email Alerts"
              subtitle="Get important updates via email"
              rightComponent={
                <Switch
                  value={emailAlerts}
                  onValueChange={setEmailAlerts}
                  trackColor={{ false: '#E8E8E8', true: '#B4AFFF' }}
                  thumbColor={emailAlerts ? '#6C63FF' : '#f4f3f4'}
                />
              }
            />
            <View style={styles.divider} />
            <SettingItem
              icon="alert-circle"
              title="Critical Alerts"
              subtitle="Immediate notifications for critical cases"
              rightComponent={
                <Switch
                  value={criticalAlerts}
                  onValueChange={setCriticalAlerts}
                  trackColor={{ false: '#E8E8E8', true: '#B4AFFF' }}
                  thumbColor={criticalAlerts ? '#6C63FF' : '#f4f3f4'}
                />
              }
            />
            <View style={styles.divider} />
            <SettingItem
              icon="file-chart"
              title="Weekly Reports"
              subtitle="Receive summary of student progress"
              rightComponent={
                <Switch
                  value={weeklyReports}
                  onValueChange={setWeeklyReports}
                  trackColor={{ false: '#E8E8E8', true: '#B4AFFF' }}
                  thumbColor={weeklyReports ? '#6C63FF' : '#f4f3f4'}
                />
              }
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuButton
              icon="account-edit"
              title="Edit Profile Information"
              onPress={handleEditProfile}
              color="#6C63FF"
            />
            <View style={styles.divider} />
            <MenuButton
              icon="lock-reset"
              title="Change Password"
              onPress={handleChangePassword}
              color="#6C63FF"
            />
            <View style={styles.divider} />
            <MenuButton
              icon="bell-cog"
              title="Notification Preferences"
              onPress={() => Alert.alert('Preferences', 'Advanced notification settings')}
              color="#6C63FF"
            />
          </View>
        </View>

        {/* Other Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuButton
              icon="help-circle"
              title="Help & Support"
              onPress={handleHelp}
              color="#6C63FF"
            />
            <View style={styles.divider} />
            <MenuButton
              icon="file-document"
              title="Terms & Conditions"
              onPress={() => Alert.alert('Terms', 'Terms and conditions')}
              color="#6C63FF"
            />
            <View style={styles.divider} />
            <MenuButton
              icon="shield-check"
              title="Privacy Policy"
              onPress={() => Alert.alert('Privacy', 'Privacy policy')}
              color="#6C63FF"
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>Mental Health & Stress Management</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutText}>
              Supporting student mental health and wellbeing through compassionate mentorship
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Icon name="logout" size={20} color="#D32F2F" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  profileDesignation: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0EFFF',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#95A5A6',
  },
  settingRight: {
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 72,
  },
  menuCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  aboutCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 13,
    color: '#95A5A6',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 13,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFEBEE',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginLeft: 8,
  },
});

export default MentorProfileScreen;