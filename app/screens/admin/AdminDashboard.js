import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../store/slices/authSlice';

const { width } = Dimensions.get('window');

export default function AdminDashboard({ navigation }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [stats] = useState({
    totalStudents: 1248,
    activeToday: 342,
    completedAssessments: 856,
    needsAttention: 23,
  });

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: '👥',
      color: '#6366F1',
      change: '+12%',
    },
    {
      title: 'Active Today',
      value: stats.activeToday,
      icon: '⚡',
      color: '#10B981',
      change: '+8%',
    },
    {
      title: 'Assessments',
      value: stats.completedAssessments,
      icon: '✅',
      color: '#8B5CF6',
      change: '+15%',
    },
    {
      title: 'Needs Attention',
      value: stats.needsAttention,
      icon: '⚠️',
      color: '#F59E0B',
      change: '-3%',
    },
  ];

  const quickActions = [
    { title: 'View Analytics', icon: '📊', color: '#6366F1' },
    { title: 'Student List', icon: '👨‍🎓', color: '#10B981' },
    { title: 'Export Reports', icon: '📄', color: '#8B5CF6' },
    { title: 'Settings', icon: '⚙️', color: '#6B7280' },
  ];

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

  const handleActionPress = (title) => {
    Alert.alert('Coming Soon', `${title} feature will be available soon!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.subtitle}>Admin Dashboard</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {statCards.map((card, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: card.color + '20' }]}>
                <Text style={styles.statIcon}>{card.icon}</Text>
              </View>
              <Text style={styles.statValue}>{card.value}</Text>
              <Text style={styles.statTitle}>{card.title}</Text>
              <Text style={[
                styles.statChange, 
                { color: card.change.startsWith('+') ? '#10B981' : '#EF4444' }
              ]}>
                {card.change}
              </Text>
            </View>
          ))}
        </View>

        {/* Mental Health Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mental Health Overview</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewRow}>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewIcon}>😊</Text>
                <Text style={styles.overviewValue}>68%</Text>
                <Text style={styles.overviewLabel}>Good</Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewIcon}>😐</Text>
                <Text style={styles.overviewValue}>20%</Text>
                <Text style={styles.overviewLabel}>Moderate</Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewIcon}>🆘</Text>
                <Text style={styles.overviewValue}>12%</Text>
                <Text style={styles.overviewLabel}>Needs Help</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => handleActionPress(action.title)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Text style={styles.actionIconText}>{action.icon}</Text>
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <View style={styles.activityCard}>
            <ActivityItem
              icon="👤"
              color="#10B981"
              title="New Student Registered"
              time="5 mins ago"
            />
            <ActivityItem
              icon="✅"
              color="#6366F1"
              title="15 Assessments Completed"
              time="1 hour ago"
            />
            <ActivityItem
              icon="⚠️"
              color="#F59E0B"
              title="3 Students Need Attention"
              time="2 hours ago"
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const ActivityItem = ({ icon, color, title, time }) => (
  <View style={styles.activityItem}>
    <View style={[styles.activityIcon, { backgroundColor: color + '20' }]}>
      <Text style={styles.activityIconText}>{icon}</Text>
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  userName: {
    fontSize: 16,
    color: '#6366F1',
    marginTop: 4,
    fontWeight: '600',
  },
  notificationBtn: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationIcon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 14,
    color: '#6366F1',
  },
  overviewCard: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 24,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewIcon: {
    fontSize: 32,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.9,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  actionCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconText: {
    fontSize: 28,
  },
  actionTitle: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIconText: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  logoutButton: {
    marginHorizontal: 24,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  bottomSpacing: {
    height: 40,
  },
});