import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ResourcesScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: '📚', gradient: ['#667eea', '#764ba2'] },
    { id: 'meditation', name: 'Meditation', icon: '🧘', gradient: ['#f093fb', '#f5576c'] },
    { id: 'exercise', name: 'Exercise', icon: '💪', gradient: ['#4facfe', '#00f2fe'] },
    { id: 'sleep', name: 'Sleep', icon: '😴', gradient: ['#43e97b', '#38f9d7'] },
    { id: 'stress', name: 'Stress', icon: '😌', gradient: ['#fa709a', '#fee140'] },
    { id: 'emergency', name: 'Emergency', icon: '🚨', gradient: ['#ff6b6b', '#ee5a6f'] },
  ];

  const resources = [
    {
      id: 1,
      category: 'meditation',
      title: 'Guided Meditation for Beginners',
      description: 'Start your meditation journey with simple 5-minute guided sessions',
      type: 'Video',
      duration: '5 min',
      icon: '🎬',
      gradient: ['#667eea', '#764ba2'],
      link: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    },
    {
      id: 2,
      category: 'meditation',
      title: 'Breathing Exercises',
      description: 'Learn effective breathing techniques to calm your mind',
      type: 'Article',
      duration: '3 min read',
      icon: '📄',
      gradient: ['#f093fb', '#f5576c'],
      link: 'https://www.healthline.com/health/breathing-exercises',
    },
    {
      id: 3,
      category: 'exercise',
      title: 'Yoga for Mental Health',
      description: 'Simple yoga poses to reduce stress and anxiety',
      type: 'Video',
      duration: '15 min',
      icon: '🎬',
      gradient: ['#4facfe', '#00f2fe'],
      link: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    },
    {
      id: 4,
      category: 'exercise',
      title: 'Daily Stretching Routine',
      description: 'Quick stretches to improve mood and energy',
      type: 'Guide',
      duration: '10 min',
      icon: '📋',
      gradient: ['#43e97b', '#38f9d7'],
      link: 'https://www.verywellfit.com/stretching-routines',
    },
    {
      id: 5,
      category: 'sleep',
      title: 'Sleep Hygiene Tips',
      description: 'Improve your sleep quality with these proven techniques',
      type: 'Article',
      duration: '5 min read',
      icon: '📄',
      gradient: ['#a8edea', '#fed6e3'],
      link: 'https://www.sleepfoundation.org/sleep-hygiene',
    },
    {
      id: 6,
      category: 'sleep',
      title: 'Relaxing Sleep Music',
      description: 'Calming music to help you fall asleep faster',
      type: 'Audio',
      duration: '30 min',
      icon: '🎵',
      gradient: ['#d299c2', '#fef9d7'],
      link: 'https://www.youtube.com/watch?v=1ZYbU82GVz4',
    },
    {
      id: 7,
      category: 'stress',
      title: 'Stress Management Techniques',
      description: 'Evidence-based strategies to manage daily stress',
      type: 'Article',
      duration: '7 min read',
      icon: '📄',
      gradient: ['#fa709a', '#fee140'],
      link: 'https://www.apa.org/topics/stress',
    },
    {
      id: 8,
      category: 'stress',
      title: 'Progressive Muscle Relaxation',
      description: 'Learn to release physical tension and mental stress',
      type: 'Video',
      duration: '12 min',
      icon: '🎬',
      gradient: ['#ffecd2', '#fcb69f'],
      link: 'https://www.youtube.com/watch?v=ClqPtWzozXs',
    },
    {
      id: 9,
      category: 'emergency',
      title: 'Crisis Helpline',
      description: '24/7 support for mental health emergencies',
      type: 'Phone',
      duration: 'Immediate',
      icon: '📞',
      gradient: ['#ff6b6b', '#ee5a6f'],
      phone: '1-800-273-8255',
    },
    {
      id: 10,
      category: 'emergency',
      title: 'Text Crisis Line',
      description: 'Text support available anytime',
      type: 'SMS',
      duration: 'Immediate',
      icon: '💬',
      gradient: ['#ee5a6f', '#f29263'],
      phone: 'Text HOME to 741741',
    },
  ];

  const filteredResources =
    selectedCategory === 'all'
      ? resources
      : resources.filter((resource) => resource.category === selectedCategory);

  const handleResourcePress = (resource) => {
    if (resource.phone) {
      Alert.alert(
        resource.title,
        `Contact: ${resource.phone}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Call',
            onPress: () => {
              const phoneNumber = resource.phone.replace(/[^0-9]/g, '');
              Linking.openURL(`tel:${phoneNumber}`);
            },
          },
        ]
      );
    } else if (resource.link) {
      Linking.openURL(resource.link).catch((err) =>
        Alert.alert('Error', 'Unable to open link')
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>🌱</Text>
          <Text style={styles.headerTitle}>Wellness Hub</Text>
          <Text style={styles.headerSubtitle}>Resources for your journey</Text>
        </View>
      </LinearGradient>

      {/* Category Pills */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryPill,
                selectedCategory === category.id && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              {selectedCategory === category.id ? (
                <LinearGradient
                  colors={category.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryGradient}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryTextActive}>{category.name}</Text>
                </LinearGradient>
              ) : (
                <>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Resources Grid */}
      <ScrollView
        style={styles.resourcesContainer}
        contentContainerStyle={styles.resourcesContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredResources.length}</Text>
            <Text style={styles.statLabel}>Resources</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>Free</Text>
            <Text style={styles.statLabel}>Access</Text>
          </View>
        </View>

        {/* Resource Cards */}
        {filteredResources.map((resource) => (
          <TouchableOpacity
            key={resource.id}
            style={styles.resourceCard}
            onPress={() => handleResourcePress(resource)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={resource.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.resourceGradient}
            >
              <View style={styles.resourceTop}>
                <View style={styles.resourceIconWrapper}>
                  <Text style={styles.resourceIcon}>{resource.icon}</Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{resource.type}</Text>
                </View>
              </View>

              <View style={styles.resourceBody}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>
                  {resource.description}
                </Text>
              </View>

              <View style={styles.resourceBottom}>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationIcon}>⏱</Text>
                  <Text style={styles.durationText}>{resource.duration}</Text>
                </View>
                <View style={styles.actionButton}>
                  <Text style={styles.actionText}>Open</Text>
                  <Text style={styles.actionArrow}>→</Text>
                </View>
              </View>
            </LinearGradient>

            {resource.category === 'emergency' && (
              <View style={styles.emergencyBadge}>
                <Text style={styles.emergencyText}>⚡ URGENT</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No resources found</Text>
            <Text style={styles.emptyText}>
              Try selecting a different category
            </Text>
          </View>
        )}

        {/* Help CTA Card */}
        <View style={styles.ctaCard}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaEmoji}>💙</Text>
            <Text style={styles.ctaTitle}>Need Professional Support?</Text>
            <Text style={styles.ctaText}>
              Connect with a licensed therapist who can provide personalized care
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Find a Therapist</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fd',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  categoriesWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#f1f3f9',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryPillActive: {
    padding: 0,
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4a5568',
  },
  categoryTextActive: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resourcesContainer: {
    flex: 1,
  },
  resourcesContent: {
    padding: 24,
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    justifyContent: 'space-around',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  resourceCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  resourceGradient: {
    padding: 20,
  },
  resourceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resourceIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceIcon: {
    fontSize: 32,
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resourceBody: {
    marginBottom: 16,
  },
  resourceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 26,
  },
  resourceDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  resourceBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  durationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#667eea',
    marginRight: 6,
  },
  actionArrow: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: 'bold',
  },
  emergencyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  emergencyText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ff6b6b',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#718096',
  },
  ctaCard: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaGradient: {
    padding: 28,
    alignItems: 'center',
  },
  ctaEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default ResourcesScreen;