import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const ProgressBar = ({
  progress = 0, // 0 to 100
  height = 8,
  color = '#6366F1',
  backgroundColor = '#E5E7EB',
  showLabel = false,
  label = null,
  animated = true,
  borderRadius = 4,
  style = {},
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [progress, animated]);

  const progressPercentage = Math.min(100, Math.max(0, progress));

  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label || `${progressPercentage}%`}</Text>
        </View>
      )}

      {/* Progress Bar */}
      <View
        style={[
          styles.progressBar,
          {
            height,
            backgroundColor,
            borderRadius,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              width,
              backgroundColor: color,
              borderRadius,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressBar: {
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});

export default ProgressBar;