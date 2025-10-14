import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Dashboard Overview
  dashboardData: null,
  
  // Student Statistics
  totalStudents: 0,
  activeStudents: 0,
  studentsList: [],
  
  // Assessment Statistics
  totalAssessments: 0,
  completionRate: 0,
  averageScore: 0,
  assessmentStats: null,
  
  // Risk Level Distribution
  riskLevels: {
    excellent: 0,
    good: 0,
    fair: 0,
    needsSupport: 0,
  },
  
  // Category Performance
  categoryPerformance: [],
  
  // Trending Concerns
  trendingConcerns: [],
  
  // Time-based Analytics
  timeBasedTrends: [],
  selectedPeriod: 'monthly', // 'daily', 'weekly', 'monthly', 'yearly'
  
  // Alerts
  alerts: [],
  unreadAlerts: 0,
  
  // Demographics
  demographics: null,
  
  // Filters
  filters: {
    dateRange: {
      start: null,
      end: null,
    },
    riskLevel: null,
    category: null,
  },
  
  // UI States
  loading: false,
  error: null,
  lastUpdated: null,
  
  // Comparison Data
  comparisonData: null,
  
  // Selected Student
  selectedStudent: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
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
    
    // Set Dashboard Data
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.loading = false;
    },
    
    // Set Student Statistics
    setStudentStats: (state, action) => {
      state.totalStudents = action.payload.total || 0;
      state.activeStudents = action.payload.active || 0;
      state.loading = false;
    },
    
    // Set Students List
    setStudentsList: (state, action) => {
      state.studentsList = action.payload;
      state.loading = false;
    },
    
    // Set Assessment Statistics
    setAssessmentStats: (state, action) => {
      state.assessmentStats = action.payload;
      state.totalAssessments = action.payload.total || 0;
      state.completionRate = action.payload.completionRate || 0;
      state.averageScore = action.payload.averageScore || 0;
      state.loading = false;
    },
    
    // Set Risk Level Distribution
    setRiskLevelDistribution: (state, action) => {
      state.riskLevels = {
        excellent: action.payload.excellent || 0,
        good: action.payload.good || 0,
        fair: action.payload.fair || 0,
        needsSupport: action.payload.needsSupport || 0,
      };
      state.loading = false;
    },
    
    // Set Category Performance
    setCategoryPerformance: (state, action) => {
      state.categoryPerformance = action.payload;
      state.loading = false;
    },
    
    // Set Trending Concerns
    setTrendingConcerns: (state, action) => {
      state.trendingConcerns = action.payload;
      state.loading = false;
    },
    
    // Set Time-based Trends
    setTimeBasedTrends: (state, action) => {
      state.timeBasedTrends = action.payload;
      state.loading = false;
    },
    
    // Set Selected Period
    setSelectedPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
    
    // Set Alerts
    setAlerts: (state, action) => {
      state.alerts = action.payload;
      state.unreadAlerts = action.payload.filter((alert) => !alert.read).length;
      state.loading = false;
    },
    
    // Add Alert
    addAlert: (state, action) => {
      state.alerts.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadAlerts += 1;
      }
    },
    
    // Mark Alert as Read
    markAlertAsRead: (state, action) => {
      const alertId = action.payload;
      const alert = state.alerts.find((a) => a.id === alertId);
      if (alert && !alert.read) {
        alert.read = true;
        state.unreadAlerts = Math.max(0, state.unreadAlerts - 1);
      }
    },
    
    // Clear All Alerts
    clearAllAlerts: (state) => {
      state.alerts = [];
      state.unreadAlerts = 0;
    },
    
    // Set Demographics
    setDemographics: (state, action) => {
      state.demographics = action.payload;
      state.loading = false;
    },
    
    // Set Filters
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    // Set Date Range Filter
    setDateRangeFilter: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    
    // Set Risk Level Filter
    setRiskLevelFilter: (state, action) => {
      state.filters.riskLevel = action.payload;
    },
    
    // Set Category Filter
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
    },
    
    // Clear Filters
    clearFilters: (state) => {
      state.filters = {
        dateRange: {
          start: null,
          end: null,
        },
        riskLevel: null,
        category: null,
      };
    },
    
    // Set Comparison Data
    setComparisonData: (state, action) => {
      state.comparisonData = action.payload;
      state.loading = false;
    },
    
    // Clear Comparison Data
    clearComparisonData: (state) => {
      state.comparisonData = null;
    },
    
    // Set Selected Student
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
      state.loading = false;
    },
    
    // Clear Selected Student
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
    
    // Update Student in List
    updateStudentInList: (state, action) => {
      const updatedStudent = action.payload;
      const index = state.studentsList.findIndex(
        (student) => student.id === updatedStudent.id
      );
      if (index !== -1) {
        state.studentsList[index] = updatedStudent;
      }
    },
    
    // Remove Student from List
    removeStudentFromList: (state, action) => {
      const studentId = action.payload;
      state.studentsList = state.studentsList.filter(
        (student) => student.id !== studentId
      );
      state.totalStudents = Math.max(0, state.totalStudents - 1);
    },
    
    // Increment Total Assessments
    incrementTotalAssessments: (state) => {
      state.totalAssessments += 1;
    },
    
    // Update Risk Level Count
    updateRiskLevelCount: (state, action) => {
      const { riskLevel, increment = true } = action.payload;
      const key = riskLevel.toLowerCase().replace(/\s+/g, '');
      
      if (state.riskLevels.hasOwnProperty(key)) {
        if (increment) {
          state.riskLevels[key] += 1;
        } else {
          state.riskLevels[key] = Math.max(0, state.riskLevels[key] - 1);
        }
      }
    },
    
    // Refresh Analytics
    refreshAnalytics: (state) => {
      state.lastUpdated = new Date().toISOString();
      state.loading = true;
    },
    
    // Reset Analytics State
    resetAnalytics: (state) => {
      return initialState;
    },
    
    // Set Multiple Analytics Data (bulk update)
    setBulkAnalyticsData: (state, action) => {
      const {
        dashboardData,
        studentStats,
        assessmentStats,
        riskLevels,
        categoryPerformance,
        trendingConcerns,
        alerts,
      } = action.payload;
      
      if (dashboardData) state.dashboardData = dashboardData;
      if (studentStats) {
        state.totalStudents = studentStats.total || 0;
        state.activeStudents = studentStats.active || 0;
      }
      if (assessmentStats) {
        state.assessmentStats = assessmentStats;
        state.totalAssessments = assessmentStats.total || 0;
        state.completionRate = assessmentStats.completionRate || 0;
        state.averageScore = assessmentStats.averageScore || 0;
      }
      if (riskLevels) state.riskLevels = riskLevels;
      if (categoryPerformance) state.categoryPerformance = categoryPerformance;
      if (trendingConcerns) state.trendingConcerns = trendingConcerns;
      if (alerts) {
        state.alerts = alerts;
        state.unreadAlerts = alerts.filter((alert) => !alert.read).length;
      }
      
      state.lastUpdated = new Date().toISOString();
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setDashboardData,
  setStudentStats,
  setStudentsList,
  setAssessmentStats,
  setRiskLevelDistribution,
  setCategoryPerformance,
  setTrendingConcerns,
  setTimeBasedTrends,
  setSelectedPeriod,
  setAlerts,
  addAlert,
  markAlertAsRead,
  clearAllAlerts,
  setDemographics,
  setFilters,
  setDateRangeFilter,
  setRiskLevelFilter,
  setCategoryFilter,
  clearFilters,
  setComparisonData,
  clearComparisonData,
  setSelectedStudent,
  clearSelectedStudent,
  updateStudentInList,
  removeStudentFromList,
  incrementTotalAssessments,
  updateRiskLevelCount,
  refreshAnalytics,
  resetAnalytics,
  setBulkAnalyticsData,
} = analyticsSlice.actions;

