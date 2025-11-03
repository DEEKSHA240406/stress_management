// app/store/slices/counselorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import counselorService from '../../services/counselorService';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'counselor/fetchDashboardStats',
  async (counselorId, { rejectWithValue }) => {
    try {
      const response = await counselorService.getDashboardStats(counselorId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAssignedStudents = createAsyncThunk(
  'counselor/fetchAssignedStudents',
  async (counselorId, { rejectWithValue }) => {
    try {
      const response = await counselorService.getAssignedStudents(counselorId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchStudentCase = createAsyncThunk(
  'counselor/fetchStudentCase',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await counselorService.getStudentCase(studentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUrgentCases = createAsyncThunk(
  'counselor/fetchUrgentCases',
  async (counselorId, { rejectWithValue }) => {
    try {
      const response = await counselorService.getUrgentCases(counselorId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCaseStatus = createAsyncThunk(
  'counselor/updateCaseStatus',
  async ({ caseId, status }, { rejectWithValue }) => {
    try {
      const response = await counselorService.updateCaseStatus(caseId, status);
      return { caseId, status, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSessions = createAsyncThunk(
  'counselor/fetchSessions',
  async ({ counselorId, studentId }, { rejectWithValue }) => {
    try {
      const response = await counselorService.getSessions(counselorId, studentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSession = createAsyncThunk(
  'counselor/createSession',
  async ({ counselorId, sessionData }, { rejectWithValue }) => {
    try {
      const response = await counselorService.createSession(counselorId, sessionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSession = createAsyncThunk(
  'counselor/updateSession',
  async ({ sessionId, sessionData }, { rejectWithValue }) => {
    try {
      const response = await counselorService.updateSession(sessionId, sessionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteSession = createAsyncThunk(
  'counselor/deleteSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      await counselorService.deleteSession(sessionId);
      return sessionId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTreatmentPlan = createAsyncThunk(
  'counselor/fetchTreatmentPlan',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await counselorService.getTreatmentPlan(studentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTreatmentPlan = createAsyncThunk(
  'counselor/createTreatmentPlan',
  async ({ studentId, planData }, { rejectWithValue }) => {
    try {
      const response = await counselorService.createTreatmentPlan(studentId, planData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTreatmentPlan = createAsyncThunk(
  'counselor/updateTreatmentPlan',
  async ({ planId, planData }, { rejectWithValue }) => {
    try {
      const response = await counselorService.updateTreatmentPlan(planId, planData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Dashboard
  dashboardStats: null,
  dashboardLoading: false,
  dashboardError: null,

  // Cases
  cases: [],
  casesLoading: false,
  casesError: null,

  // Selected case
  selectedCase: null,
  selectedCaseLoading: false,
  selectedCaseError: null,

  // Urgent cases
  urgentCases: [],
  urgentCasesLoading: false,
  urgentCasesError: null,

  // Sessions
  sessions: [],
  sessionsLoading: false,
  sessionsError: null,

  // Treatment Plans
  treatmentPlans: {},
  treatmentPlanLoading: false,
  treatmentPlanError: null,

  // Analytics
  analytics: null,
  analyticsLoading: false,
  analyticsError: null,
};

const counselorSlice = createSlice({
  name: 'counselor',
  initialState,
  reducers: {
    clearSelectedCase: (state) => {
      state.selectedCase = null;
      state.selectedCaseError = null;
    },
    clearSessions: (state) => {
      state.sessions = [];
    },
    clearTreatmentPlans: (state) => {
      state.treatmentPlans = {};
    },
    resetCounselorState: () => initialState,
  },
  extraReducers: (builder) => {
    // Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      });

    // Assigned Students
    builder
      .addCase(fetchAssignedStudents.pending, (state) => {
        state.casesLoading = true;
        state.casesError = null;
      })
      .addCase(fetchAssignedStudents.fulfilled, (state, action) => {
        state.casesLoading = false;
        state.cases = action.payload;
      })
      .addCase(fetchAssignedStudents.rejected, (state, action) => {
        state.casesLoading = false;
        state.casesError = action.payload;
      });

    // Student Case
    builder
      .addCase(fetchStudentCase.pending, (state) => {
        state.selectedCaseLoading = true;
        state.selectedCaseError = null;
      })
      .addCase(fetchStudentCase.fulfilled, (state, action) => {
        state.selectedCaseLoading = false;
        state.selectedCase = action.payload;
      })
      .addCase(fetchStudentCase.rejected, (state, action) => {
        state.selectedCaseLoading = false;
        state.selectedCaseError = action.payload;
      });

    // Urgent Cases
    builder
      .addCase(fetchUrgentCases.pending, (state) => {
        state.urgentCasesLoading = true;
        state.urgentCasesError = null;
      })
      .addCase(fetchUrgentCases.fulfilled, (state, action) => {
        state.urgentCasesLoading = false;
        state.urgentCases = action.payload;
      })
      .addCase(fetchUrgentCases.rejected, (state, action) => {
        state.urgentCasesLoading = false;
        state.urgentCasesError = action.payload;
      });

    // Update Case Status
    builder
      .addCase(updateCaseStatus.fulfilled, (state, action) => {
        const caseIndex = state.cases.findIndex(c => c.id === action.payload.caseId);
        if (caseIndex !== -1) {
          state.cases[caseIndex].status = action.payload.status;
        }
        if (state.selectedCase?.id === action.payload.caseId) {
          state.selectedCase.status = action.payload.status;
        }
      });

    // Sessions
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.sessionsLoading = true;
        state.sessionsError = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessionsLoading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.sessionsLoading = false;
        state.sessionsError = action.payload;
      });

    // Create Session
    builder
      .addCase(createSession.fulfilled, (state, action) => {
        state.sessions.unshift(action.payload);
      });

    // Update Session
    builder
      .addCase(updateSession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
      });

    // Delete Session
    builder
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(s => s.id !== action.payload);
      });

    // Treatment Plan
    builder
      .addCase(fetchTreatmentPlan.pending, (state) => {
        state.treatmentPlanLoading = true;
        state.treatmentPlanError = null;
      })
      .addCase(fetchTreatmentPlan.fulfilled, (state, action) => {
        state.treatmentPlanLoading = false;
        state.treatmentPlans[action.payload.studentId] = action.payload;
      })
      .addCase(fetchTreatmentPlan.rejected, (state, action) => {
        state.treatmentPlanLoading = false;
        state.treatmentPlanError = action.payload;
      });

    // Create Treatment Plan
    builder
      .addCase(createTreatmentPlan.fulfilled, (state, action) => {
        state.treatmentPlans[action.payload.studentId] = action.payload;
      });

    // Update Treatment Plan
    builder
      .addCase(updateTreatmentPlan.fulfilled, (state, action) => {
        state.treatmentPlans[action.payload.studentId] = action.payload;
      });
  },
});

export const {
  clearSelectedCase,
  clearSessions,
  clearTreatmentPlans,
  resetCounselorState,
} = counselorSlice.actions;

export default counselorSlice.reducer;