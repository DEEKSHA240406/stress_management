// app/services/mentorService.js
import api from './api';

const mentorService = {
  // Dashboard
  getDashboardStats: async (mentorId) => {
    try {
      const response = await api.get(`/mentor/${mentorId}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Students
  getMyStudents: async (mentorId) => {
    try {
      const response = await api.get(`/mentor/${mentorId}/students`);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  getStudentDetail: async (studentId) => {
    try {
      const response = await api.get(`/mentor/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student detail:', error);
      throw error;
    }
  },

  // Progress
  getProgressData: async (mentorId, period) => {
    try {
      const response = await api.get(`/mentor/${mentorId}/progress`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching progress data:', error);
      throw error;
    }
  },

  // Alerts
  getAlerts: async (mentorId, filter = 'all') => {
    try {
      const response = await api.get(`/mentor/${mentorId}/alerts`, {
        params: { filter }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  acknowledgeAlert: async (alertId) => {
    try {
      const response = await api.put(`/mentor/alert/${alertId}/acknowledge`);
      return response.data;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  },

  // Notes
  getNotes: async (mentorId, studentId = null) => {
    try {
      const url = studentId 
        ? `/mentor/${mentorId}/notes?studentId=${studentId}`
        : `/mentor/${mentorId}/notes`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  createNote: async (mentorId, noteData) => {
    try {
      const response = await api.post(`/mentor/${mentorId}/notes`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  updateNote: async (noteId, noteData) => {
    try {
      const response = await api.put(`/mentor/note/${noteId}`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  deleteNote: async (noteId) => {
    try {
      const response = await api.delete(`/mentor/note/${noteId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  // Profile
  getProfile: async (mentorId) => {
    try {
      const response = await api.get(`/mentor/${mentorId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (mentorId, profileData) => {
    try {
      const response = await api.put(`/mentor/${mentorId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Communication
  contactStudent: async (studentId, message) => {
    try {
      const response = await api.post(`/mentor/contact/student/${studentId}`, { message });
      return response.data;
    } catch (error) {
      console.error('Error contacting student:', error);
      throw error;
    }
  },

  referToCounselor: async (studentId, reason) => {
    try {
      const response = await api.post(`/mentor/refer/${studentId}`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error referring to counselor:', error);
      throw error;
    }
  },
};

export default mentorService;