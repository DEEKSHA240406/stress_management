import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants';

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

// Submit assessment responses
export const submitAssessmentResponse = async (assessmentData) => {
  try {
    const response = await api.post('/responses/submit', assessmentData);
    
    // Save to local storage as backup
    await saveLocalResponse(response.data.assessment);
    
    return {
      success: true,
      assessment: response.data.assessment,
      score: response.data.score,
      riskLevel: response.data.riskLevel,
      analysis: response.data.analysis,
      recommendations: response.data.recommendations,
      message: response.data.message || 'Assessment submitted successfully',
    };
  } catch (error) {
    console.error('Submit Assessment Response Error:', error.response?.data || error.message);
    
    // Save locally even if API fails
    if (assessmentData) {
      await saveLocalResponseFallback(assessmentData);
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to submit assessment',
      errors: error.response?.data?.errors,
    };
  }
};

// Get user's assessment history
export const getAssessmentHistory = async (userId = null, filters = {}) => {
  try {
    const params = { userId, ...filters };
    const response = await api.get('/responses/history', { params });
    
    return {
      success: true,
      assessments: response.data.assessments,
      total: response.data.total,
    };
  } catch (error) {
    console.error('Get Assessment History Error:', error.response?.data || error.message);
    
    // Fallback to local storage
    const localHistory = await getLocalAssessmentHistory();
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch assessment history',
      assessments: localHistory,
    };
  }
};

// Get single assessment by ID
export const getAssessmentById = async (assessmentId) => {
  try {
    const response = await api.get(`/responses/assessment/${assessmentId}`);
    
    return {
      success: true,
      assessment: response.data.assessment,
    };
  } catch (error) {
    console.error('Get Assessment By ID Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch assessment',
    };
  }
};

// Get latest assessment
export const getLatestAssessment = async () => {
  try {
    const response = await api.get('/responses/latest');
    
    return {
      success: true,
      assessment: response.data.assessment,
    };
  } catch (error) {
    console.error('Get Latest Assessment Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch latest assessment',
    };
  }
};

// Get assessment statistics for user
export const getUserAssessmentStats = async (userId = null) => {
  try {
    const params = userId ? { userId } : {};
    const response = await api.get('/responses/stats', { params });
    
    return {
      success: true,
      stats: response.data.stats,
    };
  } catch (error) {
    console.error('Get User Assessment Stats Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch assessment statistics',
    };
  }
};

// Get progress over time
export const getProgressOverTime = async (period = 'monthly') => {
  try {
    const response = await api.get('/responses/progress', {
      params: { period },
    });
    
    return {
      success: true,
      progress: response.data.progress,
      trend: response.data.trend,
    };
  } catch (error) {
    console.error('Get Progress Over Time Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch progress data',
    };
  }
};

// Delete assessment response
export const deleteAssessmentResponse = async (assessmentId) => {
  try {
    const response = await api.delete(`/responses/assessment/${assessmentId}`);
    
    return {
      success: true,
      message: response.data.message || 'Assessment deleted successfully',
    };
  } catch (error) {
    console.error('Delete Assessment Response Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete assessment',
    };
  }
};

// Update assessment notes
export const updateAssessmentNotes = async (assessmentId, notes) => {
  try {
    const response = await api.patch(`/responses/assessment/${assessmentId}/notes`, {
      notes,
    });
    
    return {
      success: true,
      assessment: response.data.assessment,
      message: response.data.message || 'Notes updated successfully',
    };
  } catch (error) {
    console.error('Update Assessment Notes Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update notes',
    };
  }
};

// Get assessment comparison (compare two assessments)
export const compareAssessments = async (assessmentId1, assessmentId2) => {
  try {
    const response = await api.get('/responses/compare', {
      params: { id1: assessmentId1, id2: assessmentId2 },
    });
    
    return {
      success: true,
      comparison: response.data.comparison,
      insights: response.data.insights,
    };
  } catch (error) {
    console.error('Compare Assessments Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to compare assessments',
    };
  }
};

// Export assessment data
export const exportAssessmentData = async (format = 'pdf', assessmentId = null) => {
  try {
    const params = { format };
    if (assessmentId) {
      params.assessmentId = assessmentId;
    }
    
    const response = await api.get('/responses/export', {
      params,
      responseType: 'blob',
    });
    
    return {
      success: true,
      data: response.data,
      format: format,
    };
  } catch (error) {
    console.error('Export Assessment Data Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to export assessment data',
    };
  }
};

// Get category-wise scores
export const getCategoryScores = async (assessmentId) => {
  try {
    const response = await api.get(`/responses/assessment/${assessmentId}/category-scores`);
    
    return {
      success: true,
      categoryScores: response.data.categoryScores,
    };
  } catch (error) {
    console.error('Get Category Scores Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch category scores',
    };
  }
};

// Get recommendations based on responses
export const getPersonalizedRecommendations = async (assessmentId = null) => {
  try {
    const params = assessmentId ? { assessmentId } : {};
    const response = await api.get('/responses/recommendations', { params });
    
    return {
      success: true,
      recommendations: response.data.recommendations,
      resources: response.data.resources,
    };
  } catch (error) {
    console.error('Get Personalized Recommendations Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch recommendations',
    };
  }
};

