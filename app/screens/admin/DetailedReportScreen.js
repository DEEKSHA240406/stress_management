import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function DetailedReportScreen({ route, navigation }) {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const { student } = route.params || {
    student: {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@university.edu',
      status: 'good',
      score: 85,
      department: 'Computer Science',
      year: '3rd Year',
      registrationNumber: 'CS2021045',
    },
  };

  // Progress Over Time Data
  const progressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        data: [65, 68, 72, 75, 78, 85],
        color: (opacity = 1) => colors.primary,
        strokeWidth: 3,
      },
    ],
  };

  // Category Scores (Radial Progress)
  const categoryScores = {
    labels: ['Mental', 'Physical', 'Social', 'Academic'],
    data: [0.85, 0.72, 0.68, 0.91],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    propsForLabels: {
      fontFamily: 'Roboto-Regular',
      fontSize: 11,
    },
  };

  const assessmentHistory = [
    {
      id: '1',
      date: '2 days ago',
      category: 'Mental Health Check',
      score: 85,
      status: 'good',
      answers: 12,
      duration: '8 min',
    },
    {
      id: '2',
      date: '1 week ago',
      category: 'Stress Assessment',
      score: 78,
      status: 'good',
      answers: 15,
      duration: '10 min',
    },
    {
      id: '3',
      date: '2 weeks ago',
      category: 'Overall Wellbeing',
      score: 72,
      status: 'moderate',
      answers: 18,
      duration: '12 min',
    },
    {
      id: '4',
      date: '3 weeks ago',
      category: 'Anxiety Check',
      score: 68,
      status: 'moderate',
      answers: 10,
      duration: '7 min',
    },
  ];

  const concerns = [
    { 
      icon: 'school', 
      label: 'Academic Pressure', 
      level: 'Moderate',
      color: colors.warning,
      description: 'Struggling with workload',
    },
    { 
      icon: 'people', 
      label: 'Social Anxiety', 
      level: 'Low',
      color: colors.success,
      description: 'Improving social connections',
    },
    { 
      icon: 'home', 
      label: 'Family Issues', 
      level: 'Low',
      color: colors.success,
      description: 'Stable family environment',
    },
    { 
      icon: 'moon', 
      label: 'Sleep Pattern', 
      level: 'Moderate',
      color: colors.warning,
      description: 'Irregular sleep schedule',
    },
  ];

  const recommendations = [
    {
      icon: 'chatbubbles',
      title: 'Counseling Session',
      description: 'Schedule a one-on-one session',
      priority: 'high',
    },
    {
      icon: 'book',
      title: 'Stress Management Workshop',
      description: 'Attend next Friday\'s workshop',
      priority: 'medium',
    },
    {
      icon: 'fitness',
      title: 'Physical Activity',
      description: 'Join yoga or meditation classes',
      priority: 'low',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return colors.success;
      case 'moderate': return colors.warning;
      case 'attention': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const handleSendMessage = () => {
    Alert.alert(
      'Send Message',
      `Send a message to ${student.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: () => console.log('Message sent') },
      ]
    );
  };

  const handleScheduleMeeting = () => {
    Alert.alert(
      'Schedule Meeting',
      `Schedule a counseling session with ${student.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Schedule', onPress: () => console.log('Meeting scheduled') },
      ]
    );
  };

  const TabButton = ({ label, value }) => (
    <TouchableOpacity
      style={[styles.tabBtn, selectedTab === value && styles.tabBtnActive]}
      onPress={() => setSelectedTab(value)}
    >
      <Text style={[styles.tabText, selectedTab === value && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Report</Text>
          <TouchableOpacity style={styles.moreBtn}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Student Info Card */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.infoCard}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
          </View>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentEmail}>{student.email}</Text>
          
          <View style={styles.studentDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="school-outline" size={16} color={colors.white} />
              <Text style={styles.detailText}>{student.department}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.white} />
              <Text style={styles.detailText}>{student.year}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="card-outline" size={16} color={colors.white} />
              <Text style={styles.detailText}>{student.registrationNumber}</Text>
            </View>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Overall Mental Health Score</Text>
            <Text style={styles.scoreValue}>{student.score}</Text>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreProgress, { width: `${student.score}%` }]} />
            </View>
            <Text style={styles.scoreStatus}>
              {student.score >= 80 ? 'Excellent' : student.score >= 60 ? 'Good' : 'Needs Attention'}
            </Text>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TabButton label="Overview" value="overview" />
          <TabButton label="Progress" value="progress" />
          <TabButton label="History" value="history" />
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <>
            {/* Category Scores */}
            <View style={styles.chartCard}>
              <Text style={styles.sectionTitle}>Health Categories</Text>
              <ProgressChart
                data={categoryScores}
                width={width - 64}
                height={200}
                strokeWidth={12}
                radius={28}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1, index) => {
                    const colors_array = [colors.primary, colors.secondary, colors.accent, colors.success];
                    return colors_array[index % colors_array.length];
                  },
                }}
                hideLegend={false}
              />
              
              <View style={styles.categoryDetails}>
                {categoryScores.labels.map((label, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <Text style={styles.categoryLabel}>{label}</Text>
                    <View style={styles.categoryRight}>
                      <View style={styles.categoryBar}>
                        <View 
                          style={[
                            styles.categoryProgress, 
                            { width: `${categoryScores.data[index] * 100}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.categoryScore}>
                        {Math.round(categoryScores.data[index] * 100)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Key Concerns */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Concerns</Text>
              {concerns.map((concern, index) => (
                <View key={index} style={styles.concernCard}>
                  <View style={[styles.concernIcon, { backgroundColor: concern.color + '20' }]}>
                    <Ionicons name={concern.icon} size={24} color={concern.color} />
                  </View>
                  <View style={styles.concernInfo}>
                    <View style={styles.concernHeader}>
                      <Text style={styles.concernLabel}>{concern.label}</Text>
                      <View style={[styles.levelBadge, { backgroundColor: concern.color + '20' }]}>
                        <Text style={[styles.levelText, { color: concern.color }]}>
                          {concern.level}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.concernDescription}>{concern.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendCard}>
                  <View style={styles.recommendLeft}>
                    <View style={[
                      styles.recommendIcon,
                      { backgroundColor: rec.priority === 'high' ? colors.error + '20' : 
                                       rec.priority === 'medium' ? colors.warning + '20' : 
                                       colors.success + '20' }
                    ]}>
                      <Ionicons 
                        name={rec.icon} 
                        size={22} 
                        color={rec.priority === 'high' ? colors.error : 
                               rec.priority === 'medium' ? colors.warning : 
                               colors.success} 
                      />
                    </View>
                    <View style={styles.recommendContent}>
                      <Text style={styles.recommendTitle}>{rec.title}</Text>
                      <Text style={styles.recommendDescription}>{rec.description}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.priorityDot,
                    { backgroundColor: rec.priority === 'high' ? colors.error : 
                                      rec.priority === 'medium' ? colors.warning : 
                                      colors.success }
                  ]} />
                </View>
              ))}
            </View>
          </>
        )}

        {selectedTab === 'progress' && (
          <>
            {/* Progress Chart */}
            <View style={styles.chartCard}>
              <Text style={styles.sectionTitle}>Progress Over Time</Text>
              <Text style={styles.chartSubtitle}>Mental health score trend (6 weeks)</Text>
              <LineChart
                data={progressData}
                width={width - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
              />
              
              <View style={styles.progressStats}>
                <View style={styles.progressStatItem}>
                  <Text style={styles.progressStatLabel}>Starting Score</Text>
                  <Text style={styles.progressStatValue}>65</Text>
                </View>
                <View style={styles.progressStatDivider} />
                <View style={styles.progressStatItem}>
                  <Text style={styles.progressStatLabel}>Current Score</Text>
                  <Text style={[styles.progressStatValue, { color: colors.success }]}>85</Text>
                </View>
                <View style={styles.progressStatDivider} />
                <View style={styles.progressStatItem}>
                  <Text style={styles.progressStatLabel}>Improvement</Text>
                  <Text style={[styles.progressStatValue, { color: colors.success }]}>+20</Text>
                </View>
              </View>
            </View>

            {/* Milestones */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Milestones & Achievements</Text>
              <MilestoneItem
                icon="trophy"
                title="First Assessment Completed"
                date="6 weeks ago"
                color={colors.warning}
              />
              <MilestoneItem
                icon="trending-up"
                title="Consistent Improvement"
                date="3 weeks ago"
                color={colors.success}
              />
              <MilestoneItem
                icon="star"
                title="Excellent Score Achieved"
                date="2 days ago"
                color={colors.primary}
              />
            </View>
          </>
        )}

        {selectedTab === 'history' && (
          <>
            {/* Assessment History */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assessment History</Text>
              <Text style={styles.sectionSubtitle}>
                {assessmentHistory.length} assessments completed
              </Text>
              {assessmentHistory.map((assessment) => (
                <TouchableOpacity key={assessment.id} style={styles.historyCard}>
                  <View style={styles.historyLeft}>
                    <View style={[
                      styles.historyIconContainer,
                      { backgroundColor: getStatusColor(assessment.status) + '20' }
                    ]}>
                      <Ionicons 
                        name="document-text" 
                        size={24} 
                        color={getStatusColor(assessment.status)} 
                      />
                    </View>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyCategory}>{assessment.category}</Text>
                      <Text style={styles.historyDate}>{assessment.date}</Text>
                      <View style={styles.historyMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons name="help-circle-outline" size={14} color={colors.textSecondary} />
                          <Text style={styles.metaText}>{assessment.answers} questions</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                          <Text style={styles.metaText}>{assessment.duration}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyScore}>{assessment.score}</Text>
                    <View style={[
                      styles.historyBadge, 
                      { backgroundColor: getStatusColor(assessment.status) + '20' }
                    ]}>
                      <Text style={[
                        styles.historyStatus, 
                        { color: getStatusColor(assessment.status) }
                      ]}>
                        {assessment.status}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleSendMessage}>
            <Ionicons name="mail" size={22} color={colors.white} />
            <Text style={styles.actionText}>Send Message</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.actionBtnSecondary]} 
            onPress={handleScheduleMeeting}
          >
            <Ionicons name="calendar" size={22} color={colors.primary} />
            <Text style={[styles.actionText, styles.actionTextSecondary]}>
              Schedule Meeting
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
            <Ionicons name="download-outline" size={22} color={colors.primary} />
            <Text style={[styles.actionText, styles.actionTextSecondary]}>
              Export Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MilestoneItem = ({ icon, title, date, color }) => (
  <View style={styles.milestoneItem}>
    <View style={[styles.milestoneIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.milestoneContent}>
      <Text style={styles.milestoneTitle}>{title}</Text>
      <Text style={styles.milestoneDate}>{date}</Text>
    </View>
    <View style={[styles.milestoneDot, { backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  moreBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoCard: {
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
  },
  studentName: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.white,
    opacity: 0.9,
    marginBottom: 16,
  },
  studentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.white,
    marginLeft: 6,
  },
  scoreContainer: {
    width: '100%',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 56,
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
    marginBottom: 12,
  },
  scoreBar: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  scoreStatus: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.white,
    opacity: 0.9,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  tabBtnActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: 'Roboto-Bold',
    color: colors.primary,
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoryDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    width: 80,
  },
  categoryRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    marginLeft: 12,
    overflow: 'hidden',
  },
  categoryProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  categoryScore: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginLeft: 12,
    width: 45,
    textAlign: 'right',
  },
  progressStats: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  progressStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  progressStatLabel: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  progressStatValue: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  progressStatDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginTop: -2,
    marginBottom: 16,
  },
  concernCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  concernIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  concernInfo: {
    flex: 1,
  },
  concernHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  concernLabel: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 11,
    fontFamily: 'Roboto-Bold',
    textTransform: 'uppercase',
  },
  concernDescription: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  recommendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recommendIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendContent: {
    flex: 1,
  },
  recommendTitle: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  recommendDescription: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 2,
  },
  milestoneDate: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  milestoneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyCategory: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  historyMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  historyRight: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  historyScore: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: 4,
  },
  historyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  historyStatus: {
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
    textTransform: 'uppercase',
  },
  actionsSection: {
    padding: 20,
    paddingBottom: 40,
  },
  actionBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionBtnSecondary: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.cardShadow,
  },
  actionText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  actionTextSecondary: {
    color: colors.primary,
  },
});