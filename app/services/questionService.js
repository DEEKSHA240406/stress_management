import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, QUESTION_CATEGORIES } from '../../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for authentication
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

// Get all questions
export const getAllQuestions = async () => {
  try {
    const response = await api.get('/questions');
    
    return {
      success: true,
      questions: response.data.questions,
      total: response.data.total,
    };
  } catch (error) {
    console.error('Get All Questions Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch questions',
      questions: [],
    };
  }
};

// Get questions by category
export const getQuestionsByCategory = async (category) => {
  try {
    const response = await api.get(`/questions/category/${category}`);
    
    return {
      success: true,
      questions: response.data.questions,
      category: category,
    };
  } catch (error) {
    console.error('Get Questions By Category Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch questions by category',
      questions: [],
    };
  }
};

// Get single question by ID
export const getQuestionById = async (questionId) => {
  try {
    const response = await api.get(`/questions/${questionId}`);
    
    return {
      success: true,
      question: response.data.question,
    };
  } catch (error) {
    console.error('Get Question By ID Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch question',
    };
  }
};

// Get random questions for assessment
export const getRandomQuestions = async (count = 10, categories = null) => {
  try {
    const params = { count };
    if (categories) {
      params.categories = categories.join(',');
    }
    
    const response = await api.get('/questions/random', { params });
    
    return {
      success: true,
      questions: response.data.questions,
    };
  } catch (error) {
    console.error('Get Random Questions Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch random questions',
      questions: [],
    };
  }
};

// Create new question (Admin only)
export const createQuestion = async (questionData) => {
  try {
    const response = await api.post('/questions', questionData);
    
    return {
      success: true,
      question: response.data.question,
      message: response.data.message || 'Question created successfully',
    };
  } catch (error) {
    console.error('Create Question Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create question',
      errors: error.response?.data?.errors,
    };
  }
};

// Update question (Admin only)
export const updateQuestion = async (questionId, questionData) => {
  try {
    const response = await api.put(`/questions/${questionId}`, questionData);
    
    return {
      success: true,
      question: response.data.question,
      message: response.data.message || 'Question updated successfully',
    };
  } catch (error) {
    console.error('Update Question Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update question',
      errors: error.response?.data?.errors,
    };
  }
};

// Delete question (Admin only)
export const deleteQuestion = async (questionId) => {
  try {
    const response = await api.delete(`/questions/${questionId}`);
    
    return {
      success: true,
      message: response.data.message || 'Question deleted successfully',
    };
  } catch (error) {
    console.error('Delete Question Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete question',
    };
  }
};

// Search questions
export const searchQuestions = async (query, filters = {}) => {
  try {
    const params = { q: query, ...filters };
    const response = await api.get('/questions/search', { params });
    
    return {
      success: true,
      questions: response.data.questions,
      total: response.data.total,
    };
  } catch (error) {
    console.error('Search Questions Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to search questions',
      questions: [],
    };
  }
};

// Get question categories
export const getQuestionCategories = async () => {
  try {
    const response = await api.get('/questions/categories');
    
    return {
      success: true,
      categories: response.data.categories,
    };
  } catch (error) {
    console.error('Get Question Categories Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch categories',
      categories: Object.values(QUESTION_CATEGORIES),
    };
  }
};

// Bulk import questions (Admin only)
export const bulkImportQuestions = async (questionsArray) => {
  try {
    const response = await api.post('/questions/bulk-import', {
      questions: questionsArray,
    });
    
    return {
      success: true,
      imported: response.data.imported,
      failed: response.data.failed,
      message: response.data.message || 'Questions imported successfully',
    };
  } catch (error) {
    console.error('Bulk Import Questions Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to import questions',
    };
  }
};

// Export questions (Admin only)
export const exportQuestions = async (format = 'json', filters = {}) => {
  try {
    const response = await api.get('/questions/export', {
      params: { format, ...filters },
      responseType: 'blob',
    });
    
    return {
      success: true,
      data: response.data,
      format: format,
    };
  } catch (error) {
    console.error('Export Questions Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to export questions',
    };
  }
};

