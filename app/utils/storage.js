// app/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys constants
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  USER_ROLE: '@user_role',
  THEME: '@theme',
  LANGUAGE: '@language',
  ONBOARDING_COMPLETE: '@onboarding_complete',
  LAST_ASSESSMENT: '@last_assessment',
  ASSESSMENT_HISTORY: '@assessment_history',
  SETTINGS: '@settings',
  NOTIFICATIONS: '@notifications',
  REMINDER_ENABLED: '@reminder_enabled',
};

/**
 * Store data in AsyncStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {Promise<boolean>} Success status
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`✅ Stored data for key: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Error storing data for key ${key}:`, error);
    return false;
  }
};

/**
 * Get data from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<any>} Stored value or null
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue != null) {
      console.log(`✅ Retrieved data for key: ${key}`);
      return JSON.parse(jsonValue);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error getting data for key ${key}:`, error);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} Success status
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`✅ Removed data for key: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Error removing data for key ${key}:`, error);
    return false;
  }
};

/**
 * Clear all AsyncStorage data
 * @returns {Promise<boolean>} Success status
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log('✅ Cleared all storage data');
    return true;
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
    return false;
  }
};

/**
 * Get all keys from AsyncStorage
 * @returns {Promise<Array>} Array of keys
 */
export const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    console.error('❌ Error getting all keys:', error);
    return [];
  }
};

// ======================
// AUTHENTICATION
// ======================

/**
 * Store authentication token
 * @param {string} token - Auth token
 * @returns {Promise<boolean>} Success status
 */
