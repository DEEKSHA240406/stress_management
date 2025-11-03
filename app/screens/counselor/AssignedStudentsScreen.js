// app/screens/counselor/AssignedStudentsScreen.js
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
import { getSeverityColor, getSeverityLevel } from '../../../constants/severityThresholds';

const AssignedStudentsScreen = () => {
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
      // API call
      // const response = await counselorService.getAssignedStudents(user.id);
      
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
          currentScore: 28,
          assignedDate: '2024-10-25T00:00:00',
          lastSession: '2024-10-26T10:00:00',
          nextSession: '2024-10-28T10:00:00',
          status: 'active',
          priority: 'critical',
          sessionsCompleted: 3,
          totalSessions: 8,
          mentorName: 'Dr. Ananya Sharma',
          issues: ['Severe Anxiety', 'Academic Stress'],
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
          currentScore: 32,
          assignedDate: '2024-10-20T00:00:00',
          lastSession: '2024-10-25T14:00:00',
          nextSession: '2024-10-29T15:00:00',
          status: 'active',
          priority: 'critical',
          sessionsCompleted: 4,
          totalSessions: 10,
          mentorName: 'Dr. Ananya Sharma',
          issues: ['Depression', 'Social Isolation'],
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
          currentScore: 38,
          assignedDate: '2024-10-18T00:00:00',
          lastSession: '2024-10-24T11:00:00',
          nextSession: '2024-10-30T11:00:00',
          status: 'active',
          priority: 'high',
          sessionsCompleted: 5,
          totalSessions: 8,
          mentorName: 'Dr. Ananya Sharma',
          issues: ['Academic Pressure', 'Performance Anxiety'],
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
          currentScore: 55,
          assignedDate: '2024-09-15T00:00:00',
          lastSession: '2024-10-22T09:00:00',
          nextSession: null,
          status: 'completed',
          priority: 'low',
          sessionsCompleted: 8,
          totalSessions: 8,
          mentorName: 'Dr. Ananya Sharma',
          issues: ['Stress Management'],
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
        case 'active':
          filtered = filtered.filter(s => s.status === 'active');
          break;
        case 'completed':
          filtered = filtered.filter(s => s.status === 'completed');
          break;
        case 'critical':
          filtered = filtered.filter(s => s.priority === 'critical');
          break;
        case 'high':
          filtered = filtered.filter(s => s.priority === 'high');
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
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#D32F2F';
      case 'high': return '#F57C00';
      case 'medium': return '#FBC02D';
      default: return '#388E3C';
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
      onPress={() => navigation.navigate('StudentCase', { studentId: student.id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={[
            styles.avatarContainer,
            { backgroundColor: getSeverityColor(student.currentScore) + '20' }
          ]}>
            <Text style={[
              styles.avatarText,
              { color: getSeverityColor(student.currentScore) }
            ]}>
              {student.initials}
            </Text>
          </View>

          <View style={styles.studentInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.studentName}>{student.name}</Text>
              {student.status === 'active' && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Active</Text>
                </View>
              )}
            </View>
            <Text style={styles.studentDetails}>
              {student.rollNumber} • {student.year}
            </Text>
            <Text style={styles.studentDepartment}>{student.department}</Text>
          </View>
        </View>

        <View style={[
          styles.priorityBadge,
          { backgroundColor: getPriorityColor(student.priority) }
        ]}>
          <Icon name="alert-circle" size={16} color="#FFF" />
        </View>
      </View>

      {/* Issues */}
      <View style={styles.issuesContainer}>
        {student.issues.map((issue, index) => (
          <View key={index} style={styles.issueTag}>
            <Text style={styles.issueText}>{issue}</Text>
          </View>
        ))}
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Sessions Progress</Text>
          <Text style={styles.progressCount}>
            {student.sessionsCompleted}/{student.totalSessions}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${(student.sessionsCompleted / student.totalSessions) * 100}%`,
                backgroundColor: getPriorityColor(student.priority)
              }
            ]} 
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Icon name="calendar" size={14} color="#7F8C8D" />
          <Text style={styles.footerText}>
            Next: {formatDate(student.nextSession)}
          </Text>
        </View>
        <View style={[
          styles.scoreContainer,
          { backgroundColor: getSeverityColor(student.currentScore) + '15' }
        ]}>
          <Text style={[
            styles.scoreText,
            { color: getSeverityColor(student.currentScore) }
          ]}>
            {student.currentScore}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const activeCount = students.filter(s => s.status === 'active').length;
  const completedCount = students.filter(s => s.status === 'completed').length;
  const criticalCount = students.filter(s => s.priority === 'critical').length;
  const highCount = students.filter(s => s.priority === 'high').length;

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
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>My Cases</Text>
            <Text style={styles.headerSubtitle}>{students.length} total cases</Text>
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
            placeholder="Search by name, roll number..."
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
          <FilterButton label="All" value="all" icon="folder-account" />
          <FilterButton 
            label={`Active (${activeCount})`} 
            value="active" 
            icon="account-clock" 
          />
          <FilterButton 
            label={`Completed (${completedCount})`} 
            value="completed" 
            icon="check-circle" 
          />
          <FilterButton 
            label={`Critical (${criticalCount})`} 
            value="critical" 
            icon="alert-circle" 
          />
          <FilterButton 
            label={`High (${highCount})`} 
            value="high" 
            icon="alert" 
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
              <Icon name="folder-open" size={80} color="#BDC3C7" />
              <Text style={styles.emptyTitle}>No Cases Found</Text>
              <Text style={styles.emptyText}>
                {searchQuery.trim() 
                  ? 'Try adjusting your search query'
                  : 'No cases match the selected filter'
                }
              </Text>
            </View>
          ) : (
            <View style={styles.studentsList}>
              <Text style={styles.resultsText}>
                {filteredStudents.length} case{filteredStudents.length !== 1 ? 's' : ''} found
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
    backgroundColor: '#4ECDC4',
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#388E3C',
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
  priorityBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  issueTag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  issueText: {
    fontSize: 11,
    color: '#5D6D7E',
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  progressCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  footerText: {
    fontSize: 11,
    color: '#7F8C8D',
    marginLeft: 6,
  },
  scoreContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
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

export default AssignedStudentsScreen;