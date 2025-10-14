import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Assessment Responses
  allResponses: [],
  currentResponse: null,
  latestResponse: null,
  
  // Assessment History
  assessmentHistory: [],
  totalAssessments: 0,
  
  // Current Assessment Data
  currentAssessment: {
    id: null,
    answers: [],
    startTime: null,
    endTime: null,
    duration: null,
    score: null,
    riskLevel: null,
    categoryScores: null,
  },
  
  // Results
  assessmentResult: null,
  score: 0,
  riskLevel: '',
  analysis: '',
  recommendations: [],
  
  // Statistics
  userStats: {
    totalCompleted: 0,
    averageScore: 0,
    lastAssessmentDate: null,
    highestScore: 0,
    lowestScore: 0,
  },
  
  // Progress Tracking
  progressData: [],
  trendDirection: null, // 'improving', 'declining', 'stable'
  
  // Category Performance
  categoryPerformance: {
    jolly: null,
    health: null,
    mental_health: null,
  },
  
  // Comparison Data
  comparisonData: null,
  selectedAssessmentsForComparison: [],
  
  // Personalized Recommendations
  personalizedRecommendations: [],
  recommendedResources: [],
  
  // Draft Assessment
  draftAssessment: null,
  hasDraft: false,
  
  // Filters
  filters: {
    dateRange: {
      start: null,
      end: null,
    },
    riskLevel: null,
    minScore: null,
    maxScore: null,
  },
  
  // Pagination
  currentPage: 1,
  responsesPerPage: 10,
  totalPages: 0,
  
  // Notes
  assessmentNotes: {},
  
  // Sharing
  sharedAssessments: [],
  
  // Sync Status
  unsyncedResponses: [],
  syncInProgress: false,
  lastSyncTime: null,
  
  // UI States
  loading: false,
  submitting: false,
  error: null,
  successMessage: null,
};

