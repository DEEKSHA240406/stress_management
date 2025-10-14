import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const CustomPieChart = ({
  data,
  title = '',
  showLegend = true,
  height = 220,
  chartWidth = width - 48,
  showPercentage = true,
  hasLegend = true,
  accessor = 'value',
  backgroundColor = 'transparent',
  paddingLeft = '15',
  absolute = false,
  style = {},
}) => {
  // Default data if none provided
  const defaultData = [
    {
      name: 'Excellent',
      value: 45,
      color: '#10B981',
      legendFontColor: '#6B7280',
      legendFontSize: 13,
    },
    {
      name: 'Good',
      value: 30,
      color: '#F59E0B',
      legendFontColor: '#6B7280',
      legendFontSize: 13,
    },
    {
      name: 'Fair',
      value: 15,
      color: '#F97316',
      legendFontColor: '#6B7280',
      legendFontSize: 13,
    },
    {
      name: 'Needs Support',
      value: 10,
      color: '#EF4444',
      legendFontColor: '#6B7280',
      legendFontSize: 13,
    },
  ];

  const chartData = data || defaultData;

  // Chart configuration
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  // Calculate total and percentages
  const calculateStats = () => {
    const total = chartData.reduce((sum, item) => sum + item[accessor], 0);
    
    const dataWithPercentages = chartData.map((item) => ({
      ...item,
      percentage: total > 0 ? ((item[accessor] / total) * 100).toFixed(1) : 0,
    }));

    return { total, dataWithPercentages };
  };

  const { total, dataWithPercentages } = calculateStats();

  // Get the largest category
  const getLargestCategory = () => {
    if (chartData.length === 0) return null;
    return chartData.reduce((max, item) =>
      item[accessor] > max[accessor] ? item : max
    );
  };

  const largestCategory = getLargestCategory();

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
        <PieChart
          data={chartData}
          width={chartWidth}
          height={height}
          chartConfig={chartConfig}
          accessor={accessor}
          backgroundColor={backgroundColor}
          paddingLeft={paddingLeft}
          hasLegend={false} // We'll create custom legend
          absolute={absolute}
          style={{
            borderRadius: 16,
          }}
        />
      </View>

      {/* Custom Legend with Percentages */}
      {showLegend && (
        <View style={styles.legendContainer}>
          {dataWithPercentages.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={styles.legendLeft}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendName}>{item.name}</Text>
              </View>
              <View style={styles.legendRight}>
                <Text style={styles.legendValue}>{item[accessor]}</Text>
                {showPercentage && (
                  <Text style={styles.legendPercentage}>({item.percentage}%)</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Summary Statistics */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>{total}</Text>
        </View>
        {largestCategory && (
          <>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Highest</Text>
              <View style={styles.highestContainer}>
                <View
                  style={[
                    styles.highestDot,
                    { backgroundColor: largestCategory.color },
                  ]}
                />
                <Text style={styles.summaryValue}>{largestCategory.name}</Text>
              </View>
            </View>
          </>
        )}
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
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  legendLeft: {
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
  legendName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 6,
  },
  legendPercentage: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  highestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highestDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
});

export default CustomPieChart;