// app/screens/student/MyMentorScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Linking,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

const MyMentorScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [mentorData, setMentorData] = useState(null);
  const [upcomingSession, setUpcomingSession] = useState(null);
  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      // API call to fetch mentor data
      // const response = await studentService.getAssignedMentor(user.id);
      
      // Mock data
      const mockMentorData = {
        id: 'M001',
        name: 'Dr. Ananya Sharma',
        designation: 'Senior Mental Health Mentor',
        department: 'Psychology Department',
        email: 'ananya.sharma@university.edu',
        phone: '+91 98765 43210',
        avatar: null,
        initials: 'AS',
        experience: '8 years',
        specialization: ['Stress Management', 'Academic Counseling', 'Anxiety'],
        availability: 'Mon-Fri, 9 AM - 5 PM',
        officeLocation: 'Room 204, Counseling Center',
        assignedStudents: 18,
        rating: 4.8,
        bio: 'Passionate about helping students navigate their mental health journey and achieve academic success while maintaining emotional well-being.',
        lastContact: '2024-10-25T14:30:00',
      };

      const mockUpcomingSession = {
        date: '2024-10-28T10:00:00',
        type: 'Check-in Session',
        mode: 'In-Person',
        location: 'Room 204, Counseling Center',
      };

      const mockRecentNotes = [
        {
          id: 1,
          date: '2024-10-25T14:30:00',
          note: 'Great progress this week! Keep up the good work with your stress management techniques.',
          sentiment: 'positive',
        },
        {
          id: 2,
          date: '2024-10-20T11:00:00',
          note: 'Discussed time management strategies. Please try the Pomodoro technique we talked about.',
          sentiment: 'neutral',
        },
      ];

      setMentorData(mockMentorData);
      setUpcomingSession(mockUpcomingSession);
      setRecentNotes(mockRecentNotes);
    } catch (error) {
      console.error('Error fetching mentor data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMentorData();
    setRefreshing(false);
  };

  const handleCall = () => {
    if (mentorData?.phone) {
      Linking.openURL(`tel:${mentorData.phone}`);
    }
  };

  const handleEmail = () => {
    if (mentorData?.email) {
      Linking.openURL(`mailto:${mentorData.email}`);
    }
  };

  const handleRequestSession = () => {
    Alert.alert(
      'Request Session',
      'Would you like to request a session with your mentor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: () => {
            // API call to request session
            Alert.alert('Success', 'Session request sent to your mentor!');
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatLastContact = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const ContactButton = ({ icon, label, onPress, color }) => (
    <TouchableOpacity
      style={styles.contactButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.contactIconContainer, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={styles.contactLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const InfoItem = ({ icon, label, value, iconColor }) => (
    <View style={styles.infoItem}>
      <View style={[styles.infoIconContainer, { backgroundColor: iconColor + '15' }]}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const SpecializationTag = ({ text }) => (
    <View style={styles.tagContainer}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );

  const NoteCard = ({ note }) => (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <View style={[
          styles.noteSentimentDot,
          { backgroundColor: note.sentiment === 'positive' ? '#388E3C' : '#95A5A6' }
        ]} />
        <Text style={styles.noteDate}>{formatDate(note.date)}</Text>
      </View>
      <Text style={styles.noteText}>{note.note}</Text>
    </View>
  );

  if (!mentorData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
        <View style={styles.loadingContainer}>
          <Icon name="account-search" size={80} color="#BDC3C7" />
          <Text style={styles.loadingText}>Loading mentor information...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>My Mentor</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Mentor Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {mentorData.avatar ? (
              <Image source={{ uri: mentorData.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{mentorData.initials}</Text>
              </View>
            )}
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
            </View>
          </View>

          <Text style={styles.mentorName}>{mentorData.name}</Text>
          <Text style={styles.mentorDesignation}>{mentorData.designation}</Text>
          <Text style={styles.mentorDepartment}>{mentorData.department}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Icon name="star" size={18} color="#FFA726" />
            <Text style={styles.ratingText}>{mentorData.rating}</Text>
            <Text style={styles.ratingSubtext}>• {mentorData.experience} experience</Text>
          </View>

          {/* Contact Buttons */}
          <View style={styles.contactButtonsContainer}>
            <ContactButton
              icon="phone"
              label="Call"
              onPress={handleCall}
              color="#4CAF50"
            />
            <ContactButton
              icon="email"
              label="Email"
              onPress={handleEmail}
              color="#2196F3"
            />
            <ContactButton
              icon="calendar-plus"
              label="Request"
              onPress={handleRequestSession}
              color="#FF6B9D"
            />
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.bioCard}>
            <Text style={styles.bioText}>{mentorData.bio}</Text>
          </View>
        </View>

        {/* Specialization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialization</Text>
          <View style={styles.tagsContainer}>
            {mentorData.specialization.map((spec, index) => (
              <SpecializationTag key={index} text={spec} />
            ))}
          </View>
        </View>

        {/* Upcoming Session */}
        {upcomingSession && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Session</Text>
            <View style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.sessionIconContainer}>
                  <Icon name="calendar-clock" size={24} color="#6C63FF" />
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionType}>{upcomingSession.type}</Text>
                  <Text style={styles.sessionDate}>{formatDate(upcomingSession.date)}</Text>
                </View>
              </View>
              <View style={styles.sessionDetails}>
                <View style={styles.sessionDetailRow}>
                  <Icon name="map-marker" size={16} color="#5D6D7E" />
                  <Text style={styles.sessionDetailText}>{upcomingSession.location}</Text>
                </View>
                <View style={styles.sessionDetailRow}>
                  <Icon name="account-group" size={16} color="#5D6D7E" />
                  <Text style={styles.sessionDetailText}>{upcomingSession.mode}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <InfoItem
              icon="clock-outline"
              label="Availability"
              value={mentorData.availability}
              iconColor="#6C63FF"
            />
            <InfoItem
              icon="office-building"
              label="Office Location"
              value={mentorData.officeLocation}
              iconColor="#4CAF50"
            />
            <InfoItem
              icon="email-outline"
              label="Email"
              value={mentorData.email}
              iconColor="#2196F3"
            />
            <InfoItem
              icon="phone-outline"
              label="Phone"
              value={mentorData.phone}
              iconColor="#FF6B9D"
            />
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mentor Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Icon name="account-group" size={28} color="#6C63FF" />
              <Text style={styles.statValue}>{mentorData.assignedStudents}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statBox}>
              <Icon name="chat-processing" size={28} color="#4CAF50" />
              <Text style={styles.statValue}>{formatLastContact(mentorData.lastContact)}</Text>
              <Text style={styles.statLabel}>Last Contact</Text>
            </View>
          </View>
        </View>

        {/* Recent Notes */}
        {recentNotes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Notes</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.notesContainer}>
              {recentNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </View>
          </View>
        )}

        {/* Help Section */}
        <View style={styles.section}>
          <View style={styles.helpCard}>
            <Icon name="information-outline" size={24} color="#6C63FF" />
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>Need Immediate Help?</Text>
              <Text style={styles.helpText}>
                If you're experiencing a crisis, please contact emergency services or your campus crisis hotline immediately.
              </Text>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#95A5A6',
    marginTop: 20,
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
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  mentorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  mentorDesignation: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '600',
    marginBottom: 2,
  },
  mentorDepartment: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 4,
  },
  ratingSubtext: {
    fontSize: 14,
    color: '#95A5A6',
    marginLeft: 4,
  },
  contactButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  contactButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  contactIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 13,
    color: '#5D6D7E',
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
  },
  bioCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bioText: {
    fontSize: 14,
    color: '#5D6D7E',
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagContainer: {
    backgroundColor: '#F0EFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '600',
  },
  sessionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  sessionDate: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  sessionDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sessionDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDetailText: {
    fontSize: 14,
    color: '#5D6D7E',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconContainer: {
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  notesContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noteCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteSentimentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#95A5A6',
  },
  noteText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA726',
  },
  helpContent: {
    flex: 1,
    marginLeft: 12,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#5D6D7E',
    lineHeight: 18,
  },
});

export default MyMentorScreen;