const responseSlice = createSlice({
  name: 'responses',
  initialState,
  reducers: {
    // Set Loading State
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set Submitting State
    setSubmitting: (state, action) => {
      state.submitting = action.payload;
    },
    
    // Set Error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.submitting = false;
    },
    
    // Clear Error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set Success Message
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    
    // Clear Success Message
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    
    // Set Assessment History
    setAssessmentHistory: (state, action) => {
      state.assessmentHistory = action.payload;
      state.totalAssessments = action.payload.length;
      state.loading = false;
    },
    
    // Add Assessment to History
    addAssessmentToHistory: (state, action) => {
      state.assessmentHistory.unshift(action.payload);
      state.totalAssessments += 1;
    },
    
    // Set Current Response
    setCurrentResponse: (state, action) => {
      state.currentResponse = action.payload;
      state.loading = false;
    },
    
    // Set Latest Response
    setLatestResponse: (state, action) => {
      state.latestResponse = action.payload;
      state.loading = false;
    },
    
    // Set Assessment Result
    setAssessmentResult: (state, action) => {
      const { assessment, score, riskLevel, analysis, recommendations } = action.payload;
      
      state.assessmentResult = assessment;
      state.score = score;
      state.riskLevel = riskLevel;
      state.analysis = analysis;
      state.recommendations = recommendations || [];
      state.latestResponse = assessment;
      state.submitting = false;
      state.loading = false;
    },
    
    // Update Current Assessment
    updateCurrentAssessment: (state, action) => {
      state.currentAssessment = {
        ...state.currentAssessment,
        ...action.payload,
      };
    },
    
    // Start Current Assessment
    startCurrentAssessment: (state, action) => {
      state.currentAssessment = {
        id: action.payload?.id || Date.now().toString(),
        answers: [],
        startTime: new Date().toISOString(),
        endTime: null,
        duration: null,
        score: null,
        riskLevel: null,
        categoryScores: null,
      };
    },
    
    // Complete Current Assessment
    completeCurrentAssessment: (state, action) => {
      state.currentAssessment.endTime = new Date().toISOString();
      state.currentAssessment.score = action.payload.score;
      state.currentAssessment.riskLevel = action.payload.riskLevel;
      state.currentAssessment.categoryScores = action.payload.categoryScores;
      
      // Calculate duration
      const start = new Date(state.currentAssessment.startTime);
      const end = new Date(state.currentAssessment.endTime);
      const durationMs = end - start;
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      state.currentAssessment.duration = `${minutes}m ${seconds}s`;
    },
    
    // Reset Current Assessment
    resetCurrentAssessment: (state) => {
      state.currentAssessment = {
        id: null,
        answers: [],
        startTime: null,
        endTime: null,
        duration: null,
        score: null,
        riskLevel: null,
        categoryScores: null,
      };
    },
    
    // Set User Statistics
    setUserStats: (state, action) => {
      state.userStats = {
        ...state.userStats,
        ...action.payload,
      };
      state.loading = false;
    },
    
    // Set Progress Data
    setProgressData: (state, action) => {
      state.progressData = action.payload.progress || [];
      state.trendDirection = action.payload.trend || null;
      state.loading = false;
    },
    
    // Set Category Performance
    setCategoryPerformance: (state, action) => {
      state.categoryPerformance = {
        ...state.categoryPerformance,
        ...action.payload,
      };
      state.loading = false;
    },
    
    // Set Comparison Data
    setComparisonData: (state, action) => {
      state.comparisonData = action.payload;
      state.loading = false;
    },
    
    // Add Assessment for Comparison
    addAssessmentForComparison: (state, action) => {
      const assessmentId = action.payload;
      if (!state.selectedAssessmentsForComparison.includes(assessmentId)) {
        state.selectedAssessmentsForComparison.push(assessmentId);
      }
    },
    
    // Remove Assessment from Comparison
    removeAssessmentFromComparison: (state, action) => {
      const assessmentId = action.payload;
      state.selectedAssessmentsForComparison = state.selectedAssessmentsForComparison.filter(
        (id) => id !== assessmentId
      );
    },
    
    // Clear Comparison
    clearComparison: (state) => {
      state.comparisonData = null;
      state.selectedAssessmentsForComparison = [];
    },
    
    // Set Personalized Recommendations
    setPersonalizedRecommendations: (state, action) => {
      state.personalizedRecommendations = action.payload.recommendations || [];
      state.recommendedResources = action.payload.resources || [];
      state.loading = false;
    },
    
    // Delete Assessment Response
    deleteAssessmentResponse: (state, action) => {
      const assessmentId = action.payload;
      state.assessmentHistory = state.assessmentHistory.filter(
        (assessment) => assessment.id !== assessmentId
      );
      state.totalAssessments = Math.max(0, state.totalAssessments - 1);
    },
    
    // Set Assessment Notes
    setAssessmentNotes: (state, action) => {
      const { assessmentId, notes } = action.payload;
      state.assessmentNotes[assessmentId] = notes;
    },
    
    // Update Assessment in History
    updateAssessmentInHistory: (state, action) => {
      const updatedAssessment = action.payload;
      const index = state.assessmentHistory.findIndex(
        (a) => a.id === updatedAssessment.id
      );
      if (index !== -1) {
        state.assessmentHistory[index] = updatedAssessment;
      }
    },
    
    // Save Draft Assessment
    saveDraftAssessment: (state, action) => {
      state.draftAssessment = action.payload;
      state.hasDraft = true;
    },
    
    // Load Draft Assessment
    loadDraftAssessment: (state) => {
      if (state.draftAssessment) {
        state.currentAssessment = state.draftAssessment;
      }
    },
    
    // Clear Draft Assessment
    clearDraftAssessment: (state) => {
      state.draftAssessment = null;
      state.hasDraft = false;
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
        dateRange: {
          start: null,
          end: null,
        },
        riskLevel: null,
        minScore: null,
        maxScore: null,
      };
    },
    
    // Set Pagination
    setPagination: (state, action) => {
      const { currentPage, responsesPerPage, totalPages } = action.payload;
      if (currentPage !== undefined) state.currentPage = currentPage;
      if (responsesPerPage !== undefined) state.responsesPerPage = responsesPerPage;
      if (totalPages !== undefined) state.totalPages = totalPages;
    },
    
    // Add Unsynced Response
    addUnsyncedResponse: (state, action) => {
      state.unsyncedResponses.push(action.payload);
    },
    
    // Remove Unsynced Response
    removeUnsyncedResponse: (state, action) => {
      const responseId = action.payload;
      state.unsyncedResponses = state.unsyncedResponses.filter(
        (response) => response.id !== responseId
      );
    },
    
    // Clear Unsynced Responses
    clearUnsyncedResponses: (state) => {
      state.unsyncedResponses = [];
    },
    
    // Set Sync Status
    setSyncInProgress: (state, action) => {
      state.syncInProgress = action.payload;
    },
    
    // Update Last Sync Time
    updateLastSyncTime: (state) => {
      state.lastSyncTime = new Date().toISOString();
    },
    
    // Add Shared Assessment
    addSharedAssessment: (state, action) => {
      state.sharedAssessments.push(action.payload);
    },
    
    // Set All Responses
    setAllResponses: (state, action) => {
      state.allResponses = action.payload;
      state.loading = false;
    },
    
    // Calculate Statistics from History
    calculateStatsFromHistory: (state) => {
      if (state.assessmentHistory.length === 0) {
        state.userStats = {
          totalCompleted: 0,
          averageScore: 0,
          lastAssessmentDate: null,
          highestScore: 0,
          lowestScore: 0,
        };
        return;
      }
      
      const scores = state.assessmentHistory.map((a) => a.score).filter(Boolean);
      const total = scores.length;
      const sum = scores.reduce((acc, score) => acc + score, 0);
      const average = total > 0 ? Math.round(sum / total) : 0;
      const highest = total > 0 ? Math.max(...scores) : 0;
      const lowest = total > 0 ? Math.min(...scores) : 0;
      const lastDate = state.assessmentHistory[0]?.date || null;
      
      state.userStats = {
        totalCompleted: total,
        averageScore: average,
        lastAssessmentDate: lastDate,
        highestScore: highest,
        lowestScore: lowest,
      };
    },
    
    // Reset Response State
    resetResponseState: (state) => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setSubmitting,
  setError,
  clearError,
  setSuccessMessage,
  clearSuccessMessage,
  setAssessmentHistory,
  addAssessmentToHistory,
  setCurrentResponse,
  setLatestResponse,
  setAssessmentResult,
  updateCurrentAssessment,
  startCurrentAssessment,
  completeCurrentAssessment,
  resetCurrentAssessment,
  setUserStats,
  setProgressData,
  setCategoryPerformance,
  setComparisonData,
  addAssessmentForComparison,
  removeAssessmentFromComparison,
  clearComparison,
  setPersonalizedRecommendations,
  deleteAssessmentResponse,
  setAssessmentNotes,
  updateAssessmentInHistory,
  saveDraftAssessment,
  loadDraftAssessment,
  clearDraftAssessment,
  setFilters,
  clearFilters,
  setPagination,
  addUnsyncedResponse,
  removeUnsyncedResponse,
  clearUnsyncedResponses,
  setSyncInProgress,
  updateLastSyncTime,
  addSharedAssessment,
  setAllResponses,
  calculateStatsFromHistory,
  resetResponseState,
} = responseSlice.actions;

