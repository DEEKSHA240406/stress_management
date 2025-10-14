import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function StudentsListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const students = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@university.edu',
      status: 'good',
      lastAssessment: '2 days ago',
      score: 85,
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.c@university.edu',
      status: 'moderate',
      lastAssessment: '1 day ago',
      score: 62,
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.d@university.edu',
      status: 'attention',
      lastAssessment: '3 hours ago',
      score: 38,
    },
    {
      id: '4',
      name: 'James Wilson',
      email: 'james.w@university.edu',
      status: 'good',
      lastAssessment: '1 week ago',
      score: 92,
    },
    {
      id: '5',
      name: 'Olivia Brown',
      email: 'olivia.b@university.edu',
      status: 'moderate',
      lastAssessment: '4 days ago',
      score: 58,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return colors.success;
      case 'moderate':
        return colors.warning;
      case 'attention':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return 'checkmark-circle';
      case 'moderate':
        return 'alert-circle';
      case 'attention':
        return 'warning';
      default:
        return 'ellipse';
    }
  };

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => navigation.navigate('DetailedReport', { student: item })}
    >
      <View style={styles.studentHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentEmail}>{item.email}</Text>
        </View>
        <Ionicons
          name={getStatusIcon(item.status)}
          size={24}
          color={getStatusColor(item.status)}
        />
      </View>

      <View style={styles.studentStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={[styles.statValue, { color: getStatusColor(item.status) }]}>
            {item.score}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Last Assessment</Text>
          <Text style={styles.statValue}>{item.lastAssessment}</Text>
        </View>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Students</Text>
        <Text style={styles.subtitle}>{students.length} total students</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <FilterButton
          label="All"
          value="all"
          selected={selectedFilter}
          onPress={() => setSelectedFilter('all')}
        />
        <FilterButton
          label="Good"
          value="good"
          selected={selectedFilter}
          onPress={() => setSelectedFilter('good')}
        />
        <FilterButton
          label="Moderate"
          value="moderate"
          selected={selectedFilter}
          onPress={() => setSelectedFilter('moderate')}
        />
        <FilterButton
          label="Attention"
          value="attention"
          selected={selectedFilter}
          onPress={() => setSelectedFilter('attention')}
        />
      </View>

      {/* Students List */}
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const FilterButton = ({ label, value, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.filterBtn, selected === value && styles.filterBtnActive]}
    onPress={onPress}
  >
    <Text style={[styles.filterText, selected === value && styles.filterTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    height: 48,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
    fontFamily: 'Roboto-Bold',
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  studentCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
  },
  studentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  studentEmail: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginTop: 2,
  },
  studentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
});