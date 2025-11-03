// app/components/counselor/SessionCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SessionCard = ({ session, onPress }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'individual':
        return '#4ECDC4';
      case 'group':
        return '#6C63FF';
      case 'assessment':
        return '#FF6B9D';
      case 'follow-up':
        return '#FFA726';
      default:
        return '#95A5A6';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'individual':
        return 'account';
      case 'group':
        return 'account-group';
      case 'assessment':
        return 'clipboard-text';
      case 'follow-up':
        return 'calendar-check';
      default:
        return 'calendar';
    }
  };

  const color = getTypeColor(session.type);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.typeIcon, { backgroundColor: color + '20' }]}>
          <Icon 
            name={getTypeIcon(session.type)} 
            size={20} 
            color={color} 
          />
        </View>
        
        <View style={styles.info}>
          <Text style={styles.type}>{session.type}</Text>
          <Text style={styles.date}>{formatDate(session.date)}</Text>
        </View>

        <View style={[styles.durationBadge, { backgroundColor: color + '15' }]}>
          <Icon name="clock-outline" size={14} color={color} />
          <Text style={[styles.duration, { color }]}>
            {session.duration}min
          </Text>
        </View>
      </View>

      {session.studentName && (
        <View style={styles.studentRow}>
          <Icon name="account" size={14} color="#7F8C8D" />
          <Text style={styles.studentName}>{session.studentName}</Text>
        </View>
      )}

      {session.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {session.notes}
        </Text>
      )}

      {session.outcome && (
        <View style={styles.outcomeContainer}>
          <Icon name="check-circle" size={14} color="#388E3C" />
          <Text style={styles.outcome}>{session.outcome}</Text>
        </View>
      )}

      {session.tags && session.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {session.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {session.tags.length > 3 && (
            <Text style={styles.moreTags}>+{session.tags.length - 3}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  type: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2C3E50',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#95A5A6',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  duration: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 13,
    color: '#7F8C8D',
    marginLeft: 6,
    fontWeight: '600',
  },
  notes: {
    fontSize: 13,
    color: '#5D6D7E',
    lineHeight: 18,
    marginBottom: 8,
  },
  outcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  outcome: {
    fontSize: 12,
    color: '#388E3C',
    fontWeight: '600',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#5D6D7E',
    fontWeight: '600',
  },
  moreTags: {
    fontSize: 11,
    color: '#95A5A6',
    alignSelf: 'center',
  },
});

export default SessionCard;