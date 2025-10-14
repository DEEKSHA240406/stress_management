import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { QUESTION_CATEGORIES, ENCOURAGEMENT_MESSAGES } from '../../../constants';

const { width, height } = Dimensions.get('window');

// Sample questions for each category
const QUESTIONS = {
  [QUESTION_CATEGORIES.JOLLY]: [
    {
      id: 1,
      text: "What's your favorite color?",
      options: ['Red 🔴', 'Blue 🔵', 'Green 🟢', 'Yellow 🟡'],
    },
    {
      id: 2,
      text: 'What makes you smile the most?',
      options: ['Friends 👥', 'Music 🎵', 'Food 🍕', 'Nature 🌳'],
    },
    {
      id: 3,
      text: 'How do you like to spend your free time?',
      options: ['Reading 📚', 'Sports ⚽', 'Gaming 🎮', 'Sleeping 😴'],
    },
  ],
  [QUESTION_CATEGORIES.HEALTH]: [
    {
      id: 4,
      text: 'How many hours do you sleep on average?',
      options: ['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'],
    },
    {
      id: 5,
      text: 'How often do you exercise?',
      options: ['Never', 'Rarely', 'Sometimes', 'Regularly'],
    },
    {
      id: 6,
      text: 'How would you rate your diet?',
      options: ['Poor', 'Fair', 'Good', 'Excellent'],
    },
  ],
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: [
    {
      id: 7,
      text: 'How often do you feel stressed?',
      options: ['Rarely', 'Sometimes', 'Often', 'Always'],
    },
    {
      id: 8,
      text: 'Do you feel overwhelmed by your responsibilities?',
      options: ['Not at all', 'Slightly', 'Moderately', 'Very much'],
    },
    {
      id: 9,
      text: 'How would you describe your mood lately?',
      options: ['Great 😊', 'Good 🙂', 'Okay 😐', 'Not good 😟'],
    },
    {
      id: 10,
      text: 'Do you have someone to talk to when you need support?',
      options: ['Always', 'Usually', 'Sometimes', 'Never'],
    },
  ],
};

const QuestionScreen = ({ navigation }) => {
  const [currentCategory, setCurrentCategory] = useState(QUESTION_CATEGORIES.JOLLY);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const emojiScale = useRef(new Animated.Value(0)).current;
  const emojiOpacity = useRef(new Animated.Value(0)).current;

  // Get all questions in order
  const allQuestions = [
    ...QUESTIONS[QUESTION_CATEGORIES.JOLLY],
    ...QUESTIONS[QUESTION_CATEGORIES.HEALTH],
    ...QUESTIONS[QUESTION_CATEGORIES.MENTAL_HEALTH],
  ];

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    // Animate question entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentQuestionIndex]);

  const handleAnswer = (option, index) => {
    // Save answer
    const newAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer: option,
    };
    setAnswers([...answers, newAnswer]);

    // Trigger celebration animation
    setShowCelebration(true);
    Animated.parallel([
      Animated.spring(emojiScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(emojiOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Wait for animation then move to next question
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const moveToNextQuestion = () => {
    // Reset celebration
    setShowCelebration(false);
    emojiScale.setValue(0);
    emojiOpacity.setValue(0);

    // Fade out current question
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Check if there are more questions
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        fadeAnim.setValue(1);
        slideAnim.setValue(50);
      } else {
        // All questions answered - navigate to results
        navigation.navigate('Result', { answers, totalQuestions });
      }
    });
  };

  const getCategoryColor = () => {
    if (currentQuestionIndex < 3) return '#6366F1'; // Jolly - Blue
    if (currentQuestionIndex < 6) return '#10B981'; // Health - Green
    return '#EC4899'; // Mental Health - Pink
  };

  const getCategoryName = () => {
    if (currentQuestionIndex < 3) return 'Jolly Questions';
    if (currentQuestionIndex < 6) return 'Health Questions';
    return 'Mental Health Questions';
  };

  const getRandomEmoji = () => {
    const emojis = ['🎉', '⭐', '👍', '💪', '🌟', '✨', '🎊', '💯', '🔥'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const getRandomEncouragement = () => {
    return ENCOURAGEMENT_MESSAGES[
      Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
    ];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Alert.alert(
              'Exit Assessment',
              'Are you sure you want to exit? Your progress will be lost.',
              [
                { text: 'Continue', style: 'cancel' },
                {
                  text: 'Exit',
                  style: 'destructive',
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          }}
        >
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.categoryBadge}>
          <Text style={[styles.categoryText, { color: getCategoryColor() }]}>
            {getCategoryName()}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: getCategoryColor(),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} of {totalQuestions}
        </Text>
      </View>

      {/* Question Card */}
      <Animated.View
        style={[
          styles.questionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}</Text>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswer(option, index)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Celebration Overlay */}
      {showCelebration && (
        <View style={styles.celebrationOverlay}>
          {/* Multiple Emojis Burst */}
          {[...Array(8)].map((_, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.celebrationEmoji,
                {
                  opacity: emojiOpacity,
                  transform: [
                    { scale: emojiScale },
                    {
                      translateX: Math.cos((i * Math.PI) / 4) * 100,
                    },
                    {
                      translateY: Math.sin((i * Math.PI) / 4) * 100,
                    },
                  ],
                },
              ]}
            >
              {getRandomEmoji()}
            </Animated.Text>
          ))}

          {/* Thumbs Up Center */}
          <Animated.Text
            style={[
              styles.thumbsUp,
              {
                opacity: emojiOpacity,
                transform: [{ scale: emojiScale }],
              },
            ]}
          >
            👍
          </Animated.Text>

          {/* Encouragement Message */}
          <Animated.View
            style={[
              styles.encouragementContainer,
              {
                opacity: emojiOpacity,
                transform: [{ scale: emojiScale }],
              },
            ]}
          >
            <Text style={styles.encouragementText}>
              {getRandomEncouragement()}
            </Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
  },
  categoryBadge: {
    flex: 1,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  celebrationEmoji: {
    position: 'absolute',
    fontSize: 40,
  },
  thumbsUp: {
    fontSize: 100,
    marginBottom: 20,
  },
  encouragementContainer: {
    position: 'absolute',
    bottom: 150,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  encouragementText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
    textAlign: 'center',
  },
});

export default QuestionScreen;