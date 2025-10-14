import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [timeFilter, setTimeFilter] = useState('month');
  const [loading, setLoading] = useState(false);

  // Mental Health Distribution Data for Pie Chart
  const mentalHealthData = [
    {
      name: 'Good Mental Health',
      population: 472,
      color: colors.success,
      legendFontColor: colors.text,
      legendFontSize: 13,
    },
    {
      name: 'Stress Issues',
      population: 342,
      color: colors.error,
      legendFontColor: colors.text,
      legendFontSize: 13,
    },
    {
      name: 'Anxiety',
      population: 278,
      color: colors.warning,
      legendFontColor: colors.text,
      legendFontSize: 13,
    },
    {
      name: 'Depression',
      population: 156,
      color: colors.accent,
      legendFontColor: colors.text,
      legendFontSize: 13,
    },
  ];

  // Calculate percentages
  const totalStudents = mentalHealthData.reduce((sum, item) => sum + item.population, 0);

  // Top Reasons Bar Chart Data
  const reasonsData = {
    labels: ['Academic', 'Social', 'Family', 'Financial', 'Health', 'Other'],
    datasets: [
      {
        data: [285, 198, 156, 134, 89, 67],
        color: (opacity = 1) => colors.primary,
      },
    ],
  };

  // Trend Line Chart Data
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [45, 52, 48, 58, 62, 68],
        color: (opacity = 1) => colors.success,
        strokeWidth: 3,
      },
      {
        data: [38, 35, 42, 38, 32, 28],
        color: (opacity = 1) => colors.warning,
        strokeWidth: 3,
      },
      {
        data: [17, 13, 10, 4, 6, 4],
        color: (opacity = 1) => colors.error,
        strokeWidth: 3,
      },
    ],
    legend: ['Good', 'Moderate', 'Critical'],
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
    propsForLabels: {
      fontFamily: 'Roboto-Regular',
      fontSize: 10,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.borderLight,
      strokeWidth: 1,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
    },
  };

  const TimeFilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[styles.filterBtn, timeFilter === value && styles.filterBtnActive]}
      onPress={() => setTimeFilter(value)}
    >
      <Text
        style={[styles.filterText, timeFilter === value && styles.filterTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Analytics Dashboard</Text>
            <Text style={styles.subtitle}>Mental Health Insights & Reports</Text>
          </View>
          <TouchableOpacity style={styles.exportBtn}>
            <Ionicons name="download-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Time Filter */}
        <View style={styles.filterContainer}>
          <TimeFilterButton label="Week" value="week" />
          <TimeFilterButton label="Month" value="month" />
          <TimeFilterButton label="Quarter" value="quarter" />
          <TimeFilterButton label="Year" value="year" />
        </View>

        {/* Summary Stats Grid */}
        <View style={styles.statsGrid}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <Ionicons name="people" size={32} color={colors.white} />
            <Text style={styles.statValue}>1,248</Text>
            <Text style={styles.statLabel}>Total Students</Text>
            <Text style={styles.statChange}>+12% from last month</Text>
          </LinearGradient>

          <LinearGradient
            colors={[colors.success, colors.secondaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <Ionicons name="checkmark-circle" size={32} color={colors.white} />
            <Text style={styles.statValue}>856</Text>
            <Text style={styles.statLabel}>Assessments Done</Text>
            <Text style={styles.statChange}>+18% completion rate</Text>
          </LinearGradient>
        </View>

        {/* Mental Health Distribution - Pie Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Mental Health Distribution</Text>
              <Text style={styles.chartSubtitle}>Current status overview</Text>
            </View>
            <TouchableOpacity style={styles.infoBtn}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <PieChart
            data={mentalHealthData}
            width={width - 48}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend={false}
          />

          {/* Custom Legend with Percentages */}
          <View style={styles.legendContainer}>
            {mentalHealthData.map((item, index) => {
              const percentage = ((item.population / totalStudents) * 100).toFixed(1);
              return (
                <View key={index} style={styles.legendItem}>
                  <View style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendLabel}>{item.name}</Text>
                  </View>
                  <View style={styles.legendStats}>
                    <Text style={styles.legendCount}>{item.population}</Text>
                    <Text style={styles.legendPercent}>{percentage}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Top Reasons - Bar Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Top Reasons for Mental Health Issues</Text>
              <Text style={styles.chartSubtitle}>What affects students most</Text>
            </View>
            <Ionicons name="bar-chart" size={20} color={colors.primary} />
          </View>

          <BarChart
            data={reasonsData}
            width={width - 64}
            height={240}
            chartConfig={{
              ...chartConfig,
              barPercentage: 0.7,
              color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            }}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
            yAxisSuffix=""
          />

          {/* Reason Details */}
          <View style={styles.reasonDetails}>
            {reasonsData.labels.map((label, index) => (
              <View key={index} style={styles.reasonItem}>
                <Text style={styles.reasonLabel}>{label}</Text>
                <View style={styles.reasonBar}>
                  <View 
                    style={[
                      styles.reasonProgress, 
                      { width: `${(reasonsData.datasets[0].data[index] / 285) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.reasonCount}>{reasonsData.datasets[0].data[index]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trend Analysis - Line Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Mental Health Trends</Text>
              <Text style={styles.chartSubtitle}>6-month comparison</Text>
            </View>
            <Ionicons name="trending-up" size={20} color={colors.success} />
          </View>

          <LineChart
            data={trendData}
            width={width - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            yAxisSuffix="%"
          />

          {/* Trend Legend */}
          <View style={styles.trendLegend}>
            <View style={styles.trendLegendItem}>
              <View style={[styles.trendDot, { backgroundColor: colors.success }]} />
              <Text style={styles.trendLegendText}>Good Mental Health</Text>
            </View>
            <View style={styles.trendLegendItem}>
              <View style={[styles.trendDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.trendLegendText}>Moderate Concern</Text>
            </View>
            <View style={styles.trendLegendItem}>
              <View style={[styles.trendDot, { backgroundColor: colors.error }]} />
              <Text style={styles.trendLegendText}>Critical Cases</Text>
            </View>
          </View>
        </View>

        {/* Detailed Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Statistics</Text>
          
          <StatRow
            icon="alert-circle"
            label="Students Needing Immediate Attention"
            value="23"
            color={colors.error}
            trend="-5"
            trendPositive={true}
          />
          <StatRow
            icon="warning"
            label="Students with Moderate Concerns"
            value="67"
            color={colors.warning}
            trend="+8"
            trendPositive={false}
          />
          <StatRow
            icon="trending-up"
            label="Overall Improvement Rate"
            value="78%"
            color={colors.success}
            trend="+12"
            trendPositive={true}
          />
          <StatRow
            icon="time"
            label="Average Response Time"
            value="24h"
            color={colors.info}
            trend="-6h"
            trendPositive={true}
          />
          <StatRow
            icon="school"
            label="Academic Stress Cases"
            value="285"
            color={colors.accent}
            trend="+15"
            trendPositive={false}
          />
          <StatRow
            icon="heart"
            label="Students Receiving Support"
            value="194"
            color={colors.secondary}
            trend="+24"
            trendPositive={true}
          />
        </View>

        {/* Export Section */}
        <View style={styles.exportSection}>
          <TouchableOpacity style={styles.fullExportBtn}>
            <Ionicons name="document-text" size={24} color={colors.white} />
            <View style={styles.exportBtnContent}>
              <Text style={styles.exportBtnText}>Generate Full Report</Text>
              <Text style={styles.exportBtnSubtext}>Export as PDF, Excel or CSV</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const StatRow = ({ icon, label, value, color, trend, trendPositive }) => (
  <View style={styles.statRow}>
    <View style={styles.statLeft}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statLabel2}>{label}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={trendPositive ? 'trending-down' : 'trending-up'} 
              size={14} 
              color={trendPositive ? colors.success : colors.error} 
            />
            <Text style={[
              styles.trendText, 
              { color: trendPositive ? colors.success : colors.error }
            ]}>
              {trend}
            </Text>
          </View>
        )}
      </View>
    </View>
    <Text style={[styles.statValue2, { color }]}>{value}</Text>
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
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginTop: 4,
  },
  exportBtn: {
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
    fontFamily: 'Roboto-Bold',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  statValue: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.white,
    opacity: 0.9,
  },
  statChange: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.white,
    opacity: 0.8,
    marginTop: 8,
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  chartSubtitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoBtn: {
    padding: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    flex: 1,
  },
  legendStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendCount: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginRight: 8,
  },
  legendPercent: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  reasonDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reasonLabel: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    width: 80,
  },
  reasonBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  reasonProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  reasonCount: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    width: 40,
    textAlign: 'right',
  },
  trendLegend: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  trendLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  trendLegendText: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: 16,
  },
  statRow: {
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
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel2: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    marginLeft: 4,
  },
  statValue2: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  exportSection: {
    padding: 20,
    paddingBottom: 40,
  },
  fullExportBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exportBtnContent: {
    flex: 1,
    marginLeft: 16,
  },
  exportBtnText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  exportBtnSubtext: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    opacity: 0.9,
  },
});