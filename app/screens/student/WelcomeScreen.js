import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

const WelcomeScreen = ({ navigation, route }) => {
  const { userProfile } = route.params || {};

  const handleStart = () => {
    navigation.navigate('QuestionScreen', { userProfile });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.emoji}>🌟</Text>
          <Text style={styles.title}>Welcome to Your Assessment</Text>
          <Text style={styles.subtitle}>
            This will take about 5-10 minutes
          </Text>

          {userProfile && (
            <View style={styles.personalizationBadge}>
              <Text style={styles.personalizationText}>
                ✨ Personalized for you
              </Text>
            </View>
          )}

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>What to expect:</Text>
            
            <View style={styles.instruction}>
              <Text style={styles.instructionIcon}>💭</Text>
              <Text style={styles.instructionText}>
                Answer questions honestly - there are no right or wrong answers
              </Text>
            </View>

            <View style={styles.instruction}>
              <Text style={styles.instructionIcon}>🔒</Text>
              <Text style={styles.instructionText}>
                Your responses are confidential and secure
              </Text>
            </View>

            <View style={styles.instruction}>
              <Text style={styles.instructionIcon}>⏱️</Text>
              <Text style={styles.instructionText}>
                Take your time - you can pause anytime
              </Text>
            </View>

            <View style={styles.instruction}>
              <Text style={styles.instructionIcon}>💚</Text>
              <Text style={styles.instructionText}>
                Questions are designed to support your wellbeing
              </Text>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
          >
            <Text style={styles.startButtonText}>Let's Begin</Text>
          </TouchableOpacity>

          {/* Note */}
          <Text style={styles.note}>
            You can exit at any time and your progress will be saved
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  personalizationBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 32,
  },
  personalizationText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  instructionsContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  instructionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  note: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default WelcomeScreen;