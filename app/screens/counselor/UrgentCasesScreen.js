// app/screens/counselor/UrgentCasesScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { getSeverityColor } from '../../../constants/severityThresholds';

const UrgentCasesScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [urgentCases, setUrgentCases] = useState([]);

  useEffect(() => {
    fetchUrgentCases();
  }, []);

  const fetchUrgentCases = async () => {
    // Mock data - replace with API call
    const mockCases = [
      {
        id: 'S001',
        studentName: 'Priya Kumar',
        score: 28,
        issue: 'Severe anxiety and stress - Immediate intervention needed',
        timeAgo: '2 hours ago',
        priority: 'critical',
      },
      {
        id: 'S002',
        studentName: 'Rahul Sharma',
        score: 32,
        issue: 'Depression symptoms - Follow-up required',
        timeAgo: '5 hours ago',
        priority: 'critical',
      },
    ];
    setUrgentCases(mockCases);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUrgentCases();
    setRefreshing(false);
  };

  const UrgentCaseCard = ({ caseData }) => (
    <TouchableOpacity
      style={styles.caseCard}
      onPress={() => navigation.navigate('StudentCase', { studentId: caseData.id })}
      activeOpacity={0.7}
    >
      <View style={styles.caseHeader}>
        <View style={[styles.avatar, { backgroundColor: getSeverityColor(caseData.score) + '20' }]}>
          <Text style={[styles.avatarText, { color: getSeverityColor(caseData.score) }]}>
            {caseData.studentName.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.caseInfo}>
          <Text style={styles.studentName}>{caseData.studentName}</Text>
          <Text style={styles.issueText}>{caseData.issue}</Text>
        </View>
        <View style={[styles.urgentBadge, { backgroundColor: getSeverityColor(caseData.score) }]}>
          <Icon name="alert" size={16} color="#FFF" />
        </View>
      </View>
      <View style={styles.caseFooter}>
        <Icon name="clock-outline" size={14} color="#95A5A6" />
        <Text style={styles.timeText}>{caseData.timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />
      
      <LinearGradient colors={['#D32F2F', '#C62828']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Urgent Cases</Text>
            <Text style={styles.headerSubtitle}>{urgentCases.length} cases need attention</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {urgentCases.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="check-circle" size={80} color="#388E3C" />
            <Text style={styles.emptyTitle}>No Urgent Cases</Text>
            <Text style={styles.emptyText}>All cases are under control</Text>
          </View>
        ) : (
          urgentCases.map((caseData) => (
            <UrgentCaseCard key={caseData.id} caseData={caseData} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { paddingTop: 15, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 5 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFF', opacity: 0.8, marginTop: 2 },
  content: { flex: 1, padding: 20 },
  caseCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  caseHeader: { flexDirection: 'row', marginBottom: 12 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 14, fontWeight: 'bold' },
  caseInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 4 },
  issueText: { fontSize: 13, color: '#5D6D7E', lineHeight: 18 },
  urgentBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  caseFooter: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 12, color: '#95A5A6', marginLeft: 4 },
  emptyContainer: { alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginTop: 20, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#95A5A6', textAlign: 'center' },
});

export default UrgentCasesScreen;

