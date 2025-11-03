// app/screens/mentor/MyStudentsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  RefreshControl,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import {
  getSeverityLevel,
  getSeverityColor,
  SEVERITY_LEVELS,
} from '../../../constants/severityThresholds';

const MyStudentsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(route.params?.filter || 'all');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterAndSearchStudents();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [students, searchQuery, selectedFilter]);

  const fetchStudents = async () => {
    try {
      // API call to fetch mentor's students
      // const response = await mentorService.getMyStudents(user.id);
      
      // Mock data
      const mockStudents = [
        {
          id: 'S001',
          name: 'Priya Kumar',
          email: 'priya.kumar@university.edu',
          department: 'Computer Science',
          year: '3rd Year',
          rollNumber: 'CS2021001',
          avatar: null,
          initials: 'PK',
          lastAssessmentDate: '2024-10-27T08:30:00',
          lastScore: 28,
          previousScore: 65,
          trend: 'declining',
          assessmentCount: 12,
          hasCounselor: true,
          counselorName: 'Dr. Rajesh Mehta',
          riskLevel: 'critical',
          lastContact: '2024-10-25T14:00:00',
        },
        {
          id: 'S002',
          name: 'Rahul Sharma',
          email: 'rahul.sharma@university.edu',
          department: 'Electronics',
          year: '2nd Year',
          rollNumber: 'EC2022015',
          avatar: null,
          initials: 'RS',
          lastAssessmentDate: '2024-10-26T15:00:00',
          lastScore: 32,
          previousScore: 48,
          trend: 'declining',
          assessmentCount: 8,
          hasCounselor: true,
          counselorName: 'Dr. Rajesh Mehta',
          riskLevel: 'critical',
          lastContact: '2024-10-26T10:00:00',
        },
        {
          id: 'S003',
          name: 'Anjali Patel',
          email: 'anjali.patel@university.edu',
          department: 'Mechanical',
          year: '4th Year',
          rollNumber: 'ME2020045',
          avatar: null,
          initials: 'AP',
          lastAssessmentDate: '2024-10-23T11:00:00',
          lastScore: 55,
          previousScore: 68,
          trend: 'declining',
          assessmentCount: 15,
          hasCounselor: false,
          riskLevel: 'moderate',
          lastContact: '2024-10-24T16:00:00',
        },
        {
          id: 'S004',
          name: 'Arjun Reddy',
          email: 'arjun.reddy@university.edu',
          department: 'Civil Engineering',
          year: '3rd Year',
          rollNumber: 'CE2021032',
          avatar: null,
          initials: 'AR',
          lastAssessmentDate: '2024-10-26T14:30:00',
          lastScore: 38,
          previousScore: 42,
          trend: 'stable',
          assessmentCount: 10,
          hasCounselor: true,
          counselorName: 'Dr. Priya Singh',
          riskLevel: 'high',
          lastContact: '2024-10-26T09:00:00',
        },
        {
          id: 'S005',
          name: 'Meera Singh',
          email: 'meera.singh@university.edu',
          department: 'Computer Science',
          year: '2nd Year',
          rollNumber: 'CS2022008',
          avatar: null,
          initials: 'MS',
          lastAssessmentDate: '2024-10-26T10:00:00',
          lastScore: 52,
          previousScore: 68,
          trend: 'declining',
          assessmentCount: 9,
          hasCounselor: false,
          riskLevel: 'moderate',
          lastContact: '2024-10-25T11:00:00',
        },
        {
          id: 'S006',
          name: 'Vikram Malhotra',
          email: 'vikram.m@university.edu',
          department: 'Electronics',
          year: '3rd Year',
          rollNumber: 'EC2021019',
          avatar: null,
          initials: 'VM',
          lastAssessmentDate: '2024-10-25T16:45:00',
          lastScore: 72,
          previousScore: 70,
          trend: 'improving',
          assessmentCount: 11,
          hasCounselor: false,
          riskLevel: 'low',
          lastContact: '2024-10-25T13:00:00',
        },
        {
          id: 'S007',
          name: 'Sneha Desai',
          email: 'sneha.desai@university.edu',
          department: 'Computer Science',
          year: '4th Year',
          rollNumber: 'CS2020012',
          avatar: null,
          initials: 'SD',
          lastAssessmentDate: '2024-10-27T09:00:00',
          lastScore: 85,
          previousScore: 82,
          trend: 'improving',
          assessmentCount: 14,
          hasCounselor: false,
          riskLevel: 'healthy',
          lastContact: '2024-10-26T15:00:00',
        },
        {
          id: 'S008',
          name: 'Karthik Iyer',
          email: 'karthik.iyer@university.edu',
          department: 'Mechanical',
          year: '2nd Year',
          rollNumber: 'ME2022028',
          avatar: null,
          initials: 'KI',
          lastAssessmentDate: '2024-10-26T13:00:00',
          lastScore: 78,
          previousScore: 75,
          trend: 'stable',
          assessmentCount: 7,
          hasCounselor: false,
          riskLevel: 'healthy',
          lastContact: '2024-10-26T12:00:00',
        },
      ];

      setStudents(mockStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const filterAndSearchStudents = () => {
    let filtered = [...students];

    // Apply filter
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'critical':
          filtered = filtered.filter(s => s.riskLevel === 'critical');
          break;
        case 'attention':
          filtered = filtered.filter(s => s.riskLevel === 'high' || s.riskLevel === 'moderate');
          break;
        case 'healthy':
          filtered = filtered.filter(s => s.riskLevel === 'healthy' || s.riskLevel === 'low');
          break;
        case 'counselor':
          filtered = filtered.filter(s => s.hasCounselor);
          break;
      }
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.name.toLowerCase().includes(query) ||
          s.department.toLowerCase().includes(query) ||
          s.rollNumber.toLowerCase().includes(query)
      );
    }

    setFilteredStudents(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return 'trending-up';
      case 'declining': return 'trending-down';
      default: return 'trending-neutral';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return '#388E3C';
      case 'declining': return '#D32F2F';
      default: return '#95A5A6';
    }
  };

  const FilterButton = ({ label, value, icon }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === value && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(value)}
      activeOpacity={0.7}
    >
      <Icon 
        name={icon} 
        size={18} 
        color={selectedFilter === value ? '#FFF' : '#5D6D7E'} 
      />
      <Text style={[
        styles.filterText,
        selectedFilter === value && styles.filterTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const StudentCard = ({ student }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => navigation.navigate('StudentDetail', { studentId: student.id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={[
            styles.avatarContainer,
            { backgroundColor: getSeverityColor(student.lastScore) + '20' }
          ]}>
            <Text style={[
              styles.avatarText,
              { color: getSeverityColor(student.lastScore) }
            ]}>
              {student.initials}
            </Text>
          </View>

          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentDetails}>
              {student.rollNumber} • {student.year}
            </Text>
            <Text style={styles.studentDepartment}>{student.department}</Text>
          </View>
        </View>

        <View style={styles.cardRight}>
          <View style={[
            styles.scoreBadge,
            { backgroundColor: getSeverityColor(student.lastScore) }
          ]}>
            <Text style={styles.scoreText}>{student.lastScore}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Icon 
              name={getTrendIcon(student.trend)} 
              size={16} 
              color={getTrendColor(student.trend)} 
            />
            <Text style={[styles.metricText, { color: getTrendColor(student.trend) }]}>
              {student.trend}
            </Text>
          </View>

          <View style={styles.metric}>
            <Icon name="clipboard-text" size={16} color="#7F8C8D" />
            <Text style={styles.metricText}>{student.assessmentCount} tests</Text>
          </View>

          {student.hasCounselor && (
            <View style={styles.metric}>
              <Icon name="account-heart" size={16} color="#FF6B9D" />
              <Text style={[styles.metricText, { color: '#FF6B9D' }]}>Counselor</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.lastContact}>
            <Icon name="clock-outline" size={14} color="#95A5A6" />
            <Text style={styles.lastContactText}>
              Last contact: {formatDate(student.lastContact)}
            </Text>
          </View>

          <View style={[
            styles.riskBadge,
            { backgroundColor: getSeverityColor(student.lastScore) + '15' }
          ]}>
            <Text style={[
              styles.riskText,
              { color: getSeverityColor(student.lastScore) }
            ]}>
              {student.riskLevel}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const criticalCount = students.filter(s => s.riskLevel === 'critical').length;
  const attentionCount = students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'moderate').length;
  const healthyCount = students.filter(s => s.riskLevel === 'healthy' || s.riskLevel === 'low').length;
  const counselorCount = students.filter(s => s.hasCounselor).length;

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
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>My Students</Text>
            <Text style={styles.headerSubtitle}>{students.length} / 20 students</Text>
          </View>
          <TouchableOpacity style={styles.headerIconButton}>
            <Icon name="sort" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#95A5A6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, roll number, or department"
            placeholderTextColor="#95A5A6"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color="#95A5A6" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <FilterButton label="All" value="all" icon="account-group" />
          <FilterButton 
            label={`Critical (${criticalCount})`} 
            value="critical" 
            icon="alert-circle" 
          />
          <FilterButton 
            label={`Attention (${attentionCount})`} 
            value="attention" 
            icon="exclamation" 
          />
          <FilterButton 
            label={`Healthy (${healthyCount})`} 
            value="healthy" 
            icon="emoticon-happy" 
          />
          <FilterButton 
            label={`With Counselor (${counselorCount})`} 
            value="counselor" 
            icon="account-heart" 
          />
        </ScrollView>
      </View>

      {/* Students List */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredStudents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="account-search" size={80} color="#BDC3C7" />
              <Text style={styles.emptyTitle}>No Students Found</Text>
              <Text style={styles.emptyText}>
                {searchQuery.trim() 
                  ? 'Try adjusting your search query'
                  : 'No students match the selected filter'
                }
              </Text>
            </View>
          ) : (
            <View style={styles.studentsList}>
              <Text style={styles.resultsText}>
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
              </Text>
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      </Animated.View>
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
    marginBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 2,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 10,
    paddingVertical: 0,
  },
  filterContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterScrollContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#6C63FF',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5D6D7E',
    marginLeft: 6,
  },
  filterTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  studentsList: {
    padding: 20,
  },
  resultsText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 15,
    fontWeight: '600',
  },
  studentCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  studentDetails: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  studentDepartment: {
    fontSize: 12,
    color: '#95A5A6',
  },
  cardRight: {
    justifyContent: 'center',
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardBody: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  metricRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  metricText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastContact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastContactText: {
    fontSize: 11,
    color: '#95A5A6',
    marginLeft: 4,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MyStudentsScreen;