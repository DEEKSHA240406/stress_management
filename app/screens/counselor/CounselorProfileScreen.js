// app/screens/counselor/CounselorProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const CounselorProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const ProfileOption = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    iconColor = '#6C63FF', 
    showChevron = true,
    rightComponent 
  }) => (
    <TouchableOpacity 
      style={styles.option} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={!!rightComponent}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        <Icon name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionText}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent || (showChevron && <Icon name="chevron-right" size={20} color="#95A5A6" />)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4ECDC4" />
      
      {/* Header */}
      <LinearGradient colors={['#4ECDC4', '#44B8B0']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>
              {user?.name?.split(' ').map(n => n[0]).join('') || 'DR'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Dr. Counselor'}</Text>
          <Text style={styles.email}>{user?.email || 'counselor@university.edu'}</Text>
          <Text style={styles.designation}>Clinical Psychologist</Text>
          
          <View style={styles.statusBadge}>
            <Icon name="check-circle" size={14} color="#388E3C" />
            <Text style={styles.statusText}>Active</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Icon name="pencil" size={18} color="#4ECDC4" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Active Cases</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>87%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <ProfileOption 
            icon="account-edit" 
            title="Personal Information" 
            subtitle="Update your details"
            onPress={handleEditProfile} 
            iconColor="#4ECDC4" 
          />
          <ProfileOption 
            icon="lock-outline" 
            title="Change Password" 
            subtitle="Update your password"
            onPress={() => Alert.alert('Change Password', 'Feature coming soon')} 
            iconColor="#6C63FF" 
          />
          <ProfileOption 
            icon="shield-account" 
            title="Privacy & Security" 
            subtitle="Manage privacy settings"
            onPress={() => Alert.alert('Privacy', 'Feature coming soon')} 
            iconColor="#FF6B9D" 
          />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <ProfileOption 
            icon="bell-ring" 
            title="Push Notifications" 
            subtitle="Receive alerts for urgent cases"
            iconColor="#FFA726"
            showChevron={false}
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E8E8E8', true: '#A7E6E1' }}
                thumbColor={notificationsEnabled ? '#4ECDC4' : '#f4f3f4'}
              />
            }
          />
          <ProfileOption 
            icon="email-outline" 
            title="Email Notifications" 
            subtitle="Get session reminders via email"
            iconColor="#2196F3"
            showChevron={false}
            rightComponent={
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#E8E8E8', true: '#A7E6E1' }}
                thumbColor={emailNotifications ? '#4ECDC4' : '#f4f3f4'}
              />
            }
          />
          <ProfileOption 
            icon="volume-high" 
            title="Sound & Vibration" 
            subtitle="Customize alert sounds"
            onPress={() => Alert.alert('Sounds', 'Feature coming soon')} 
            iconColor="#9C27B0" 
          />
        </View>

        {/* Professional Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional</Text>
          <ProfileOption 
            icon="certificate" 
            title="Credentials & Licenses" 
            subtitle="RCI License #12345"
            onPress={() => Alert.alert('Credentials', 'Feature coming soon')} 
            iconColor="#388E3C" 
          />
          <ProfileOption 
            icon="book-open-variant" 
            title="Specializations" 
            subtitle="View and update areas of expertise"
            onPress={() => Alert.alert('Specializations', 'Feature coming soon')} 
            iconColor="#F57C00" 
          />
          <ProfileOption 
            icon="school" 
            title="Continuing Education" 
            subtitle="Track professional development"
            onPress={() => Alert.alert('Education', 'Feature coming soon')} 
            iconColor="#1976D2" 
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <ProfileOption 
            icon="calendar-range" 
            title="Working Hours" 
            subtitle="Set your availability"
            onPress={() => Alert.alert('Hours', 'Feature coming soon')} 
            iconColor="#00897B" 
          />
          <ProfileOption 
            icon="format-list-bulleted" 
            title="Session Templates" 
            subtitle="Manage note templates"
            onPress={() => Alert.alert('Templates', 'Feature coming soon')} 
            iconColor="#7B1FA2" 
          />
          <ProfileOption 
            icon="download" 
            title="Export Data" 
            subtitle="Download your session records"
            onPress={() => Alert.alert('Export', 'Feature coming soon')} 
            iconColor="#5E35B1" 
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          <ProfileOption 
            icon="help-circle" 
            title="Help Center" 
            subtitle="FAQs and guides"
            onPress={() => Alert.alert('Help', 'Feature coming soon')} 
            iconColor="#FFA726" 
          />
          <ProfileOption 
            icon="message-text" 
            title="Contact Support" 
            subtitle="Get help from our team"
            onPress={() => Alert.alert('Support', 'Email: support@example.com')} 
            iconColor="#26C6DA" 
          />
          <ProfileOption 
            icon="file-document" 
            title="Terms & Policies" 
            subtitle="Privacy policy, terms of use"
            onPress={() => Alert.alert('Terms', 'Feature coming soon')} 
            iconColor="#66BB6A" 
          />
          <ProfileOption 
            icon="information" 
            title="About" 
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('About', 'Mental Health Monitoring System v1.0.0')} 
            iconColor="#78909C" 
          />
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  designation: {
    fontSize: 13,
    color: '#95A5A6',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#388E3C',
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8FFFE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ECDC4',
    marginLeft: 6,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 15,
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 10,
  },
  section: {
    marginTop: 25,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginLeft: 8,
  },
});

export default CounselorProfileScreen;