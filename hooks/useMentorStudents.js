// app/hooks/useMentorStudents.js
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMyStudents,
  fetchDashboardStats,
  fetchStudentDetail,
} from '../store/slices/mentorSlice';

/**
 * Custom hook for managing mentor's students
 */
export const useMentorStudents = (mentorId) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const {
    students,
    studentsLoading,
    studentsError,
    selectedStudent,
    selectedStudentLoading,
    dashboardStats,
  } = useSelector((state) => state.mentor);

  // Fetch students on mount
  useEffect(() => {
    if (mentorId) {
      loadStudents();
      loadDashboard();
    }
  }, [mentorId]);

  const loadStudents = useCallback(async () => {
    try {
      await dispatch(fetchMyStudents(mentorId)).unwrap();
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }, [dispatch, mentorId]);

  const loadDashboard = useCallback(async () => {
    try {
      await dispatch(fetchDashboardStats(mentorId)).unwrap();
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  }, [dispatch, mentorId]);

  const loadStudentDetail = useCallback(async (studentId) => {
    try {
      await dispatch(fetchStudentDetail(studentId)).unwrap();
    } catch (error) {
      console.error('Error loading student detail:', error);
    }
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadStudents(), loadDashboard()]);
    setRefreshing(false);
  }, [loadStudents, loadDashboard]);

  // Filter students
  const filteredStudents = students.filter((student) => {
    // Apply status filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'at_risk' && student.score >= 40) return false;
      if (selectedStatus === 'needs_attention' && (student.score < 40 || student.score >= 60)) return false;
      if (selectedStatus === 'stable' && student.score < 60) return false;
    }

    // Apply search filter
    if (filterQuery.trim()) {
      const query = filterQuery.toLowerCase();
      return (
        student.name.toLowerCase().includes(query) ||
        student.rollNumber.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort students by severity (critical first)
  const sortedStudents = [...filteredStudents].sort((a, b) => a.score - b.score);

  // Get statistics
  const stats = {
    total: students.length,
    atRisk: students.filter((s) => s.score < 40).length,
    needsAttention: students.filter((s) => s.score >= 40 && s.score < 60).length,
    stable: students.filter((s) => s.score >= 60).length,
  };

  return {
    students: sortedStudents,
    loading: studentsLoading,
    error: studentsError,
    refreshing,
    onRefresh,
    selectedStudent,
    selectedStudentLoading,
    dashboardStats,
    stats,
    filterQuery,
    setFilterQuery,
    selectedStatus,
    setSelectedStatus,
    loadStudentDetail,
    loadStudents,
  };
};

// app/hooks/useCounselorCases.js
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAssignedStudents,
  fetchDashboardStats as fetchCounselorDashboard,
  fetchStudentCase,
  fetchUrgentCases,
  updateCaseStatus,
} from '../store/slices/counselorSlice';

/**
 * Custom hook for managing counselor's cases
 */
export const useCounselorCases = (counselorId) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, active, completed, urgent

  const {
    cases,
    casesLoading,
    casesError,
    selectedCase,
    selectedCaseLoading,
    urgentCases,
    urgentCasesLoading,
    dashboardStats,
  } = useSelector((state) => state.counselor);

  // Fetch cases on mount
  useEffect(() => {
    if (counselorId) {
      loadCases();
      loadDashboard();
      loadUrgentCases();
    }
  }, [counselorId]);

  const loadCases = useCallback(async () => {
    try {
      await dispatch(fetchAssignedStudents(counselorId)).unwrap();
    } catch (error) {
      console.error('Error loading cases:', error);
    }
  }, [dispatch, counselorId]);

  const loadDashboard = useCallback(async () => {
    try {
      await dispatch(fetchCounselorDashboard(counselorId)).unwrap();
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  }, [dispatch, counselorId]);

  const loadUrgentCases = useCallback(async () => {
    try {
      await dispatch(fetchUrgentCases(counselorId)).unwrap();
    } catch (error) {
      console.error('Error loading urgent cases:', error);
    }
  }, [dispatch, counselorId]);

  const loadCaseDetail = useCallback(async (studentId) => {
    try {
      await dispatch(fetchStudentCase(studentId)).unwrap();
    } catch (error) {
      console.error('Error loading case detail:', error);
    }
  }, [dispatch]);

  const updateStatus = useCallback(async (caseId, status) => {
    try {
      await dispatch(updateCaseStatus({ caseId, status })).unwrap();
    } catch (error) {
      console.error('Error updating case status:', error);
      throw error;
    }
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadCases(), loadDashboard(), loadUrgentCases()]);
    setRefreshing(false);
  }, [loadCases, loadDashboard, loadUrgentCases]);

  // Filter cases
  const filteredCases = cases.filter((caseItem) => {
    // Apply status filter
    if (selectedFilter === 'active' && caseItem.status !== 'active') return false;
    if (selectedFilter === 'completed' && caseItem.status !== 'completed') return false;
    if (selectedFilter === 'urgent' && caseItem.priority !== 'critical') return false;

    // Apply search filter
    if (filterQuery.trim()) {
      const query = filterQuery.toLowerCase();
      return (
        caseItem.studentName.toLowerCase().includes(query) ||
        caseItem.rollNumber?.toLowerCase().includes(query) ||
        caseItem.department?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort cases by priority (critical first)
  const sortedCases = [...filteredCases].sort((a, b) => {
    // Critical cases first
    if (a.priority === 'critical' && b.priority !== 'critical') return -1;
    if (a.priority !== 'critical' && b.priority === 'critical') return 1;
    // Then by score
    return a.score - b.score;
  });

  // Get statistics
  const stats = {
    total: cases.length,
    active: cases.filter((c) => c.status === 'active').length,
    completed: cases.filter((c) => c.status === 'completed').length,
    critical: cases.filter((c) => c.priority === 'critical').length,
    sessionsToday: dashboardStats?.todaySessions || 0,
  };

  return {
    cases: sortedCases,
    loading: casesLoading,
    error: casesError,
    refreshing,
    onRefresh,
    selectedCase,
    selectedCaseLoading,
    urgentCases,
    urgentCasesLoading,
    dashboardStats,
    stats,
    filterQuery,
    setFilterQuery,
    selectedFilter,
    setSelectedFilter,
    loadCaseDetail,
    loadCases,
    updateStatus,
  };
};

export default { useMentorStudents, useCounselorCases };