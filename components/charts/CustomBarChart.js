import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const CustomBarChart = ({
  data,
  title = '',
  yAxisLabel = '',
  yAxisSuffix = '',
  showLegend = true,
  height = 220,
  chartWidth = width - 48,
  showValues = true,
  decimalPlaces = 0,
  fromZero = true,
  segments = 4,
  horizontalLabelRotation = 0,
  verticalLabelRotation = 0,
  withInnerLines = true,
  style = {},
}) => {
  // Default data structure if none provided
  const defaultData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      },
    ],
  };

  const chartData = data || defaultData;

  // Chart configuration
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: decimalPlaces,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`, // Primary blue
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`, // Gray text
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid line
      stroke: '#E5E7EB',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '500',
    },
    barPercentage: 0.7,
    fillShadowGradient: '#6366F1',
    fillShadowGradientOpacity: 1,
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!chartData.datasets || chartData.datasets.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }

    const allData = chartData.datasets[0].data;
    const min = Math.min(...allData);
    const max = Math.max(...allData);
    const sum = allData.reduce((acc, val) => acc + val, 0);
    const avg = sum / allData.length;

    return { min, max, avg: avg.toFixed(1) };
  };

  const stats = calculateStats();

  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      {title && (
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      {/* Chart */}
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={height}
          chartConfig={chartConfig}
          yAxisLabel={yAxisLabel}
          yAxisSuffix={yAxisSuffix}
          showValuesOnTopOfBars={showValues}
          fromZero={fromZero}
          segments={segments}
          horizontalLabelRotation={horizontalLabelRotation}
          verticalLabelRotation={verticalLabelRotation}
          withInnerLines={withInnerLines}
          style={{
            borderRadius: 16,
            paddingRight: 0,
          }}
        />
      </View>

      {/* Legend */}
      {showLegend && chartData.datasets && chartData.datasets[0]?.legend && (
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#6366F1' }]} />
            <Text style={styles.legendText}>{chartData.datasets[0].legend}</Text>
          </View>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  legendContainer: {
    flexDirection: 'row',
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

export default CustomBarChart;