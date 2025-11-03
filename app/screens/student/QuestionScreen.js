import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  QUESTION_CATEGORIES,
  GENDER_TYPES,
  AGE_GROUPS,
  CATEGORY_COLORS,
  CATEGORY_NAMES,
  CATEGORY_ICONS,
  QUESTION_SOUNDS,
  getQuestionsByCategory,
  getAllQuestions,
  hasSensitiveContent,
  getGentlePhrasing,
  detectAgeGroup,
  playQuestionSound,
} from '../../../constants/questionCategories';

const { width, height } = Dimensions.get('window');

// Encouragement messages
const ENCOURAGEMENT_MESSAGES = [
  'Great job! 🌟',
  'You\'re doing amazing! 💪',
  'Keep going! ✨',
  'Well done! 👏',
  'Fantastic! 🎉',
  'You\'re awesome! 🌈',
  'Excellent choice! 💯',
  'You\'re crushing it! 🚀',
  'Brilliant! 🌟',
  'Superb! ⭐',
];

// Different emojis for variety
const CELEBRATION_EMOJIS = [
  '🎉', '🌟', '✨', '💫', '⭐', '🎊', '🎈', '🎁', 
  '💝', '🌈', '🦋', '🌺', '🌸', '🌼', '🌻', '🏆',
  '👏', '💪', '🔥', '💯', '✅', '👍', '🙌', '💖',
  '🎯', '🚀', '💎', '🌙', '☀️', '🎵', '🎶', '💐'
];

// Sound files array
const SOUND_FILES = [
  // require('../../../assets/sounds/celebration.mp3'),
  // require('../../../assets/sounds/correct.mp3'),
  // require('../../../assets/sounds/encouragement.mp3'),
  require('../../../assets/sounds/thumbs-up.mp3'),
  require('../../../assets/sounds/start.mp3'),
];

