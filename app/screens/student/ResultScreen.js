import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  CATEGORY_COLORS,
  CATEGORY_NAMES,
  CATEGORY_ICONS,
  QUESTION_CATEGORIES,
} from '../../../constants/questionCategories';

const ResultScreen = ({ navigation, route }) => {
  const { answers = [], totalQuestions = 0, userProfile } = route.params || {};

  useEffect(() => {
    console.log('📊 Results loaded:', {
      totalAnswers: answers.length,
      totalQuestions,
      userProfile,
    });
  }, []);

  const getCategoryStats = () => {
    const stats = {};
    
    // Initialize all categories
    Object.values(QUESTION_CATEGORIES).forEach(category => {
      stats[category] = {
        answered: 0,
        total: 0,
      };
    });

    // Count answers by category
    answers.forEach(answer => {
      if (answer.category && stats[answer.category]) {
        stats[answer.category].answered++;
      }
    });

    return stats;
  };

  const categoryStats = getCategoryStats();

  const handleDone = () => {
    navigation.navigate('StudentDashboard');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Success Header */}
        <View style={styles.header}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.title}>Assessment Complete!</Text>
          <Text style={styles.subtitle}>
            Great job completing your mental wellness check-in
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Questions Answered</Text>
            <Text style={styles.summaryValue}>{answers.length} / {totalQuestions}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time Spent</Text>
            <Text style={styles.summaryValue}>~{Math.ceil(answers.length * 0.5)} min</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Completion Rate</Text>
            <Text style={styles.summaryValue}>
              {totalQuestions > 0 ? Math.round((answers.length / totalQuestions) * 100) : 0}%
            </Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          
          {Object.keys(categoryStats).map((categoryKey) => {
            const stat = categoryStats[categoryKey];
            const categoryName = CATEGORY_NAMES[categoryKey];
            const categoryIcon = CATEGORY_ICONS[categoryKey];
            const categoryColor = CATEGORY_COLORS[categoryKey];

            if (stat.answered === 0) return null;

            return (
              <View
                key={categoryKey}
                style={[styles.categoryCard, { borderLeftColor: categoryColor }]}
              >
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryIcon}>{categoryIcon}</Text>
                  <Text style={styles.categoryName}>{categoryName}</Text>
                </View>
                <Text style={styles.categoryCount}>
                  {stat.answered} question{stat.answered !== 1 ? 's' : ''} answered
                </Text>
              </View>
            );
          })}
        </View>

        {/* Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsIcon}>💡</Text>
          <Text style={styles.insightsTitle}>What's Next?</Text>
          <Text style={styles.insightsText}>
            Your responses help us understand your wellness better. Consider taking regular
            assessments to track your progress over time.
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleDone}>
          <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.secondaryButton} onPress={handleViewHistory}>
          <Text style={styles.secondaryButtonText}>View History</Text>
        </TouchableOpacity> */}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 36,
  },
  insightsCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  insightsIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 8,
  },
  insightsText: {
    fontSize: 14,
    color: '#6366F1',
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ResultScreen;