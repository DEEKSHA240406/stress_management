// app/screens/counselor/StudentCaseScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { getSeverityColor } from '../../../constants/severityThresholds';

const { width } = Dimensions.get('window');

const StudentCaseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { studentId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [student, setStudent] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview'); // overview, history, sessions, treatment

  useEffect(() => {
    fetchStudentCase();
  }, []);

  const fetchStudentCase = async () => {
    try {
      // API call
      // const response = await counselorService.getStudentCase(studentId);
      
      // Mock data
      const mockStudent = {
        id: studentId,
        name: 'Priya Kumar',
        email: 'priya.kumar@university.edu',
        phone: '+91 98765 12345',
        department: 'Computer Science',
        year: '3rd Year',
        rollNumber: 'CS2021001',
        avatar: null,
        initials: 'PK',
        currentScore: 28,
        assignedDate: '2024-10-25T00:00:00',
        status: 'active',
        priority: 'critical',
        mentorName: 'Dr. Ananya Sharma',
        mentorEmail: 'ananya.sharma@university.edu',
        emergencyContact: '+91 98765 98765',
        emergencyContactName: 'Mrs. Kumar (Mother)',
        issues: ['Severe Anxiety', 'Academic Stress', 'Sleep Issues'],
        symptoms: ['Panic attacks', 'Difficulty concentrating', 'Insomnia'],
        riskFactors: ['Academic pressure', 'Family expectations', 'Social isolation'],
        sessionsCompleted: 3,
        totalSessions: 8,
        nextSession: '2024-10-28T10:00:00',
        lastSession: '2024-10-26T10:00:00',
        
        // Progress data
        progressHistory: [
          { date: '2024-10-05', score: 65 },
          { date: '2024-10-12', score: 52 },
          { date: '2024-10-19', score: 38 },
          { date: '2024-10-26', score: 28 },
        ],

        // Recent sessions
        recentSessions: [
          {
            id: 1,
            date: '2024-10-26T10:00:00',
            type: 'Individual Therapy',
            duration: 60,
            notes: 'Patient showed signs of improvement. Discussed coping mechanisms.',
            outcome: 'Positive progress',
          },
          {
            id: 2,
            date: '2024-10-22T10:00:00',
            type: 'Assessment',
            duration: 45,
            notes: 'Initial assessment completed. Identified key stressors.',
            outcome: 'Assessment complete',
          },
        ],
      };

      setStudent(mockStudent);
    } catch (error) {
      console.error('Error fetching student case:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudentCase();
    setRefreshing(false);
  };

  const handleScheduleSession = () => {
    Alert.alert('Schedule Session', 'Session scheduling feature coming soon!');
  };

  const handleAddNote = () => {
    navigation.navigate('SessionNotes', { studentId });
  };

  const handleUpdateTreatment = () => {
    navigation.navigate('TreatmentPlan', { studentId });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const TabButton = ({ label, value, icon }) => (
    <TouchableOpacity
      style={[styles.tabButton, selectedTab === value && styles.tabButtonActive]}
      onPress={() => setSelectedTab(value)}
      activeOpacity={0.7}
    >
      <Icon 
        name={icon} 
        size={20} 
        color={selectedTab === value ? '#4ECDC4' : '#95A5A6'} 
      />
      <Text style={[
        styles.tabText,
        selectedTab === value && styles.tabTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const InfoRow = ({ icon, label, value, iconColor }) => (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: iconColor + '15' }]}>
        <Icon name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const IssueTag = ({ text, color }) => (
    <View style={[styles.issueTag, { backgroundColor: color + '15' }]}>
      <Icon name="alert-circle" size={14} color={color} />
      <Text style={[styles.issueTagText, { color }]}>{text}</Text>
    </View>
  );

  const SessionCard = ({ session }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionCardHeader}>
        <View>
          <Text style={styles.sessionType}>{session.type}</Text>
          <Text style={styles.sessionDate}>{formatDateTime(session.date)}</Text>
        </View>
        <View style={styles.sessionDuration}>
          <Icon name="clock-outline" size={16} color="#4ECDC4" />
          <Text style={styles.sessionDurationText}>{session.duration} min</Text>
        </View>
      </View>
      <Text style={styles.sessionNotes}>{session.notes}</Text>
      <View style={styles.sessionFooter}>
        <Text style={styles.sessionOutcome}>Outcome: {session.outcome}</Text>
      </View>
    </View>
  );

  if (!student) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4ECDC4" />
        <View style={styles.loadingContainer}>
          <Icon name="loading" size={40} color="#4ECDC4" />
          <Text style={styles.loadingText}>Loading case details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const chartData = {
    labels: student.progressHistory.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: student.progressHistory.map(item => item.score),
      color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
      strokeWidth: 3
    }]
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4ECDC4" />

      {/* Header */}
      <LinearGradient
        colors={['#4ECDC4', '#44B8B0']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Case Details</Text>
          <TouchableOpacity style={styles.headerIconButton}>
            <Icon name="dots-vertical" size={24} color="#FFF" />
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
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={[
            styles.avatarLarge,
            { backgroundColor: getSeverityColor(student.currentScore) + '20' }
          ]}>
            <Text style={[
              styles.avatarLargeText,
              { color: getSeverityColor(student.currentScore) }
            ]}>
              {student.initials}
            </Text>
          </View>

          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentRoll}>{student.rollNumber}</Text>
          <Text style={styles.studentDept}>{student.department} • {student.year}</Text>

          {/* Priority Badge */}
          <View style={[
            styles.priorityBadgeLarge,
            { backgroundColor: getSeverityColor(student.currentScore) }
          ]}>
            <Icon name="alert-circle" size={16} color="#FFF" />
            <Text style={styles.priorityBadgeText}>{student.priority.toUpperCase()}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleScheduleSession}
            >
              <Icon name="calendar-plus" size={20} color="#4ECDC4" />
              <Text style={styles.actionButtonText}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAddNote}
            >
              <Icon name="note-plus" size={20} color="#6C63FF" />
              <Text style={styles.actionButtonText}>Add Note</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleUpdateTreatment}
            >
              <Icon name="clipboard-text" size={20} color="#388E3C" />
              <Text style={styles.actionButtonText}>Treatment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Current Status</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: student.status === 'active' ? '#E8F5E9' : '#F5F5F5' }
            ]}>
              <Text style={[
                styles.statusBadgeText,
                { color: student.status === 'active' ? '#388E3C' : '#95A5A6' }
              ]}>
                {student.status}
              </Text>
            </View>
          </View>
          <View style={styles.statusStats}>
            <View style={styles.statusStatItem}>
              <Text style={styles.statusStatLabel}>Mental Health Score</Text>
              <Text style={[
                styles.statusStatValue,
                { color: getSeverityColor(student.currentScore) }
              ]}>
                {student.currentScore}%
              </Text>
            </View>
            <View style={styles.statusStatItem}>
              <Text style={styles.statusStatLabel}>Sessions Progress</Text>
              <Text style={styles.statusStatValue}>
                {student.sessionsCompleted}/{student.totalSessions}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TabButton label="Overview" value="overview" icon="information" />
          <TabButton label="History" value="history" icon="chart-line" />
          <TabButton label="Sessions" value="sessions" icon="calendar-check" />
          <TabButton label="Treatment" value="treatment" icon="clipboard-text" />
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Issues */}
            <Text style={styles.sectionTitle}>Identified Issues</Text>
            <View style={styles.issuesContainer}>
              {student.issues.map((issue, index) => (
                <IssueTag key={index} text={issue} color="#D32F2F" />
              ))}
            </View>

            {/* Symptoms */}
            <Text style={styles.sectionTitle}>Symptoms</Text>
            <View style={styles.symptomsList}>
              {student.symptoms.map((symptom, index) => (
                <View key={index} style={styles.symptomItem}>
                  <Icon name="circle-small" size={20} color="#4ECDC4" />
                  <Text style={styles.symptomText}>{symptom}</Text>
                </View>
              ))}
            </View>

            {/* Risk Factors */}
            <Text style={styles.sectionTitle}>Risk Factors</Text>
            <View style={styles.symptomsList}>
              {student.riskFactors.map((factor, index) => (
                <View key={index} style={styles.symptomItem}>
                  <Icon name="circle-small" size={20} color="#FF6B9D" />
                  <Text style={styles.symptomText}>{factor}</Text>
                </View>
              ))}
            </View>

            {/* Contact Information */}
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.infoCard}>
              <InfoRow 
                icon="email" 
                label="Email" 
                value={student.email} 
                iconColor="#2196F3" 
              />
              <InfoRow 
                icon="phone" 
                label="Phone" 
                value={student.phone} 
                iconColor="#4CAF50" 
              />
              <InfoRow 
                icon="account-alert" 
                label="Emergency Contact" 
                value={`${student.emergencyContactName}\n${student.emergencyContact}`} 
                iconColor="#F57C00" 
              />
              <InfoRow 
                icon="account-supervisor" 
                label="Assigned Mentor" 
                value={`${student.mentorName}\n${student.mentorEmail}`} 
                iconColor="#6C63FF" 
              />
            </View>
          </View>
        )}

        {selectedTab === 'history' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Progress Chart</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={chartData}
                width={width - 60}
                height={220}
                chartConfig={{
                  backgroundColor: '#FFF',
                  backgroundGradientFrom: '#FFF',
                  backgroundGradientTo: '#FFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(95, 109, 126, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#4ECDC4'
                  }
                }}
                bezier
                style={styles.chart}
              />
            </View>

            <Text style={styles.sectionTitle}>Assessment History</Text>
            <View style={styles.historyList}>
              {student.progressHistory.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <View style={[
                      styles.historyDot,
                      { backgroundColor: getSeverityColor(item.score) }
                    ]} />
                    <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
                  </View>
                  <View style={[
                    styles.historyScore,
                    { backgroundColor: getSeverityColor(item.score) }
                  ]}>
                    <Text style={styles.historyScoreText}>{item.score}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'sessions' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <View style={styles.sessionsContainer}>
              {student.recentSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('SessionNotes', { studentId })}
            >
              <Text style={styles.viewAllButtonText}>View All Sessions</Text>
              <Icon name="chevron-right" size={20} color="#4ECDC4" />
            </TouchableOpacity>
          </View>
        )}

        {selectedTab === 'treatment' && (
          <View style={styles.tabContent}>
            <View style={styles.emptyTreatmentContainer}>
              <Icon name="clipboard-text-outline" size={80} color="#BDC3C7" />
              <Text style={styles.emptyTreatmentTitle}>Treatment Plan</Text>
              <Text style={styles.emptyTreatmentText}>
                Create a comprehensive treatment plan for this student
              </Text>
              <TouchableOpacity 
                style={styles.createPlanButton}
                onPress={handleUpdateTreatment}
              >
                <Icon name="plus" size={20} color="#FFF" />
                <Text style={styles.createPlanButtonText}>Create Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 10,
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
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
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
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLargeText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  studentRoll: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  studentDept: {
    fontSize: 14,
    color: '#95A5A6',
    marginBottom: 12,
  },
  priorityBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    minWidth: 90,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
    marginTop: 6,
  },
  statusCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  statusStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusStatItem: {
    alignItems: 'center',
  },
  statusStatLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 6,
  },
  statusStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 4,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#E8FFFE',
  },
  tabText: {
    fontSize: 13,
    color: '#95A5A6',
    marginLeft: 6,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#4ECDC4',
  },
  tabContent: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
    marginTop: 10,
  },
  issuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  issueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  issueTagText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  symptomsList: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 14,
    color: '#2C3E50',
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#95A5A6',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chart: {
    borderRadius: 16,
  },
  historyList: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  historyScore: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  historyScoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  sessionsContainer: {
    marginBottom: 15,
  },
  sessionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sessionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  sessionDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8FFFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionDurationText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
    marginLeft: 4,
  },
  sessionNotes: {
    fontSize: 14,
    color: '#5D6D7E',
    lineHeight: 20,
    marginBottom: 12,
  },
  sessionFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sessionOutcome: {
    fontSize: 13,
    color: '#388E3C',
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8FFFE',
    paddingVertical: 14,
    borderRadius: 12,
  },
  viewAllButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginRight: 6,
  },
  emptyTreatmentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emptyTreatmentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTreatmentText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    marginBottom: 20,
  },
  createPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createPlanButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
});

export default StudentCaseScreen;