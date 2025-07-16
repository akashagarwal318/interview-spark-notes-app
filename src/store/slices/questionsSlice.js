import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import QuestionService from '../../services/questionService.js';

// Async thunks for API calls
export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await QuestionService.getQuestions(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuestionAsync = createAsyncThunk(
  'questions/createQuestion',
  async (questionData, { rejectWithValue }) => {
    try {
      const question = await QuestionService.createQuestion(questionData);
      return question;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuestionAsync = createAsyncThunk(
  'questions/updateQuestion',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const question = await QuestionService.updateQuestion(id, data);
      return question;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuestionAsync = createAsyncThunk(
  'questions/deleteQuestion',
  async (id, { rejectWithValue }) => {
    try {
      await QuestionService.deleteQuestion(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleQuestionStatusAsync = createAsyncThunk(
  'questions/toggleQuestionStatus',
  async ({ id, field }, { rejectWithValue }) => {
    try {
      const question = await QuestionService.toggleQuestionStatus(id, field);
      return question;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  filteredItems: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalQuestions: 0,
    hasNext: false,
    hasPrev: false
  },
  loading: false,
  error: null,
  currentRound: 'all',
  searchTerm: '',
  questionsPerPage: 10,
  sortBy: 'newest',
  filters: {
    favorite: false,
    review: false,
    hot: false
  },
  selectedTags: [],
  lastFetch: null,
  isOnline: navigator.onLine
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    // Local state management reducers
    setCurrentRound: (state, action) => {
      state.currentRound = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setQuestionsPerPage: (state, action) => {
      state.questionsPerPage = action.payload;
      state.pagination.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
      state.pagination.currentPage = 1;
    },
    resetFilters: (state) => {
      state.currentRound = 'all';
      state.searchTerm = '';
      state.filters = {
        favorite: false,
        review: false,
        hot: false
      };
      state.selectedTags = [];
      state.pagination.currentPage = 1;
    },
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Local question management (for offline support)
    addQuestionLocal: (state, action) => {
      const newQuestion = {
        id: `temp_${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorite: false,
        review: false,
        hot: false,
        isLocal: true // Mark as local until synced
      };
      state.items.unshift(newQuestion);
      state.pagination.totalQuestions += 1;
    },
    updateQuestionLocal: (state, action) => {
      const index = state.items.findIndex(q => q.id === action.payload.id || q._id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { 
          ...state.items[index], 
          ...action.payload,
          updatedAt: new Date().toISOString()
        };
      }
    },
    deleteQuestionLocal: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(q => q.id !== id && q._id !== id);
      state.pagination.totalQuestions = Math.max(0, state.pagination.totalQuestions - 1);
    }
  },
  extraReducers: (builder) => {
    // Fetch questions
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.questions || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.lastFetch = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Create question
    builder
      .addCase(createQuestionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.pagination.totalQuestions += 1;
        state.error = null;
      })
      .addCase(createQuestionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Update question
    builder
      .addCase(updateQuestionAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(updateQuestionAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(q => 
          q.id === action.payload.id || 
          q._id === action.payload._id || 
          q._id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateQuestionAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

    // Delete question
    builder
      .addCase(deleteQuestionAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteQuestionAsync.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(q => 
          q.id !== id && 
          q._id !== id
        );
        state.pagination.totalQuestions = Math.max(0, state.pagination.totalQuestions - 1);
        state.error = null;
      })
      .addCase(deleteQuestionAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

    // Toggle question status
    builder
      .addCase(toggleQuestionStatusAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleQuestionStatusAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(q => 
          q.id === action.payload.id || 
          q._id === action.payload._id || 
          q._id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleQuestionStatusAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const {
  setCurrentRound,
  setSearchTerm,
  setCurrentPage,
  setQuestionsPerPage,
  setSortBy,
  setFilters,
  setSelectedTags,
  resetFilters,
  setOnlineStatus,
  clearError,
  addQuestionLocal,
  updateQuestionLocal,
  deleteQuestionLocal
} = questionsSlice.actions;

export default questionsSlice.reducer;
