// app/screens/mentor/StudentProgressScreen.js
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { getSeverityColor } from '../../../constants/severityThresholds';

const { width } = Dimensions.get('window');

const StudentProgressScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // week, month, quarter, year
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    fetchProgressData();
  }, [selectedPeriod]);

  const fetchProgressData = async () => {
    try {
      // API call
      // const response = await mentorService.getProgressData(selectedPeriod);
      
      // Mock data
      const mockData = {
        averageScore: 58,
        improvingCount: 6,
        decliningCount: 8,
        stableCount: 6,
        totalAssessments: 156,
        
        // Time series data
        timeSeriesData: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            data: [62, 58, 55, 58],
            color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
            strokeWidth: 3
          }]
        },

        // Category breakdown
        categoryData: {
          labels: ['Critical', 'High', 'Moderate', 'Low', 'Healthy'],
          datasets: [{
            data: [2, 5, 7, 4, 2]
          }]
        },

        // Top improving students
        topImproving: [
          { name: 'Vikram Malhotra', improvement: 15, currentScore: 72 },
          { name: 'Sneha Desai', improvement: 12, currentScore: 85 },
          { name: 'Karthik Iyer', improvement: 8, currentScore: 78 },
        ],

        // Needs attention
        needsAttention: [
          { name: 'Priya Kumar', decline: 37, currentScore: 28 },
          { name: 'Rahul Sharma', decline: 16, currentScore: 32 },
          { name: 'Arjun Reddy', decline: 4, currentScore: 38 },
        ],
      };

      setProgressData(mockData);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProgressData();
    setRefreshing(false);
  };

  const PeriodButton = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === value && styles.periodButtonActive
      ]}
      onPress={() => setSelectedPeriod(value)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.periodText,
        selectedPeriod === value && styles.periodTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color, trend }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Icon 
              name={trend > 0 ? 'trending-up' : 'trending-down'} 
              size={14} 
              color={trend > 0 ? '#388E3C' : '#D32F2F'} 
            />
            <Text style={[
              styles.trendText,
              { color: trend > 0 ? '#388E3C' : '#D32F2F' }
            ]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const StudentListItem = ({ student, type }) => (
    <TouchableOpacity 
      style={styles.studentListItem}
      onPress={() => navigation.navigate('StudentDetail', { studentId: student.id })}
    >
      <View style={styles.studentListLeft}>
        <View style={[
          styles.studentAvatar,
          { backgroundColor: getSeverityColor(student.currentScore) + '20' }
        ]}>
          <Text style={[
            styles.studentAvatarText,
            { color: getSeverityColor(student.currentScore) }
          ]}>
            {student.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View>
          <Text style={styles.studentListName}>{student.name}</Text>
          <Text style={styles.studentListScore}>Score: {student.currentScore}%</Text>
        </View>
      </View>
      <View style={styles.studentListRight}>
        <View style={[
          styles.changeIndicator,
          { backgroundColor: type === 'improving' ? '#E8F5E9' : '#FFEBEE' }
        ]}>
          <Icon 
            name={type === 'improving' ? 'arrow-up' : 'arrow-down'} 
            size={16} 
            color={type === 'improving' ? '#388E3C' : '#D32F2F'} 
          />
          <Text style={[
            styles.changeText,
            { color: type === 'improving' ? '#388E3C' : '#D32F2F' }
          ]}>
            {type === 'improving' ? student.improvement : student.decline}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!progressData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
        <View style={styles.loadingContainer}>
          <Icon name="chart-line" size={60} color="#BDC3C7" />
          <Text style={styles.loadingText}>Loading progress data...</Text>
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
          <Text style={styles.headerTitle}>Student Progress</Text>
          <TouchableOpacity style={styles.headerIconButton}>
            <Icon name="download" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <PeriodButton label="Week" value="week" />
          <PeriodButton label="Month" value="month" />
          <PeriodButton label="Quarter" value="quarter" />
          <PeriodButton label="Year" value="year" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="chart-line"
              value={`${progressData.averageScore}%`}
              label="Average Score"
              color="#6C63FF"
              trend={2}
            />
            <StatCard
              icon="clipboard-text"
              value={progressData.totalAssessments}
              label="Total Assessments"
              color="#4CAF50"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              icon="trending-up"
              value={progressData.improvingCount}
              label="Improving"
              color="#388E3C"
            />
            <StatCard
              icon="trending-down"
              value={progressData.decliningCount}
              label="Declining"
              color="#D32F2F"
            />
            <StatCard
              icon="trending-neutral"
              value={progressData.stableCount}
              label="Stable"
              color="#95A5A6"
            />
          </View>
        </View>

        {/* Average Score Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Average Score Trend</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={progressData.timeSeriesData}
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
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#6C63FF'
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Risk Category Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Category Distribution</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={progressData.categoryData}
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
              }}
              style={styles.chart}
              showValuesOnTopOfBars
            />
          </View>
        </View>

        {/* Top Improving Students */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Improving Students</Text>
            <Icon name="emoticon-happy" size={24} color="#388E3C" />
          </View>
          <View style={styles.listContainer}>
            {progressData.topImproving.map((student, index) => (
              <StudentListItem key={index} student={student} type="improving" />
            ))}
          </View>
        </View>

        {/* Students Needing Attention */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Needs Attention</Text>
            <Icon name="alert-circle" size={24} color="#D32F2F" />
          </View>
          <View style={styles.listContainer}>
            {progressData.needsAttention.map((student, index) => (
              <StudentListItem key={index} student={student} type="declining" />
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <View style={styles.insightCard}>
            <Icon name="lightbulb" size={24} color="#FFA726" />
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>
                • {progressData.decliningCount} students show declining trends and may need immediate attention
              </Text>
              <Text style={styles.insightText}>
                • {progressData.improvingCount} students are showing positive improvement
              </Text>
              <Text style={styles.insightText}>
                • Average score has changed by 2% compared to last period
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
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 16,
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: '#FFF',
  },
  periodText: {
    fontSize: 13,
    color: '#FFF',
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#6C63FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#7F8C8D',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chart: {
    borderRadius: 16,
  },
  listContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  studentListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  studentListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  studentListName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  studentListScore: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  studentListRight: {
    marginLeft: 10,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBF0',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA726',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightText: {
    fontSize: 13,
    color: '#5D6D7E',
    lineHeight: 20,
    marginBottom: 6,
  },
});

export default StudentProgressScreen;