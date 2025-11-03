import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  SafeAreaView,
  FlatList,
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
      title: 'Guided Meditation',
      description: 'Start your meditation journey',
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
      description: 'Calm your mind effectively',
      type: 'Article',
      duration: '3 min',
      icon: '📄',
      gradient: ['#f093fb', '#f5576c'],
      link: 'https://www.healthline.com/health/breathing-exercises',
    },
    {
      id: 3,
      category: 'exercise',
      title: 'Yoga for Mental Health',
      description: 'Reduce stress and anxiety',
      type: 'Video',
      duration: '15 min',
      icon: '🎬',
      gradient: ['#4facfe', '#00f2fe'],
      link: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    },
    {
      id: 4,
      category: 'exercise',
      title: 'Daily Stretching',
      description: 'Improve mood and energy',
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
      description: 'Improve sleep quality',
      type: 'Article',
      duration: '5 min',
      icon: '📄',
      gradient: ['#a8edea', '#fed6e3'],
      link: 'https://www.sleepfoundation.org/sleep-hygiene',
    },
    {
      id: 6,
      category: 'sleep',
      title: 'Relaxing Sleep Music',
      description: 'Fall asleep faster',
      type: 'Audio',
      duration: '30 min',
      icon: '🎵',
      gradient: ['#d299c2', '#fef9d7'],
      link: 'https://www.youtube.com/watch?v=1ZYbU82GVz4',
    },
    {
      id: 7,
      category: 'stress',
      title: 'Stress Management',
      description: 'Manage daily stress',
      type: 'Article',
      duration: '7 min',
      icon: '📄',
      gradient: ['#fa709a', '#fee140'],
      link: 'https://www.apa.org/topics/stress',
    },
    {
      id: 8,
      category: 'stress',
      title: 'Muscle Relaxation',
      description: 'Release tension',
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
      description: '24/7 mental health support',
      type: 'Phone',
      duration: 'Now',
      icon: '📞',
      gradient: ['#ff6b6b', '#ee5a6f'],
      phone: '1-800-273-8255',
    },
    {
      id: 10,
      category: 'emergency',
      title: 'Text Crisis Line',
      description: 'Text support anytime',
      type: 'SMS',
      duration: 'Now',
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

  const renderResourceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.resourceCard}
      onPress={() => handleResourcePress(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.resourceGradient}
      >
        <View style={styles.resourceHeader}>
          <Text style={styles.resourceIcon}>{item.icon}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>

        <Text style={styles.resourceTitle}>{item.title}</Text>
        <Text style={styles.resourceDescription}>{item.description}</Text>

        <View style={styles.resourceFooter}>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>⏱ {item.duration}</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </View>
      </LinearGradient>

      {item.category === 'emergency' && (
        <View style={styles.emergencyBadge}>
          <Text style={styles.emergencyText}>⚡ URGENT</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryPill,
        selectedCategory === item.id && styles.categoryPillActive,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      {selectedCategory === item.id ? (
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryGradient}
        >
          <Text style={styles.categoryIcon}>{item.icon}</Text>
          <Text style={styles.categoryTextActive}>{item.name}</Text>
        </LinearGradient>
      ) : (
        <>
          <Text style={styles.categoryIcon}>{item.icon}</Text>
          <Text style={styles.categoryText}>{item.name}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
        <Text style={styles.headerEmoji}>🌱</Text>
        <Text style={styles.headerTitle}>Wellness Hub</Text>
        <Text style={styles.headerSubtitle}>Resources for your journey</Text>
      </LinearGradient>

      {/* Category Pills - Horizontal FlatList */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

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

      {/* Resources Grid - FlatList with numColumns */}
      <FlatList
        data={filteredResources}
        renderItem={renderResourceCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.resourcesContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No resources found</Text>
            <Text style={styles.emptyText}>Try a different category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fd',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  categoriesWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a5568',
  },
  categoryTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resourcesContent: {
    paddingBottom: 20,
  },
  resourceCard: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  resourceGradient: {
    padding: 16,
    minHeight: 180,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resourceIcon: {
    fontSize: 28,
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 20,
  },
  resourceDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
    marginBottom: 12,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  durationBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emergencyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  emergencyText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ff6b6b',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    width: '100%',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#718096',
  },
});

export default ResourcesScreen;