// Share assessment with professional
export const shareAssessmentWithProfessional = async (assessmentId, professionalEmail) => {
  try {
    const response = await api.post(`/responses/assessment/${assessmentId}/share`, {
      professionalEmail,
    });
    
    return {
      success: true,
      message: response.data.message || 'Assessment shared successfully',
    };
  } catch (error) {
    console.error('Share Assessment Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to share assessment',
    };
  }
};

// Get aggregated responses (Admin only)
export const getAggregatedResponses = async (filters = {}) => {
  try {
    const response = await api.get('/responses/aggregated', { params: filters });
    
    return {
      success: true,
      aggregatedData: response.data.aggregatedData,
      insights: response.data.insights,
    };
  } catch (error) {
    console.error('Get Aggregated Responses Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch aggregated responses',
    };
  }
};

// Save draft assessment
export const saveDraftAssessment = async (draftData) => {
  try {
    await AsyncStorage.setItem('@draft_assessment', JSON.stringify(draftData));
    
    return {
      success: true,
      message: 'Draft saved successfully',
    };
  } catch (error) {
    console.error('Save Draft Assessment Error:', error);
    return {
      success: false,
      message: 'Failed to save draft',
    };
  }
};

// Get draft assessment
export const getDraftAssessment = async () => {
  try {
    const draft = await AsyncStorage.getItem('@draft_assessment');
    
    if (draft) {
      return {
        success: true,
        draft: JSON.parse(draft),
      };
    }
    
    return {
      success: false,
      message: 'No draft found',
      draft: null,
    };
  } catch (error) {
    console.error('Get Draft Assessment Error:', error);
    return {
      success: false,
      message: 'Failed to retrieve draft',
      draft: null,
    };
  }
};

// Clear draft assessment
export const clearDraftAssessment = async () => {
  try {
    await AsyncStorage.removeItem('@draft_assessment');
    
    return {
      success: true,
      message: 'Draft cleared',
    };
  } catch (error) {
    console.error('Clear Draft Assessment Error:', error);
    return {
      success: false,
      message: 'Failed to clear draft',
    };
  }
};

// Save response locally (backup)
const saveLocalResponse = async (assessmentData) => {
  try {
    const history = await AsyncStorage.getItem('@assessment_history');
    const assessments = history ? JSON.parse(history) : [];
    
    assessments.push(assessmentData);
    
    await AsyncStorage.setItem('@assessment_history', JSON.stringify(assessments));
    return { success: true };
  } catch (error) {
    console.error('Save Local Response Error:', error);
    return { success: false };
  }
};

// Save response locally as fallback
const saveLocalResponseFallback = async (assessmentData) => {
  try {
    const localAssessment = {
      ...assessmentData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      synced: false,
    };
    
    await saveLocalResponse(localAssessment);
    return { success: true };
  } catch (error) {
    console.error('Save Local Response Fallback Error:', error);
    return { success: false };
  }
};

// Get local assessment history
const getLocalAssessmentHistory = async () => {
  try {
    const history = await AsyncStorage.getItem('@assessment_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Get Local Assessment History Error:', error);
    return [];
  }
};

// Sync unsynced assessments
export const syncUnsyncedAssessments = async () => {
  try {
    const history = await getLocalAssessmentHistory();
    const unsynced = history.filter((assessment) => !assessment.synced);
    
    if (unsynced.length === 0) {
      return {
        success: true,
        message: 'No assessments to sync',
        synced: 0,
      };
    }
    
    let syncedCount = 0;
    const syncedIds = [];
    
    for (const assessment of unsynced) {
      const result = await submitAssessmentResponse(assessment);
      if (result.success) {
        syncedCount++;
        syncedIds.push(assessment.id);
      }
    }
    
    // Update local storage
    const updatedHistory = history.map((assessment) => {
      if (syncedIds.includes(assessment.id)) {
        return { ...assessment, synced: true };
      }
      return assessment;
    });
    
    await AsyncStorage.setItem('@assessment_history', JSON.stringify(updatedHistory));
    
    return {
      success: true,
      message: `${syncedCount} assessments synced successfully`,
      synced: syncedCount,
      failed: unsynced.length - syncedCount,
    };
  } catch (error) {
    console.error('Sync Unsynced Assessments Error:', error);
    return {
      success: false,
      message: 'Failed to sync assessments',
      synced: 0,
    };
  }
};

// Calculate score locally
export const calculateScoreLocally = (answers) => {
  let score = 0;
  
  answers.forEach((answer) => {
    // Simple scoring logic - customize based on your needs
    if (answer.answer.includes('Great') || answer.answer.includes('Always') || answer.answer.includes('Excellent')) {
      score += 10;
    } else if (answer.answer.includes('Good') || answer.answer.includes('Usually') || answer.answer.includes('7-8 hours')) {
      score += 8;
    } else if (answer.answer.includes('Okay') || answer.answer.includes('Sometimes') || answer.answer.includes('Fair')) {
      score += 5;
    } else if (answer.answer.includes('Rarely') || answer.answer.includes('5-6 hours')) {
      score += 3;
    } else {
      score += 1;
    }
  });
  
  // Normalize to 100
  const normalizedScore = Math.round((score / (answers.length * 10)) * 100);
  
  // Determine risk level
  let riskLevel = '';
  if (normalizedScore >= 80) riskLevel = 'Excellent';
  else if (normalizedScore >= 60) riskLevel = 'Good';
  else if (normalizedScore >= 40) riskLevel = 'Fair';
  else riskLevel = 'Needs Support';
  
  return {
    score: normalizedScore,
    riskLevel,
  };
};

export default api;