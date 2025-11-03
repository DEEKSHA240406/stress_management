// app/screens/counselor/SessionNotesScreen.js
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
  Modal,
  RefreshControl,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

const SessionNotesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { studentId } = route.params || {};
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  
  // Form fields
  const [sessionType, setSessionType] = useState('individual'); // individual, group, assessment
  const [sessionDate, setSessionDate] = useState(new Date());
  const [duration, setDuration] = useState('60');
  const [observations, setObservations] = useState('');
  const [interventions, setInterventions] = useState('');
  const [outcome, setOutcome] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  useEffect(() => {
    fetchSessions();
  }, [studentId]);

  const fetchSessions = async () => {
    try {
      // API call
      // const response = await counselorService.getSessions(user.id, studentId);
      
      // Mock data
      const mockSessions = [
        {
          id: 1,
          studentId: 'S001',
          studentName: 'Priya Kumar',
          date: '2024-10-26T10:00:00',
          type: 'individual',
          duration: 60,
          observations: 'Patient appeared anxious but more willing to engage compared to previous session. Discussed recent academic stressors and family pressure. Demonstrated some improvement in coping mechanisms.',
          interventions: 'Cognitive Behavioral Therapy techniques, breathing exercises, positive self-talk strategies',
          outcome: 'Positive progress - patient showed better emotional regulation',
          nextSteps: 'Continue CBT sessions, practice daily mindfulness exercises, schedule follow-up in 3 days',
          mood: 'anxious',
          attendanceStatus: 'attended',
        },
        {
          id: 2,
          studentId: 'S001',
          studentName: 'Priya Kumar',
          date: '2024-10-22T10:00:00',
          type: 'assessment',
          duration: 45,
          observations: 'Initial comprehensive assessment completed. Student reported severe anxiety symptoms, difficulty sleeping, and academic stress. Family history positive for anxiety disorders.',
          interventions: 'Administered GAD-7 and PHQ-9 assessments, created initial treatment plan',
          outcome: 'Assessment complete - High anxiety levels identified',
          nextSteps: 'Begin weekly individual therapy, refer for psychiatric evaluation if needed',
          mood: 'distressed',
          attendanceStatus: 'attended',
        },
        {
          id: 3,
          studentId: 'S002',
          studentName: 'Rahul Sharma',
          date: '2024-10-25T14:00:00',
          type: 'individual',
          duration: 60,
          observations: 'Student expressed feelings of hopelessness and social withdrawal. Discussed challenges in connecting with peers and managing coursework.',
          interventions: 'Supportive therapy, explored social support systems, discussed time management strategies',
          outcome: 'Patient engaged well in session, identified specific areas for improvement',
          nextSteps: 'Schedule bi-weekly sessions, encourage participation in student activities',
          mood: 'low',
          attendanceStatus: 'attended',
        },
      ];

      // Filter by student if studentId is provided
      const filteredSessions = studentId 
        ? mockSessions.filter(session => session.studentId === studentId)
        : mockSessions;

      setSessions(filteredSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSessions();
    setRefreshing(false);
  };

  const handleAddSession = () => {
    setEditingSession(null);
    setSessionType('individual');
    setDuration('60');
    setObservations('');
    setInterventions('');
    setOutcome('');
    setNextSteps('');
    setModalVisible(true);
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setSessionType(session.type);
    setDuration(session.duration.toString());
    setObservations(session.observations);
    setInterventions(session.interventions);
    setOutcome(session.outcome);
    setNextSteps(session.nextSteps);
    setModalVisible(true);
  };

  const handleSaveSession = async () => {
    if (!observations.trim() || !interventions.trim() || !outcome.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // API call to save session
      Alert.alert('Success', editingSession ? 'Session updated successfully' : 'Session note added successfully');
      setModalVisible(false);
      fetchSessions();
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to save session note');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionTypeColor = (type) => {
    switch (type) {
      case 'individual': return '#4ECDC4';
      case 'group': return '#6C63FF';
      case 'assessment': return '#FF6B9D';
      default: return '#95A5A6';
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'happy': return 'emoticon-happy';
      case 'neutral': return 'emoticon-neutral';
      case 'anxious': return 'emoticon-sad';
      case 'distressed': return 'emoticon-cry';
      case 'low': return 'emoticon-dead';
      default: return 'emoticon-neutral';
    }
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

  const TypeButton = ({ label, value, icon }) => (
    <TouchableOpacity
      style={[
        styles.typeButton,
        sessionType === value && styles.typeButtonActive
      ]}
      onPress={() => setSessionType(value)}
      activeOpacity={0.7}
    >
      <Icon 
        name={icon} 
        size={20} 
        color={sessionType === value ? '#FFF' : getSessionTypeColor(value)} 
      />
      <Text style={[
        styles.typeButtonText,
        sessionType === value && styles.typeButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SessionCard = ({ session }) => (
    <TouchableOpacity
      style={styles.sessionCard}
      onPress={() => handleEditSession(session)}
      activeOpacity={0.7}
    >
      <View style={styles.sessionCardHeader}>
        <View style={styles.sessionCardLeft}>
          <View style={[
            styles.sessionTypeIcon,
            { backgroundColor: getSessionTypeColor(session.type) + '20' }
          ]}>
            <Icon 
              name={session.type === 'individual' ? 'account' : session.type === 'group' ? 'account-group' : 'clipboard-text'}
              size={20} 
              color={getSessionTypeColor(session.type)} 
            />
          </View>
          <View>
            {!studentId && (
              <Text style={styles.sessionStudent}>{session.studentName}</Text>
            )}
            <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
            <Text style={styles.sessionTime}>
              {formatTime(session.date)} • {session.duration} min
            </Text>
          </View>
        </View>
        <View style={styles.sessionCardRight}>
          <View style={[
            styles.sessionTypeBadge,
            { backgroundColor: getSessionTypeColor(session.type) }
          ]}>
            <Text style={styles.sessionTypeBadgeText}>
              {session.type}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sessionContent}>
        <Text style={styles.sectionLabel}>Observations:</Text>
        <Text style={styles.sessionText} numberOfLines={2}>
          {session.observations}
        </Text>

        <Text style={styles.sectionLabel}>Outcome:</Text>
        <Text style={styles.sessionOutcomeText}>{session.outcome}</Text>
      </View>

      <View style={styles.sessionFooter}>
        <View style={styles.moodIndicator}>
          <Icon name={getMoodIcon(session.mood)} size={18} color="#7F8C8D" />
          <Text style={styles.moodText}>{session.mood}</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#95A5A6" />
      </View>
    </TouchableOpacity>
  );

  const filteredSessions = sessions.filter(session => {
    if (selectedFilter === 'all') return true;
    return session.type === selectedFilter;
  });

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
            <Text style={styles.headerTitle}>
              {studentId ? 'Session Notes' : 'All Sessions'}
            </Text>
            <Text style={styles.headerSubtitle}>{sessions.length} sessions</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddSession}
          >
            <Icon name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <FilterButton label="All Sessions" value="all" />
          <FilterButton label="Individual" value="individual" />
          <FilterButton label="Group" value="group" />
          <FilterButton label="Assessment" value="assessment" />
        </ScrollView>
      </View>

      {/* Sessions List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredSessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="calendar-text" size={80} color="#BDC3C7" />
            <Text style={styles.emptyTitle}>No Session Notes</Text>
            <Text style={styles.emptyText}>
              Start documenting your therapy sessions to track progress
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={handleAddSession}
            >
              <Icon name="plus" size={20} color="#FFF" />
              <Text style={styles.emptyButtonText}>Add First Session</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sessionsList}>
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Add/Edit Session Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingSession ? 'Edit Session' : 'New Session Note'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Session Type */}
              <Text style={styles.inputLabel}>Session Type *</Text>
              <View style={styles.typeContainer}>
                <TypeButton label="Individual" value="individual" icon="account" />
                <TypeButton label="Group" value="group" icon="account-group" />
                <TypeButton label="Assessment" value="assessment" icon="clipboard-text" />
              </View>

              {/* Duration */}
              <Text style={styles.inputLabel}>Duration (minutes) *</Text>
              <TextInput
                style={styles.shortInput}
                placeholder="60"
                placeholderTextColor="#95A5A6"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />

              {/* Observations */}
              <Text style={styles.inputLabel}>Observations *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Document your observations during the session..."
                placeholderTextColor="#95A5A6"
                value={observations}
                onChangeText={setObservations}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Interventions */}
              <Text style={styles.inputLabel}>Interventions Used *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe therapeutic interventions and techniques used..."
                placeholderTextColor="#95A5A6"
                value={interventions}
                onChangeText={setInterventions}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              {/* Outcome */}
              <Text style={styles.inputLabel}>Session Outcome *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Summarize the outcome and patient response..."
                placeholderTextColor="#95A5A6"
                value={outcome}
                onChangeText={setOutcome}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              {/* Next Steps */}
              <Text style={styles.inputLabel}>Next Steps</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Plan for follow-up and recommendations..."
                placeholderTextColor="#95A5A6"
                value={nextSteps}
                onChangeText={setNextSteps}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveSession}
                >
                  <Text style={styles.saveButtonText}>
                    {editingSession ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
    backgroundColor: '#4ECDC4',
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
  sessionsList: {
    padding: 20,
  },
  sessionCard: {
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
  sessionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sessionCardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  sessionTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionStudent: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  sessionCardRight: {
    justifyContent: 'center',
  },
  sessionTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sessionTypeBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF',
    textTransform: 'capitalize',
  },
  sessionContent: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7F8C8D',
    marginTop: 8,
    marginBottom: 4,
  },
  sessionText: {
    fontSize: 13,
    color: '#5D6D7E',
    lineHeight: 18,
  },
  sessionOutcomeText: {
    fontSize: 13,
    color: '#388E3C',
    fontWeight: '600',
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  moodIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 6,
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
    marginBottom: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '90%',
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    marginTop: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  typeButtonActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  typeButtonText: {
    fontSize: 13,
    color: '#5D6D7E',
    marginLeft: 6,
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#FFF',
  },
  shortInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  textArea: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#2C3E50',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5D6D7E',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default SessionNotesScreen;