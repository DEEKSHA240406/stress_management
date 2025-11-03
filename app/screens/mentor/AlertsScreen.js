// app/screens/mentor/AlertsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert as RNAlert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

const AlertsScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, critical, high, moderate
  const [alerts, setAlerts] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchAlerts();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedFilter]);

  const fetchAlerts = async () => {
    try {
      // API call to fetch alerts
      // const response = await mentorService.getAlerts(user.id, selectedFilter);
      
      // Mock data
      const mockAlerts = [
        {
          id: 1,
          studentId: 'S001',
          studentName: 'Priya Kumar',
          studentAvatar: 'PK',
          severity: 'critical',
          type: 'score_drop',
          title: 'Critical Score Drop',
          message: 'Mental health score dropped to 28% - Immediate attention required',
          timestamp: '2024-10-27T08:30:00',
          score: 28,
          previousScore: 65,
          isRead: false,
          isAcknowledged: false,
        },
        {
          id: 2,
          studentId: 'S002',
          studentName: 'Rahul Sharma',
          studentAvatar: 'RS',
          severity: 'critical',
          type: 'assessment_decline',
          title: 'Declining Mental Health',
          message: 'Consistent decline over last 3 assessments',
          timestamp: '2024-10-27T07:15:00',
          score: 32,
          previousScore: 48,
          isRead: false,
          isAcknowledged: false,
        },
        {
          id: 3,
          studentId: 'S003',
          studentName: 'Anjali Patel',
          studentAvatar: 'AP',
          severity: 'high',
          type: 'missed_assessment',
          title: 'Missed Multiple Assessments',
          message: 'Student has missed last 3 scheduled assessments',
          timestamp: '2024-10-26T18:00:00',
          score: null,
          previousScore: 55,
          isRead: false,
          isAcknowledged: false,
        },
        {
          id: 4,
          studentId: 'S004',
          studentName: 'Arjun Reddy',
          studentAvatar: 'AR',
          severity: 'high',
          type: 'stress_level',
          title: 'High Stress Indicators',
          message: 'Reported high stress in academic and personal life',
          timestamp: '2024-10-26T14:30:00',
          score: 38,
          previousScore: 42,
          isRead: true,
          isAcknowledged: false,
        },
        {
          id: 5,
          studentId: 'S005',
          studentName: 'Meera Singh',
          studentAvatar: 'MS',
          severity: 'moderate',
          type: 'pattern_change',
          title: 'Behavior Pattern Change',
          message: 'Change detected in response patterns',
          timestamp: '2024-10-26T10:00:00',
          score: 52,
          previousScore: 68,
          isRead: true,
          isAcknowledged: true,
        },
        {
          id: 6,
          studentId: 'S006',
          studentName: 'Vikram Malhotra',
          studentAvatar: 'VM',
          severity: 'moderate',
          type: 'counselor_assigned',
          title: 'Assigned to Counselor',
          message: 'Student automatically assigned to counselor due to low score',
          timestamp: '2024-10-25T16:45:00',
          score: 35,
          previousScore: 58,
          isRead: true,
          isAcknowledged: true,
        },
      ];

      // Filter based on selection
      const filtered = selectedFilter === 'all' 
        ? mockAlerts 
        : mockAlerts.filter(alert => alert.severity === selectedFilter);

      setAlerts(filtered);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#D32F2F';
      case 'high': return '#F57C00';
      case 'moderate': return '#FBC02D';
      default: return '#95A5A6';
    }
  };

  const getSeverityIcon = (type) => {
    switch (type) {
      case 'score_drop': return 'arrow-down-bold-circle';
      case 'assessment_decline': return 'trending-down';
      case 'missed_assessment': return 'calendar-remove';
      case 'stress_level': return 'alert-circle';
      case 'pattern_change': return 'swap-horizontal';
      case 'counselor_assigned': return 'account-heart';
      default: return 'information';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleAlertPress = (alert) => {
    navigation.navigate('StudentDetail', { studentId: alert.studentId });
  };

  const handleAcknowledge = (alertId) => {
    RNAlert.alert(
      'Acknowledge Alert',
      'Mark this alert as acknowledged?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Acknowledge',
          onPress: async () => {
            try {
              // API call to acknowledge alert
              // await mentorService.acknowledgeAlert(alertId);
              
              // Update local state
              setAlerts(prev => 
                prev.map(alert => 
                  alert.id === alertId 
                    ? { ...alert, isAcknowledged: true, isRead: true }
                    : alert
                )
              );
            } catch (error) {
              console.error('Error acknowledging alert:', error);
            }
          }
        }
      ]
    );
  };

  const FilterButton = ({ label, value, count }) => (
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
      {count > 0 && (
        <View style={[
          styles.filterBadge,
          selectedFilter === value && styles.filterBadgeActive
        ]}>
          <Text style={[
            styles.filterBadgeText,
            selectedFilter === value && styles.filterBadgeTextActive
          ]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const AlertCard = ({ alert }) => (
    <TouchableOpacity
      style={[
        styles.alertCard,
        !alert.isRead && styles.alertCardUnread
      ]}
      onPress={() => handleAlertPress(alert)}
      activeOpacity={0.7}
    >
      <View style={styles.alertCardHeader}>
        <View style={styles.alertCardLeft}>
          <View style={[
            styles.avatarContainer,
            { backgroundColor: getSeverityColor(alert.severity) + '20' }
          ]}>
            <Text style={[
              styles.avatarText,
              { color: getSeverityColor(alert.severity) }
            ]}>
              {alert.studentAvatar}
            </Text>
          </View>
          
          <View style={styles.alertInfo}>
            <View style={styles.alertTitleRow}>
              <Text style={styles.studentName}>{alert.studentName}</Text>
              {!alert.isRead && (
                <View style={styles.unreadDot} />
              )}
            </View>
            <Text style={styles.alertTitle}>{alert.title}</Text>
          </View>
        </View>

        <View style={[
          styles.severityBadge,
          { backgroundColor: getSeverityColor(alert.severity) }
        ]}>
          <Icon 
            name={getSeverityIcon(alert.type)} 
            size={20} 
            color="#FFF" 
          />
        </View>
      </View>

      <Text style={styles.alertMessage}>{alert.message}</Text>

      {alert.score !== null && (
        <View style={styles.scoreInfo}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Current Score</Text>
            <Text style={[
              styles.scoreValue,
              { color: getSeverityColor(alert.severity) }
            ]}>
              {alert.score}%
            </Text>
          </View>
          {alert.previousScore && (
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Previous Score</Text>
              <Text style={styles.scoreValue}>{alert.previousScore}%</Text>
            </View>
          )}
          {alert.previousScore && (
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Change</Text>
              <Text style={[
                styles.scoreValue,
                { color: alert.score < alert.previousScore ? '#D32F2F' : '#388E3C' }
              ]}>
                {alert.score - alert.previousScore > 0 ? '+' : ''}
                {alert.score - alert.previousScore}%
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.alertFooter}>
        <View style={styles.timestampContainer}>
          <Icon name="clock-outline" size={14} color="#95A5A6" />
          <Text style={styles.timestamp}>{formatTimestamp(alert.timestamp)}</Text>
        </View>

        {!alert.isAcknowledged && (
          <TouchableOpacity
            style={styles.acknowledgeButton}
            onPress={() => handleAcknowledge(alert.id)}
            activeOpacity={0.7}
          >
            <Icon name="check-circle-outline" size={16} color="#6C63FF" />
            <Text style={styles.acknowledgeText}>Acknowledge</Text>
          </TouchableOpacity>
        )}

        {alert.isAcknowledged && (
          <View style={styles.acknowledgedBadge}>
            <Icon name="check-circle" size={14} color="#388E3C" />
            <Text style={styles.acknowledgedText}>Acknowledged</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;
  const moderateCount = alerts.filter(a => a.severity === 'moderate').length;

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
          <Text style={styles.headerTitle}>Alerts & Notifications</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconButton}>
              <Icon name="filter-variant" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <FilterButton label="All" value="all" count={alerts.length} />
          <FilterButton label="Critical" value="critical" count={criticalCount} />
          <FilterButton label="High" value="high" count={highCount} />
          <FilterButton label="Moderate" value="moderate" count={moderateCount} />
        </ScrollView>
      </View>

      {/* Alerts List */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {alerts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="bell-off-outline" size={80} color="#BDC3C7" />
              <Text style={styles.emptyTitle}>No Alerts</Text>
              <Text style={styles.emptyText}>
                You're all caught up! No {selectedFilter !== 'all' ? selectedFilter : ''} alerts at the moment.
              </Text>
            </View>
          ) : (
            <View style={styles.alertsList}>
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
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
  headerRight: {
    width: 40,
  },
  headerIconButton: {
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#6C63FF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D6D7E',
  },
  filterTextActive: {
    color: '#FFF',
  },
  filterBadge: {
    marginLeft: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5D6D7E',
  },
  filterBadgeTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  alertsList: {
    padding: 20,
  },
  alertCard: {
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
  alertCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  alertCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertCardLeft: {
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
  alertInfo: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C63FF',
    marginLeft: 8,
  },
  alertTitle: {
    fontSize: 14,
    color: '#5D6D7E',
    marginTop: 2,
  },
  severityBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
    marginBottom: 12,
  },
  scoreInfo: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#95A5A6',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#95A5A6',
    marginLeft: 4,
  },
  acknowledgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F0EFFF',
  },
  acknowledgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
    marginLeft: 4,
  },
  acknowledgedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  acknowledgedText: {
    fontSize: 12,
    color: '#388E3C',
    marginLeft: 4,
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

export default AlertsScreen;