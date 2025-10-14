import { createSlice } from '@reduxjs/toolkit';
import { QUESTION_CATEGORIES } from '../../../constants';

const initialState = {
  // All Questions
  allQuestions: [],
  
  // Current Assessment Questions
  currentQuestions: [],
  currentQuestionIndex: 0,
  
  // Answers
  answers: [],
  
  // Question Categories
  categories: Object.values(QUESTION_CATEGORIES),
  selectedCategory: null,
  
  // Question by Category
  jollyQuestions: [],
  healthQuestions: [],
  mentalHealthQuestions: [],
  
  // Assessment State
  assessmentStarted: false,
  assessmentCompleted: false,
  assessmentStartTime: null,
  assessmentEndTime: null,
  assessmentDuration: null,
  
  // Question Management (Admin)
  totalQuestions: 0,
  questionsPerCategory: {
    jolly: 0,
    health: 0,
    mental_health: 0,
  },
  
  // Pagination
  currentPage: 1,
  questionsPerPage: 10,
  totalPages: 0,
  
  // Search & Filter
  searchQuery: '',
  filters: {
    category: null,
    isActive: null,
  },
  
  // Single Question (for editing)
  selectedQuestion: null,
  
  // Draft Question (for creating/editing)
  draftQuestion: null,
  
  // UI States
  loading: false,
  error: null,
  
  // Cache
  cachedQuestions: [],
  cacheTimestamp: null,
  
  // Statistics
  questionStats: null,
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    // Set Loading State
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set Error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Clear Error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set All Questions
    setAllQuestions: (state, action) => {
      state.allQuestions = action.payload;
      state.totalQuestions = action.payload.length;
      
      // Categorize questions
      state.jollyQuestions = action.payload.filter(
        (q) => q.category === QUESTION_CATEGORIES.JOLLY
      );
      state.healthQuestions = action.payload.filter(
        (q) => q.category === QUESTION_CATEGORIES.HEALTH
      );
      state.mentalHealthQuestions = action.payload.filter(
        (q) => q.category === QUESTION_CATEGORIES.MENTAL_HEALTH
      );
      
      // Count per category
      state.questionsPerCategory = {
        jolly: state.jollyQuestions.length,
        health: state.healthQuestions.length,
        mental_health: state.mentalHealthQuestions.length,
      };
      
      state.loading = false;
    },
    
    // Set Current Assessment Questions
    setCurrentQuestions: (state, action) => {
      state.currentQuestions = action.payload;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.loading = false;
    },
    
    // Set Current Question Index
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    
    // Next Question
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.currentQuestions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    
    // Previous Question
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    
    // Add Answer
    addAnswer: (state, action) => {
      const answer = action.payload;
      
      // Check if answer for this question already exists
      const existingIndex = state.answers.findIndex(
        (a) => a.questionId === answer.questionId
      );
      
      if (existingIndex !== -1) {
        // Update existing answer
        state.answers[existingIndex] = answer;
      } else {
        // Add new answer
        state.answers.push(answer);
      }
    },
    
    // Update Answer
    updateAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      const index = state.answers.findIndex((a) => a.questionId === questionId);
      
      if (index !== -1) {
        state.answers[index] = {
          ...state.answers[index],
          answer,
        };
      }
    },
    
    // Remove Answer
    removeAnswer: (state, action) => {
      const questionId = action.payload;
      state.answers = state.answers.filter((a) => a.questionId !== questionId);
    },
    
    // Clear All Answers
    clearAnswers: (state) => {
      state.answers = [];
    },
    
    // Start Assessment
    startAssessment: (state, action) => {
      state.assessmentStarted = true;
      state.assessmentCompleted = false;
      state.assessmentStartTime = new Date().toISOString();
      state.currentQuestions = action.payload || state.currentQuestions;
      state.currentQuestionIndex = 0;
      state.answers = [];
    },
    
    // Complete Assessment
    completeAssessment: (state) => {
      state.assessmentCompleted = true;
      state.assessmentStarted = false;
      state.assessmentEndTime = new Date().toISOString();
      
      // Calculate duration
      if (state.assessmentStartTime) {
        const start = new Date(state.assessmentStartTime);
        const end = new Date(state.assessmentEndTime);
        const durationMs = end - start;
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        state.assessmentDuration = `${minutes}m ${seconds}s`;
      }
    },
    
    // Reset Assessment
    resetAssessment: (state) => {
      state.assessmentStarted = false;
      state.assessmentCompleted = false;
      state.assessmentStartTime = null;
      state.assessmentEndTime = null;
      state.assessmentDuration = null;
      state.currentQuestionIndex = 0;
      state.answers = [];
    },
    
    // Set Selected Category
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    
    // Set Questions by Category
    setQuestionsByCategory: (state, action) => {
      const { category, questions } = action.payload;
      
      if (category === QUESTION_CATEGORIES.JOLLY) {
        state.jollyQuestions = questions;
      } else if (category === QUESTION_CATEGORIES.HEALTH) {
        state.healthQuestions = questions;
      } else if (category === QUESTION_CATEGORIES.MENTAL_HEALTH) {
        state.mentalHealthQuestions = questions;
      }
      
      state.loading = false;
    },
    
    // Add Question
    addQuestion: (state, action) => {
      const question = action.payload;
      state.allQuestions.push(question);
      state.totalQuestions += 1;
      
      // Add to category
      if (question.category === QUESTION_CATEGORIES.JOLLY) {
        state.jollyQuestions.push(question);
        state.questionsPerCategory.jolly += 1;
      } else if (question.category === QUESTION_CATEGORIES.HEALTH) {
        state.healthQuestions.push(question);
        state.questionsPerCategory.health += 1;
      } else if (question.category === QUESTION_CATEGORIES.MENTAL_HEALTH) {
        state.mentalHealthQuestions.push(question);
        state.questionsPerCategory.mental_health += 1;
      }
    },
    
    // Update Question
    updateQuestion: (state, action) => {
      const updatedQuestion = action.payload;
      
      // Update in allQuestions
      const index = state.allQuestions.findIndex((q) => q.id === updatedQuestion.id);
      if (index !== -1) {
        state.allQuestions[index] = updatedQuestion;
      }
      
      // Update in category arrays
      const updateInCategory = (categoryArray) => {
        const catIndex = categoryArray.findIndex((q) => q.id === updatedQuestion.id);
        if (catIndex !== -1) {
          categoryArray[catIndex] = updatedQuestion;
        }
      };
      
      updateInCategory(state.jollyQuestions);
      updateInCategory(state.healthQuestions);
      updateInCategory(state.mentalHealthQuestions);
    },
    
    // Delete Question
    deleteQuestion: (state, action) => {
      const questionId = action.payload;
      
      // Find and remove from allQuestions
      const question = state.allQuestions.find((q) => q.id === questionId);
      state.allQuestions = state.allQuestions.filter((q) => q.id !== questionId);
      state.totalQuestions = Math.max(0, state.totalQuestions - 1);
      
      // Remove from category
      if (question) {
        if (question.category === QUESTION_CATEGORIES.JOLLY) {
          state.jollyQuestions = state.jollyQuestions.filter((q) => q.id !== questionId);
          state.questionsPerCategory.jolly = Math.max(0, state.questionsPerCategory.jolly - 1);
        } else if (question.category === QUESTION_CATEGORIES.HEALTH) {
          state.healthQuestions = state.healthQuestions.filter((q) => q.id !== questionId);
          state.questionsPerCategory.health = Math.max(0, state.questionsPerCategory.health - 1);
        } else if (question.category === QUESTION_CATEGORIES.MENTAL_HEALTH) {
          state.mentalHealthQuestions = state.mentalHealthQuestions.filter((q) => q.id !== questionId);
          state.questionsPerCategory.mental_health = Math.max(0, state.questionsPerCategory.mental_health - 1);
        }
      }
    },
    
    // Set Selected Question
    setSelectedQuestion: (state, action) => {
      state.selectedQuestion = action.payload;
    },
    
    // Clear Selected Question
    clearSelectedQuestion: (state) => {
      state.selectedQuestion = null;
    },
    
    // Set Draft Question
    setDraftQuestion: (state, action) => {
      state.draftQuestion = action.payload;
    },
    
    // Clear Draft Question
    clearDraftQuestion: (state) => {
      state.draftQuestion = null;
    },
    
    // Set Search Query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    // Set Filters
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    // Clear Filters
    clearFilters: (state) => {
      state.filters = {
        category: null,
        isActive: null,
      };
      state.searchQuery = '';
    },
    
    // Set Pagination
    setPagination: (state, action) => {
      const { currentPage, questionsPerPage, totalPages } = action.payload;
      if (currentPage !== undefined) state.currentPage = currentPage;
      if (questionsPerPage !== undefined) state.questionsPerPage = questionsPerPage;
      if (totalPages !== undefined) state.totalPages = totalPages;
    },
    
    // Cache Questions
    cacheQuestions: (state, action) => {
      state.cachedQuestions = action.payload;
      state.cacheTimestamp = new Date().toISOString();
    },
    
    // Clear Cache
    clearCache: (state) => {
      state.cachedQuestions = [];
      state.cacheTimestamp = null;
    },
    
    // Set Question Statistics
    setQuestionStats: (state, action) => {
      state.questionStats = action.payload;
    },
    
    // Toggle Question Active Status
    toggleQuestionStatus: (state, action) => {
      const { questionId, isActive } = action.payload;
      
      const updateStatus = (question) => {
        if (question.id === questionId) {
          question.isActive = isActive;
        }
        return question;
      };
      
      state.allQuestions = state.allQuestions.map(updateStatus);
      state.jollyQuestions = state.jollyQuestions.map(updateStatus);
      state.healthQuestions = state.healthQuestions.map(updateStatus);
      state.mentalHealthQuestions = state.mentalHealthQuestions.map(updateStatus);
    },
    
    // Reorder Questions
    reorderQuestions: (state, action) => {
      const orderedIds = action.payload;
      
      // Reorder allQuestions based on orderedIds
      const orderedQuestions = orderedIds
        .map((id) => state.allQuestions.find((q) => q.id === id))
        .filter(Boolean);
      
      state.allQuestions = orderedQuestions;
    },
    
    // Reset Questions State
    resetQuestionsState: (state) => {
      return initialState;
    },
    
    // Get Progress Percentage
    getProgress: (state) => {
      if (state.currentQuestions.length === 0) return 0;
      return Math.round(
        ((state.currentQuestionIndex + 1) / state.currentQuestions.length) * 100
      );
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setAllQuestions,
  setCurrentQuestions,
  setCurrentQuestionIndex,
  nextQuestion,
  previousQuestion,
  addAnswer,
  updateAnswer,
  removeAnswer,
  clearAnswers,
  startAssessment,
  completeAssessment,
  resetAssessment,
  setSelectedCategory,
  setQuestionsByCategory,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  setSelectedQuestion,
  clearSelectedQuestion,
  setDraftQuestion,
  clearDraftQuestion,
  setSearchQuery,
  setFilters,
  clearFilters,
  setPagination,
  cacheQuestions,
  clearCache,
  setQuestionStats,
  toggleQuestionStatus,
  reorderQuestions,
  resetQuestionsState,
  getProgress,
} = questionSlice.actions;

