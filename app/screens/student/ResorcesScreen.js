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

const ResourcesScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Resource categories
  const categories = [
    { id: 'all', name: 'All', icon: '📚' },
    { id: 'meditation', name: 'Meditation', icon: '🧘' },
    { id: 'exercise', name: 'Exercise', icon: '💪' },
    { id: 'sleep', name: 'Sleep', icon: '😴' },
    { id: 'stress', name: 'Stress', icon: '😌' },
    { id: 'emergency', name: 'Emergency', icon: '🆘' },
  ];

  // Resources data
  const resources = [
    {
      id: 1,
      category: 'meditation',
      title: 'Guided Meditation for Beginners',
      description: 'Start your meditation journey with simple 5-minute guided sessions',
      type: 'Video',
      duration: '5 min',
      icon: '🎬',
      color: '#6366F1',
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
      color: '#8B5CF6',
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
      color: '#10B981',
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
      color: '#14B8A6',
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
      color: '#EC4899',
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
      color: '#F472B6',
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
      color: '#F59E0B',
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
      color: '#FBBF24',
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
      color: '#EF4444',
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
      color: '#DC2626',
      phone: 'Text HOME to 741741',
    },
  ];

  // Filter resources based on selected category
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wellness Resources</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Resources List */}
      <ScrollView
        style={styles.resourcesContainer}
        contentContainerStyle={styles.resourcesContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerIcon}>💡</Text>
          <Text style={styles.infoBannerText}>
            Tap any resource to learn more and access helpful content
          </Text>
        </View>

        {/* Resource Cards */}
        {filteredResources.map((resource) => (
          <TouchableOpacity
            key={resource.id}
            style={[
              styles.resourceCard,
              resource.category === 'emergency' && styles.emergencyCard,
            ]}
            onPress={() => handleResourcePress(resource)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: resource.color + '20' },
              ]}
            >
              <Text style={styles.resourceCardIcon}>{resource.icon}</Text>
            </View>

            <View style={styles.resourceContent}>
              <View style={styles.resourceHeader}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: resource.color + '20' },
                  ]}
                >
                  <Text style={[styles.typeText, { color: resource.color }]}>
                    {resource.type}
                  </Text>
                </View>
              </View>

              <Text style={styles.resourceDescription}>
                {resource.description}
              </Text>

              <View style={styles.resourceFooter}>
                <View style={styles.durationContainer}>
                  <Text style={styles.durationIcon}>⏱️</Text>
                  <Text style={styles.durationText}>{resource.duration}</Text>
                </View>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Resources Found</Text>
            <Text style={styles.emptyText}>
              Try selecting a different category
            </Text>
          </View>
        )}

        {/* Bottom Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need More Help? 💬</Text>
          <Text style={styles.helpText}>
            If you're experiencing a mental health crisis, please reach out to
            a professional immediately.
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Find a Therapist</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 60,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#6366F1',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  resourcesContainer: {
    flex: 1,
  },
  resourcesContent: {
    padding: 24,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoBannerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emergencyCard: {
    borderWidth: 2,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  resourceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceCardIcon: {
    fontSize: 28,
  },
  resourceContent: {
    flex: 1,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resourceTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  durationText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  helpSection: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#B45309',
    lineHeight: 20,
    marginBottom: 16,
  },
  helpButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ResourcesScreen;