// Selectors
export const selectLoading = (state) => state.responses.loading;
export const selectSubmitting = (state) => state.responses.submitting;
export const selectError = (state) => state.responses.error;
export const selectSuccessMessage = (state) => state.responses.successMessage;
export const selectAssessmentHistory = (state) => state.responses.assessmentHistory;
export const selectTotalAssessments = (state) => state.responses.totalAssessments;
export const selectCurrentResponse = (state) => state.responses.currentResponse;
export const selectLatestResponse = (state) => state.responses.latestResponse;
export const selectAssessmentResult = (state) => state.responses.assessmentResult;
export const selectScore = (state) => state.responses.score;
export const selectRiskLevel = (state) => state.responses.riskLevel;
export const selectAnalysis = (state) => state.responses.analysis;
export const selectRecommendations = (state) => state.responses.recommendations;
export const selectCurrentAssessment = (state) => state.responses.currentAssessment;
export const selectUserStats = (state) => state.responses.userStats;
export const selectProgressData = (state) => state.responses.progressData;
export const selectTrendDirection = (state) => state.responses.trendDirection;
export const selectCategoryPerformance = (state) => state.responses.categoryPerformance;
export const selectComparisonData = (state) => state.responses.comparisonData;
export const selectSelectedAssessmentsForComparison = (state) => 
  state.responses.selectedAssessmentsForComparison;
export const selectPersonalizedRecommendations = (state) => 
  state.responses.personalizedRecommendations;
export const selectRecommendedResources = (state) => state.responses.recommendedResources;
export const selectDraftAssessment = (state) => state.responses.draftAssessment;
export const selectHasDraft = (state) => state.responses.hasDraft;
export const selectFilters = (state) => state.responses.filters;
export const selectPagination = (state) => ({
  currentPage: state.responses.currentPage,
  responsesPerPage: state.responses.responsesPerPage,
  totalPages: state.responses.totalPages,
});
export const selectAssessmentNotes = (state) => state.responses.assessmentNotes;
export const selectUnsyncedResponses = (state) => state.responses.unsyncedResponses;
export const selectSyncInProgress = (state) => state.responses.syncInProgress;
export const selectLastSyncTime = (state) => state.responses.lastSyncTime;
export const selectHasUnsyncedData = (state) => state.responses.unsyncedResponses.length > 0;

export default responseSlice.reducer;