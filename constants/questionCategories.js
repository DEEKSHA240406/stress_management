// Question Categories
export const QUESTION_CATEGORIES = {
  JOLLY: 'jolly',
  HEALTH: 'health',
  MENTAL_HEALTH: 'mental_health',
};

// Category Display Names
export const CATEGORY_NAMES = {
  [QUESTION_CATEGORIES.JOLLY]: 'Jolly Questions',
  [QUESTION_CATEGORIES.HEALTH]: 'Health Questions',
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: 'Mental Health Questions',
};

// Category Descriptions
export const CATEGORY_DESCRIPTIONS = {
  [QUESTION_CATEGORIES.JOLLY]: 'Light, fun questions to make you comfortable',
  [QUESTION_CATEGORIES.HEALTH]: 'Questions about your general health and well-being',
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: 'Questions about your mental and emotional state',
};

// Category Colors
export const CATEGORY_COLORS = {
  [QUESTION_CATEGORIES.JOLLY]: '#6366F1', // Blue
  [QUESTION_CATEGORIES.HEALTH]: '#10B981', // Green
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: '#EC4899', // Pink
};

// Category Icons
export const CATEGORY_ICONS = {
  [QUESTION_CATEGORIES.JOLLY]: '✨',
  [QUESTION_CATEGORIES.HEALTH]: '❤️',
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: '🧠',
};

// Category Order (for displaying in sequence)
export const CATEGORY_ORDER = [
  QUESTION_CATEGORIES.JOLLY,
  QUESTION_CATEGORIES.HEALTH,
  QUESTION_CATEGORIES.MENTAL_HEALTH,
];

// Get Category Info
export const getCategoryInfo = (category) => {
  return {
    key: category,
    name: CATEGORY_NAMES[category] || 'Unknown Category',
    description: CATEGORY_DESCRIPTIONS[category] || '',
    color: CATEGORY_COLORS[category] || '#6B7280',
    icon: CATEGORY_ICONS[category] || '📋',
  };
};

// Get All Categories with Info
export const getAllCategoriesInfo = () => {
  return CATEGORY_ORDER.map((category) => getCategoryInfo(category));
};

// Validate Category
export const isValidCategory = (category) => {
  return Object.values(QUESTION_CATEGORIES).includes(category);
};

// Sample Questions by Category (for reference/testing)
export const SAMPLE_QUESTIONS = {
  [QUESTION_CATEGORIES.JOLLY]: [
    {
      id: 1,
      category: QUESTION_CATEGORIES.JOLLY,
      text: "What's your favorite color?",
      options: ['Red 🔴', 'Blue 🔵', 'Green 🟢', 'Yellow 🟡'],
    },
    {
      id: 2,
      category: QUESTION_CATEGORIES.JOLLY,
      text: 'What makes you smile the most?',
      options: ['Friends 👥', 'Music 🎵', 'Food 🍕', 'Nature 🌳'],
    },
    {
      id: 3,
      category: QUESTION_CATEGORIES.JOLLY,
      text: 'How do you like to spend your free time?',
      options: ['Reading 📚', 'Sports ⚽', 'Gaming 🎮', 'Sleeping 😴'],
    },
  ],
  [QUESTION_CATEGORIES.HEALTH]: [
    {
      id: 4,
      category: QUESTION_CATEGORIES.HEALTH,
      text: 'How many hours do you sleep on average?',
      options: ['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'],
    },
    {
      id: 5,
      category: QUESTION_CATEGORIES.HEALTH,
      text: 'How often do you exercise?',
      options: ['Never', 'Rarely', 'Sometimes', 'Regularly'],
    },
    {
      id: 6,
      category: QUESTION_CATEGORIES.HEALTH,
      text: 'How would you rate your diet?',
      options: ['Poor', 'Fair', 'Good', 'Excellent'],
    },
  ],
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: [
    {
      id: 7,
      category: QUESTION_CATEGORIES.MENTAL_HEALTH,
      text: 'How often do you feel stressed?',
      options: ['Rarely', 'Sometimes', 'Often', 'Always'],
    },
    {
      id: 8,
      category: QUESTION_CATEGORIES.MENTAL_HEALTH,
      text: 'Do you feel overwhelmed by your responsibilities?',
      options: ['Not at all', 'Slightly', 'Moderately', 'Very much'],
    },
    {
      id: 9,
      category: QUESTION_CATEGORIES.MENTAL_HEALTH,
      text: 'How would you describe your mood lately?',
      options: ['Great 😊', 'Good 🙂', 'Okay 😐', 'Not good 😟'],
    },
    {
      id: 10,
      category: QUESTION_CATEGORIES.MENTAL_HEALTH,
      text: 'Do you have someone to talk to when you need support?',
      options: ['Always', 'Usually', 'Sometimes', 'Never'],
    },
  ],
};

// Get Sample Questions by Category
export const getSampleQuestionsByCategory = (category) => {
  return SAMPLE_QUESTIONS[category] || [];
};

// Get All Sample Questions
export const getAllSampleQuestions = () => {
  return [
    ...SAMPLE_QUESTIONS[QUESTION_CATEGORIES.JOLLY],
    ...SAMPLE_QUESTIONS[QUESTION_CATEGORIES.HEALTH],
    ...SAMPLE_QUESTIONS[QUESTION_CATEGORIES.MENTAL_HEALTH],
  ];
};

// Category Statistics Template
export const CATEGORY_STATS_TEMPLATE = {
  [QUESTION_CATEGORIES.JOLLY]: {
    totalQuestions: 0,
    averageScore: 0,
    completionRate: 0,
  },
  [QUESTION_CATEGORIES.HEALTH]: {
    totalQuestions: 0,
    averageScore: 0,
    completionRate: 0,
  },
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: {
    totalQuestions: 0,
    averageScore: 0,
    completionRate: 0,
  },
};

export default {
  QUESTION_CATEGORIES,
  CATEGORY_NAMES,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_ORDER,
  getCategoryInfo,
  getAllCategoriesInfo,
  isValidCategory,
  SAMPLE_QUESTIONS,
  getSampleQuestionsByCategory,
  getAllSampleQuestions,
  CATEGORY_STATS_TEMPLATE,
};