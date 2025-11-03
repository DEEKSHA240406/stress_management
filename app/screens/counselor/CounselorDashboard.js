// app/screens/counselor/CounselorDashboard.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { getSeverityColor } from '../../../constants/severityThresholds';

const { width } = Dimensions.get('window');

const CounselorDashboard = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalCases: 0,
    activeCases: 0,
    urgentCases: 0,
    completedCases: 0,
    pendingSessions: 0,
    todaySessions: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // API call
      // const response = await counselorService.getDashboardStats(user.id);
      
      // Mock data
      setDashboardData({
        totalCases: 12,
        activeCases: 8,
        urgentCases: 3,
        completedCases: 4,
        pendingSessions: 5,
        todaySessions: 2,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, icon, color, onPress, subtitle, badge }) => (
    <TouchableOpacity 
      style={styles.statCard} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[color + '20', color + '05']}
        style={styles.statGradient}
      >
        <View style={styles.statHeader}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Icon name={icon} size={28} color={color} />
          </View>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{value}</Text>
            {badge && (
              <View style={[styles.badge, { backgroundColor: color }]}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );

  const QuickActionButton = ({ title, icon, onPress, color }) => (
    <TouchableOpacity 
      style={styles.quickAction}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  const UrgentCaseCard = ({ studentName, severity, issue, time, studentId }) => (
    <TouchableOpacity 
      style={styles.urgentCard}
      onPress={() => navigation.navigate('StudentCase', { studentId })}
      activeOpacity={0.7}
    >
      <View style={styles.urgentCardHeader}>
        <View style={styles.urgentCardLeft}>
          <View style={[
            styles.urgentAvatar,
            { backgroundColor: getSeverityColor(severity) + '20' }
          ]}>
            <Text style={[
              styles.urgentAvatarText,
              { color: getSeverityColor(severity) }
            ]}>
              {studentName.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View>
            <Text style={styles.urgentStudentName}>{studentName}</Text>
            <Text style={styles.urgentIssue}>{issue}</Text>
          </View>
        </View>
        <View style={[
          styles.severityBadge,
          { backgroundColor: getSeverityColor(severity) }
        ]}>
          <Icon name="alert" size={16} color="#FFF" />
        </View>
      </View>
      <View style={styles.urgentCardFooter}>
        <Icon name="clock-outline" size={14} color="#95A5A6" />
        <Text style={styles.urgentTime}>{time}</Text>
      </View>
    </TouchableOpacity>
  );

  const SessionCard = ({ studentName, time, type, studentId }) => (
    <TouchableOpacity 
      style={styles.sessionCard}
      onPress={() => navigation.navigate('StudentCase', { studentId })}
      activeOpacity={0.7}
    >
      <View style={styles.sessionCardLeft}>
        <View style={styles.sessionTimeContainer}>
          <Text style={styles.sessionTime}>{time}</Text>
        </View>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionStudent}>{studentName}</Text>
          <Text style={styles.sessionType}>{type}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color="#95A5A6" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4ECDC4" />
      
      {/* Header */}
      <LinearGradient
        colors={['#4ECDC4', '#44B8B0']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome Back,</Text>
            <Text style={styles.counselorName}>{user?.name || 'Dr. Counselor'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('CounselorProfile')}
          >
            <Icon name="account-circle" size={40} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Cases"
              value={dashboardData.totalCases}
              icon="folder-account"
              color="#4ECDC4"
              onPress={() => navigation.navigate('AssignedStudents')}
            />
            <StatCard
              title="Active Cases"
              value={dashboardData.activeCases}
              icon="account-clock"
              color="#6C63FF"
              onPress={() => navigation.navigate('AssignedStudents', { filter: 'active' })}
            />
            <StatCard
              title="Urgent Cases"
              value={dashboardData.urgentCases}
              icon="alert-circle"
              color="#D32F2F"
              onPress={() => navigation.navigate('UrgentCases')}
              badge="High"
            />
            <StatCard
              title="Completed"
              value={dashboardData.completedCases}
              icon="check-circle"
              color="#388E3C"
              onPress={() => navigation.navigate('AssignedStudents', { filter: 'completed' })}
              subtitle="This month"
            />
          </View>
        </View>

        {/* Session Summary */}
        <View style={styles.section}>
          <View style={styles.sessionSummary}>
            <View style={styles.sessionSummaryItem}>
              <Icon name="calendar-today" size={24} color="#4ECDC4" />
              <View style={styles.sessionSummaryInfo}>
                <Text style={styles.sessionSummaryValue}>{dashboardData.todaySessions}</Text>
                <Text style={styles.sessionSummaryLabel}>Today's Sessions</Text>
              </View>
            </View>
            <View style={styles.sessionSummaryDivider} />
            <View style={styles.sessionSummaryItem}>
              <Icon name="calendar-clock" size={24} color="#FF6B9D" />
              <View style={styles.sessionSummaryInfo}>
                <Text style={styles.sessionSummaryValue}>{dashboardData.pendingSessions}</Text>
                <Text style={styles.sessionSummaryLabel}>Pending Sessions</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionButton
              title="My Cases"
              icon="folder-account"
              color="#4ECDC4"
              onPress={() => navigation.navigate('AssignedStudents')}
            />
            <QuickActionButton
              title="Urgent"
              icon="alert-octagon"
              color="#D32F2F"
              onPress={() => navigation.navigate('UrgentCases')}
            />
            <QuickActionButton
              title="Sessions"
              icon="calendar-check"
              color="#6C63FF"
              onPress={() => navigation.navigate('SessionNotes')}
            />
            <QuickActionButton
              title="Treatment"
              icon="clipboard-text"
              color="#388E3C"
              onPress={() => navigation.navigate('TreatmentPlan')}
            />
          </View>
        </View>

        {/* Urgent Cases */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Urgent Cases</Text>
            <TouchableOpacity onPress={() => navigation.navigate('UrgentCases')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.urgentContainer}>
            <UrgentCaseCard
              studentName="Priya Kumar"
              severity={28}
              issue="Severe anxiety and stress - Immediate intervention needed"
              time="2 hours ago"
              studentId="S001"
            />
            <UrgentCaseCard
              studentName="Rahul Sharma"
              severity={32}
              issue="Depression symptoms - Follow-up required"
              time="5 hours ago"
              studentId="S002"
            />
            <UrgentCaseCard
              studentName="Arjun Reddy"
              severity={38}
              issue="Academic pressure causing mental distress"
              time="1 day ago"
              studentId="S004"
            />
          </View>
        </View>

        {/* Today's Sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity>
              <Icon name="calendar-plus" size={24} color="#4ECDC4" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.sessionsContainer}>
            <SessionCard
              studentName="Priya Kumar"
              time="10:00 AM"
              type="Follow-up Session"
              studentId="S001"
            />
            <SessionCard
              studentName="Meera Singh"
              time="2:30 PM"
              type="Initial Assessment"
              studentId="S005"
            />
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Icon name="lightbulb" size={24} color="#FFA726" />
              <Text style={styles.tipsTitle}>Professional Tip</Text>
            </View>
            <Text style={styles.tipsText}>
              Remember to document all sessions thoroughly. Detailed notes help track progress and identify patterns in student behavior and mental health.
            </Text>
          </View>
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
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  counselorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 4,
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFF',
  },
  statGradient: {
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statTitle: {
    fontSize: 14,
    color: '#5D6D7E',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 11,
    color: '#95A5A6',
    marginTop: 4,
  },
  sessionSummary: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionSummaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionSummaryInfo: {
    marginLeft: 12,
  },
  sessionSummaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  sessionSummaryLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  sessionSummaryDivider: {
    width: 1,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 50) / 2,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  urgentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  urgentCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  urgentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  urgentCardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  urgentAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  urgentAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  urgentStudentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  urgentIssue: {
    fontSize: 13,
    color: '#5D6D7E',
    lineHeight: 18,
  },
  severityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgentCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentTime: {
    fontSize: 12,
    color: '#95A5A6',
    marginLeft: 4,
  },
  sessionsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sessionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionTimeContainer: {
    backgroundColor: '#E8FFFE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  sessionTime: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionStudent: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  sessionType: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  tipsCard: {
    backgroundColor: '#FFFBF0',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA726',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57C00',
    marginLeft: 10,
  },
  tipsText: {
    fontSize: 13,
    color: '#5D6D7E',
    lineHeight: 20,
  },
});

export default CounselorDashboard;