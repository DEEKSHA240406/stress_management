// app/components/mentor/ProgressIndicator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getSeverityColor } from '../../constants/severityThresholds';

const ProgressIndicator = ({ 
  currentScore, 
  previousScore, 
  size = 'medium',
  showChange = true,
  showPercentage = true
}) => {
  const change = currentScore - previousScore;
  const isImproving = change > 0;
  const color = getSeverityColor(currentScore);

  const sizes = {
    small: { 
      container: 60, 
      score: 16, 
      label: 10,
      change: 11,
      borderWidth: 3,
      changeBadge: { paddingHorizontal: 6, paddingVertical: 2 },
    },
    medium: { 
      container: 80, 
      score: 22, 
      label: 12,
      change: 12,
      borderWidth: 4,
      changeBadge: { paddingHorizontal: 8, paddingVertical: 4 },
    },
    large: { 
      container: 110, 
      score: 28, 
      label: 14,
      change: 13,
      borderWidth: 5,
      changeBadge: { paddingHorizontal: 10, paddingVertical: 6 },
    },
  };

  const currentSize = sizes[size];

  const getChangeColor = () => {
    if (change > 10) return '#388E3C'; // Significant improvement
    if (change > 0) return '#66BB6A';  // Slight improvement
    if (change < -10) return '#D32F2F'; // Significant decline
    if (change < 0) return '#F57C00';  // Slight decline
    return '#95A5A6'; // No change
  };

  const getChangeIcon = () => {
    if (change > 0) return 'trending-up';
    if (change < 0) return 'trending-down';
    return 'trending-neutral';
  };

  return (
    <View style={styles.container}>
      {/* Main Progress Circle */}
      <View 
        style={[
          styles.circle,
          { 
            width: currentSize.container,
            height: currentSize.container,
            borderRadius: currentSize.container / 2,
            borderColor: color,
            borderWidth: currentSize.borderWidth,
          }
        ]}
      >
        <Text style={[styles.scoreText, { fontSize: currentSize.score, color }]}>
          {Math.round(currentScore)}
        </Text>
        {showPercentage && (
          <Text style={[styles.percentText, { fontSize: currentSize.label, color }]}>
            %
          </Text>
        )}
      </View>
      
      {/* Change Indicator */}
      {showChange && previousScore !== null && previousScore !== undefined && change !== 0 && (
        <View style={[
          styles.changeBadge,
          currentSize.changeBadge,
          { backgroundColor: getChangeColor() }
        ]}>
          <Icon 
            name={getChangeIcon()} 
            size={currentSize.change} 
            color="#FFF" 
          />
          <Text style={[styles.changeText, { fontSize: currentSize.change }]}>
            {Math.abs(change).toFixed(1)}%
          </Text>
        </View>
      )}

      {/* Status Label */}
      {showChange && previousScore !== null && previousScore !== undefined && (
        <Text style={[styles.statusLabel, { fontSize: currentSize.label }]}>
          {isImproving ? 'Improving' : change < 0 ? 'Declining' : 'Stable'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  scoreText: {
    fontWeight: 'bold',
  },
  percentText: {
    position: 'absolute',
    bottom: '28%',
    fontWeight: '600',
    opacity: 0.7,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 12,
  },
  changeText: {
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 4,
  },
  statusLabel: {
    marginTop: 6,
    fontWeight: '600',
    color: '#7F8C8D',
  },
});

export default ProgressIndicator;