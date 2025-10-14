import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const LineChart = ({
  data,
  title = '',
  yAxisLabel = '',
  yAxisSuffix = '',
  showLegend = true,
  height = 220,
  chartWidth = width - 48,
  withDots = true,
  withInnerLines = true,
  withOuterLines = true,
  withVerticalLines = false,
  withHorizontalLines = true,
  withVerticalLabels = true,
  withHorizontalLabels = true,
  segments = 4,
  bezier = true,
  fromZero = false,
  decimalPlaces = 0,
  transparent = false,
  showDataPoints = true,
  style = {},
}) => {
  // Default data if none provided
  const defaultData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [65, 70, 75, 72, 80, 85],
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`, // Primary blue
        strokeWidth: 2,
      },
    ],
    legend: ['Assessment Scores'],
  };

  const chartData = data || defaultData;

  // Chart configuration
  const chartConfig = {
    backgroundColor: transparent ? 'transparent' : '#FFFFFF',
    backgroundGradientFrom: transparent ? 'transparent' : '#FFFFFF',
    backgroundGradientTo: transparent ? 'transparent' : '#FFFFFF',
    decimalPlaces: decimalPlaces,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#E5E7EB',
      strokeWidth: 1,
    },
    propsForDots: {
      r: showDataPoints ? '5' : '0',
      strokeWidth: '2',
      stroke: '#6366F1',
      fill: '#FFFFFF',
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '500',
    },
    fillShadowGradient: '#6366F1',
    fillShadowGradientOpacity: 0.1,
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!chartData.datasets || chartData.datasets.length === 0) {
      return { min: 0, max: 0, avg: 0, trend: 'stable', change: 0 };
    }

    const allData = chartData.datasets[0].data;
    const min = Math.min(...allData);
    const max = Math.max(...allData);
    const sum = allData.reduce((acc, val) => acc + val, 0);
    const avg = sum / allData.length;

    // Calculate trend (comparing first and last value)
    const firstValue = allData[0];
    const lastValue = allData[allData.length - 1];
    const change = lastValue - firstValue;
    const percentChange = ((change / firstValue) * 100).toFixed(1);
    
    let trend = 'stable';
    if (change > 0) trend = 'improving';
    else if (change < 0) trend = 'declining';

    return {
      min,
      max,
      avg: avg.toFixed(1),
      trend,
      change: percentChange,
    };
  };

  const stats = calculateStats();

  // Get trend icon and color
  const getTrendDisplay = () => {
    if (stats.trend === 'improving') {
      return { icon: '📈', color: '#10B981', text: 'Improving' };
    } else if (stats.trend === 'declining') {
      return { icon: '📉', color: '#EF4444', text: 'Declining' };
    } else {
      return { icon: '➖', color: '#6B7280', text: 'Stable' };
    }
  };

  const trendDisplay = getTrendDisplay();

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {title && <Text style={styles.title}>{title}</Text>}
        
        {/* Trend Indicator */}
        <View style={[styles.trendBadge, { backgroundColor: trendDisplay.color + '20' }]}>
          <Text style={styles.trendIcon}>{trendDisplay.icon}</Text>
          <Text style={[styles.trendText, { color: trendDisplay.color }]}>
            {trendDisplay.text}
          </Text>
          {stats.change !== 0 && (
            <Text style={[styles.trendChange, { color: trendDisplay.color }]}>
              {stats.change > 0 ? '+' : ''}{stats.change}%
            </Text>
          )}
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <RNLineChart
          data={chartData}
          width={chartWidth}
          height={height}
          chartConfig={chartConfig}
          yAxisLabel={yAxisLabel}
          yAxisSuffix={yAxisSuffix}
          withDots={withDots}
          withInnerLines={withInnerLines}
          withOuterLines={withOuterLines}
          withVerticalLines={withVerticalLines}
          withHorizontalLines={withHorizontalLines}
          withVerticalLabels={withVerticalLabels}
          withHorizontalLabels={withHorizontalLabels}
          segments={segments}
          bezier={bezier}
          fromZero={fromZero}
          style={{
            borderRadius: 16,
            paddingRight: 0,
          }}
        />
      </View>

      {/* Legend */}
      {showLegend && chartData.legend && chartData.legend.length > 0 && (
        <View style={styles.legendContainer}>
          {chartData.datasets.map((dataset, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor: dataset.color
                      ? dataset.color(1)
                      : '#6366F1',
                  },
                ]}
              />
              <Text style={styles.legendText}>
                {chartData.legend[index] || `Dataset ${index + 1}`}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Min</Text>
          <Text style={styles.statValue}>{stats.min}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg</Text>
          <Text style={styles.statValue}>{stats.avg}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>{stats.max}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  trendChange: {
    fontSize: 12,
    fontWeight: '700',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
});

export default LineChart;