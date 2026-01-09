import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import RoundService from '../../services/roundService.js';
import QuestionService from '../../services/questionService.js';
import SubjectService from '../../services/subjectService.js';

// Async thunks for API calls
export const fetchRounds = createAsyncThunk('questions/fetchRounds', async () => {
  try {
    const data = await RoundService.getRounds();
    return data;
  } catch (e) {
    return [];
  }
});

export const fetchSubjects = createAsyncThunk('questions/fetchSubjects', async () => {
  try {
    const data = await SubjectService.getSubjects();
    return data;
  } catch (e) {
    console.error('Failed to fetch subjects:', e);
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
  const slug = label.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const round = await RoundService.createRound(slug, label);
  return round;
});

export const deleteRoundAsync = createAsyncThunk('questions/deleteRound', async (name, { dispatch }) => {
  await RoundService.deleteRound(name);
  // Backend updates DB. Local state is updated in the reducer below.
  // Only refetch rounds list (not questions - that would reload all data)
  dispatch(fetchRounds());
  return name;
});

export const createSubjectAsync = createAsyncThunk('questions/createSubject', async (name) => {
  const subject = await SubjectService.createSubject(name, name.toUpperCase());
  return subject;
});

export const deleteSubjectAsync = createAsyncThunk('questions/deleteSubject', async (name, { dispatch }) => {
  await SubjectService.deleteSubject(name);
  // Backend updates DB. Local state is updated in the reducer below.
  // Only refetch subjects list (not questions - that would reload all data)
  dispatch(fetchSubjects());
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
  items: [], // raw questions fetched from backend
  // Central list of interview rounds (string keys stored on each question)
  rounds: ['technical', 'hr', 'telephonic', 'introduction', 'behavioral', 'system-design', 'coding', 'unnamed'],
  // Dynamic subjects/topics (user-defined, starts empty)
  subjects: [],
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
  filters: {
    favorite: false,
    review: false,
    hot: false
  },
  selectedTags: [],
  selectedSubject: 'all', // New field for subject filtering
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
      state.selectedSubject = 'all'; // Reset subject when round changes
      state.pagination.currentPage = 1;
    },
    setSelectedSubject: (state, action) => { // New reducer
      state.selectedSubject = action.payload;
      state.pagination.currentPage = 1;
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
        state.items = [...state.items]; // force reference change for selectors
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
          state.items = [...state.items]; // force reference change
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
            state.items = [...state.items];
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
          state.items = [...state.items];
        }
        state.error = null;
      })
      .addCase(toggleQuestionStatusAsync.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Rounds
    builder
      .addCase(fetchRounds.fulfilled, (state, action) => {
        const protectedRounds = [];
        const incoming = action.payload.map(r => r.name);
        state.rounds = Array.from(new Set([...protectedRounds, ...incoming, 'unnamed']));
      })
      .addCase(createRoundAsync.fulfilled, (state, action) => {
        if (action.payload?.name && !state.rounds.includes(action.payload.name)) {
          state.rounds.push(action.payload.name);
        }
      })
      .addCase(deleteRoundAsync.fulfilled, (state, action) => {
        const name = action.payload;
        const protectedRounds = [];
        if (!protectedRounds.includes(name)) {
          state.rounds = state.rounds.filter(r => r !== name);
          // Move questions to 'unnamed' instead of 'technical'
          state.items = state.items.map(q => q.round === name ? { ...q, round: 'unnamed' } : q);
          if (state.currentRound === name) state.currentRound = 'all';

          // Ensure 'unnamed' exists in the list if we just moved items there
          if (!state.rounds.includes('unnamed')) {
            state.rounds.push('unnamed');
          }
        }
      });

    // Subjects
    builder
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.subjects = action.payload.map(s => s.name);
      })
      .addCase(createSubjectAsync.fulfilled, (state, action) => {
        if (action.payload?.name && !state.subjects.includes(action.payload.name)) {
          state.subjects.push(action.payload.name);
        }
      })
      .addCase(deleteSubjectAsync.fulfilled, (state, action) => {
        const name = action.payload;
        state.subjects = state.subjects.filter(s => s !== name);
        // Fallback to unnamed for deleted subjects
        state.items = state.items.map(q => q.subject === name ? { ...q, subject: 'unnamed' } : q);
        if (state.selectedSubject === name) state.selectedSubject = 'all';
        // Ensure unnamed exists
        if (!state.subjects.includes('unnamed') && state.items.some(q => q.subject === 'unnamed')) {
          state.subjects.push('unnamed');
        }
      });
  }
});

export const selectFilteredQuestions = createSelector(
  [
    (state) => state.questions.items,
    (state) => state.questions.searchTerm,
    (state) => state.questions.searchScope,
    (state) => state.questions.currentRound,
    (state) => state.questions.filters,
    (state) => state.questions.selectedTags,
    (state) => state.questions.selectedSubject
  ],
  (items, searchTerm, searchScope, currentRound, filters, selectedTags, selectedSubject) => {
    let filtered = [...items];

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

    // Apply subject filter (hierarchical: Round -> Subject) - Works for all rounds
    if (currentRound !== 'all' && selectedSubject !== 'all') {
      filtered = filtered.filter(item => item.subject === selectedSubject);
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
          item.tags.some(tag => {
            // Tags can be strings or objects with .name property
            const tagName = typeof tag === 'string' ? tag : (tag.name || '');
            return tagName.toLowerCase() === tagId.toLowerCase();
          })
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
  setSelectedSubject,
  setSearchTerm,
  setSearchScope,
  setCurrentPage,
  setQuestionsPerPage,
  setFilters,
  setSelectedTags,
  resetFilters,
  setOnlineStatus,
  clearError,
  addQuestionLocal,
  updateQuestionLocal,
  deleteQuestionLocal,
} = questionsSlice.actions;

export default questionsSlice.reducer;
