// constants/severityThresholds.js

/**
 * Mental Health Score Severity Thresholds
 * Lower score = worse mental health (more severe)
 * Scale: 0-100%
 */

export const SEVERITY_THRESHOLDS = {
  CRITICAL: 25,  // 0-25%: Critical - Immediate intervention required
  HIGH: 40,      // 26-40%: High severity - Urgent attention needed
  MODERATE: 60,  // 41-60%: Moderate severity - Regular monitoring
  LOW: 80,       // 61-80%: Low severity - Preventive care
  HEALTHY: 100,  // 81-100%: Healthy - No immediate concern
};

/**
 * Assignment thresholds
 */
export const COUNSELOR_ASSIGNMENT_THRESHOLD = 40; // Students scoring below 40% automatically assigned to counselor
export const MENTOR_ALERT_THRESHOLD = 60;         // Mentors alerted when students score below 60%

/**
 * Capacity limits
 */
export const MAX_STUDENTS_PER_MENTOR = 20;        // Maximum students per mentor
export const MAX_ACTIVE_CASES_PER_COUNSELOR = 15; // Maximum active cases per counselor

/**
 * Notification priorities
 */
export const NOTIFICATION_PRIORITIES = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

/**
 * Get severity level from score
 * @param {number} score - Mental health score (0-100)
 * @returns {string} - Severity level
 */
export const getSeverityLevel = (score) => {
  if (score < SEVERITY_THRESHOLDS.CRITICAL) {
    return 'Critical';
  } else if (score < SEVERITY_THRESHOLDS.HIGH) {
    return 'High';
  } else if (score < SEVERITY_THRESHOLDS.MODERATE) {
    return 'Moderate';
  } else if (score < SEVERITY_THRESHOLDS.LOW) {
    return 'Low';
  }
  return 'Healthy';
};

/**
 * Get severity color from score
 * @param {number} score - Mental health score (0-100)
 * @returns {string} - Color hex code
 */
export const getSeverityColor = (score) => {
  if (score < SEVERITY_THRESHOLDS.CRITICAL) {
    return '#D32F2F'; // Red - Critical
  } else if (score < SEVERITY_THRESHOLDS.HIGH) {
    return '#F57C00'; // Orange - High
  } else if (score < SEVERITY_THRESHOLDS.MODERATE) {
    return '#FBC02D'; // Yellow - Moderate
  } else if (score < SEVERITY_THRESHOLDS.LOW) {
    return '#66BB6A'; // Light Green - Low
  }
  return '#388E3C'; // Green - Healthy
};

/**
 * Check if student needs counselor assignment
 * @param {number} score - Mental health score (0-100)
 * @returns {boolean}
 */
export const needsCounselorAssignment = (score) => {
  return score < COUNSELOR_ASSIGNMENT_THRESHOLD;
};

/**
 * Check if mentor should be alerted
 * @param {number} score - Mental health score (0-100)
 * @returns {boolean}
 */
export const needsMentorAlert = (score) => {
  return score < MENTOR_ALERT_THRESHOLD;
};

/**
 * Get notification priority based on severity
 * @param {number} score - Mental health score (0-100)
 * @returns {string} - Priority level
 */
export const getNotificationPriority = (score) => {
  if (score < SEVERITY_THRESHOLDS.CRITICAL) {
    return NOTIFICATION_PRIORITIES.CRITICAL;
  } else if (score < SEVERITY_THRESHOLDS.HIGH) {
    return NOTIFICATION_PRIORITIES.HIGH;
  } else if (score < SEVERITY_THRESHOLDS.MODERATE) {
    return NOTIFICATION_PRIORITIES.MEDIUM;
  }
  return NOTIFICATION_PRIORITIES.LOW;
};

/**
 * Get severity description
 * @param {number} score - Mental health score (0-100)
 * @returns {string} - Description
 */
