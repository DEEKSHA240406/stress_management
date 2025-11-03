// app/screens/admin/CounselorManagementScreen.js
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
import { MAX_ACTIVE_CASES_PER_COUNSELOR } from '../../../constants/severityThresholds';

const CounselorManagementScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [counselors, setCounselors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, available, full, inactive
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      // API call
      // const response = await adminService.getCounselors();
      
      // Mock data
      const mockCounselors = [
        {
          id: 'C001',
          name: 'Dr. Rajesh Mehta',
          email: 'rajesh.mehta@university.edu',
          phone: '+91 98765 54321',
          department: 'Clinical Psychology',
          specialization: ['Anxiety Disorders', 'Depression', 'Trauma'],
          license: 'RCI License #12345',
          experience: 15,
          activeCases: 12,
          maxCases: MAX_ACTIVE_CASES_PER_COUNSELOR,
          completedCases: 45,
          status: 'active',
          rating: 4.9,
          joinDate: '2019-03-15',
          totalSessions: 520,
          criticalCases: 4,
          successRate: 87,
        },
        {
          id: 'C002',
          name: 'Dr. Priya Singh',
          email: 'priya.singh@university.edu',
          phone: '+91 98765 54322',
          department: 'Counseling Psychology',
          specialization: ['Academic Stress', 'Relationship Issues', 'Self-Esteem'],
          license: 'RCI License #12346',
          experience: 10,
          activeCases: 15,
          maxCases: MAX_ACTIVE_CASES_PER_COUNSELOR,
          completedCases: 38,
          status: 'active',
          rating: 4.8,
          joinDate: '2020-06-20',
          totalSessions: 410,
          criticalCases: 5,
          successRate: 82,
        },
        {
          id: 'C003',
          name: 'Dr. Amit Sharma',
          email: 'amit.sharma@university.edu',
          phone: '+91 98765 54323',
          department: 'Clinical Psychology',
          specialization: ['PTSD', 'Addiction', 'Crisis Intervention'],
          license: 'RCI License #12347',
          experience: 12,
          activeCases: 8,
          maxCases: MAX_ACTIVE_CASES_PER_COUNSELOR,
          completedCases: 52,
          status: 'active',
          rating: 4.7,
          joinDate: '2018-09-10',
          totalSessions: 580,
          criticalCases: 3,
          successRate: 90,
        },
        {
          id: 'C004',
          name: 'Dr. Neha Kapoor',
          email: 'neha.kapoor@university.edu',
          phone: '+91 98765 54324',
          department: 'Counseling Psychology',
          specialization: ['Eating Disorders', 'Body Image', 'Social Anxiety'],
          license: 'RCI License #12348',
          experience: 8,
          activeCases: 0,
          maxCases: MAX_ACTIVE_CASES_PER_COUNSELOR,
          completedCases: 15,
          status: 'inactive',
          rating: 4.6,
          joinDate: '2022-01-15',
          totalSessions: 180,
          criticalCases: 0,
          successRate: 85,
        },
      ];

      setCounselors(mockCounselors);
    } catch (error) {
      console.error('Error fetching counselors:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCounselors();
    setRefreshing(false);
  };

  const handleAddCounselor = () => {
    Alert.alert('Add Counselor', 'Add counselor feature coming soon!');
  };

  const handleViewDetails = (counselor) => {
    setSelectedCounselor(counselor);
    setModalVisible(true);
  };

  const handleAssignCase = (counselor) => {
    if (counselor.activeCases >= counselor.maxCases) {
      Alert.alert('Full Capacity', `${counselor.name} has reached maximum capacity of ${MAX_ACTIVE_CASES_PER_COUNSELOR} active cases.`);
      return;
    }
    Alert.alert('Assign Case', 'Manual case assignment feature coming soon!');
  };

  const handleDeactivate = (counselorId) => {
    Alert.alert(
      'Deactivate Counselor',
      'Are you sure you want to deactivate this counselor? Their active cases will need to be reassigned.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Counselor deactivated successfully');
            fetchCounselors();
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#388E3C';
      case 'inactive': return '#95A5A6';
      case 'on-leave': return '#FFA726';
      default: return '#95A5A6';
    }
  };

  const getCapacityColor = (active, max) => {
    const percentage = (active / max) * 100;
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

  const CounselorCard = ({ counselor }) => {
    const capacityPercentage = (counselor.activeCases / counselor.maxCases) * 100;
    
    return (
      <TouchableOpacity
        style={styles.counselorCard}
        onPress={() => handleViewDetails(counselor)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {counselor.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.counselorInfo}>
              <Text style={styles.counselorName}>{counselor.name}</Text>
              <Text style={styles.counselorDepartment}>{counselor.department}</Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={14} color="#FFA726" />
                <Text style={styles.ratingText}>{counselor.rating}</Text>
                <Text style={styles.experienceText}>• {counselor.experience} yrs exp</Text>
              </View>
            </View>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(counselor.status) + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(counselor.status) }
            ]}>
              {counselor.status}
            </Text>
          </View>
        </View>

        {/* Capacity */}
        <View style={styles.capacitySection}>
          <View style={styles.capacityHeader}>
            <Text style={styles.capacityLabel}>Active Cases</Text>
            <Text style={styles.capacityCount}>
              {counselor.activeCases}/{counselor.maxCases}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${capacityPercentage}%`,
                  backgroundColor: getCapacityColor(counselor.activeCases, counselor.maxCases)
                }
              ]} 
            />
          </View>
        </View>

        {/* Specialization Tags */}
        <View style={styles.specializationContainer}>
          {counselor.specialization.slice(0, 3).map((spec, index) => (
            <View key={index} style={styles.specTag}>
              <Text style={styles.specText}>{spec}</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="check-circle" size={16} color="#388E3C" />
            <Text style={styles.statText}>{counselor.completedCases} completed</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="alert-circle" size={16} color="#D32F2F" />
            <Text style={styles.statText}>{counselor.criticalCases} critical</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="chart-line" size={16} color="#6C63FF" />
            <Text style={styles.statText}>{counselor.successRate}% success</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              counselor.activeCases >= counselor.maxCases && styles.actionButtonDisabled
            ]}
            onPress={() => handleAssignCase(counselor)}
            disabled={counselor.activeCases >= counselor.maxCases}
          >
            <Icon name="account-plus" size={18} color={counselor.activeCases >= counselor.maxCases ? '#95A5A6' : '#4ECDC4'} />
            <Text style={[
              styles.actionButtonText,
              counselor.activeCases >= counselor.maxCases && styles.actionButtonTextDisabled
            ]}>
              Assign
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleViewDetails(counselor)}
          >
            <Icon name="eye" size={18} color="#6C63FF" />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeactivate(counselor.id)}
          >
            <Icon name="account-off" size={18} color="#D32F2F" />
            <Text style={[styles.actionButtonText, { color: '#D32F2F' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredCounselors = counselors.filter(counselor => {
    // Apply filter
    if (selectedFilter === 'available' && counselor.activeCases >= counselor.maxCases) return false;
    if (selectedFilter === 'full' && counselor.activeCases < counselor.maxCases) return false;
    if (selectedFilter === 'inactive' && counselor.status !== 'inactive') return false;
    if (selectedFilter === 'all' && counselor.status === 'inactive') return false;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        counselor.name.toLowerCase().includes(query) ||
        counselor.email.toLowerCase().includes(query) ||
        counselor.department.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const availableCount = counselors.filter(c => c.activeCases < c.maxCases && c.status === 'active').length;
  const fullCount = counselors.filter(c => c.activeCases >= c.maxCases).length;
  const inactiveCount = counselors.filter(c => c.status === 'inactive').length;

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
            <Text style={styles.headerTitle}>Counselor Management</Text>
            <Text style={styles.headerSubtitle}>{counselors.length} counselors</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddCounselor}
          >
            <Icon name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#95A5A6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search counselors..."
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

      {/* Counselors List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredCounselors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="account-heart" size={80} color="#BDC3C7" />
            <Text style={styles.emptyTitle}>No Counselors Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery.trim() 
                ? 'Try adjusting your search query'
                : 'Add counselors to start managing cases'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.counselorsList}>
            {filteredCounselors.map((counselor) => (
              <CounselorCard key={counselor.id} counselor={counselor} />
            ))}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Counselor Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Counselor Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            {selectedCounselor && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalAvatar}>
                  <Text style={styles.modalAvatarText}>
                    {selectedCounselor.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <Text style={styles.modalName}>{selectedCounselor.name}</Text>
                <Text style={styles.modalEmail}>{selectedCounselor.email}</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Contact & Credentials</Text>
                  <Text style={styles.modalText}>Phone: {selectedCounselor.phone}</Text>
                  <Text style={styles.modalText}>Department: {selectedCounselor.department}</Text>
                  <Text style={styles.modalText}>License: {selectedCounselor.license}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Specialization</Text>
                  {selectedCounselor.specialization.map((spec, index) => (
                    <Text key={index} style={styles.modalText}>• {spec}</Text>
                  ))}
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Performance Statistics</Text>
                  <Text style={styles.modalText}>Experience: {selectedCounselor.experience} years</Text>
                  <Text style={styles.modalText}>Rating: {selectedCounselor.rating}/5.0</Text>
                  <Text style={styles.modalText}>Total Sessions: {selectedCounselor.totalSessions}</Text>
                  <Text style={styles.modalText}>Active Cases: {selectedCounselor.activeCases}/{selectedCounselor.maxCases}</Text>
                  <Text style={styles.modalText}>Completed Cases: {selectedCounselor.completedCases}</Text>
                  <Text style={styles.modalText}>Critical Cases: {selectedCounselor.criticalCases}</Text>
                  <Text style={styles.modalText}>Success Rate: {selectedCounselor.successRate}%</Text>
                </View>

                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(false);
                    handleAssignCase(selectedCounselor);
                  }}
                >
                  <Text style={styles.modalButtonText}>Assign Case</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFF', opacity: 0.8, marginTop: 2 },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#2C3E50', marginLeft: 10, paddingVertical: 0 },
  filterContainer: { backgroundColor: '#FFF', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  filterScrollContent: { paddingHorizontal: 20 },
  filterButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F5F7FA', marginRight: 10 },
  filterButtonActive: { backgroundColor: '#4ECDC4' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#5D6D7E' },
  filterTextActive: { color: '#FFF' },
  content: { flex: 1 },
  counselorsList: { padding: 20 },
  counselorCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardLeft: { flexDirection: 'row', flex: 1 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#4ECDC4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  counselorInfo: { flex: 1, justifyContent: 'center' },
  counselorName: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 2 },
  counselorDepartment: { fontSize: 13, color: '#7F8C8D', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, fontWeight: '600', color: '#2C3E50', marginLeft: 4 },
  experienceText: { fontSize: 12, color: '#95A5A6', marginLeft: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, justifyContent: 'center' },
  statusText: { fontSize: 11, fontWeight: 'bold', textTransform: 'capitalize' },
  capacitySection: { marginBottom: 12 },
  capacityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  capacityLabel: { fontSize: 12, color: '#7F8C8D', fontWeight: '600' },
  capacityCount: { fontSize: 12, fontWeight: 'bold', color: '#2C3E50' },
  progressBar: { height: 6, backgroundColor: '#E8E8E8', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  specializationContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  specTag: { backgroundColor: '#F8F9FA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 6 },
  specText: { fontSize: 11, color: '#5D6D7E', fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginBottom: 12, flexWrap: 'wrap' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 4 },
  statText: { fontSize: 12, color: '#7F8C8D', marginLeft: 6 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F8F9FA' },
  actionButtonDisabled: { opacity: 0.5 },
  actionButtonText: { fontSize: 13, fontWeight: '600', color: '#2C3E50', marginLeft: 6 },
  actionButtonTextDisabled: { color: '#95A5A6' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginTop: 20, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#95A5A6', textAlign: 'center', lineHeight: 20 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50' },
  modalAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4ECDC4', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 },
  modalAvatarText: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  modalName: { fontSize: 22, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginBottom: 4 },
  modalEmail: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', marginBottom: 20 },
  modalSection: { marginBottom: 20 },
  modalSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8 },
  modalText: { fontSize: 14, color: '#5D6D7E', marginBottom: 4, lineHeight: 20 },
  modalButton: { backgroundColor: '#4ECDC4', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  modalButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
});

export default CounselorManagementScreen;