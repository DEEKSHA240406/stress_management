// app/store/slices/mentorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mentorService from '../../services/mentorService';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'mentor/fetchDashboardStats',
  async (mentorId, { rejectWithValue }) => {
    try {
      const response = await mentorService.getDashboardStats(mentorId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMyStudents = createAsyncThunk(
  'mentor/fetchMyStudents',
  async (mentorId, { rejectWithValue }) => {
    try {
      const response = await mentorService.getMyStudents(mentorId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchStudentDetail = createAsyncThunk(
  'mentor/fetchStudentDetail',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await mentorService.getStudentDetail(studentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAlerts = createAsyncThunk(
  'mentor/fetchAlerts',
  async ({ mentorId, filter }, { rejectWithValue }) => {
    try {
      const response = await mentorService.getAlerts(mentorId, filter);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const acknowledgeAlert = createAsyncThunk(
  'mentor/acknowledgeAlert',
  async (alertId, { rejectWithValue }) => {
    try {
      const response = await mentorService.acknowledgeAlert(alertId);
      return { alertId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchNotes = createAsyncThunk(
  'mentor/fetchNotes',
  async ({ mentorId, studentId }, { rejectWithValue }) => {
    try {
      const response = await mentorService.getNotes(mentorId, studentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createNote = createAsyncThunk(
  'mentor/createNote',
  async ({ mentorId, noteData }, { rejectWithValue }) => {
    try {
      const response = await mentorService.createNote(mentorId, noteData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateNote = createAsyncThunk(
  'mentor/updateNote',
  async ({ noteId, noteData }, { rejectWithValue }) => {
    try {
      const response = await mentorService.updateNote(noteId, noteData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteNote = createAsyncThunk(
  'mentor/deleteNote',
  async (noteId, { rejectWithValue }) => {
    try {
      await mentorService.deleteNote(noteId);
      return noteId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const referToCounselor = createAsyncThunk(
  'mentor/referToCounselor',
  async ({ studentId, reason }, { rejectWithValue }) => {
    try {
      const response = await mentorService.referToCounselor(studentId, reason);
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

  // Students
  students: [],
  studentsLoading: false,
  studentsError: null,

  // Selected student
  selectedStudent: null,
  selectedStudentLoading: false,
  selectedStudentError: null,

  // Alerts
  alerts: [],
  alertsLoading: false,
  alertsError: null,
  unreadAlertsCount: 0,

  // Notes
  notes: [],
  notesLoading: false,
  notesError: null,

  // Progress
  progressData: null,
  progressLoading: false,
  progressError: null,
};

const mentorSlice = createSlice({
  name: 'mentor',
  initialState,
  reducers: {
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
      state.selectedStudentError = null;
    },
    clearAlerts: (state) => {
      state.alerts = [];
      state.unreadAlertsCount = 0;
    },
    clearNotes: (state) => {
      state.notes = [];
    },
    setUnreadAlertsCount: (state, action) => {
      state.unreadAlertsCount = action.payload;
    },
    resetMentorState: () => initialState,
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

    // My Students
    builder
      .addCase(fetchMyStudents.pending, (state) => {
        state.studentsLoading = true;
        state.studentsError = null;
      })
      .addCase(fetchMyStudents.fulfilled, (state, action) => {
        state.studentsLoading = false;
        state.students = action.payload;
      })
      .addCase(fetchMyStudents.rejected, (state, action) => {
        state.studentsLoading = false;
        state.studentsError = action.payload;
      });

    // Student Detail
    builder
      .addCase(fetchStudentDetail.pending, (state) => {
        state.selectedStudentLoading = true;
        state.selectedStudentError = null;
      })
      .addCase(fetchStudentDetail.fulfilled, (state, action) => {
        state.selectedStudentLoading = false;
        state.selectedStudent = action.payload;
      })
      .addCase(fetchStudentDetail.rejected, (state, action) => {
        state.selectedStudentLoading = false;
        state.selectedStudentError = action.payload;
      });

    // Alerts
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.alertsLoading = true;
        state.alertsError = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.alerts = action.payload;
        state.unreadAlertsCount = action.payload.filter(alert => !alert.read).length;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.alertsLoading = false;
        state.alertsError = action.payload;
      });

    // Acknowledge Alert
    builder
      .addCase(acknowledgeAlert.fulfilled, (state, action) => {
        const index = state.alerts.findIndex(alert => alert.id === action.payload.alertId);
        if (index !== -1) {
          state.alerts[index].read = true;
          state.unreadAlertsCount = Math.max(0, state.unreadAlertsCount - 1);
        }
      });

    // Notes
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.notesLoading = true;
        state.notesError = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notesLoading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.notesLoading = false;
        state.notesError = action.payload;
      });

    // Create Note
    builder
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
      });

    // Update Note
    builder
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      });

    // Delete Note
    builder
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(note => note.id !== action.payload);
      });

    // Refer to Counselor
    builder
      .addCase(referToCounselor.fulfilled, (state, action) => {
        // Update student status if in students list
        const studentIndex = state.students.findIndex(s => s.id === action.payload.studentId);
        if (studentIndex !== -1) {
          state.students[studentIndex].referredToCounselor = true;
        }
        // Update selected student if matches
        if (state.selectedStudent?.id === action.payload.studentId) {
          state.selectedStudent.referredToCounselor = true;
        }
      });
  },
});

export const {
  clearSelectedStudent,
  clearAlerts,
  clearNotes,
  setUnreadAlertsCount,
  resetMentorState,
} = mentorSlice.actions;

export default mentorSlice.reducer;