// Selectors
export const selectAnalyticsLoading = (state) => state.analytics.loading;
export const selectAnalyticsError = (state) => state.analytics.error;
export const selectDashboardData = (state) => state.analytics.dashboardData;
export const selectTotalStudents = (state) => state.analytics.totalStudents;
export const selectActiveStudents = (state) => state.analytics.activeStudents;
export const selectStudentsList = (state) => state.analytics.studentsList;
export const selectTotalAssessments = (state) => state.analytics.totalAssessments;
export const selectCompletionRate = (state) => state.analytics.completionRate;
export const selectAverageScore = (state) => state.analytics.averageScore;
export const selectRiskLevels = (state) => state.analytics.riskLevels;
export const selectCategoryPerformance = (state) => state.analytics.categoryPerformance;
export const selectTrendingConcerns = (state) => state.analytics.trendingConcerns;
export const selectTimeBasedTrends = (state) => state.analytics.timeBasedTrends;
export const selectSelectedPeriod = (state) => state.analytics.selectedPeriod;
export const selectAlerts = (state) => state.analytics.alerts;
export const selectUnreadAlerts = (state) => state.analytics.unreadAlerts;
export const selectDemographics = (state) => state.analytics.demographics;
export const selectFilters = (state) => state.analytics.filters;
export const selectComparisonData = (state) => state.analytics.comparisonData;
export const selectSelectedStudent = (state) => state.analytics.selectedStudent;
export const selectLastUpdated = (state) => state.analytics.lastUpdated;

export default analyticsSlice.reducer;