const QuestionScreen = ({ navigation, route }) => {
  // Get user profile from navigation params or previous screen
  const userProfile = route?.params?.userProfile || {
    gender: GENDER_TYPES.PREFER_NOT_TO_SAY,
    age: 25,
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [particles, setParticles] = useState([]);
  const [sound, setSound] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Detect age group
  const ageGroup = detectAgeGroup(userProfile.age);

  // Get filtered questions based on user profile
  const allQuestions = getAllQuestions({
    gender: userProfile.gender,
    ageGroup: ageGroup,
  });

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Clean up sound on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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

  const playSound = async (questionIndex) => {
    try {
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Rotate through different sounds based on question index
      const soundFile = SOUND_FILES[questionIndex % SOUND_FILES.length];

      const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
      setSound(newSound);
      await newSound.playAsync();
      
      console.log(`🔊 Playing sound ${questionIndex % SOUND_FILES.length + 1} for question ${questionIndex + 1}`);
    } catch (error) {
      console.log('Sound playback error:', error);
    }
  };

  const getRandomEmoji = () => {
    return CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];
  };

  const createParticles = () => {
    const particleCount = 25; // More particles for fuller effect
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      // Random angle for each particle
      const angle = (Math.random() * 360 * Math.PI) / 180;
      
      // Random distance (some go further than others)
      const distance = 100 + Math.random() * 200;
      
      // Random velocity for natural feel
      const velocity = 0.5 + Math.random() * 0.5;
      
      // Random rotation
      const rotation = Math.random() * 720 - 360;
      
      // Random size variation
      const scale = 0.6 + Math.random() * 0.8;

      newParticles.push({
        id: i,
        emoji: getRandomEmoji(),
        translateX: new Animated.Value(0),
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(1),
        scale: new Animated.Value(0),
        rotate: new Animated.Value(0),
        angle,
        distance: distance * velocity,
        rotation,
        finalScale: scale,
      });
    }

    setParticles(newParticles);
    return newParticles;
  };

  const triggerGPayBurst = () => {
    const newParticles = createParticles();

    // Animate all particles
    newParticles.forEach((particle, index) => {
      // Stagger the animations slightly for more natural effect
      const delay = index * 15;

      Animated.parallel([
        // Scale up quickly
        Animated.spring(particle.scale, {
          toValue: particle.finalScale,
          friction: 3,
          tension: 80,
          delay,
          useNativeDriver: true,
        }),
        // Move outward in all directions
        Animated.timing(particle.translateX, {
          toValue: Math.cos(particle.angle) * particle.distance,
          duration: 1200,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(particle.translateY, {
          toValue: Math.sin(particle.angle) * particle.distance - 50, // Slight upward bias
          duration: 1200,
          delay,
          useNativeDriver: true,
        }),
        // Rotate while moving
        Animated.timing(particle.rotate, {
          toValue: particle.rotation,
          duration: 1200,
          delay,
          useNativeDriver: true,
        }),
        // Fade out as they move
        Animated.sequence([
          Animated.delay(delay + 400),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  };

  const handleAnswer = (option, index) => {
    // Play different sound for each question
    playSound(currentQuestionIndex);

    // Save answer
    const newAnswer = {
      questionId: currentQuestion.id,
      category: currentQuestion.category,
      question: currentQuestion.text,
      answer: option,
      sensitivity: currentQuestion.sensitivity,
      timestamp: new Date().toISOString(),
    };
    setAnswers([...answers, newAnswer]);

    // Trigger celebration animation
    setShowCelebration(true);
    triggerGPayBurst();

    // Wait for animation then move to next question
    setTimeout(() => {
      moveToNextQuestion();
    }, 1600);
  };

  const saveAssessmentToHistory = async () => {
    try {
      const assessment = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        answers: answers,
        totalQuestions: totalQuestions,
        userProfile: userProfile,
        completedAt: new Date().toISOString(),
      };

      // Get existing history
      const historyJson = await AsyncStorage.getItem('@assessment_history');
      const history = historyJson ? JSON.parse(historyJson) : [];
      
      // Add new assessment
      history.push(assessment);
      
      // Save back to storage
      await AsyncStorage.setItem('@assessment_history', JSON.stringify(history));
      
      console.log('✅ Assessment saved to history');
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const moveToNextQuestion = () => {
    // Reset celebration
    setShowCelebration(false);
    setParticles([]);

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
        // All questions answered - play completion sound
        playSound(totalQuestions);
        
        // Save assessment to history
        saveAssessmentToHistory();
        
        // Navigate to results
        setTimeout(() => {
          navigation.navigate('ResultScreen', { 
            answers, 
            totalQuestions,
            userProfile,
          });
        }, 1000);
      }
    });
  };

  const getCategoryColor = () => {
    return CATEGORY_COLORS[currentQuestion.category] || '#6B7280';
  };

  const getCategoryName = () => {
    return CATEGORY_NAMES[currentQuestion.category] || 'Questions';
  };

  const getCategoryIcon = () => {
    return CATEGORY_ICONS[currentQuestion.category] || '📋';
  };

  const getRandomEncouragement = () => {
    return ENCOURAGEMENT_MESSAGES[
      Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
    ];
  };

  // const getSensitivityIndicator = () => {
  //   if (hasSensitiveContent(currentQuestion)) {
  //     return (
  //       <View style={styles.sensitivityBadge}>
  //         <Text style={styles.sensitivityText}>💚 Safe Space</Text>
  //       </View>
  //     );
  //   }
  //   return null;
  // };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Alert.alert(
              'Exit Assessment',
              'Are you sure you want to exit? Your progress will be saved.',
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
          <Text style={styles.categoryIcon}>{getCategoryIcon()}</Text>
          <Text style={[styles.categoryText, { color: getCategoryColor() }]}>
            {getCategoryName()}
          </Text>
        </View>

        <View style={styles.placeholder} />
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

      {/* Sensitivity Indicator */}
      {/* {getSensitivityIndicator()} */}

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
        <View style={[styles.questionCard, hasSensitiveContent(currentQuestion) && styles.sensitiveCard]}>
          <View style={styles.questionHeader}>
            <Text style={[styles.questionNumber, { color: getCategoryColor() }]}>
              Question {currentQuestionIndex + 1}
            </Text>
            {currentQuestion.required && (
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>Required</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.questionText}>
            {getGentlePhrasing(currentQuestion.text)}
          </Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  { borderColor: getCategoryColor() + '30' }
                ]}
                onPress={() => handleAnswer(option, index)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option}</Text>
                <View style={[styles.optionIndicator, { backgroundColor: getCategoryColor() }]} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Helper text for sensitive questions */}
          {hasSensitiveContent(currentQuestion) && (
            <View style={styles.helperContainer}>
              <Text style={styles.helperText}>
                💚 Your responses are confidential and help us support you better
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* User Profile Info */}
      <View style={styles.profileInfo}>
        <Text style={styles.profileInfoText}>
          Personalized for: {userProfile.gender === GENDER_TYPES.MALE ? '👨' : userProfile.gender === GENDER_TYPES.FEMALE ? '👩' : '👤'} Age {userProfile.age}
        </Text>
      </View>

      {/* GPay/Paytm Style Celebration Overlay */}
      {showCelebration && (
        <View style={styles.celebrationOverlay} pointerEvents="none">
          {/* Particle Burst - GPay Style */}
          {particles.map((particle) => {
            const rotateZ = particle.rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            });

            return (
              <Animated.Text
                key={particle.id}
                style={[
                  styles.particle,
                  {
                    opacity: particle.opacity,
                    transform: [
                      { translateX: particle.translateX },
                      { translateY: particle.translateY },
                      { scale: particle.scale },
                      { rotate: rotateZ },
                    ],
                  },
                ]}
              >
                {particle.emoji}
              </Animated.Text>
            );
          })}

          {/* Encouragement Message */}
          {particles.length > 0 && (
            <Animated.View
              style={[
                styles.encouragementContainer,
                {
                  opacity: particles[0]?.opacity || 1,
                  transform: [{ scale: particles[0]?.scale || 1 }],
                },
              ]}
            >
              <Text style={styles.encouragementText}>
                {getRandomEncouragement()}
              </Text>
            </Animated.View>
          )}
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
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
    fontWeight: '500',
  },
  sensitivityBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sensitivityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
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
  sensitiveCard: {
    borderWidth: 2,
    borderColor: '#D1FAE5',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  requiredBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  requiredText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 32,
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  optionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
  helperContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
  },
  helperText: {
    fontSize: 13,
    color: '#065F46',
    textAlign: 'center',
    lineHeight: 18,
  },
  profileInfo: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  profileInfoText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    fontSize: 40,
    top: height / 2,
    left: width / 2,
  },
  encouragementContainer: {
    position: 'absolute',
    top: height / 2 - 100,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  encouragementText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366F1',
    textAlign: 'center',
  },
});

export default QuestionScreen;