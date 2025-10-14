import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';

const WelcomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartAssessment = () => {
    navigation.navigate('Question');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Animated Welcome Content */}
      <Animated.View
        style={[
          styles.welcomeContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.welcomeIcon}>🌟</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Hello, {user?.name}! 👋</Text>
        <Text style={styles.subtitle}>Ready to check in with yourself?</Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What to Expect 📋</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>✨</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoItemTitle}>Friendly Questions</Text>
              <Text style={styles.infoItemText}>
                We'll start with some light, jolly questions to make you comfortable
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>❤️</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoItemTitle}>Health Check</Text>
              <Text style={styles.infoItemText}>
                Then we'll ask about your general health and well-being
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🧠</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoItemTitle}>Mental Health</Text>
              <Text style={styles.infoItemText}>
                Finally, we'll check in on your mental and emotional state
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🎉</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoItemTitle}>Positive Vibes</Text>
              <Text style={styles.infoItemText}>
                Enjoy fun animations and encouragement along the way!
              </Text>
            </View>
          </View>
        </View>

        {/* Time Info */}
        <View style={styles.timeCard}>
          <Text style={styles.timeIcon}>⏱️</Text>
          <View style={styles.timeTextContainer}>
            <Text style={styles.timeTitle}>Takes about 5-10 minutes</Text>
            <Text style={styles.timeText}>
              Answer honestly - there are no right or wrong answers
            </Text>
          </View>
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <Text style={styles.privacyText}>
            Your responses are confidential and will help us understand how to better support you
          </Text>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>Quick Tips 💡</Text>
          <Text style={styles.guidelineText}>• Find a quiet, comfortable place</Text>
          <Text style={styles.guidelineText}>• Be honest with your answers</Text>
          <Text style={styles.guidelineText}>• Take your time, no rush</Text>
          <Text style={styles.guidelineText}>• Remember, seeking help is strength</Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartAssessment}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start Assessment</Text>
          <Text style={styles.startButtonIcon}>→</Text>
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleGoBack}
        >
          <Text style={styles.skipButtonText}>Maybe Later</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  welcomeContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeIcon: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 28,
    marginRight: 12,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  infoItemText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  timeCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  timeIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  timeTextContainer: {
    flex: 1,
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#B45309',
  },
  privacyCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  privacyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  guidelinesCard: {
    width: '100%',
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 12,
  },
  guidelineText: {
    fontSize: 14,
    color: '#047857',
    marginBottom: 6,
    lineHeight: 20,
  },
  startButton: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  startButtonIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  skipButton: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default WelcomeScreen;