// Get question statistics
export const getQuestionStats = async (questionId) => {
  try {
    const response = await api.get(`/questions/${questionId}/stats`);
    
    return {
      success: true,
      stats: response.data.stats,
    };
  } catch (error) {
    console.error('Get Question Stats Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch question statistics',
    };
  }
};

// Toggle question active status (Admin only)
export const toggleQuestionStatus = async (questionId, isActive) => {
  try {
    const response = await api.patch(`/questions/${questionId}/status`, {
      isActive,
    });
    
    return {
      success: true,
      question: response.data.question,
      message: response.data.message || 'Question status updated',
    };
  } catch (error) {
    console.error('Toggle Question Status Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update question status',
    };
  }
};

// Reorder questions (Admin only)
export const reorderQuestions = async (orderedIds) => {
  try {
    const response = await api.post('/questions/reorder', {
      orderedIds,
    });
    
    return {
      success: true,
      message: response.data.message || 'Questions reordered successfully',
    };
  } catch (error) {
    console.error('Reorder Questions Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to reorder questions',
    };
  }
};

// Duplicate question (Admin only)
export const duplicateQuestion = async (questionId) => {
  try {
    const response = await api.post(`/questions/${questionId}/duplicate`);
    
    return {
      success: true,
      question: response.data.question,
      message: response.data.message || 'Question duplicated successfully',
    };
  } catch (error) {
    console.error('Duplicate Question Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to duplicate question',
    };
  }
};

// Get questions with pagination
export const getQuestionsPaginated = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = { page, limit, ...filters };
    const response = await api.get('/questions/paginated', { params });
    
    return {
      success: true,
      questions: response.data.questions,
      pagination: {
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages,
        hasNext: response.data.hasNext,
        hasPrev: response.data.hasPrev,
      },
    };
  } catch (error) {
    console.error('Get Questions Paginated Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch paginated questions',
      questions: [],
    };
  }
};

// Validate question data
export const validateQuestionData = (questionData) => {
  const errors = {};

  if (!questionData.text || questionData.text.trim().length === 0) {
    errors.text = 'Question text is required';
  }

  if (!questionData.category) {
    errors.category = 'Category is required';
  } else if (!Object.values(QUESTION_CATEGORIES).includes(questionData.category)) {
    errors.category = 'Invalid category';
  }

  if (!questionData.options || questionData.options.length < 2) {
    errors.options = 'At least 2 options are required';
  }

  if (questionData.options) {
    questionData.options.forEach((option, index) => {
      if (!option.text || option.text.trim().length === 0) {
        errors[`option_${index}`] = `Option ${index + 1} text is required`;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Cache questions locally
export const cacheQuestions = async (questions) => {
  try {
    await AsyncStorage.setItem('@cached_questions', JSON.stringify(questions));
    return { success: true };
  } catch (error) {
    console.error('Cache Questions Error:', error);
    return { success: false };
  }
};

// Get cached questions
export const getCachedQuestions = async () => {
  try {
    const cached = await AsyncStorage.getItem('@cached_questions');
    if (cached) {
      return {
        success: true,
        questions: JSON.parse(cached),
      };
    }
    return {
      success: false,
      message: 'No cached questions found',
      questions: [],
    };
  } catch (error) {
    console.error('Get Cached Questions Error:', error);
    return {
      success: false,
      message: 'Failed to retrieve cached questions',
      questions: [],
    };
  }
};

// Clear cached questions
export const clearCachedQuestions = async () => {
  try {
    await AsyncStorage.removeItem('@cached_questions');
    return { success: true };
  } catch (error) {
    console.error('Clear Cached Questions Error:', error);
    return { success: false };
  }
};

// Get questions with offline support
export const getQuestionsWithOfflineSupport = async (category = null) => {
  try {
    // Try to fetch from API
    let result;
    if (category) {
      result = await getQuestionsByCategory(category);
    } else {
      result = await getAllQuestions();
    }

    if (result.success && result.questions.length > 0) {
      // Cache for offline use
      await cacheQuestions(result.questions);
      return result;
    } else {
      // Fallback to cached questions
      return await getCachedQuestions();
    }
  } catch (error) {
    // On network error, use cached questions
    console.log('Network error, using cached questions');
    return await getCachedQuestions();
  }
};

export default api;