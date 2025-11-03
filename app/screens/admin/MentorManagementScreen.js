// app/screens/admin/MentorManagementScreen.js
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
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { MAX_STUDENTS_PER_MENTOR } from '../../../constants/severityThresholds';

const MentorManagementScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, available, full, inactive
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      // API call
      // const response = await adminService.getMentors();
      
      // Mock data
      const mockMentors = [
        {
          id: 'M001',
          name: 'Dr. Ananya Sharma',
          email: 'ananya.sharma@university.edu',
          phone: '+91 98765 43210',
          department: 'Psychology',
          specialization: ['Stress Management', 'Academic Counseling', 'Anxiety'],
          experience: 8,
          assignedStudents: 18,
          maxStudents: MAX_STUDENTS_PER_MENTOR,
          status: 'active',
          rating: 4.8,
          joinDate: '2022-06-15',
          totalSessions: 245,
          criticalCases: 3,
        },
        {
          id: 'M002',
          name: 'Dr. Rajesh Verma',
          email: 'rajesh.verma@university.edu',
          phone: '+91 98765 43211',
          department: 'Psychology',
          specialization: ['Depression', 'Behavioral Therapy', 'PTSD'],
          experience: 12,
          assignedStudents: 20,
          maxStudents: MAX_STUDENTS_PER_MENTOR,
          status: 'active',
          rating: 4.9,
          joinDate: '2020-08-20',
          totalSessions: 380,
          criticalCases: 5,
        },
        {
          id: 'M003',
          name: 'Dr. Priya Singh',
          email: 'priya.singh@university.edu',
          phone: '+91 98765 43212',
          department: 'Counseling',
          specialization: ['Career Counseling', 'Relationship Issues', 'Self-Esteem'],
          experience: 6,
          assignedStudents: 15,
          maxStudents: MAX_STUDENTS_PER_MENTOR,
          status: 'active',
          rating: 4.7,
          joinDate: '2023-01-10',
          totalSessions: 180,
          criticalCases: 2,
        },
        {
          id: 'M004',
          name: 'Dr. Amit Kumar',
          email: 'amit.kumar@university.edu',
          phone: '+91 98765 43213',
          department: 'Psychology',
          specialization: ['Trauma', 'Addiction', 'Family Therapy'],
          experience: 10,
          assignedStudents: 12,
          maxStudents: MAX_STUDENTS_PER_MENTOR,
          status: 'active',
          rating: 4.6,
          joinDate: '2021-03-15',
          totalSessions: 290,
          criticalCases: 4,
        },
        {
          id: 'M005',
          name: 'Dr. Sneha Patel',
          email: 'sneha.patel@university.edu',
          phone: '+91 98765 43214',
          department: 'Counseling',
          specialization: ['Academic Stress', 'Test Anxiety', 'Time Management'],
          experience: 5,
          assignedStudents: 0,
          maxStudents: MAX_STUDENTS_PER_MENTOR,
          status: 'inactive',
          rating: 4.5,
          joinDate: '2023-09-01',
          totalSessions: 45,
          criticalCases: 0,
        },
      ];

      setMentors(mockMentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMentors();
    setRefreshing(false);
  };

  const handleAddMentor = () => {
    Alert.alert('Add Mentor', 'Add mentor feature coming soon!');
  };

  const handleViewDetails = (mentor) => {
    setSelectedMentor(mentor);
    setModalVisible(true);
  };

  const handleAssignStudents = (mentor) => {
    if (mentor.assignedStudents >= mentor.maxStudents) {
      Alert.alert('Full Capacity', `${mentor.name} has reached maximum capacity of ${MAX_STUDENTS_PER_MENTOR} students.`);
      return;
    }
    setSelectedMentor(mentor);
    setAssignModalVisible(true);
  };

  const handleDeactivate = (mentorId) => {
    Alert.alert(
      'Deactivate Mentor',
      'Are you sure you want to deactivate this mentor? Their students will need to be reassigned.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: () => {
            // API call to deactivate
            Alert.alert('Success', 'Mentor deactivated successfully');
            fetchMentors();
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#388E3C';
      case 'inactive': return '#95A5A6';
      default: return '#FFA726';
    }
  };

  const getCapacityColor = (assigned, max) => {
    const percentage = (assigned / max) * 100;
    if (percentage >= 100) return '#D32F2F';
    if (percentage >= 80) return '#F57C00';
    if (percentage >= 50) return '#FBC02D';
    return '#388E3C';
  };

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === value && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(value)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.filterText,
        selectedFilter === value && styles.filterTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const MentorCard = ({ mentor }) => {
    const capacityPercentage = (mentor.assignedStudents / mentor.maxStudents) * 100;
    
    return (
      <TouchableOpacity
        style={styles.mentorCard}
        onPress={() => handleViewDetails(mentor)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.mentorInfo}>
              <Text style={styles.mentorName}>{mentor.name}</Text>
              <Text style={styles.mentorDepartment}>{mentor.department}</Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={14} color="#FFA726" />
                <Text style={styles.ratingText}>{mentor.rating}</Text>
                <Text style={styles.experienceText}>• {mentor.experience} yrs exp</Text>
              </View>
            </View>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(mentor.status) + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(mentor.status) }
            ]}>
              {mentor.status}
            </Text>
          </View>
        </View>

        {/* Capacity */}
        <View style={styles.capacitySection}>
          <View style={styles.capacityHeader}>
            <Text style={styles.capacityLabel}>Student Capacity</Text>
            <Text style={styles.capacityCount}>
              {mentor.assignedStudents}/{mentor.maxStudents}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${capacityPercentage}%`,
                  backgroundColor: getCapacityColor(mentor.assignedStudents, mentor.maxStudents)
                }
              ]} 
            />
          </View>
        </View>

        {/* Specialization Tags */}
        <View style={styles.specializationContainer}>
          {mentor.specialization.slice(0, 3).map((spec, index) => (
            <View key={index} style={styles.specTag}>
              <Text style={styles.specText}>{spec}</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="calendar-check" size={16} color="#6C63FF" />
            <Text style={styles.statText}>{mentor.totalSessions} sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="alert-circle" size={16} color="#D32F2F" />
            <Text style={styles.statText}>{mentor.criticalCases} critical</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              mentor.assignedStudents >= mentor.maxStudents && styles.actionButtonDisabled
            ]}
            onPress={() => handleAssignStudents(mentor)}
            disabled={mentor.assignedStudents >= mentor.maxStudents}
          >
            <Icon name="account-plus" size={18} color={mentor.assignedStudents >= mentor.maxStudents ? '#95A5A6' : '#6C63FF'} />
            <Text style={[
              styles.actionButtonText,
              mentor.assignedStudents >= mentor.maxStudents && styles.actionButtonTextDisabled
            ]}>
              Assign
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleViewDetails(mentor)}
          >
            <Icon name="eye" size={18} color="#4ECDC4" />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeactivate(mentor.id)}
          >
            <Icon name="account-off" size={18} color="#D32F2F" />
            <Text style={[styles.actionButtonText, { color: '#D32F2F' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredMentors = mentors.filter(mentor => {
    // Apply filter
    if (selectedFilter === 'available' && mentor.assignedStudents >= mentor.maxStudents) return false;
    if (selectedFilter === 'full' && mentor.assignedStudents < mentor.maxStudents) return false;
    if (selectedFilter === 'inactive' && mentor.status !== 'inactive') return false;
    if (selectedFilter === 'all' && mentor.status === 'inactive') return false;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        mentor.name.toLowerCase().includes(query) ||
        mentor.email.toLowerCase().includes(query) ||
        mentor.department.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const availableCount = mentors.filter(m => m.assignedStudents < m.maxStudents && m.status === 'active').length;
  const fullCount = mentors.filter(m => m.assignedStudents >= m.maxStudents).length;
  const inactiveCount = mentors.filter(m => m.status === 'inactive').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA726" />

      {/* Header */}
      <LinearGradient
        colors={['#FFA726', '#FB8C00']}
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
            <Text style={styles.headerTitle}>Mentor Management</Text>
            <Text style={styles.headerSubtitle}>{mentors.length} mentors</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddMentor}
          >
            <Icon name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#95A5A6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search mentors..."
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
          <FilterButton label="Active" value="all" />
          <FilterButton label={`Available (${availableCount})`} value="available" />
          <FilterButton label={`Full (${fullCount})`} value="full" />
          <FilterButton label={`Inactive (${inactiveCount})`} value="inactive" />
        </ScrollView>
      </View>

      {/* Mentors List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredMentors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="account-search" size={80} color="#BDC3C7" />
            <Text style={styles.emptyTitle}>No Mentors Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery.trim() 
                ? 'Try adjusting your search query'
                : 'Add mentors to start managing assignments'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.mentorsList}>
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Mentor Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mentor Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            {selectedMentor && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalAvatar}>
                  <Text style={styles.modalAvatarText}>
                    {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <Text style={styles.modalName}>{selectedMentor.name}</Text>
                <Text style={styles.modalEmail}>{selectedMentor.email}</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Contact</Text>
                  <Text style={styles.modalText}>Phone: {selectedMentor.phone}</Text>
                  <Text style={styles.modalText}>Department: {selectedMentor.department}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Specialization</Text>
                  {selectedMentor.specialization.map((spec, index) => (
                    <Text key={index} style={styles.modalText}>• {spec}</Text>
                  ))}
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Statistics</Text>
                  <Text style={styles.modalText}>Experience: {selectedMentor.experience} years</Text>
                  <Text style={styles.modalText}>Rating: {selectedMentor.rating}/5.0</Text>
                  <Text style={styles.modalText}>Total Sessions: {selectedMentor.totalSessions}</Text>
                  <Text style={styles.modalText}>Assigned Students: {selectedMentor.assignedStudents}/{selectedMentor.maxStudents}</Text>
                  <Text style={styles.modalText}>Critical Cases: {selectedMentor.criticalCases}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(false);
                    handleAssignStudents(selectedMentor);
                  }}
                >
                  <Text style={styles.modalButtonText}>Assign Students</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Assign Students Modal */}
      <Modal
        visible={assignModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAssignModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Students</Text>
              <TouchableOpacity onPress={() => setAssignModalVisible(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            {selectedMentor && (
              <View>
                <Text style={styles.assignInfo}>
                  Assigning students to {selectedMentor.name}
                </Text>
                <Text style={styles.assignCapacity}>
                  Current: {selectedMentor.assignedStudents}/{selectedMentor.maxStudents} students
                </Text>
                <Text style={styles.assignAvailable}>
                  Available slots: {selectedMentor.maxStudents - selectedMentor.assignedStudents}
                </Text>

                {/* Student selection would go here */}
                <View style={styles.assignPlaceholder}>
                  <Icon name="account-multiple-plus" size={60} color="#BDC3C7" />
                  <Text style={styles.assignPlaceholderText}>
                    Student selection interface coming soon
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={() => {
                    Alert.alert('Success', 'Students assigned successfully!');
                    setAssignModalVisible(false);
                    fetchMentors();
                  }}
                >
                  <Text style={styles.modalButtonText}>Confirm Assignment</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  addButton: {
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#FFA726',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D6D7E',
  },
  filterTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  mentorsList: {
    padding: 20,
  },
  mentorCard: {
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
    backgroundColor: '#FFA726',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  mentorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  mentorDepartment: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 4,
  },
  experienceText: {
    fontSize: 12,
    color: '#95A5A6',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  capacitySection: {
    marginBottom: 12,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  capacityLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  capacityCount: {
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
  specializationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  specTag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  specText: {
    fontSize: 11,
    color: '#5D6D7E',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 6,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 6,
  },
  actionButtonTextDisabled: {
    color: '#95A5A6',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFA726',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalEmail: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#5D6D7E',
    marginBottom: 4,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#FFA726',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  assignInfo: {
    fontSize: 14,
    color: '#5D6D7E',
    marginBottom: 8,
  },
  assignCapacity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  assignAvailable: {
    fontSize: 14,
    color: '#388E3C',
    fontWeight: '600',
    marginBottom: 20,
  },
  assignPlaceholder: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 20,
  },
  assignPlaceholderText: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default MentorManagementScreen;