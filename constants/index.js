// API Configuration
export const API_BASE_URL = 'http://localhost:5000/api';
// For Android Emulator use: 'http://10.0.2.2:5000/api'
// For Physical Device use your computer's IP: 'http://192.168.x.x:5000/api'

// Question Categories
export const QUESTION_CATEGORIES = {
  JOLLY: 'jolly',
  HEALTH: 'health',
  MENTAL_HEALTH: 'mental_health',
};

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

// AsyncStorage Keys
export const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER: '@user_data',
  QUESTIONS: '@questions_data',
  RESPONSES: '@responses_data',
};

// Colors
export const COLORS = {
  primary: '#6366F1',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F9FAFB',
  white: '#FFFFFF',
  black: '#000000',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  gray: '#9CA3AF',
};

// Encouragement Messages
export const ENCOURAGEMENT_MESSAGES = [
  "You're doing great! 🌟",
  "Keep going, you're amazing! 💪",
  "Excellent work! 🎉",
  "You're stronger than you think! 💙",
  "One step at a time, you've got this! ✨",
  "Proud of you for being here! 🌈",
  "Your honesty is your strength! 💚",
  "You're not alone in this journey! 🤝",
];

// Completion Messages
export const COMPLETION_MESSAGES = [
  "Awesome! You've completed the assessment! 🎊",
  "Well done! Your responses help us support you better! 💚",
  "Thank you for being honest and brave! 🌈",
  "Great job! Remember, seeking help is a sign of strength! 💪",
];