// app/services/counselorService.js
import api from './api';

const counselorService = {
  // Dashboard
  getDashboardStats: async (counselorId) => {
    try {
      const response = await api.get(`/counselor/${counselorId}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Cases
  getAssignedStudents: async (counselorId) => {
    try {
      const response = await api.get(`/counselor/${counselorId}/cases`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assigned students:', error);
      throw error;
    }
  },

  getStudentCase: async (studentId) => {
    try {
      const response = await api.get(`/counselor/case/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student case:', error);
      throw error;
    }
  },

  getUrgentCases: async (counselorId) => {
    try {
      const response = await api.get(`/counselor/${counselorId}/urgent`);
      return response.data;
    } catch (error) {
      console.error('Error fetching urgent cases:', error);
      throw error;
    }
  },

  updateCaseStatus: async (caseId, status) => {
    try {
      const response = await api.put(`/counselor/case/${caseId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating case status:', error);
      throw error;
    }
  },

  // Session Notes
  getSessions: async (counselorId, studentId = null) => {
    try {
      const url = studentId 
        ? `/counselor/${counselorId}/sessions?studentId=${studentId}`
        : `/counselor/${counselorId}/sessions`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },

  createSession: async (counselorId, sessionData) => {
    try {
      const response = await api.post(`/counselor/${counselorId}/sessions`, sessionData);
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  updateSession: async (sessionId, sessionData) => {
    try {
      const response = await api.put(`/counselor/session/${sessionId}`, sessionData);
      return response.data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  },

  deleteSession: async (sessionId) => {
    try {
      const response = await api.delete(`/counselor/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  },

  // Treatment Plans
  getTreatmentPlan: async (studentId) => {
    try {
      const response = await api.get(`/counselor/treatment/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching treatment plan:', error);
      throw error;
    }
  },

  createTreatmentPlan: async (studentId, planData) => {
    try {
      const response = await api.post(`/counselor/treatment/${studentId}`, planData);
      return response.data;
    } catch (error) {
      console.error('Error creating treatment plan:', error);
      throw error;
    }
  },

  updateTreatmentPlan: async (planId, planData) => {
    try {
      const response = await api.put(`/counselor/treatment/${planId}`, planData);
      return response.data;
    } catch (error) {
      console.error('Error updating treatment plan:', error);
      throw error;
    }
  },

  // Schedule
  getSchedule: async (counselorId, date) => {
    try {
      const response = await api.get(`/counselor/${counselorId}/schedule`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },

  scheduleSession: async (counselorId, sessionData) => {
    try {
      const response = await api.post(`/counselor/${counselorId}/schedule`, sessionData);
      return response.data;
    } catch (error) {
      console.error('Error scheduling session:', error);
      throw error;
    }
  },

  // Profile
  getProfile: async (counselorId) => {
    try {
      const response = await api.get(`/counselor/${counselorId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (counselorId, profileData) => {
    try {
      const response = await api.put(`/counselor/${counselorId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Analytics
  getCaseAnalytics: async (counselorId, period) => {
    try {
      const response = await api.get(`/counselor/${counselorId}/analytics`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },
};

export default counselorService;