export const getSeverityDescription = (score) => {
  if (score < SEVERITY_THRESHOLDS.CRITICAL) {
    return 'Immediate intervention required. Critical mental health concerns identified.';
  } else if (score < SEVERITY_THRESHOLDS.HIGH) {
    return 'Urgent attention needed. Significant mental health challenges detected.';
  } else if (score < SEVERITY_THRESHOLDS.MODERATE) {
    return 'Regular monitoring recommended. Some mental health concerns present.';
  } else if (score < SEVERITY_THRESHOLDS.LOW) {
    return 'Preventive care suggested. Minor stress or concerns detected.';
  }
  return 'Good mental health. Continue positive practices.';
};

/**
 * Get recommended actions based on severity
 * @param {number} score - Mental health score (0-100)
 * @returns {Array<string>} - List of recommended actions
 */
export const getRecommendedActions = (score) => {
  if (score < SEVERITY_THRESHOLDS.CRITICAL) {
    return [
      'Immediate counselor assignment',
      'Notify mentor and admin',
      'Schedule urgent session within 24 hours',
      'Consider psychiatric evaluation',
      'Monitor closely',
    ];
  } else if (score < SEVERITY_THRESHOLDS.HIGH) {
    return [
      'Assign to counselor',
      'Alert mentor',
      'Schedule session within 3 days',
      'Develop treatment plan',
      'Weekly follow-ups',
    ];
  } else if (score < SEVERITY_THRESHOLDS.MODERATE) {
    return [
      'Notify mentor',
      'Consider counselor referral',
      'Schedule check-in within 1 week',
      'Provide coping resources',
      'Monitor progress',
    ];
  } else if (score < SEVERITY_THRESHOLDS.LOW) {
    return [
      'Mentor awareness',
      'Provide stress management resources',
      'Optional counseling support',
      'Routine check-ins',
    ];
  }
  return [
    'Continue current wellness practices',
    'Maintain regular mentor contact',
    'Preventive resources available',
  ];
};

/**
 * Calculate score change percentage
 * @param {number} currentScore - Current score
 * @param {number} previousScore - Previous score
 * @returns {Object} - { change: number, percentage: number, isImproving: boolean }
 */
export const calculateScoreChange = (currentScore, previousScore) => {
  const change = currentScore - previousScore;
  const percentage = previousScore !== 0 ? (change / previousScore) * 100 : 0;
  
  return {
    change: Math.round(change * 10) / 10,
    percentage: Math.round(percentage * 10) / 10,
    isImproving: change > 0,
  };
};

/**
 * Format score for display
 * @param {number} score - Mental health score
 * @returns {string} - Formatted score
 */
export const formatScore = (score) => {
  return `${Math.round(score)}%`;
};

/**
 * Validate score range
 * @param {number} score - Mental health score
 * @returns {boolean}
 */
export const isValidScore = (score) => {
  return typeof score === 'number' && score >= 0 && score <= 100;
};

/**
 * Get severity badge config for UI
 * @param {number} score - Mental health score
 * @returns {Object} - { color, icon, level, description }
 */
export const getSeverityBadge = (score) => {
  return {
    color: getSeverityColor(score),
    level: getSeverityLevel(score),
    description: getSeverityDescription(score),
    priority: getNotificationPriority(score),
  };
};

export default {
  SEVERITY_THRESHOLDS,
  COUNSELOR_ASSIGNMENT_THRESHOLD,
  MENTOR_ALERT_THRESHOLD,
  MAX_STUDENTS_PER_MENTOR,
  MAX_ACTIVE_CASES_PER_COUNSELOR,
  NOTIFICATION_PRIORITIES,
  getSeverityLevel,
  getSeverityColor,
  needsCounselorAssignment,
  needsMentorAlert,
  getNotificationPriority,
  getSeverityDescription,
  getRecommendedActions,
  calculateScoreChange,
  formatScore,
  isValidScore,
  getSeverityBadge,
};