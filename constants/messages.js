// Encouragement Messages (during assessment)
export const ENCOURAGEMENT_MESSAGES = [
  "You're doing great! 🌟",
  "Keep going, you're amazing! 💪",
  "Excellent work! 🎉",
  "You're stronger than you think! 💙",
  "One step at a time, you've got this! ✨",
  "Proud of you for being here! 🌈",
  "Your honesty is your strength! 💚",
  "You're not alone in this journey! 🤝",
  "Every answer brings you closer! 🎯",
  "You're making great progress! 🚀",
  "Keep up the amazing work! ⭐",
  "You're doing wonderfully! 🌺",
  "Stay strong, you're almost there! 💫",
  "Great job on being honest! 🙌",
  "You're being so brave! 🦋",
];

// Completion Messages (after finishing assessment)
export const COMPLETION_MESSAGES = [
  "Awesome! You've completed the assessment! 🎊",
  "Well done! Your responses help us support you better! 💚",
  "Thank you for being honest and brave! 🌈",
  "Great job! Remember, seeking help is a sign of strength! 💪",
  "You did it! Your mental health matters! 🌟",
  "Completed! You're taking important steps for yourself! ✨",
  "Amazing work! Your wellness journey begins now! 🚀",
  "Congratulations! You've taken a big step forward! 🎉",
];

// Welcome Messages
export const WELCOME_MESSAGES = {
  STUDENT: "Welcome back! Ready to check in on your wellness? 🌟",
  ADMIN: "Welcome, Admin! Let's see how everyone is doing today. 📊",
  FIRST_TIME: "Welcome! We're here to support your mental health journey. 💙",
  MORNING: "Good morning! How are you feeling today? ☀️",
  AFTERNOON: "Good afternoon! Time for a wellness check? 🌤️",
  EVENING: "Good evening! Let's reflect on your day. 🌙",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  AUTHENTICATION_ERROR: "Your session has expired. Please login again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  NOT_FOUND: "The requested information could not be found.",
  PERMISSION_DENIED: "You don't have permission to access this.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
  TIMEOUT_ERROR: "The request took too long. Please try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ASSESSMENT_SUBMITTED: "Assessment submitted successfully! 🎉",
  PROFILE_UPDATED: "Profile updated successfully! ✓",
  PASSWORD_CHANGED: "Password changed successfully! 🔒",
  EMAIL_SENT: "Email sent successfully! 📧",
  SAVED: "Changes saved successfully! ✓",
  DELETED: "Deleted successfully! 🗑️",
  LOGIN_SUCCESS: "Welcome back! 👋",
  LOGOUT_SUCCESS: "Logged out successfully! 👋",
  REGISTRATION_SUCCESS: "Account created successfully! 🎉",
};

// Confirmation Messages
export const CONFIRMATION_MESSAGES = {
  DELETE_ASSESSMENT: "Are you sure you want to delete this assessment?",
  DELETE_ACCOUNT: "Are you sure you want to delete your account? This cannot be undone.",
  LOGOUT: "Are you sure you want to logout?",
  EXIT_ASSESSMENT: "Are you sure you want to exit? Your progress will be lost.",
  DISCARD_CHANGES: "Are you sure you want to discard your changes?",
  RESET_DATA: "Are you sure you want to reset all data?",
};

// Empty State Messages
export const EMPTY_STATE_MESSAGES = {
  NO_ASSESSMENTS: "No assessments yet. Start your first one!",
  NO_HISTORY: "No assessment history available.",
  NO_NOTIFICATIONS: "You're all caught up! No new notifications.",
  NO_RESOURCES: "No resources found for this category.",
  NO_STUDENTS: "No students found.",
  NO_RESULTS: "No results found. Try a different search.",
  NO_DATA: "No data available at the moment.",
};

