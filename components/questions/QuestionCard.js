import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const QuestionCard = ({
  questionNumber = 1,
  totalQuestions = 10,
  question = '',
  category = '',
  children,
  style = {},
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Reset and animate when question changes
    fadeAnim.setValue(0);
    slideAnim.setValue(30);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [question]);

  // Get category color
  const getCategoryColor = () => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('jolly')) return '#6366F1';
    if (lowerCategory.includes('health')) return '#10B981';
    if (lowerCategory.includes('mental')) return '#EC4899';
    return '#6B7280';
  };

  const categoryColor = getCategoryColor();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* Question Number */}
        <View style={styles.numberContainer}>
          <Text style={styles.questionNumberLabel}>Question</Text>
          <Text style={styles.questionNumber}>
            {questionNumber} / {totalQuestions}
          </Text>
        </View>

        {/* Category Badge */}
        {category && (
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {category}
            </Text>
          </View>
        )}
      </View>

      {/* Question Text */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      {/* Options/Children */}
      <View style={styles.childrenContainer}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  numberContainer: {
    flexDirection: 'column',
  },
  questionNumberLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 28,
  },
  childrenContainer: {
    marginTop: 8,
  },
});

export default QuestionCard;