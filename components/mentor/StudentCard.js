// app/components/mentor/StudentCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getSeverityColor, getSeverityLevel } from '../../constants/severityThresholds';

const StudentCard = ({ student, onPress, showStatus = true }) => {
  const severityColor = getSeverityColor(student.score);
  const severityLevel = getSeverityLevel(student.score);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'at_risk': return 'alert-circle';
      case 'needs_attention': return 'alert';
      case 'stable': return 'check-circle';
      default: return 'account';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'at_risk': return '#D32F2F';
      case 'needs_attention': return '#F57C00';
      case 'stable': return '#388E3C';
      default: return '#95A5A6';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={[
            styles.avatar,
            { backgroundColor: severityColor + '20' }
          ]}>
            <Text style={[styles.avatarText, { color: severityColor }]}>
              {student.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentDetails}>
              {student.rollNumber} • {student.department}
            </Text>
            <Text style={styles.studentYear}>{student.year}</Text>
          </View>
        </View>
        
        <View style={styles.cardRight}>
          <View style={[
            styles.scoreContainer,
            { backgroundColor: severityColor + '15' }
          ]}>
            <Text style={[styles.scoreText, { color: severityColor }]}>
              {student.score}%
            </Text>
          </View>
        </View>
      </View>

      {showStatus && student.status && (
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(student.status) + '15' }
          ]}>
            <Icon 
              name={getStatusIcon(student.status)} 
              size={14} 
              color={getStatusColor(student.status)} 
            />
            <Text style={[
              styles.statusText,
              { color: getStatusColor(student.status) }
            ]}>
              {student.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          <View style={[
            styles.severityBadge,
            { backgroundColor: severityColor }
          ]}>
            <Text style={styles.severityText}>{severityLevel}</Text>
          </View>
        </View>
      )}

      {student.lastAssessment && (
        <View style={styles.footer}>
          <Icon name="calendar-clock" size={14} color="#95A5A6" />
          <Text style={styles.footerText}>
            Last assessment: {new Date(student.lastAssessment).toLocaleDateString()}
          </Text>
        </View>
      )}

      {student.hasUnreadNotes && (
        <View style={styles.notificationBadge}>
          <Icon name="bell" size={12} color="#FFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  studentDetails: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  studentYear: {
    fontSize: 12,
    color: '#95A5A6',
  },
  cardRight: {
    justifyContent: 'center',
  },
  scoreContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 11,
    color: '#95A5A6',
    marginLeft: 6,
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StudentCard;