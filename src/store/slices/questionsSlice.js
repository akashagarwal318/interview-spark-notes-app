import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import RoundService from '../../services/roundService.js';
import QuestionService from '../../services/questionService.js';

// Async thunks for API calls
export const fetchRounds = createAsyncThunk('questions/fetchRounds', async () => {
  try {
    const data = await RoundService.getRounds();
    return data;
  } catch (e) {
    return [];
  }
});

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

export const createRoundAsync = createAsyncThunk('questions/createRound', async (label) => {
  const slug = label.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');
  const round = await RoundService.createRound(slug, label);
  return round;
});

export const deleteRoundAsync = createAsyncThunk('questions/deleteRound', async (name) => {
  await RoundService.deleteRound(name);
  return name;
});

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
  // Central list of interview rounds (string keys stored on each question)
  rounds: ['technical','hr','telephonic','introduction','behavioral','system-design','coding'],
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
  searchScope: 'all', // 'all', 'question', 'answer', 'code'
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
    addCustomRound: (state, action) => {
      const raw = (action.payload || '').trim();
      if (!raw) return;
      const slug = raw
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      if (!slug) return;
      if (!state.rounds.includes(slug)) {
        state.rounds.push(slug);
      }
    },
    deleteCustomRound: (state, action) => {
      const round = action.payload;
      const protectedRounds = ['technical','hr','telephonic','introduction','behavioral','system-design','coding'];
      if (protectedRounds.includes(round)) return; // don't remove default
      state.rounds = state.rounds.filter(r => r !== round);
      // If currently viewing deleted round, reset to 'all'
      if (state.currentRound === round) state.currentRound = 'all';
      // Optionally reassign questions of deleted round to 'technical'
      state.items = state.items.map(q => q.round === round ? { ...q, round: 'technical' } : q);
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearchScope: (state, action) => {
      state.searchScope = action.payload;
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
      state.searchScope = 'all';
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
        // auto-register round if new
        if (action.payload?.round && !state.rounds.includes(action.payload.round)) {
          state.rounds.push(action.payload.round);
        }
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
        if (action.payload?.round && !state.rounds.includes(action.payload.round)) {
          state.rounds.push(action.payload.round);
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
      .addCase(toggleQuestionStatusAsync.pending, (state, action) => {
        // Optimistic toggle
        const { arg } = action.meta || {};
        const optimisticId = arg?.id;
        const field = arg?.field;
        if (optimisticId && field) {
          const idx = state.items.findIndex(q => q.id === optimisticId || q._id === optimisticId);
          if (idx !== -1) {
            state.items[idx] = { ...state.items[idx], [field]: !state.items[idx][field] };
          }
        }
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

    // Rounds
    builder
      .addCase(fetchRounds.fulfilled, (state, action) => {
        const protectedRounds = ['technical','hr','telephonic','introduction','behavioral','system-design','coding'];
        const incoming = action.payload.map(r => r.name);
        state.rounds = Array.from(new Set([...protectedRounds, ...incoming]));
      })
      .addCase(createRoundAsync.fulfilled, (state, action) => {
        if (action.payload?.name && !state.rounds.includes(action.payload.name)) {
          state.rounds.push(action.payload.name);
        }
      })
      .addCase(deleteRoundAsync.fulfilled, (state, action) => {
        const name = action.payload;
        const protectedRounds = ['technical','hr','telephonic','introduction','behavioral','system-design','coding'];
        if (!protectedRounds.includes(name)) {
          state.rounds = state.rounds.filter(r => r !== name);
          state.items = state.items.map(q => q.round === name ? { ...q, round: 'technical' } : q);
          if (state.currentRound === name) state.currentRound = 'all';
        }
      });
  }
});

// Selector functions for computed values
export const selectFilteredQuestions = createSelector(
  [(state) => state.questions.items,
   (state) => state.questions.searchTerm,
   (state) => state.questions.searchScope,
   (state) => state.questions.currentRound,
   (state) => state.questions.filters,
   (state) => state.questions.selectedTags],
  (items, searchTerm, searchScope, currentRound, filters, selectedTags) => {
    // Normalize tags to always be objects with _id and name
    const normalizeTags = (tags) =>
      (tags || []).map(tag => typeof tag === 'string' ? { _id: tag, name: tag, color: '#6B7280' } : tag);

    let filtered = items.map(item => ({
      ...item,
      tags: normalizeTags(item.tags)
    }));

    // Apply search filter based on scope
    if (searchTerm && searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase().trim();
      const extractCodeBlocks = (text = '') => {
        const blocks = [];
        const regex = /```[a-zA-Z0-9_-]*\n([\s\S]*?)```/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          blocks.push(match[1]);
        }
        return blocks.join('\n');
      };
      filtered = filtered.filter(item => {
        const q = item.question?.toLowerCase() || '';
        const a = item.answer?.toLowerCase() || '';
        const codeField = item.code?.toLowerCase() || '';
        const codeInAnswer = extractCodeBlocks(item.answer || '').toLowerCase();
        const tagString = (item.tags || []).map(t => t.name?.toLowerCase()).join(' ');
        switch (searchScope) {
          case 'question':
            return q.includes(lowerSearch);
          case 'answer':
            return a.includes(lowerSearch);
          case 'code':
            return codeField.includes(lowerSearch) || codeInAnswer.includes(lowerSearch);
          case 'all':
          default:
            return (
              q.includes(lowerSearch) ||
              a.includes(lowerSearch) ||
              codeField.includes(lowerSearch) ||
              codeInAnswer.includes(lowerSearch) ||
              tagString.includes(lowerSearch)
            );
        }
      });
    }

    // Apply round filter
    if (currentRound !== 'all') {
      filtered = filtered.filter(item => item.round === currentRound);
    }



    // Apply status filters
    if (filters.favorite) {
      filtered = filtered.filter(item => item.favorite === true);
    }
    if (filters.review) {
      filtered = filtered.filter(item => item.review === true);
    }
    if (filters.hot) {
      filtered = filtered.filter(item => item.hot === true);
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item => {
        if (!item.tags || item.tags.length === 0) return false;
        return selectedTags.some(tagId =>
          item.tags.some(tag => tag._id === tagId)
        );
      });
    }

    return filtered;
  }
);

export const selectQuestionStats = createSelector(
  [(state) => state.questions.items],
  (items) => {
    const stats = {
      total: items.length,
      favorites: items.filter(q => q.favorite).length,
      review: items.filter(q => q.review).length,
      hot: items.filter(q => q.hot).length,
      byRound: {
        technical: items.filter(q => q.round === 'technical').length,
        hr: items.filter(q => q.round === 'hr').length,
        telephonic: items.filter(q => q.round === 'telephonic').length,
        introduction: items.filter(q => q.round === 'introduction').length,
      }
    };
    return stats;
  }
);

export const {
  setCurrentRound,
  setSearchTerm,
  setSearchScope,
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
  deleteQuestionLocal,
  addCustomRound,
  deleteCustomRound
} = questionsSlice.actions;

export default questionsSlice.reducer;
