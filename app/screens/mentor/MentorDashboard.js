// app/screens/mentor/MentorDashboard.js
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
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MentorDashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    criticalStudents: 0,
    needsAttention: 0,
    healthyStudents: 0,
    recentAlerts: 0,
    averageScore: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // API call to fetch mentor dashboard data
      // const response = await mentorService.getDashboardStats(user.id);
      
      // Mock data for now
      setDashboardData({
        totalStudents: 20,
        criticalStudents: 2,
        needsAttention: 5,
        healthyStudents: 13,
        recentAlerts: 3,
        averageScore: 68
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

  const StatCard = ({ title, value, icon, color, onPress, subtitle }) => (
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
          <Text style={styles.statValue}>{value}</Text>
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

  const AlertItem = ({ studentName, severity, message, time }) => (
    <TouchableOpacity style={styles.alertItem} activeOpacity={0.7}>
      <View style={styles.alertLeft}>
        <View style={[
          styles.severityDot, 
          { backgroundColor: severity === 'critical' ? '#D32F2F' : '#F57C00' }
        ]} />
        <View style={styles.alertContent}>
          <Text style={styles.alertStudent}>{studentName}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          <Text style={styles.alertTime}>{time}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
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
          <View>
            <Text style={styles.greeting}>Welcome Back,</Text>
            <Text style={styles.mentorName}>{user?.name || 'Mentor'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('MentorProfile')}
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
              title="Total Students"
              value={dashboardData.totalStudents}
              icon="account-group"
              color="#6C63FF"
              onPress={() => navigation.navigate('MyStudents')}
            />
            <StatCard
              title="Critical Cases"
              value={dashboardData.criticalStudents}
              icon="alert-circle"
              color="#D32F2F"
              onPress={() => navigation.navigate('Alerts')}
              subtitle="Needs immediate attention"
            />
            <StatCard
              title="Needs Attention"
              value={dashboardData.needsAttention}
              icon="exclamation"
              color="#F57C00"
              onPress={() => navigation.navigate('MyStudents', { filter: 'attention' })}
            />
            <StatCard
              title="Healthy Students"
              value={dashboardData.healthyStudents}
              icon="emoticon-happy"
              color="#388E3C"
              onPress={() => navigation.navigate('MyStudents', { filter: 'healthy' })}
            />
          </View>
        </View>

        {/* Average Score */}
        <View style={styles.section}>
          <View style={styles.scoreCard}>
            <View style={styles.scoreLeft}>
              <Text style={styles.scoreLabel}>Average Mental Health Score</Text>
              <Text style={styles.scoreValue}>{dashboardData.averageScore}%</Text>
              <Text style={styles.scoreSubtext}>
                {dashboardData.averageScore >= 70 ? 'Good overall health' : 'Needs improvement'}
              </Text>
            </View>
            <View style={styles.scoreRight}>
              <View style={[
                styles.scoreCircle,
                { borderColor: dashboardData.averageScore >= 70 ? '#388E3C' : '#F57C00' }
              ]}>
                <Icon 
                  name={dashboardData.averageScore >= 70 ? 'emoticon-happy' : 'emoticon-neutral'} 
                  size={40} 
                  color={dashboardData.averageScore >= 70 ? '#388E3C' : '#F57C00'} 
                />
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionButton
              title="My Students"
              icon="account-group"
              color="#6C63FF"
              onPress={() => navigation.navigate('MyStudents')}
            />
            <QuickActionButton
              title="Alerts"
              icon="bell-alert"
              color="#D32F2F"
              onPress={() => navigation.navigate('Alerts')}
            />
            <QuickActionButton
              title="Progress"
              icon="chart-line"
              color="#388E3C"
              onPress={() => navigation.navigate('StudentProgress')}
            />
            <QuickActionButton
              title="Notes"
              icon="notebook"
              color="#F57C00"
              onPress={() => navigation.navigate('Notes')}
            />
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.alertsContainer}>
            <AlertItem
              studentName="Priya Kumar"
              severity="critical"
              message="Score dropped below 30% - High stress level"
              time="2 hours ago"
            />
            <AlertItem
              studentName="Rahul Sharma"
              severity="high"
              message="Declined in mental health assessment"
              time="5 hours ago"
            />
            <AlertItem
              studentName="Anjali Patel"
              severity="high"
              message="Missed last 2 assessments"
              time="1 day ago"
            />
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
  mentorName: {
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
    color: '#6C63FF',
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
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
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
  scoreCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreLeft: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#5D6D7E',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  scoreSubtext: {
    fontSize: 13,
    color: '#95A5A6',
  },
  scoreRight: {
    marginLeft: 15,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
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
  alertsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  alertLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  severityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
    marginTop: 6,
  },
  alertContent: {
    flex: 1,
  },
  alertStudent: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 13,
    color: '#5D6D7E',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#95A5A6',
  },
});

export default MentorDashboard;