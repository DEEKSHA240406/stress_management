// Question Categories
export const QUESTION_CATEGORIES = {
  JOLLY: 'jolly',
  PERSONAL: 'personal',
  HEALTH: 'health',
  PHYSICAL: 'physical',
  MENTAL_HEALTH: 'mental_health',
  DEVELOPMENTAL: 'developmental',
};

// Gender Types
export const GENDER_TYPES = {
  MALE: 'male',
  FEMALE: 'female',
  NON_BINARY: 'non_binary',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say',
};

// Age Groups for Developmental Questions
export const AGE_GROUPS = {
  CHILD: 'child', // 0-12
  TEEN: 'teen', // 13-17
  YOUNG_ADULT: 'young_adult', // 18-25
  ADULT: 'adult', // 26-45
  MIDDLE_AGE: 'middle_age', // 46-65
  SENIOR: 'senior', // 65+
};

// Category Display Names
export const CATEGORY_NAMES = {
  [QUESTION_CATEGORIES.JOLLY]: 'Friendly Questions',
  [QUESTION_CATEGORIES.PERSONAL]: 'Personal Details',
  [QUESTION_CATEGORIES.HEALTH]: 'General Health',
  [QUESTION_CATEGORIES.PHYSICAL]: 'Physical Health',
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: 'Mental Wellbeing',
  [QUESTION_CATEGORIES.DEVELOPMENTAL]: 'Development & Growth',
};

// Category Descriptions
export const CATEGORY_DESCRIPTIONS = {
  [QUESTION_CATEGORIES.JOLLY]: 'Light, friendly questions to help us know you better',
  [QUESTION_CATEGORIES.PERSONAL]: 'Basic information about yourself',
  [QUESTION_CATEGORIES.HEALTH]: 'Questions about your overall health',
  [QUESTION_CATEGORIES.PHYSICAL]: 'Questions about your physical wellbeing',
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: 'Questions about your emotional and mental state',
  [QUESTION_CATEGORIES.DEVELOPMENTAL]: 'Questions tailored to your life stage',
};

// Category Colors
export const CATEGORY_COLORS = {
  [QUESTION_CATEGORIES.JOLLY]: '#6366F1',
  [QUESTION_CATEGORIES.PERSONAL]: '#8B5CF6',
  [QUESTION_CATEGORIES.HEALTH]: '#10B981',
  [QUESTION_CATEGORIES.PHYSICAL]: '#F59E0B',
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: '#EC4899',
  [QUESTION_CATEGORIES.DEVELOPMENTAL]: '#06B6D4',
};

// Category Icons
export const CATEGORY_ICONS = {
  [QUESTION_CATEGORIES.JOLLY]: '✨',
  [QUESTION_CATEGORIES.PERSONAL]: '👤',
  [QUESTION_CATEGORIES.HEALTH]: '❤️',
  [QUESTION_CATEGORIES.PHYSICAL]: '💪',
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: '🧠',
  [QUESTION_CATEGORIES.DEVELOPMENTAL]: '🌱',
};

// Sound Effects for Questions (audio file names or URLs)
export const QUESTION_SOUNDS = {
  START: '🔔', // Bell sound when starting
  SUCCESS: '✅', // Success sound when answered
  COMPLETE: '🎉', // Celebration sound when category complete
  TRANSITION: '➡️', // Transition sound between categories
};

// Category Order
export const CATEGORY_ORDER = [
  QUESTION_CATEGORIES.JOLLY,
  QUESTION_CATEGORIES.PERSONAL,
  QUESTION_CATEGORIES.HEALTH,
  QUESTION_CATEGORIES.PHYSICAL,
  QUESTION_CATEGORIES.MENTAL_HEALTH,
  QUESTION_CATEGORIES.DEVELOPMENTAL,
];

// Sensitive Word Consciousness - Words to handle carefully
export const SENSITIVE_TERMS = {
  MENTAL_HEALTH: [
    'depression', 'anxiety', 'suicide', 'self-harm', 'trauma',
    'abuse', 'addiction', 'eating disorder', 'panic', 'crisis'
  ],
  PHYSICAL_HEALTH: [
    'pain', 'injury', 'disability', 'chronic', 'illness',
    'medication', 'surgery', 'diagnosis'
  ],
  PERSONAL: [
    'assault', 'violence', 'discrimination', 'harassment',
    'loss', 'grief', 'death'
  ],
};

