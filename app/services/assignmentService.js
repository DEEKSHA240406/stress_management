// app/services/assignmentService.js
import api from './api';
import { 
  COUNSELOR_ASSIGNMENT_THRESHOLD,
  MENTOR_ALERT_THRESHOLD,
  MAX_STUDENTS_PER_MENTOR,
  MAX_ACTIVE_CASES_PER_COUNSELOR,
  needsCounselorAssignment,
  needsMentorAlert,
} from '../constants/severityThresholds';

const assignmentService = {
  // Auto-assignment after assessment
  processAssessmentResult: async (studentId, score, assessmentData) => {
    try {
      const response = await api.post('/assignment/process-assessment', {
        studentId,
        score,
        assessmentData
      });
      return response.data;
    } catch (error) {
      console.error('Error processing assessment result:', error);
      throw error;
    }
  },

  // Check if student needs counselor assignment
  checkCounselorAssignment: async (studentId, score) => {
    try {
      if (needsCounselorAssignment(score)) {
        const response = await api.post('/assignment/check-counselor', {
          studentId,
          score
        });
        return response.data;
      }
      return { needsAssignment: false };
    } catch (error) {
      console.error('Error checking counselor assignment:', error);
      throw error;
    }
  },

  // Auto-assign student to counselor
  autoAssignCounselor: async (studentId, score, issues = []) => {
    try {
      const response = await api.post('/assignment/auto-assign-counselor', {
        studentId,
        score,
        issues,
        threshold: COUNSELOR_ASSIGNMENT_THRESHOLD
      });
      return response.data;
    } catch (error) {
      console.error('Error auto-assigning counselor:', error);
      throw error;
    }
  },

  // Manually assign student to counselor
  assignCounselor: async (studentId, counselorId, reason) => {
    try {
      const response = await api.post('/assignment/assign-counselor', {
        studentId,
        counselorId,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning counselor:', error);
      throw error;
    }
  },

  // Get available counselors for assignment
  getAvailableCounselors: async (preferSpecialization = null) => {
    try {
      const response = await api.get('/assignment/available-counselors', {
        params: { 
          maxCases: MAX_ACTIVE_CASES_PER_COUNSELOR,
          specialization: preferSpecialization
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available counselors:', error);
      throw error;
    }
  },

  // Assign students to mentor (max 20)
  assignStudentsToMentor: async (mentorId, studentIds) => {
    try {
      // Check if mentor has capacity
      const currentCount = await assignmentService.getMentorStudentCount(mentorId);
      const totalAfterAssignment = currentCount + studentIds.length;
      
      if (totalAfterAssignment > MAX_STUDENTS_PER_MENTOR) {
        throw new Error(`Cannot assign ${studentIds.length} students. Mentor capacity is ${MAX_STUDENTS_PER_MENTOR}. Current: ${currentCount}`);
      }

      const response = await api.post('/assignment/assign-mentor', {
        mentorId,
        studentIds,
        maxStudents: MAX_STUDENTS_PER_MENTOR
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning students to mentor:', error);
      throw error;
    }
  },

  // Get mentor's current student count
  getMentorStudentCount: async (mentorId) => {
    try {
      const response = await api.get(`/assignment/mentor/${mentorId}/count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching mentor student count:', error);
      throw error;
    }
  },

  // Get available mentors with capacity
  getAvailableMentors: async () => {
    try {
      const response = await api.get('/assignment/available-mentors', {
        params: { maxStudents: MAX_STUDENTS_PER_MENTOR }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available mentors:', error);
      throw error;
    }
  },

  // Trigger mentor alert
  triggerMentorAlert: async (studentId, mentorId, score) => {
    try {
      if (needsMentorAlert(score)) {
        const response = await api.post('/assignment/mentor-alert', {
          studentId,
          mentorId,
          score,
          threshold: MENTOR_ALERT_THRESHOLD
        });
        return response.data;
      }
      return { alertSent: false };
    } catch (error) {
      console.error('Error triggering mentor alert:', error);
      throw error;
    }
  },

  // Get assignment settings
  getSettings: async () => {
    try {
      const response = await api.get('/assignment/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment settings:', error);
      throw error;
    }
  },

  // Update assignment settings
  updateSettings: async (settings) => {
    try {
      const response = await api.put('/assignment/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating assignment settings:', error);
      throw error;
    }
  },

  // Get assignment history
  getAssignmentHistory: async (studentId) => {
    try {
      const response = await api.get(`/assignment/history/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment history:', error);
      throw error;
    }
  },

  // Reassign student
  reassignStudent: async (studentId, newCounselorId, reason) => {
    try {
      const response = await api.post('/assignment/reassign', {
        studentId,
        newCounselorId,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error reassigning student:', error);
      throw error;
    }
  },

  // Unassign student from counselor
  unassignCounselor: async (studentId, reason) => {
    try {
      const response = await api.post('/assignment/unassign-counselor', {
        studentId,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error unassigning counselor:', error);
      throw error;
    }
  },

  // Get assignment statistics
  getAssignmentStats: async () => {
    try {
      const response = await api.get('/assignment/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment stats:', error);
      throw error;
    }
  },

  // Bulk assign students to mentors
  bulkAssignMentors: async (assignments) => {
    try {
      // assignments: [{ mentorId, studentIds }]
      const response = await api.post('/assignment/bulk-assign-mentors', {
        assignments,
        maxStudentsPerMentor: MAX_STUDENTS_PER_MENTOR
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk assigning mentors:', error);
      throw error;
    }
  },

  // Load balancing - Find best counselor
  findBestCounselor: async (studentIssues = [], considerSpecialization = true) => {
    try {
      const response = await api.post('/assignment/find-best-counselor', {
        studentIssues,
        considerSpecialization,
        maxCases: MAX_ACTIVE_CASES_PER_COUNSELOR
      });
      return response.data;
    } catch (error) {
      console.error('Error finding best counselor:', error);
      throw error;
    }
  },

  // Validate assignment capacity
  validateCapacity: async (mentorId = null, counselorId = null) => {
    try {
      const response = await api.post('/assignment/validate-capacity', {
        mentorId,
        counselorId,
        maxStudentsPerMentor: MAX_STUDENTS_PER_MENTOR,
        maxCasesPerCounselor: MAX_ACTIVE_CASES_PER_COUNSELOR
      });
      return response.data;
    } catch (error) {
      console.error('Error validating capacity:', error);
      throw error;
    }
  },
};

export default assignmentService;