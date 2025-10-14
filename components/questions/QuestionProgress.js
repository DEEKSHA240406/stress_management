import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const QuestionProgress = ({
  currentQuestion = 1,
  totalQuestions = 10,
  showPercentage = true,
  showSteps = false,
  color = '#6366F1',
  backgroundColor = '#E5E7EB',
  height = 8,
  style = {},
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  const progress = Math.min(100, (currentQuestion / totalQuestions) * 100);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.label}>
          Question {currentQuestion} of {totalQuestions}
        </Text>
        {showPercentage && (
          <Text style={[styles.percentage, { color }]}>
            {Math.round(progress)}%
          </Text>
        )}
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBar, { height, backgroundColor }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>

      {/* Steps Indicator */}
      {showSteps && (
        <View style={styles.stepsContainer}>
          {[...Array(totalQuestions)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.step,
                {
                  backgroundColor:
                    index < currentQuestion ? color : backgroundColor,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 4,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 4,
  },
  step: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});

export default QuestionProgress;