// Loading Messages
export const LOADING_MESSAGES = {
  LOADING: "Loading...",
  SUBMITTING: "Submitting...",
  PROCESSING: "Processing...",
  SAVING: "Saving...",
  DELETING: "Deleting...",
  UPLOADING: "Uploading...",
  SYNCING: "Syncing...",
  PLEASE_WAIT: "Please wait...",
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
  PASSWORD_MISMATCH: "Passwords do not match",
  NAME_TOO_SHORT: "Name must be at least 3 characters",
  INVALID_FORMAT: "Invalid format",
  TOO_LONG: "Input is too long",
  TOO_SHORT: "Input is too short",
};

// Risk Level Messages
export const RISK_LEVEL_MESSAGES = {
  EXCELLENT: {
    title: "Excellent! 😊",
    message: "Your mental health appears to be in great shape! Keep up the good work.",
    color: "#10B981",
  },
  GOOD: {
    title: "Good! 🙂",
    message: "You're doing well. Keep maintaining your healthy habits.",
    color: "#F59E0B",
  },
  FAIR: {
    title: "Fair 😐",
    message: "There are some areas that need attention. Consider reaching out for support.",
    color: "#F97316",
  },
  NEEDS_SUPPORT: {
    title: "Needs Support 😟",
    message: "We're here for you. Please consider talking to a professional.",
    color: "#EF4444",
  },
};

// Recommendation Messages
export const RECOMMENDATION_MESSAGES = {
  EXCELLENT: "Continue your healthy habits and consider helping others on their wellness journey.",
  GOOD: "Focus on maintaining good sleep habits, regular exercise, and stress management techniques.",
  FAIR: "Try incorporating meditation, better sleep hygiene, and talking to someone you trust.",
  NEEDS_SUPPORT: "Please consider speaking with a mental health professional. Check out our resources section.",
};

// Motivational Quotes
export const MOTIVATIONAL_QUOTES = [
  "Taking care of your mental health is an act of self-love.",
  "Your mental health is just as important as your physical health.",
  "It's okay to not be okay. What matters is reaching out.",
  "Small steps forward are still progress.",
  "You are stronger than you know.",
  "Healing is not linear. Be patient with yourself.",
  "Your feelings are valid and you deserve support.",
  "Mental health is a journey, not a destination.",
  "You don't have to be positive all the time. It's okay to feel.",
  "Progress, not perfection.",
];

// Tips Messages
export const MENTAL_HEALTH_TIPS = [
  "💤 Get 7-9 hours of quality sleep each night.",
  "🧘 Practice mindfulness or meditation for 10 minutes daily.",
  "🏃 Exercise regularly - even a 15-minute walk helps!",
  "🥗 Eat a balanced diet to support your mental health.",
  "💬 Talk to someone you trust about your feelings.",
  "📱 Take breaks from social media and screens.",
  "📚 Keep a gratitude journal to focus on positives.",
  "🎨 Engage in hobbies and activities you enjoy.",
  "🤝 Connect with supportive friends and family.",
  "🧠 Learn stress management techniques.",
];

// Emergency Messages
export const EMERGENCY_MESSAGES = {
  CRISIS_TITLE: "Need Immediate Help? 🆘",
  CRISIS_MESSAGE: "If you're in crisis or need urgent support, please reach out to a professional immediately.",
  CRISIS_HOTLINE: "National Crisis Hotline: 1-800-273-8255",
  CRISIS_TEXT: "Text HOME to 741741 for 24/7 support",
};

export default {
  ENCOURAGEMENT_MESSAGES,
  COMPLETION_MESSAGES,
  WELCOME_MESSAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CONFIRMATION_MESSAGES,
  EMPTY_STATE_MESSAGES,
  LOADING_MESSAGES,
  VALIDATION_MESSAGES,
  RISK_LEVEL_MESSAGES,
  RECOMMENDATION_MESSAGES,
  MOTIVATIONAL_QUOTES,
  MENTAL_HEALTH_TIPS,
  EMERGENCY_MESSAGES,
};