// API Base URL
export const API_BASE_URL = 'http://10.0.2.2:5000/api';
// For iOS Simulator: 'http://localhost:5000/api'
// For Physical Device: 'http://YOUR_IP_ADDRESS:5000/api'

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  REFRESH_TOKEN: '/auth/refresh',
  GET_PROFILE: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',
  UPDATE_EMAIL: '/auth/update-email',
  CHECK_EMAIL: '/auth/check-email',
  VALIDATE_SESSION: '/auth/validate-session',
  DELETE_ACCOUNT: '/auth/account',
  SETUP_2FA: '/auth/2fa/setup',
  VERIFY_2FA: '/auth/2fa/verify',
};

// Question Endpoints
export const QUESTION_ENDPOINTS = {
  GET_ALL: '/questions',
  GET_BY_ID: (id) => `/questions/${id}`,
  GET_BY_CATEGORY: (category) => `/questions/category/${category}`,
  GET_RANDOM: '/questions/random',
  SEARCH: '/questions/search',
  GET_CATEGORIES: '/questions/categories',
  CREATE: '/questions',
  UPDATE: (id) => `/questions/${id}`,
  DELETE: (id) => `/questions/${id}`,
  BULK_IMPORT: '/questions/bulk-import',
  EXPORT: '/questions/export',
  GET_STATS: (id) => `/questions/${id}/stats`,
  TOGGLE_STATUS: (id) => `/questions/${id}/status`,
  REORDER: '/questions/reorder',
  DUPLICATE: (id) => `/questions/${id}/duplicate`,
  PAGINATED: '/questions/paginated',
};

// Response/Assessment Endpoints
export const RESPONSE_ENDPOINTS = {
  SUBMIT: '/responses/submit',
  GET_HISTORY: '/responses/history',
  GET_BY_ID: (id) => `/responses/assessment/${id}`,
  GET_LATEST: '/responses/latest',
  GET_STATS: '/responses/stats',
  GET_PROGRESS: '/responses/progress',
  DELETE: (id) => `/responses/assessment/${id}`,
  UPDATE_NOTES: (id) => `/responses/assessment/${id}/notes`,
  COMPARE: '/responses/compare',
  EXPORT: '/responses/export',
  GET_CATEGORY_SCORES: (id) => `/responses/assessment/${id}/category-scores`,
  GET_RECOMMENDATIONS: '/responses/recommendations',
  SHARE: (id) => `/responses/assessment/${id}/share`,
  GET_AGGREGATED: '/responses/aggregated',
};

// Analytics Endpoints (Admin)
export const ANALYTICS_ENDPOINTS = {
  GET_SUMMARY: '/analytics/summary',
  GET_DASHBOARD: '/analytics/dashboard/overview',
  GET_STUDENT_STATS: '/analytics/students/stats',
  GET_STUDENTS_LIST: '/analytics/students/list',
  GET_STUDENT_BY_ID: (id) => `/analytics/students/${id}`,
  GET_STUDENTS_BY_RISK: (riskLevel) => `/analytics/students/risk/${riskLevel}`,
  SEARCH_STUDENTS: '/analytics/students/search',
  GET_ASSESSMENT_STATS: '/analytics/assessments/stats',
  GET_COMPLETION_RATE: '/analytics/assessments/completion-rate',
  GET_RISK_LEVELS: '/analytics/risk-levels',
  GET_CATEGORY_PERFORMANCE: '/analytics/categories/performance',
  GET_TRENDING_CONCERNS: '/analytics/concerns/trending',
  GET_TIME_TRENDS: '/analytics/trends',
  GET_COMPARISON: '/analytics/compare',
  GET_DEMOGRAPHICS: '/analytics/demographics',
  GET_ALERTS: '/analytics/alerts',
  MARK_ALERT_READ: (id) => `/analytics/alerts/${id}/read`,
  GENERATE_REPORT: '/analytics/reports/generate',
  EXPORT_DATA: '/analytics/export',
  GET_INTERVENTIONS: '/analytics/interventions/recommendations',
};

// User/Student Management Endpoints
export const USER_ENDPOINTS = {
  GET_ALL_USERS: '/users',
  GET_USER_BY_ID: (id) => `/users/${id}`,
  UPDATE_USER: (id) => `/users/${id}`,
  DELETE_USER: (id) => `/users/${id}`,
  GET_USER_PROFILE: (id) => `/users/${id}/profile`,
  UPDATE_USER_STATUS: (id) => `/users/${id}/status`,
  SEARCH_USERS: '/users/search',
};

// Resource Endpoints
export const RESOURCE_ENDPOINTS = {
  GET_ALL: '/resources',
  GET_BY_ID: (id) => `/resources/${id}`,
  GET_BY_CATEGORY: (category) => `/resources/category/${category}`,
  CREATE: '/resources',
  UPDATE: (id) => `/resources/${id}`,
  DELETE: (id) => `/resources/${id}`,
  SEARCH: '/resources/search',
};

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/notifications',
  GET_UNREAD: '/notifications/unread',
  MARK_AS_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/mark-all-read',
  DELETE: (id) => `/notifications/${id}`,
  DELETE_ALL: '/notifications/delete-all',
};

// Settings Endpoints
export const SETTINGS_ENDPOINTS = {
  GET_SETTINGS: '/settings',
  UPDATE_SETTINGS: '/settings',
  GET_PREFERENCES: '/settings/preferences',
  UPDATE_PREFERENCES: '/settings/preferences',
};

// Health Check
export const HEALTH_ENDPOINT = '/health';

// File Upload
export const UPLOAD_ENDPOINTS = {
  AVATAR: '/upload/avatar',
  DOCUMENT: '/upload/document',
};

// Helper function to build full URL
export const buildUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to build query string
export const buildQueryString = (params) => {
  const queryString = Object.keys(params)
    .filter((key) => params[key] !== null && params[key] !== undefined)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  return queryString ? `?${queryString}` : '';
};

export default {
  API_BASE_URL,
  AUTH_ENDPOINTS,
  QUESTION_ENDPOINTS,
  RESPONSE_ENDPOINTS,
  ANALYTICS_ENDPOINTS,
  USER_ENDPOINTS,
  RESOURCE_ENDPOINTS,
  NOTIFICATION_ENDPOINTS,
  SETTINGS_ENDPOINTS,
  HEALTH_ENDPOINT,
  UPLOAD_ENDPOINTS,
  buildUrl,
  buildQueryString,
};