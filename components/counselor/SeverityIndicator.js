// app/components/counselor/SeverityIndicator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getSeverityColor, getSeverityLevel } from '../../constants/severityThresholds';

const SeverityIndicator = ({ 
  score, 
  showLabel = true, 
  showPercentage = true,
  size = 'medium' // small, medium, large
}) => {
  const color = getSeverityColor(score);
  const level = getSeverityLevel(score);

  const sizes = {
    small: {
      circle: 50,
      score: 16,
      label: 10,
      borderWidth: 3,
    },
    medium: {
      circle: 70,
      score: 22,
      label: 11,
      borderWidth: 4,
    },
    large: {
      circle: 100,
      score: 32,
      label: 13,
      borderWidth: 5,
    },
  };

  const currentSize = sizes[size];

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.circle, 
          { 
            width: currentSize.circle,
            height: currentSize.circle,
            borderRadius: currentSize.circle / 2,
            borderColor: color,
            borderWidth: currentSize.borderWidth,
          }
        ]}
      >
        <Text 
          style={[
            styles.score, 
            { 
              fontSize: currentSize.score,
              color: color 
            }
          ]}
        >
          {Math.round(score)}
          {showPercentage && <Text style={styles.percentage}>%</Text>}
        </Text>
      </View>
      
      {showLabel && (
        <View style={[styles.labelContainer, { backgroundColor: color }]}>
          <Text 
            style={[
              styles.label, 
              { fontSize: currentSize.label }
            ]}
          >
            {level.toUpperCase()}
          </Text>
        </View>
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
  score: {
    fontWeight: 'bold',
  },
  percentage: {
    fontSize: 12,
    opacity: 0.8,
  },
  labelContainer: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
});

export default SeverityIndicator;