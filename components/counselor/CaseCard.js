// app/components/counselor/CaseCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getSeverityColor, getSeverityLevel } from '../../constants/severityThresholds';

export const CaseCard = ({ caseData, onPress }) => {
  const severityColor = getSeverityColor(caseData.score);
  const severityLevel = getSeverityLevel(caseData.score);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: severityColor + '20' }]}>
          <Text style={[styles.avatarText, { color: severityColor }]}>
            {caseData.studentName.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{caseData.studentName}</Text>
          <Text style={styles.studentDetails}>{caseData.department} • {caseData.year}</Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
          <Icon name="alert-circle" size={14} color="#FFF" />
        </View>
      </View>

      <View style={styles.issuesContainer}>
        {caseData.issues?.slice(0, 2).map((issue, index) => (
          <View key={index} style={styles.issueTag}>
            <Text style={styles.issueText}>{issue}</Text>
          </View>
        ))}
        {caseData.issues?.length > 2 && (
          <Text style={styles.moreText}>+{caseData.issues.length - 2} more</Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Icon name="calendar-check" size={14} color="#6C63FF" />
          <Text style={styles.footerText}>{caseData.sessionsCompleted}/{caseData.totalSessions}</Text>
        </View>
        <View style={styles.footerItem}>
          <Icon name="clock-outline" size={14} color="#95A5A6" />
          <Text style={styles.footerText}>Next: {caseData.nextSession || 'Not scheduled'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const caseCardStyles = StyleSheet.create({
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 14, fontWeight: 'bold' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: 'bold', color: '#2C3E50', marginBottom: 2 },
  studentDetails: { fontSize: 12, color: '#7F8C8D' },
  severityBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issuesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  issueTag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  issueText: { fontSize: 11, color: '#5D6D7E', fontWeight: '600' },
  moreText: { fontSize: 11, color: '#95A5A6', alignSelf: 'center', marginLeft: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 11, color: '#7F8C8D', marginLeft: 6 },
});

// app/components/counselor/SessionCard.js
export const SessionCard = ({ session, onPress }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'individual': return '#4ECDC4';
      case 'group': return '#6C63FF';
      case 'assessment': return '#FF6B9D';
      default: return '#95A5A6';
    }
  };

  return (
    <TouchableOpacity style={sessionCardStyles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={sessionCardStyles.header}>
        <View style={[sessionCardStyles.typeIcon, { backgroundColor: getTypeColor(session.type) + '20' }]}>
          <Icon name={session.type === 'individual' ? 'account' : 'account-group'} size={18} color={getTypeColor(session.type)} />
        </View>
        <View style={sessionCardStyles.info}>
          <Text style={sessionCardStyles.type}>{session.type}</Text>
          <Text style={sessionCardStyles.date}>{formatDate(session.date)}</Text>
        </View>
        <View style={[sessionCardStyles.durationBadge, { backgroundColor: getTypeColor(session.type) + '15' }]}>
          <Text style={[sessionCardStyles.duration, { color: getTypeColor(session.type) }]}>{session.duration}min</Text>
        </View>
      </View>
      <Text style={sessionCardStyles.notes} numberOfLines={2}>{session.notes}</Text>
    </TouchableOpacity>
  );
};

const sessionCardStyles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  typeIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  info: { flex: 1 },
  type: { fontSize: 14, fontWeight: 'bold', color: '#2C3E50', textTransform: 'capitalize' },
  date: { fontSize: 11, color: '#95A5A6', marginTop: 2 },
  durationBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  duration: { fontSize: 11, fontWeight: 'bold' },
  notes: { fontSize: 13, color: '#5D6D7E', lineHeight: 18 },
});

// app/components/counselor/SeverityIndicator.js
export const SeverityIndicator = ({ score, showLabel = true, size = 'medium' }) => {
  const color = getSeverityColor(score);
  const level = getSeverityLevel(score);

  const sizes = { small: 40, medium: 60, large: 80 };
  const currentSize = sizes[size];

  return (
    <View style={severityStyles.container}>
      <View style={[severityStyles.circle, { width: currentSize, height: currentSize, borderColor: color }]}>
        <Text style={[severityStyles.score, { color }]}>{score}</Text>
      </View>
      {showLabel && <Text style={[severityStyles.label, { color }]}>{level}</Text>}
    </View>
  );
};

const severityStyles = StyleSheet.create({
  container: { alignItems: 'center' },
  circle: { borderWidth: 3, borderRadius: 100, justifyContent: 'center', alignItems: 'center' },
  score: { fontSize: 18, fontWeight: 'bold' },
  label: { fontSize: 11, fontWeight: 'bold', marginTop: 6, textTransform: 'uppercase' },
});

// app/components/counselor/TreatmentStep.js
export const TreatmentStep = ({ step, index, isCompleted, onToggle }) => {
  return (
    <View style={treatmentStyles.container}>
      <TouchableOpacity style={[treatmentStyles.checkbox, isCompleted && treatmentStyles.checkboxCompleted]} onPress={onToggle}>
        {isCompleted && <Icon name="check" size={16} color="#FFF" />}
      </TouchableOpacity>
      <View style={treatmentStyles.content}>
        <Text style={[treatmentStyles.stepNumber, isCompleted && treatmentStyles.completedText]}>Step {index + 1}</Text>
        <Text style={[treatmentStyles.stepText, isCompleted && treatmentStyles.completedText]}>{step.title}</Text>
        {step.description && <Text style={treatmentStyles.description}>{step.description}</Text>}
      </View>
    </View>
  );
};

const treatmentStyles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#E8E8E8', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkboxCompleted: { backgroundColor: '#388E3C', borderColor: '#388E3C' },
  content: { flex: 1 },
  stepNumber: { fontSize: 11, fontWeight: 'bold', color: '#6C63FF', marginBottom: 4 },
  stepText: { fontSize: 14, fontWeight: '600', color: '#2C3E50', marginBottom: 4 },
  description: { fontSize: 12, color: '#7F8C8D', lineHeight: 16 },
  completedText: { textDecorationLine: 'line-through', color: '#95A5A6' },
});

const styles = caseCardStyles;
export default CaseCard;