export const storeAuthToken = async (token) => {
  return await storeData(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Get authentication token
 * @returns {Promise<string|null>} Auth token
 */
export const getAuthToken = async () => {
  return await getData(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Remove authentication token
 * @returns {Promise<boolean>} Success status
 */
export const removeAuthToken = async () => {
  return await removeData(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} Authentication status
 */
export const isAuthenticated = async () => {
  const token = await getAuthToken();
  return token !== null;
};

// ======================
// USER DATA
// ======================

/**
 * Store user data
 * @param {Object} userData - User data object
 * @returns {Promise<boolean>} Success status
 */
export const storeUserData = async (userData) => {
  return await storeData(STORAGE_KEYS.USER_DATA, userData);
};

/**
 * Get user data
 * @returns {Promise<Object|null>} User data
 */
export const getUserData = async () => {
  return await getData(STORAGE_KEYS.USER_DATA);
};

/**
 * Update user data (merge with existing)
 * @param {Object} updates - Data to update
 * @returns {Promise<boolean>} Success status
 */
export const updateUserData = async (updates) => {
  try {
    const currentData = await getUserData();
    const updatedData = { ...currentData, ...updates };
    return await storeUserData(updatedData);
  } catch (error) {
    console.error('❌ Error updating user data:', error);
    return false;
  }
};

/**
 * Remove user data
 * @returns {Promise<boolean>} Success status
 */
export const removeUserData = async () => {
  return await removeData(STORAGE_KEYS.USER_DATA);
};

// ======================
// USER ROLE
// ======================

/**
 * Store user role
 * @param {string} role - User role ('student' or 'admin')
 * @returns {Promise<boolean>} Success status
 */
export const storeUserRole = async (role) => {
  return await storeData(STORAGE_KEYS.USER_ROLE, role);
};

/**
 * Get user role
 * @returns {Promise<string|null>} User role
 */
export const getUserRole = async () => {
  return await getData(STORAGE_KEYS.USER_ROLE);
};

/**
 * Check if user is admin
 * @returns {Promise<boolean>} True if admin
 */
export const isAdmin = async () => {
  const role = await getUserRole();
  return role === 'admin';
};

/**
 * Check if user is student
 * @returns {Promise<boolean>} True if student
 */
export const isStudent = async () => {
  const role = await getUserRole();
  return role === 'student';
};

// ======================
// ASSESSMENTS
// ======================

/**
 * Store assessment history
 * @param {Array} history - Assessment history array
 * @returns {Promise<boolean>} Success status
 */
export const storeAssessmentHistory = async (history) => {
  return await storeData(STORAGE_KEYS.ASSESSMENT_HISTORY, history);
};

/**
 * Get assessment history
 * @returns {Promise<Array>} Assessment history
 */
export const getAssessmentHistory = async () => {
  const history = await getData(STORAGE_KEYS.ASSESSMENT_HISTORY);
  return history || [];
};

/**
 * Add assessment to history
 * @param {Object} assessment - Assessment data
 * @returns {Promise<boolean>} Success status
 */
export const addAssessmentToHistory = async (assessment) => {
  try {
    const history = await getAssessmentHistory();
    const newAssessment = {
      ...assessment,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    const newHistory = [newAssessment, ...history];
    return await storeAssessmentHistory(newHistory);
  } catch (error) {
    console.error('❌ Error adding assessment to history:', error);
    return false;
  }
};

/**
 * Clear assessment history
 * @returns {Promise<boolean>} Success status
 */
export const clearAssessmentHistory = async () => {
  return await storeAssessmentHistory([]);
};

/**
 * Store last assessment
 * @param {Object} assessment - Last assessment data
 * @returns {Promise<boolean>} Success status
 */
export const storeLastAssessment = async (assessment) => {
  return await storeData(STORAGE_KEYS.LAST_ASSESSMENT, assessment);
};

/**
 * Get last assessment
 * @returns {Promise<Object|null>} Last assessment data
 */
export const getLastAssessment = async () => {
  return await getData(STORAGE_KEYS.LAST_ASSESSMENT);
};

// ======================
// SETTINGS
// ======================

/**
 * Store app settings
 * @param {Object} settings - Settings object
 * @returns {Promise<boolean>} Success status
 */
export const storeSettings = async (settings) => {
  return await storeData(STORAGE_KEYS.SETTINGS, settings);
};

/**
 * Get app settings
 * @returns {Promise<Object>} Settings object
 */
export const getSettings = async () => {
  const defaultSettings = {
    notifications: true,
    emailAlerts: true,
    criticalAlerts: true,
    theme: 'light',
    language: 'en',
    soundEnabled: true,
    vibrationEnabled: true,
  };
  const settings = await getData(STORAGE_KEYS.SETTINGS);
  return settings || defaultSettings;
};

/**
 * Update specific setting
 * @param {string} key - Setting key
 * @param {any} value - Setting value
 * @returns {Promise<boolean>} Success status
 */
export const updateSetting = async (key, value) => {
  try {
    const settings = await getSettings();
    settings[key] = value;
    return await storeSettings(settings);
  } catch (error) {
    console.error('❌ Error updating setting:', error);
    return false;
  }
};

/**
 * Reset settings to default
 * @returns {Promise<boolean>} Success status
 */
export const resetSettings = async () => {
  const defaultSettings = {
    notifications: true,
    emailAlerts: true,
    criticalAlerts: true,
    theme: 'light',
    language: 'en',
    soundEnabled: true,
    vibrationEnabled: true,
  };
  return await storeSettings(defaultSettings);
};

// ======================
// ONBOARDING
// ======================

/**
 * Mark onboarding as complete
 * @returns {Promise<boolean>} Success status
 */
export const markOnboardingComplete = async () => {
  return await storeData(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
};

/**
 * Check if onboarding is complete
 * @returns {Promise<boolean>} Onboarding status
 */
export const isOnboardingComplete = async () => {
  const status = await getData(STORAGE_KEYS.ONBOARDING_COMPLETE);
  return status === true;
};

/**
 * Reset onboarding status
 * @returns {Promise<boolean>} Success status
 */
export const resetOnboarding = async () => {
  return await removeData(STORAGE_KEYS.ONBOARDING_COMPLETE);
};

// ======================
// THEME
// ======================

/**
 * Store theme preference
 * @param {string} theme - Theme ('light' or 'dark')
 * @returns {Promise<boolean>} Success status
 */
export const storeTheme = async (theme) => {
  return await storeData(STORAGE_KEYS.THEME, theme);
};

/**
 * Get theme preference
 * @returns {Promise<string>} Theme preference
 */
export const getTheme = async () => {
  const theme = await getData(STORAGE_KEYS.THEME);
  return theme || 'light';
};

// ======================
// LOGOUT / CLEAR DATA
// ======================

/**
 * Logout user (clear all user-related data)
 * @returns {Promise<boolean>} Success status
 */
export const logout = async () => {
  try {
    await removeAuthToken();
    await removeUserData();
    await removeData(STORAGE_KEYS.USER_ROLE);
    await removeData(STORAGE_KEYS.LAST_ASSESSMENT);
    console.log('✅ User logged out successfully');
    return true;
  } catch (error) {
    console.error('❌ Error during logout:', error);
    return false;
  }
};

/**
 * Clear all user data but keep settings
 * @returns {Promise<boolean>} Success status
 */
export const clearUserData = async () => {
  try {
    await removeAuthToken();
    await removeUserData();
    await removeData(STORAGE_KEYS.USER_ROLE);
    await clearAssessmentHistory();
    await removeData(STORAGE_KEYS.LAST_ASSESSMENT);
    return true;
  } catch (error) {
    console.error('❌ Error clearing user data:', error);
    return false;
  }
};

// ======================
// DEBUGGING / DEVELOPMENT
// ======================

/**
 * Get all stored data (for debugging)
 * @returns {Promise<Object>} All stored data
 */
export const getAllStoredData = async () => {
  try {
    const keys = await getAllKeys();
    const data = {};
    
    for (const key of keys) {
      data[key] = await getData(key);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error getting all stored data:', error);
    return {};
  }
};

/**
 * Print all stored data to console (for debugging)
 */
export const debugPrintStorage = async () => {
  const data = await getAllStoredData();
  console.log('📦 All Stored Data:', JSON.stringify(data, null, 2));
};

export default {
  STORAGE_KEYS,
  storeData,
  getData,
  removeData,
  clearAll,
  getAllKeys,
  storeAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,
  storeUserData,
  getUserData,
  updateUserData,
  removeUserData,
  storeUserRole,
  getUserRole,
  isAdmin,
  isStudent,
  storeAssessmentHistory,
  getAssessmentHistory,
  addAssessmentToHistory,
  clearAssessmentHistory,
  storeLastAssessment,
  getLastAssessment,
  storeSettings,
  getSettings,
  updateSetting,
  resetSettings,
  markOnboardingComplete,
  isOnboardingComplete,
  resetOnboarding,
  storeTheme,
  getTheme,
  logout,
  clearUserData,
  getAllStoredData,
  debugPrintStorage,
};