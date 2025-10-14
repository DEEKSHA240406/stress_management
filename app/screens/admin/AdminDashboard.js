import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function AdminDashboard({ navigation }) {
  const [stats] = useState({
    totalStudents: 1248,
    activeToday: 342,
    completedAssessments: 856,
    needsAttention: 23,
  });

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: 'people',
      color: colors.primary,
      change: '+12%',
    },
    {
      title: 'Active Today',
      value: stats.activeToday,
      icon: 'pulse',
      color: colors.secondary,
      change: '+8%',
    },
    {
      title: 'Assessments',
      value: stats.completedAssessments,
      icon: 'checkmark-circle',
      color: colors.accent,
      change: '+15%',
    },
    {
      title: 'Needs Attention',
      value: stats.needsAttention,
      icon: 'warning',
      color: colors.warning,
      change: '-3%',
    },
  ];

  const quickActions = [
    {
      title: 'View Analytics',
      icon: 'bar-chart',
      color: colors.primary,
      screen: 'Analytics',
    },
    {
      title: 'Student List',
      icon: 'people',
      color: colors.secondary,
      screen: 'Students',
    },
    {
      title: 'Export Reports',
      icon: 'document-text',
      color: colors.accent,
      screen: 'ExportReport',
    },
    {
      title: 'Settings',
      icon: 'settings',
      color: colors.textSecondary,
      screen: 'Settings',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.subtitle}>Admin Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {statCards.map((card, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: card.color + '20' }]}>
                <Ionicons name={card.icon} size={24} color={card.color} />
              </View>
              <Text style={styles.statValue}>{card.value}</Text>
              <Text style={styles.statTitle}>{card.title}</Text>
              <Text style={[styles.statChange, { color: card.change.startsWith('+') ? colors.success : colors.error }]}>
                {card.change}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mental Health Overview</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.overviewCard}
          >
            <View style={styles.overviewRow}>
              <View style={styles.overviewItem}>
                <Ionicons name="happy" size={32} color={colors.white} />
                <Text style={styles.overviewValue}>68%</Text>
                <Text style={styles.overviewLabel}>Good</Text>
              </View>
              <View style={styles.overviewItem}>
                <Ionicons name="sad" size={32} color={colors.white} />
                <Text style={styles.overviewValue}>20%</Text>
                <Text style={styles.overviewLabel}>Moderate</Text>
              </View>
              <View style={styles.overviewItem}>
                <Ionicons name="alert-circle" size={32} color={colors.white} />
                <Text style={styles.overviewValue}>12%</Text>
                <Text style={styles.overviewLabel}>Needs Help</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon} size={28} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <View style={styles.activityCard}>
            <ActivityItem
              icon="person-add"
              color={colors.success}
              title="New Student Registered"
              time="5 mins ago"
            />
            <ActivityItem
              icon="checkmark-done"
              color={colors.primary}
              title="15 Assessments Completed"
              time="1 hour ago"
            />
            <ActivityItem
              icon="alert"
              color={colors.warning}
              title="3 Students Need Attention"
              time="2 hours ago"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ActivityItem = ({ icon, color, title, time }) => (
  <View style={styles.activityItem}>
    <View style={[styles.activityIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
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
  greeting: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginTop: 4,
  },
  notificationBtn: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    margin: 6,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.primary,
  },
  overviewCard: {
    borderRadius: 16,
    padding: 24,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.white,
    marginTop: 4,
    opacity: 0.9,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  actionCard: {
    width: (width - 56) / 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    margin: 6,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
});