// Selectors
export const selectLoading = (state) => state.questions.loading;
export const selectError = (state) => state.questions.error;
export const selectAllQuestions = (state) => state.questions.allQuestions;
export const selectCurrentQuestions = (state) => state.questions.currentQuestions;
export const selectCurrentQuestionIndex = (state) => state.questions.currentQuestionIndex;
export const selectCurrentQuestion = (state) =>
  state.questions.currentQuestions[state.questions.currentQuestionIndex];
export const selectAnswers = (state) => state.questions.answers;
export const selectCategories = (state) => state.questions.categories;
export const selectSelectedCategory = (state) => state.questions.selectedCategory;
export const selectJollyQuestions = (state) => state.questions.jollyQuestions;
export const selectHealthQuestions = (state) => state.questions.healthQuestions;
export const selectMentalHealthQuestions = (state) => state.questions.mentalHealthQuestions;
export const selectAssessmentStarted = (state) => state.questions.assessmentStarted;
export const selectAssessmentCompleted = (state) => state.questions.assessmentCompleted;
export const selectAssessmentDuration = (state) => state.questions.assessmentDuration;
export const selectTotalQuestions = (state) => state.questions.totalQuestions;
export const selectQuestionsPerCategory = (state) => state.questions.questionsPerCategory;
export const selectSelectedQuestion = (state) => state.questions.selectedQuestion;
export const selectDraftQuestion = (state) => state.questions.draftQuestion;
export const selectSearchQuery = (state) => state.questions.searchQuery;
export const selectFilters = (state) => state.questions.filters;
export const selectPagination = (state) => ({
  currentPage: state.questions.currentPage,
  questionsPerPage: state.questions.questionsPerPage,
  totalPages: state.questions.totalPages,
});
export const selectCachedQuestions = (state) => state.questions.cachedQuestions;
export const selectQuestionStats = (state) => state.questions.questionStats;
export const selectAssessmentProgress = (state) => {
  if (state.questions.currentQuestions.length === 0) return 0;
  return Math.round(
    ((state.questions.currentQuestionIndex + 1) / state.questions.currentQuestions.length) * 100
  );
};

export default questionSlice.reducer;