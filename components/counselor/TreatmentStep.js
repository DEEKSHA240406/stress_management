// app/components/counselor/TreatmentStep.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TreatmentStep = ({ 
  step, 
  index, 
  isCompleted = false, 
  onToggle,
  showCheckbox = true,
  editable = true
}) => {
  return (
    <View style={styles.container}>
      {showCheckbox && (
        <TouchableOpacity 
          style={[
            styles.checkbox, 
            isCompleted && styles.checkboxCompleted
          ]} 
          onPress={editable ? onToggle : null}
          disabled={!editable}
          activeOpacity={0.7}
        >
          {isCompleted && <Icon name="check" size={16} color="#FFF" />}
        </TouchableOpacity>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[
            styles.stepNumber, 
            isCompleted && styles.completedText
          ]}>
            Step {index + 1}
          </Text>
          {step.priority && (
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(step.priority) + '20' }
            ]}>
              <Text style={[
                styles.priorityText,
                { color: getPriorityColor(step.priority) }
              ]}>
                {step.priority}
              </Text>
            </View>
          )}
        </View>

        <Text style={[
          styles.stepTitle, 
          isCompleted && styles.completedText
        ]}>
          {step.title}
        </Text>

        {step.description && (
          <Text style={[
            styles.description,
            isCompleted && styles.completedText
          ]}>
            {step.description}
          </Text>
        )}

        {step.duration && (
          <View style={styles.durationContainer}>
            <Icon name="clock-outline" size={14} color="#7F8C8D" />
            <Text style={styles.duration}>{step.duration}</Text>
          </View>
        )}

        {step.goals && step.goals.length > 0 && (
          <View style={styles.goalsContainer}>
            <Text style={styles.goalsTitle}>Goals:</Text>
            {step.goals.map((goal, idx) => (
              <View key={idx} style={styles.goalItem}>
                <Icon name="circle-small" size={16} color="#6C63FF" />
                <Text style={styles.goalText}>{goal}</Text>
              </View>
            ))}
          </View>
        )}

        {step.techniques && step.techniques.length > 0 && (
          <View style={styles.techniquesContainer}>
            {step.techniques.map((technique, idx) => (
              <View key={idx} style={styles.techniqueTag}>
                <Text style={styles.techniqueText}>{technique}</Text>
              </View>
            ))}
          </View>
        )}

        {isCompleted && step.completedDate && (
          <View style={styles.completedInfo}>
            <Icon name="check-circle" size={14} color="#388E3C" />
            <Text style={styles.completedDate}>
              Completed on {new Date(step.completedDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return '#D32F2F';
    case 'medium':
      return '#F57C00';
    case 'low':
      return '#388E3C';
    default:
      return '#95A5A6';
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: '#388E3C',
    borderColor: '#388E3C',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6C63FF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 6,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    color: '#5D6D7E',
    lineHeight: 18,
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#95A5A6',
    opacity: 0.7,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  duration: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  goalsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  goalsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  goalText: {
    fontSize: 12,
    color: '#5D6D7E',
    flex: 1,
    lineHeight: 16,
  },
  techniquesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  techniqueTag: {
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  techniqueText: {
    fontSize: 11,
    color: '#6C63FF',
    fontWeight: '600',
  },
  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  completedDate: {
    fontSize: 11,
    color: '#388E3C',
    marginLeft: 6,
    fontWeight: '600',
  },
});

export default TreatmentStep;