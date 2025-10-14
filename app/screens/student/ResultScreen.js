import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const { width } = Dimensions.get('window');

const COMPLETION_MESSAGES = [
  "You did it! 🎊",
  "Assessment completed successfully! ✨",
  "Great work completing the assessment! 🌟",
  "Thank you for taking the time! 💙",
  "Well done! Your responses have been recorded! ✅",
];

const ResultScreen = ({ navigation, route }) => {
  const { answers, totalQuestions } = route.params;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const confettiAnims = useRef([...Array(20)].map(() => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    opacity: new Animated.Value(1),
  }))).current;

  const [score, setScore] = useState(0);
  const [analysis, setAnalysis] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [riskLevel, setRiskLevel] = useState('');

  useEffect(() => {
    calculateResults();
    startAnimations();
    saveAssessment();
  }, []);

  const calculateResults = () => {
    let calculatedScore = 0;
    
    answers.forEach((answer) => {
      if (answer.answer.includes('Great') || answer.answer.includes('Always') || answer.answer.includes('Excellent')) {
        calculatedScore += 10;
      } else if (answer.answer.includes('Good') || answer.answer.includes('Usually') || answer.answer.includes('7-8 hours')) {
        calculatedScore += 8;
      } else if (answer.answer.includes('Okay') || answer.answer.includes('Sometimes') || answer.answer.includes('Fair')) {
        calculatedScore += 5;
      } else if (answer.answer.includes('Rarely') || answer.answer.includes('5-6 hours')) {
        calculatedScore += 3;
      } else {
        calculatedScore += 1;
      }
    });

    const normalizedScore = Math.round((calculatedScore / (totalQuestions * 10)) * 100);
    setScore(normalizedScore);

    if (normalizedScore >= 80) {
      setRiskLevel('Excellent');
      setAnalysis('Your mental health appears to be in great shape! Keep up the good work with your self-care routines.');
      setRecommendation('Continue your healthy habits and consider helping others on their wellness journey.');
    } else if (normalizedScore >= 60) {
      setRiskLevel('Good');
      setAnalysis("You're doing well overall. There are some areas where you could improve to enhance your mental wellness.");
      setRecommendation('Focus on maintaining good sleep habits, regular exercise, and stress management techniques.');
    } else if (normalizedScore >= 40) {
      setRiskLevel('Fair');
      setAnalysis('Your responses indicate some areas of concern. Consider making some positive changes to support your mental health.');
      setRecommendation('Try incorporating meditation, better sleep hygiene, and talking to someone you trust about your feelings.');
    } else {
      setRiskLevel('Needs Support');
      setAnalysis('Your responses suggest you may benefit from additional support. Remember, seeking help is a sign of strength.');
      setRecommendation('Please consider speaking with a mental health professional. Check out our resources or contact a crisis helpline if needed.');
    }
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    confettiAnims.forEach((anim, index) => {
      const angle = (index / confettiAnims.length) * Math.PI * 2;
      const distance = 150 + Math.random() * 100;
      
      Animated.parallel([
        Animated.timing(anim.x, {
          toValue: Math.cos(angle) * distance,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(anim.y, {
          toValue: Math.sin(angle) * distance,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const saveAssessment = async () => {
    try {
      const assessment = {
        date: new Date().toISOString(),
        score: score,
        totalQuestions: totalQuestions,
        answers: answers,
        riskLevel: riskLevel,
        duration: '8 min',
        category: 'All',
      };

      const existingHistory = await AsyncStorage.getItem('@assessment_history');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.push(assessment);
      await AsyncStorage.setItem('@assessment_history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const getStatusColor = () => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  const getStatusEmoji = () => {
    if (score >= 80) return '😊';
    if (score >= 60) return '🙂';
    if (score >= 40) return '😐';
    return '😟';
  };

  const getRandomCompletionMessage = () => {
    return COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];
  };

  const handleGoHome = () => {
    // Navigate back to Home tab in StudentTabs
    navigation.navigate('StudentTabs', { screen: 'Home' });
  };

  const handleViewHistory = () => {
    navigation.navigate('StudentTabs', { screen: 'History' });
  };

  const handleViewResources = () => {
    navigation.navigate('StudentTabs', { screen: 'Resources' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.confettiContainer}>
        {confettiAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                opacity: anim.opacity,
                transform: [
                  { translateX: anim.x },
                  { translateY: anim.y },
                ],
              },
            ]}
          >
            <Text style={styles.confettiEmoji}>
              {['🎉', '⭐', '✨', '🌟', '💫'][index % 5]}
            </Text>
          </Animated.View>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.completionIcon}>🎊</Text>
            <Text style={styles.completionTitle}>Assessment Complete!</Text>
            <Text style={styles.completionMessage}>
              {getRandomCompletionMessage()}
            </Text>
          </View>

          <View style={styles.scoreContainer}>
            <View style={[styles.scoreCircle, { borderColor: getStatusColor() }]}>
              <Text style={styles.scoreEmoji}>{getStatusEmoji()}</Text>
              <Text style={[styles.scoreNumber, { color: getStatusColor() }]}>
                {score}
              </Text>
              <Text style={styles.scoreLabel}>out of 100</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {riskLevel}
              </Text>
            </View>
          </View>

          <View style={styles.analysisCard}>
            <Text style={styles.analysisTitle}>Your Assessment Summary 📋</Text>
            <Text style={styles.analysisText}>{analysis}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalQuestions}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{moment().format('MMM DD')}</Text>
              <Text style={styles.statLabel}>Date</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8 min</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
          </View>

          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationIcon}>💡</Text>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Recommendations</Text>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
              <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>

            <View style={styles.secondaryButtons}>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleViewHistory}>
                <Text style={styles.secondaryButtonIcon}>📈</Text>
                <Text style={styles.secondaryButtonText}>View History</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={handleViewResources}>
                <Text style={styles.secondaryButtonIcon}>📚</Text>
                <Text style={styles.secondaryButtonText}>Resources</Text>
              </TouchableOpacity>
            </View>
          </View>

          {score < 40 && (
            <View style={styles.emergencyCard}>
              <Text style={styles.emergencyIcon}>🆘</Text>
              <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
              <Text style={styles.emergencyText}>
                If you're in crisis, please reach out to a professional immediately
              </Text>
              <TouchableOpacity style={styles.emergencyButton}>
                <Text style={styles.emergencyButtonText}>Crisis Helpline</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.quoteCard}>
            <Text style={styles.quoteIcon}>"</Text>
            <Text style={styles.quoteText}>
              Taking care of your mental health is an act of self-love. You're taking the right steps!
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  confettiContainer: {
    position: 'absolute',
    top: 200,
    left: width / 2,
    zIndex: 10,
  },
  confetti: {
    position: 'absolute',
  },
  confettiEmoji: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  completionIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  completionMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  scoreEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  recommendationIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#B45309',
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 24,
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
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  emergencyCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FEE2E2',
    marginBottom: 20,
  },
  emergencyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emergencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quoteCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  quoteIcon: {
    fontSize: 48,
    color: '#6366F1',
    opacity: 0.3,
    lineHeight: 32,
  },
  quoteText: {
    fontSize: 15,
    color: '#4F46E5',
    fontStyle: 'italic',
    lineHeight: 22,
  },
});

export default ResultScreen;