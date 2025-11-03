// app/hooks/useCounselorCases.js
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAssignedStudents,
  fetchDashboardStats,
  fetchStudentCase,
  fetchUrgentCases,
  updateCaseStatus,
} from '../store/slices/counselorSlice';

/**
 * Custom hook for managing counselor's cases
 * Provides filtered, sorted cases with stats and loading states
 * 
 * @param {string} counselorId - The counselor's ID
 * @returns {Object} Cases data and management functions
 */
export const useCounselorCases = (counselorId) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, active, completed, urgent, critical

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

  // Fetch all data on mount
  useEffect(() => {
    if (counselorId) {
      loadAllData();
    }
  }, [counselorId]);

  /**
   * Load all counselor data
   */
  const loadAllData = useCallback(async () => {
    try {
      await Promise.all([
        loadCases(),
        loadDashboard(),
        loadUrgentCases(),
      ]);
    } catch (error) {
      console.error('Error loading counselor data:', error);
    }
  }, [counselorId]);

  /**
   * Load assigned cases
   */
  const loadCases = useCallback(async () => {
    try {
      await dispatch(fetchAssignedStudents(counselorId)).unwrap();
    } catch (error) {
      console.error('Error loading cases:', error);
      throw error;
    }
  }, [dispatch, counselorId]);

  /**
   * Load dashboard statistics
   */
  const loadDashboard = useCallback(async () => {
    try {
      await dispatch(fetchDashboardStats(counselorId)).unwrap();
    } catch (error) {
      console.error('Error loading dashboard:', error);
      throw error;
    }
  }, [dispatch, counselorId]);

  /**
   * Load urgent cases
   */
  const loadUrgentCases = useCallback(async () => {
    try {
      await dispatch(fetchUrgentCases(counselorId)).unwrap();
    } catch (error) {
      console.error('Error loading urgent cases:', error);
      throw error;
    }
  }, [dispatch, counselorId]);

  /**
   * Load specific case details
   */
  const loadCaseDetail = useCallback(async (studentId) => {
    try {
      await dispatch(fetchStudentCase(studentId)).unwrap();
    } catch (error) {
      console.error('Error loading case detail:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * Update case status
   */
  const updateStatus = useCallback(async (caseId, status) => {
    try {
      await dispatch(updateCaseStatus({ caseId, status })).unwrap();
      return true;
    } catch (error) {
      console.error('Error updating case status:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * Refresh all data
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadAllData();
    } finally {
      setRefreshing(false);
    }
  }, [loadAllData]);

  /**
   * Filter cases based on selected filter and search query
   */
  const filteredCases = cases.filter((caseItem) => {
    // Apply status filter
    switch (selectedFilter) {
      case 'active':
        if (caseItem.status !== 'active') return false;
        break;
      case 'completed':
        if (caseItem.status !== 'completed') return false;
        break;
      case 'urgent':
        if (caseItem.priority !== 'high' && caseItem.priority !== 'critical') return false;
        break;
      case 'critical':
        if (caseItem.priority !== 'critical') return false;
        break;
      case 'all':
      default:
        // Show all active cases by default
        if (caseItem.status === 'completed' || caseItem.status === 'closed') return false;
        break;
    }

    // Apply search filter
    if (filterQuery.trim()) {
      const query = filterQuery.toLowerCase();
      const searchFields = [
        caseItem.studentName,
        caseItem.rollNumber,
        caseItem.department,
        ...(caseItem.issues || []),
      ].map(field => field?.toLowerCase() || '');

      return searchFields.some(field => field.includes(query));
    }

    return true;
  });

  /**
   * Sort cases by priority and score
   * Critical cases first, then by mental health score (lowest first)
   */
  const sortedCases = [...filteredCases].sort((a, b) => {
    // Priority order: critical > high > medium > low
    const priorityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
    const aPriority = priorityOrder[a.priority] || 999;
    const bPriority = priorityOrder[b.priority] || 999;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // If same priority, sort by score (lower score = worse mental health = higher priority)
    return a.score - b.score;
  });

  /**
   * Calculate statistics
   */
  const stats = {
    total: cases.length,
    active: cases.filter((c) => c.status === 'active').length,
    completed: cases.filter((c) => c.status === 'completed').length,
    critical: cases.filter((c) => c.priority === 'critical').length,
    high: cases.filter((c) => c.priority === 'high').length,
    sessionsToday: dashboardStats?.todaySessions || 0,
    pendingSessions: dashboardStats?.pendingSessions || 0,
    averageScore: cases.length > 0 
      ? Math.round(cases.reduce((sum, c) => sum + c.score, 0) / cases.length)
      : 0,
  };

  /**
   * Get cases by priority
   */
  const getCasesByPriority = useCallback((priority) => {
    return cases.filter(c => c.priority === priority);
  }, [cases]);

  /**
   * Get cases by status
   */
  const getCasesByStatus = useCallback((status) => {
    return cases.filter(c => c.status === status);
  }, [cases]);

  /**
   * Search cases
   */
  const searchCases = useCallback((query) => {
    setFilterQuery(query);
  }, []);

  /**
   * Apply filter
   */
  const applyFilter = useCallback((filter) => {
    setSelectedFilter(filter);
  }, []);

  /**
   * Clear filters
   */
  const clearFilters = useCallback(() => {
    setFilterQuery('');
    setSelectedFilter('all');
  }, []);

  return {
    // Data
    cases: sortedCases,
    allCases: cases,
    urgentCases,
    selectedCase,
    dashboardStats,
    stats,

    // Loading states
    loading: casesLoading,
    urgentLoading: urgentCasesLoading,
    selectedCaseLoading,
    refreshing,
    error: casesError,

    // Filter states
    filterQuery,
    selectedFilter,

    // Actions
    loadCases,
    loadCaseDetail,
    loadUrgentCases,
    loadDashboard,
    updateStatus,
    onRefresh,
    searchCases,
    applyFilter,
    clearFilters,
    setFilterQuery,
    setSelectedFilter,

    // Helpers
    getCasesByPriority,
    getCasesByStatus,
  };
};

export default useCounselorCases;