// Alternative Phrasing for Sensitive Questions
export const GENTLE_PHRASINGS = {
  pain: 'discomfort',
  problem: 'challenge',
  disorder: 'condition',
  suffer: 'experience',
  victim: 'person who experienced',
};

// Sample Questions by Category
export const SAMPLE_QUESTIONS = {
  // ===== JOLLY/FRIENDLY QUESTIONS =====
  [QUESTION_CATEGORIES.JOLLY]: [
    {
      id: 'j1',
      category: QUESTION_CATEGORIES.JOLLY,
      text: "What's your favorite way to start the day?",
      options: ['Coffee ☕', 'Exercise 🏃', 'Music 🎵', 'Meditation 🧘'],
      sound: QUESTION_SOUNDS.START,
      sensitivity: 'low',
    },
    {
      id: 'j2',
      category: QUESTION_CATEGORIES.JOLLY,
      text: 'What makes you feel most energized?',
      options: ['Being outdoors 🌳', 'Time with friends 👥', 'Learning new things 📚', 'Creative activities 🎨'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'low',
    },
    {
      id: 'j3',
      category: QUESTION_CATEGORIES.JOLLY,
      text: 'How do you prefer to relax?',
      options: ['Watching shows 📺', 'Reading 📖', 'Hobbies 🎯', 'Resting 😌'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'low',
    },
    {
      id: 'j4',
      category: QUESTION_CATEGORIES.JOLLY,
      text: 'What type of environment do you thrive in?',
      options: ['Quiet & calm 🤫', 'Lively & social 🎊', 'Structured 📋', 'Flexible 🌊'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'low',
    },
  ],

  // ===== PERSONAL DETAILS =====
  [QUESTION_CATEGORIES.PERSONAL]: [
    {
      id: 'p1',
      category: QUESTION_CATEGORIES.PERSONAL,
      text: 'What is your age group?',
      options: ['Under 18', '18-25', '26-35', '36-45', '46-60', '60+'],
      sound: QUESTION_SOUNDS.START,
      sensitivity: 'low',
      required: true,
    },
    {
      id: 'p2',
      category: QUESTION_CATEGORIES.PERSONAL,
      text: 'How do you identify?',
      options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'medium',
      required: true,
      genderSpecific: true,
    },
    {
      id: 'p3',
      category: QUESTION_CATEGORIES.PERSONAL,
      text: 'What is your current living situation?',
      options: ['With family 🏠', 'Alone 🏡', 'With roommates 🏘️', 'With partner 💑'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'low',
    },
    {
      id: 'p4',
      category: QUESTION_CATEGORIES.PERSONAL,
      text: 'What is your primary occupation?',
      options: ['Student 📚', 'Employed 💼', 'Self-employed 🚀', 'Homemaker 🏠', 'Retired 🌴', 'Looking for work 🔍'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'low',
    },
  ],

  // ===== HEALTH QUESTIONS =====
  [QUESTION_CATEGORIES.HEALTH]: [
    {
      id: 'h1',
      category: QUESTION_CATEGORIES.HEALTH,
      text: 'How many hours do you typically sleep?',
      options: ['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'],
      sound: QUESTION_SOUNDS.START,
      sensitivity: 'low',
    },
    {
      id: 'h2',
      category: QUESTION_CATEGORIES.HEALTH,
      text: 'How would you describe your overall health?',
      options: ['Excellent 💯', 'Good 👍', 'Fair 👌', 'Could be better 🤔'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'medium',
    },
    {
      id: 'h3',
      category: QUESTION_CATEGORIES.HEALTH,
      text: 'How often do you have regular health check-ups?',
      options: ['Regularly (annual) 📅', 'Sometimes 🗓️', 'Rarely 📆', 'Never ❌'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'medium',
    },
    {
      id: 'h4',
      category: QUESTION_CATEGORIES.HEALTH,
      text: 'How would you rate your diet?',
      options: ['Very balanced 🥗', 'Mostly healthy 🍎', 'Could improve 🍔', 'Needs attention 🍕'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'low',
    },
  ],

  // ===== PHYSICAL HEALTH QUESTIONS =====
  [QUESTION_CATEGORIES.PHYSICAL]: [
    {
      id: 'ph1',
      category: QUESTION_CATEGORIES.PHYSICAL,
      text: 'How often do you engage in physical activity?',
      options: ['Daily 🏃‍♂️', 'Several times a week 💪', 'Once a week 🚶', 'Rarely 🛋️'],
      sound: QUESTION_SOUNDS.START,
      sensitivity: 'low',
      genderVariations: {
        [GENDER_TYPES.MALE]: 'How often do you exercise or play sports?',
        [GENDER_TYPES.FEMALE]: 'How often do you exercise or engage in physical activities?',
      },
    },
    {
      id: 'ph2',
      category: QUESTION_CATEGORIES.PHYSICAL,
      text: 'Do you experience any ongoing physical discomfort?',
      options: ['None 😊', 'Mild occasionally 🙂', 'Moderate sometimes 😐', 'Significant often 😟'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'high',
      consciousWording: true,
    },
    {
      id: 'ph3',
      category: QUESTION_CATEGORIES.PHYSICAL,
      text: 'How is your energy level throughout the day?',
      options: ['High energy ⚡', 'Steady energy 🔋', 'Fluctuating 📊', 'Low energy 🔌'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'medium',
    },
    {
      id: 'ph4',
      category: QUESTION_CATEGORIES.PHYSICAL,
      text: 'How often do you experience headaches or body tension?',
      options: ['Never 😊', 'Rarely 🙂', 'Sometimes 😐', 'Frequently 😟'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'high',
      consciousWording: true,
    },
  ],

  // ===== MENTAL HEALTH QUESTIONS =====
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: [
    {
      id: 'mh1',
      category: QUESTION_CATEGORIES.MENTAL_HEALTH,
      text: 'How would you describe your mood over the past week?',
      options: ['Very positive 😊', 'Generally good 🙂', 'Mixed feelings 😐', 'Challenging 😔'],
      sound: QUESTION_SOUNDS.START,
      sensitivity: 'high',
      consciousWording: true,
    },
    {
      id: 'mh2',
      category: QUESTION_CATEGORIES.MENTAL_HEALTH,
      text: 'How often do you feel stressed or overwhelmed?',
      options: ['Rarely 😌', 'Sometimes 🙂', 'Often 😰', 'Most of the time 😫'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'high',
      consciousWording: true,
    },
    {
      id: 'mh3',
      category: QUESTION_CATEGORIES.MENTAL_HEALTH,
      text: 'Do you have people you can talk to when you need support?',
      options: ['Yes, many 👥', 'A few close ones 👫', 'One or two 🤝', 'Not really 😔'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'high',
    },
    {
      id: 'mh4',
      category: QUESTION_CATEGORIES.MENTAL_HEALTH,
      text: 'How do you handle difficult emotions?',
      options: ['Healthy coping 💚', 'Working on it 💛', 'It\'s challenging 🧡', 'Need support ❤️'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'high',
      consciousWording: true,
    },
    {
      id: 'mh5',
      category: QUESTION_CATEGORIES.MENTAL_HEALTH,
      text: 'How satisfied are you with your work-life balance?',
      options: ['Very satisfied 🌟', 'Mostly satisfied ⭐', 'Room for improvement 🌙', 'Needs change ✨'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'medium',
    },
  ],

  // ===== DEVELOPMENTAL QUESTIONS (Age/Gender Specific) =====
  [QUESTION_CATEGORIES.DEVELOPMENTAL]: [
    // Teen Questions
    {
      id: 'd1',
      category: QUESTION_CATEGORIES.DEVELOPMENTAL,
      text: 'How do you feel about your academic/school performance?',
      options: ['Doing great 🎓', 'Doing well 📚', 'It\'s okay 📝', 'Finding it challenging 📖'],
      sound: QUESTION_SOUNDS.START,
      sensitivity: 'medium',
      ageGroups: [AGE_GROUPS.TEEN],
    },
    {
      id: 'd2',
      category: QUESTION_CATEGORIES.DEVELOPMENTAL,
      text: 'How comfortable are you with your social relationships?',
      options: ['Very comfortable 😊', 'Mostly comfortable 🙂', 'Sometimes awkward 😅', 'Working on it 🤔'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'medium',
      ageGroups: [AGE_GROUPS.TEEN, AGE_GROUPS.YOUNG_ADULT],
    },
    // Young Adult Questions
    {
      id: 'd3',
      category: QUESTION_CATEGORIES.DEVELOPMENTAL,
      text: 'How satisfied are you with your career progress?',
      options: ['Very satisfied 🚀', 'On track ✅', 'Exploring options 🔍', 'Figuring it out 🤔'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'medium',
      ageGroups: [AGE_GROUPS.YOUNG_ADULT, AGE_GROUPS.ADULT],
    },
    // Adult Questions
    {
      id: 'd4',
      category: QUESTION_CATEGORIES.DEVELOPMENTAL,
      text: 'How do you feel about your life goals and achievements?',
      options: ['Very fulfilled 🌟', 'Making progress 📈', 'Re-evaluating 🔄', 'Seeking direction 🧭'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'medium',
      ageGroups: [AGE_GROUPS.ADULT, AGE_GROUPS.MIDDLE_AGE],
    },
    // Gender-Specific Questions
    {
      id: 'd5',
      category: QUESTION_CATEGORIES.DEVELOPMENTAL,
      text: 'How do you manage hormonal changes or related health concerns?',
      options: ['Managing well 💚', 'Aware and adapting 💛', 'Finding it challenging 🧡', 'Need guidance ❤️'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'high',
      consciousWording: true,
      genderSpecific: [GENDER_TYPES.FEMALE],
      ageGroups: [AGE_GROUPS.TEEN, AGE_GROUPS.YOUNG_ADULT, AGE_GROUPS.ADULT, AGE_GROUPS.MIDDLE_AGE],
    },
    {
      id: 'd6',
      category: QUESTION_CATEGORIES.DEVELOPMENTAL,
      text: 'How comfortable are you discussing your health concerns?',
      options: ['Very comfortable 💪', 'Somewhat comfortable 👍', 'A bit hesitant 🤔', 'Prefer privacy 🤐'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'high',
      genderSpecific: [GENDER_TYPES.MALE],
      ageGroups: [AGE_GROUPS.YOUNG_ADULT, AGE_GROUPS.ADULT, AGE_GROUPS.MIDDLE_AGE],
    },
    // Senior Questions
    {
      id: 'd7',
      category: QUESTION_CATEGORIES.DEVELOPMENTAL,
      text: 'How satisfied are you with your daily routine and activities?',
      options: ['Very satisfied 😊', 'Content 🙂', 'Looking for more 🔍', 'Need change 🔄'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'medium',
      ageGroups: [AGE_GROUPS.MIDDLE_AGE, AGE_GROUPS.SENIOR],
    },
    {
      id: 'd8',
      category: QUESTION_CATEGORIES.DEVELOPMENTAL,
      text: 'How connected do you feel to your community and family?',
      options: ['Very connected 💖', 'Well connected 💝', 'Somewhat connected 💗', 'Would like more connection 💓'],
      sound: QUESTION_SOUNDS.SUCCESS,
      sensitivity: 'medium',
      ageGroups: [AGE_GROUPS.MIDDLE_AGE, AGE_GROUPS.SENIOR],
    },
  ],
};

// Helper Functions

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

// Get All Categories Info
export const getAllCategoriesInfo = () => {
  return CATEGORY_ORDER.map((category) => getCategoryInfo(category));
};

// Validate Category
export const isValidCategory = (category) => {
  return Object.values(QUESTION_CATEGORIES).includes(category);
};

// Get Questions by Category with Filters
export const getQuestionsByCategory = (category, filters = {}) => {
  const { gender, ageGroup } = filters;
  let questions = SAMPLE_QUESTIONS[category] || [];

  // Filter by age group if specified
  if (ageGroup && category === QUESTION_CATEGORIES.DEVELOPMENTAL) {
    questions = questions.filter((q) => {
      if (!q.ageGroups) return true;
      return q.ageGroups.includes(ageGroup);
    });
  }

  // Filter by gender if specified
  if (gender) {
    questions = questions.filter((q) => {
      if (!q.genderSpecific) return true;
      if (Array.isArray(q.genderSpecific)) {
        return q.genderSpecific.includes(gender);
      }
      return true;
    });

    // Apply gender-specific text variations
    questions = questions.map((q) => {
      if (q.genderVariations && q.genderVariations[gender]) {
        return {
          ...q,
          text: q.genderVariations[gender],
        };
      }
      return q;
    });
  }

  return questions;
};

// Get All Questions with Filters
export const getAllQuestions = (filters = {}) => {
  return CATEGORY_ORDER.flatMap((category) =>
    getQuestionsByCategory(category, filters)
  );
};

// Check if Question Contains Sensitive Content
export const hasSensitiveContent = (question) => {
  return question.sensitivity === 'high' || question.consciousWording === true;
};

// Get Gentle Phrasing
export const getGentlePhrasing = (text) => {
  let gentleText = text;
  Object.keys(GENTLE_PHRASINGS).forEach((harsh) => {
    const gentle = GENTLE_PHRASINGS[harsh];
    const regex = new RegExp(`\\b${harsh}\\b`, 'gi');
    gentleText = gentleText.replace(regex, gentle);
  });
  return gentleText;
};

// Detect Age Group from Age
export const detectAgeGroup = (age) => {
  if (age < 13) return AGE_GROUPS.CHILD;
  if (age < 18) return AGE_GROUPS.TEEN;
  if (age < 26) return AGE_GROUPS.YOUNG_ADULT;
  if (age < 46) return AGE_GROUPS.ADULT;
  if (age < 66) return AGE_GROUPS.MIDDLE_AGE;
  return AGE_GROUPS.SENIOR;
};

// Play Sound Effect
export const playQuestionSound = (soundType) => {
  // This would integrate with an actual audio library
  console.log(`🔊 Playing sound: ${soundType}`);
  // Example: new Audio(`/sounds/${soundType}.mp3`).play();
};

// Category Statistics Template
export const CATEGORY_STATS_TEMPLATE = {
  [QUESTION_CATEGORIES.JOLLY]: {
    totalQuestions: 0,
    answeredQuestions: 0,
    averageScore: 0,
    completionRate: 0,
  },
  [QUESTION_CATEGORIES.PERSONAL]: {
    totalQuestions: 0,
    answeredQuestions: 0,
    averageScore: 0,
    completionRate: 0,
  },
  [QUESTION_CATEGORIES.HEALTH]: {
    totalQuestions: 0,
    answeredQuestions: 0,
    averageScore: 0,
    completionRate: 0,
  },
  [QUESTION_CATEGORIES.PHYSICAL]: {
    totalQuestions: 0,
    answeredQuestions: 0,
    averageScore: 0,
    completionRate: 0,
  },
  [QUESTION_CATEGORIES.MENTAL_HEALTH]: {
    totalQuestions: 0,
    answeredQuestions: 0,
    averageScore: 0,
    completionRate: 0,
  },
  [QUESTION_CATEGORIES.DEVELOPMENTAL]: {
    totalQuestions: 0,
    answeredQuestions: 0,
    averageScore: 0,
    completionRate: 0,
  },
};

// Export everything
export default {
  QUESTION_CATEGORIES,
  GENDER_TYPES,
  AGE_GROUPS,
  CATEGORY_NAMES,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_ORDER,
  QUESTION_SOUNDS,
  SENSITIVE_TERMS,
  GENTLE_PHRASINGS,
  SAMPLE_QUESTIONS,
  getCategoryInfo,
  getAllCategoriesInfo,
  isValidCategory,
  getQuestionsByCategory,
  getAllQuestions,
  hasSensitiveContent,
  getGentlePhrasing,
  detectAgeGroup,
  playQuestionSound,
  CATEGORY_STATS_TEMPLATE,
};