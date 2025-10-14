import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get overall analytics summary
export const getAnalyticsSummary = async () => {
  try {
    const response = await api.get('/analytics/summary');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Analytics Summary Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch analytics summary',
    };
  }
};

// Get student statistics
export const getStudentStats = async () => {
  try {
    const response = await api.get('/analytics/students/stats');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Student Stats Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch student statistics',
    };
  }
};

// Get assessment statistics
export const getAssessmentStats = async () => {
  try {
    const response = await api.get('/analytics/assessments/stats');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Assessment Stats Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch assessment statistics',
    };
  }
};

// Get risk level distribution
export const getRiskLevelDistribution = async () => {
  try {
    const response = await api.get('/analytics/risk-levels');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Risk Level Distribution Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch risk level distribution',
    };
  }
};

// Get category-wise performance
export const getCategoryPerformance = async () => {
  try {
    const response = await api.get('/analytics/categories/performance');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Category Performance Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch category performance',
    };
  }
};

// Get trending concerns/issues
export const getTrendingConcerns = async () => {
  try {
    const response = await api.get('/analytics/concerns/trending');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Trending Concerns Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch trending concerns',
    };
  }
};

// Get time-based analytics (monthly/weekly trends)
export const getTimeBasedAnalytics = async (period = 'monthly') => {
  try {
    const response = await api.get(`/analytics/trends?period=${period}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Time-Based Analytics Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch time-based analytics',
    };
  }
};

// Get all students list
export const getAllStudents = async () => {
  try {
    const response = await api.get('/analytics/students/list');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get All Students Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch students list',
    };
  }
};

// Get student details by ID
export const getStudentById = async (studentId) => {
  try {
    const response = await api.get(`/analytics/students/${studentId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Student By ID Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch student details',
    };
  }
};

// Get students by risk level
export const getStudentsByRiskLevel = async (riskLevel) => {
  try {
    const response = await api.get(`/analytics/students/risk/${riskLevel}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Students By Risk Level Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch students by risk level',
    };
  }
};

// Generate report
export const generateReport = async (reportType, filters = {}) => {
  try {
    const response = await api.post('/analytics/reports/generate', {
      reportType,
      filters,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Generate Report Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to generate report',
    };
  }
};

// Export analytics data
export const exportAnalyticsData = async (format = 'csv') => {
  try {
    const response = await api.get(`/analytics/export?format=${format}`, {
      responseType: 'blob',
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Export Analytics Data Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to export analytics data',
    };
  }
};

// Get comparison analytics (compare time periods)
export const getComparisonAnalytics = async (startDate, endDate) => {
  try {
    const response = await api.get('/analytics/compare', {
      params: { startDate, endDate },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Comparison Analytics Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch comparison analytics',
    };
  }
};

// Get demographic analytics
export const getDemographicAnalytics = async () => {
  try {
    const response = await api.get('/analytics/demographics');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Demographic Analytics Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch demographic analytics',
    };
  }
};

// Search students
export const searchStudents = async (query) => {
  try {
    const response = await api.get('/analytics/students/search', {
      params: { q: query },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Search Students Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to search students',
    };
  }
};

// Get alert notifications (for high-risk students)
export const getAlertNotifications = async () => {
  try {
    const response = await api.get('/analytics/alerts');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Alert Notifications Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch alert notifications',
    };
  }
};

// Mark alert as read
export const markAlertAsRead = async (alertId) => {
  try {
    const response = await api.patch(`/analytics/alerts/${alertId}/read`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Mark Alert As Read Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to mark alert as read',
    };
  }
};

// Get dashboard overview (quick stats for admin dashboard)
export const getDashboardOverview = async () => {
  try {
    const response = await api.get('/analytics/dashboard/overview');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Dashboard Overview Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch dashboard overview',
    };
  }
};

// Get assessment completion rate
export const getAssessmentCompletionRate = async () => {
  try {
    const response = await api.get('/analytics/assessments/completion-rate');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Assessment Completion Rate Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch completion rate',
    };
  }
};

// Get intervention recommendations
export const getInterventionRecommendations = async () => {
  try {
    const response = await api.get('/analytics/interventions/recommendations');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Intervention Recommendations Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch intervention recommendations',
    };
  }
};

export default api;