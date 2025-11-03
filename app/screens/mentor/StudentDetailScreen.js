// app/screens/mentor/StudentDetailScreen.js
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

const StudentDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { studentId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [student, setStudent] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview'); // overview, history, notes

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      // API call
      // const response = await mentorService.getStudentDetail(studentId);
      
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
        previousScore: 65,
        trend: 'declining',
        assessmentCount: 12,
        hasCounselor: true,
        counselorName: 'Dr. Rajesh Mehta',
        counselorContact: 'rajesh.mehta@university.edu',
        riskLevel: 'critical',
        lastAssessmentDate: '2024-10-27T08:30:00',
        joinDate: '2024-06-15T00:00:00',
        address: '123 Campus Road, University Quarters',
        emergencyContact: '+91 98765 98765',
        emergencyContactName: 'Mrs. Kumar (Mother)',
      };

      const mockHistory = [
        { date: '2024-10-27', score: 28, category: 'critical' },
        { date: '2024-10-20', score: 35, category: 'critical' },
        { date: '2024-10-13', score: 42, category: 'moderate' },
        { date: '2024-10-06', score: 48, category: 'moderate' },
        { date: '2024-09-29', score: 55, category: 'moderate' },
        { date: '2024-09-22', score: 58, category: 'moderate' },
        { date: '2024-09-15', score: 62, category: 'moderate' },
        { date: '2024-09-08', score: 65, category: 'low' },
      ];

      setStudent(mockStudent);
      setAssessmentHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudentDetails();
    setRefreshing(false);
  };

  const handleAddNote = () => {
    Alert.alert(
      'Add Note',
      'This will open the note editor',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => navigation.navigate('Notes', { studentId }) }
      ]
    );
  };

  const handleContactStudent = () => {
    Alert.alert(
      'Contact Student',
      'Choose a method to contact',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {} },
        { text: 'Email', onPress: () => {} }
      ]
    );
  };

  const handleRefer = () => {
    Alert.alert(
      'Refer to Counselor',
      'Are you sure you want to refer this student to a counselor?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Refer', onPress: () => Alert.alert('Success', 'Student referred to counselor') }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
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
        color={selectedTab === value ? '#6C63FF' : '#95A5A6'} 
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

  const AssessmentItem = ({ item, index }) => (
    <View style={styles.assessmentItem}>
      <View style={styles.assessmentLeft}>
        <View style={[
          styles.assessmentDot,
          { backgroundColor: getSeverityColor(item.score) }
        ]} />
        <View>
          <Text style={styles.assessmentDate}>{formatDate(item.date)}</Text>
          <Text style={styles.assessmentCategory}>{item.category} risk</Text>
        </View>
      </View>
      <View style={[
        styles.assessmentScore,
        { backgroundColor: getSeverityColor(item.score) }
      ]}>
        <Text style={styles.assessmentScoreText}>{item.score}%</Text>
      </View>
    </View>
  );

  if (!student) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
        <View style={styles.loadingContainer}>
          <Icon name="loading" size={40} color="#6C63FF" />
          <Text style={styles.loadingText}>Loading student details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const chartData = {
    labels: assessmentHistory.slice().reverse().map(item => 
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: assessmentHistory.slice().reverse().map(item => item.score),
      color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
      strokeWidth: 3
    }]
  };

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
          <Text style={styles.headerTitle}>Student Details</Text>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={() => Alert.alert('More Options', 'Additional actions')}
          >
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

          {/* Current Score */}
          <View style={styles.currentScoreContainer}>
            <Text style={styles.currentScoreLabel}>Current Mental Health Score</Text>
            <Text style={[
              styles.currentScore,
              { color: getSeverityColor(student.currentScore) }
            ]}>
              {student.currentScore}%
            </Text>
            <View style={styles.scoreChange}>
              <Icon 
                name={student.currentScore < student.previousScore ? 'trending-down' : 'trending-up'} 
                size={16} 
                color={student.currentScore < student.previousScore ? '#D32F2F' : '#388E3C'} 
              />
              <Text style={[
                styles.scoreChangeText,
                { color: student.currentScore < student.previousScore ? '#D32F2F' : '#388E3C' }
              ]}>
                {Math.abs(student.currentScore - student.previousScore)}% from last assessment
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleContactStudent}
            >
              <Icon name="phone" size={20} color="#6C63FF" />
              <Text style={styles.actionButtonText}>Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAddNote}
            >
              <Icon name="note-plus" size={20} color="#4CAF50" />
              <Text style={styles.actionButtonText}>Add Note</Text>
            </TouchableOpacity>

            {!student.hasCounselor && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleRefer}
              >
                <Icon name="account-heart" size={20} color="#FF6B9D" />
                <Text style={styles.actionButtonText}>Refer</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Counselor Info */}
        {student.hasCounselor && (
          <View style={styles.counselorCard}>
            <View style={styles.counselorHeader}>
              <Icon name="account-heart" size={24} color="#FF6B9D" />
              <Text style={styles.counselorTitle}>Assigned Counselor</Text>
            </View>
            <Text style={styles.counselorName}>{student.counselorName}</Text>
            <Text style={styles.counselorContact}>{student.counselorContact}</Text>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TabButton label="Overview" value="overview" icon="information" />
          <TabButton label="History" value="history" icon="chart-line" />
          <TabButton label="Notes" value="notes" icon="notebook" />
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
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
                icon="home" 
                label="Address" 
                value={student.address} 
                iconColor="#FF6B9D" 
              />
              <InfoRow 
                icon="account-alert" 
                label="Emergency Contact" 
                value={`${student.emergencyContactName}\n${student.emergencyContact}`} 
                iconColor="#F57C00" 
              />
            </View>

            <Text style={styles.sectionTitle}>Assessment Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Icon name="clipboard-text" size={28} color="#6C63FF" />
                <Text style={styles.statValue}>{student.assessmentCount}</Text>
                <Text style={styles.statLabel}>Total Tests</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="calendar" size={28} color="#4CAF50" />
                <Text style={styles.statValue}>{formatDate(student.lastAssessmentDate)}</Text>
                <Text style={styles.statLabel}>Last Test</Text>
              </View>
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
                  color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(95, 109, 126, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#6C63FF'
                  }
                }}
                bezier
                style={styles.chart}
              />
            </View>

            <Text style={styles.sectionTitle}>Assessment History</Text>
            <View style={styles.historyList}>
              {assessmentHistory.map((item, index) => (
                <AssessmentItem key={index} item={item} index={index} />
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'notes' && (
          <View style={styles.tabContent}>
            <View style={styles.emptyNotesContainer}>
              <Icon name="notebook-outline" size={80} color="#BDC3C7" />
              <Text style={styles.emptyNotesTitle}>No Notes Yet</Text>
              <Text style={styles.emptyNotesText}>
                Add notes about your interactions and observations
              </Text>
              <TouchableOpacity 
                style={styles.addNoteButton}
                onPress={handleAddNote}
              >
                <Icon name="plus" size={20} color="#FFF" />
                <Text style={styles.addNoteButtonText}>Add First Note</Text>
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
    marginBottom: 20,
  },
  currentScoreContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    width: '100%',
    marginBottom: 20,
  },
  currentScoreLabel: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  currentScore: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreChangeText: {
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '600',
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
  counselorCard: {
    backgroundColor: '#FFF8F5',
    borderRadius: 16,
    padding: 16,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  counselorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  counselorTitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 8,
    fontWeight: '600',
  },
  counselorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  counselorContact: {
    fontSize: 13,
    color: '#5D6D7E',
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
    backgroundColor: '#F0EFFF',
  },
  tabText: {
    fontSize: 14,
    color: '#95A5A6',
    marginLeft: 6,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#6C63FF',
  },
  tabContent: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
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
  assessmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  assessmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assessmentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  assessmentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  assessmentCategory: {
    fontSize: 12,
    color: '#7F8C8D',
    textTransform: 'capitalize',
  },
  assessmentScore: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  assessmentScoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  emptyNotesContainer: {
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
  emptyNotesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyNotesText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    marginBottom: 20,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addNoteButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
});

export default StudentDetailScreen;