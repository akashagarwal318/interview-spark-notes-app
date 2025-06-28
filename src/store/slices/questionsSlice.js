
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  filteredItems: [],
  loading: false,
  currentRound: 'all',
  searchTerm: '',
  currentPage: 1,
  questionsPerPage: 10,
  sortBy: 'newest',
  filters: {
    favorite: false,
    review: false,
    hot: false
  }
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    loadQuestions: (state) => {
      state.loading = true;
      try {
        const saved = localStorage.getItem('interviewQuestions');
        if (saved) {
          state.items = JSON.parse(saved);
        }
        state.filteredItems = state.items;
      } catch (error) {
        console.error('Error loading questions:', error);
      }
      state.loading = false;
    },
    saveQuestions: (state, action) => {
      try {
        localStorage.setItem('interviewQuestions', JSON.stringify(action.payload));
      } catch (error) {
        console.error('Error saving questions:', error);
      }
    },
    addQuestion: (state, action) => {
      const newQuestion = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        favorite: false,
        review: false,
        hot: false
      };
      state.items.unshift(newQuestion);
      questionsSlice.caseReducers.applyFilters(state);
    },
    updateQuestion: (state, action) => {
      const index = state.items.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        questionsSlice.caseReducers.applyFilters(state);
      }
    },
    deleteQuestion: (state, action) => {
      state.items = state.items.filter(q => q.id !== action.payload);
      questionsSlice.caseReducers.applyFilters(state);
    },
    setCurrentRound: (state, action) => {
      state.currentRound = action.payload;
      state.currentPage = 1;
      questionsSlice.caseReducers.applyFilters(state);
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
      questionsSlice.caseReducers.applyFilters(state);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setQuestionsPerPage: (state, action) => {
      state.questionsPerPage = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      questionsSlice.caseReducers.applyFilters(state);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
      questionsSlice.caseReducers.applyFilters(state);
    },
    applyFilters: (state) => {
      let filtered = [...state.items];
      
      // Round filter
      if (state.currentRound !== 'all') {
        filtered = filtered.filter(q => q.round === state.currentRound);
      }
      
      // Search filter
      if (state.searchTerm) {
        const term = state.searchTerm.toLowerCase();
        filtered = filtered.filter(q => 
          q.question.toLowerCase().includes(term) ||
          q.answer.toLowerCase().includes(term) ||
          q.tags.some(tag => tag.toLowerCase().includes(term))
        );
      }
      
      // Status filters
      if (state.filters.favorite) {
        filtered = filtered.filter(q => q.favorite);
      }
      if (state.filters.review) {
        filtered = filtered.filter(q => q.review);
      }
      if (state.filters.hot) {
        filtered = filtered.filter(q => q.hot);
      }
      
      // Sort
      filtered.sort((a, b) => {
        switch (state.sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'alphabetical':
            return a.question.localeCompare(b.question);
          default:
            return 0;
        }
      });
      
      state.filteredItems = filtered;
    }
  }
});

export const {
  loadQuestions,
  saveQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  setCurrentRound,
  setSearchTerm,
  setCurrentPage,
  setQuestionsPerPage,
  setSortBy,
  setFilters,
  applyFilters
} = questionsSlice.actions;

export default questionsSlice.reducer;
