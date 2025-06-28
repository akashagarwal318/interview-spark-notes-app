
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Default questions data
const defaultQuestions = [
  {
    id: 1,
    round: 'technical',
    question: 'What is the difference between let, const, and var in JavaScript?',
    answer: 'let and const are block-scoped, while var is function-scoped. const cannot be reassigned after declaration, while let and var can be. let and const are not hoisted in the same way as var.',
    code: `// var - function scoped, hoisted\nvar x = 1;\nif (true) {\n  var x = 2; // same variable\n}\nconsole.log(x); // 2\n\n// let - block scoped\nlet y = 1;\nif (true) {\n  let y = 2; // different variable\n}\nconsole.log(y); // 1\n\n// const - block scoped, cannot be reassigned\nconst z = 1;\n// z = 2; // Error!`,
    tags: ['JavaScript', 'Variables', 'ES6'],
    favorite: false,
    review: true,
    hot: false,
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    round: 'technical',
    question: 'Explain closures in JavaScript with an example.',
    answer: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. This allows for data privacy and function factories.',
    code: `function outerFunction(x) {\n  // This is the outer function's scope\n  \n  function innerFunction(y) {\n    // This inner function has access to x\n    console.log(x + y);\n  }\n  \n  return innerFunction;\n}\n\nconst myClosure = outerFunction(10);\nmyClosure(5); // Outputs: 15`,
    tags: ['JavaScript', 'Closures', 'Scope'],
    favorite: true,
    review: false,
    hot: true,
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Async thunks for localStorage operations
export const loadQuestions = createAsyncThunk(
  'questions/loadQuestions',
  async () => {
    try {
      const stored = localStorage.getItem('interviewQuestions');
      if (stored) {
        return JSON.parse(stored);
      }
      return defaultQuestions;
    } catch (error) {
      console.error('Error loading questions:', error);
      return defaultQuestions;
    }
  }
);

export const saveQuestions = createAsyncThunk(
  'questions/saveQuestions',
  async (questions) => {
    try {
      localStorage.setItem('interviewQuestions', JSON.stringify(questions));
      return questions;
    } catch (error) {
      console.error('Error saving questions:', error);
      throw error;
    }
  }
);

const questionsSlice = createSlice({
  name: 'questions',
  initialState: {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    searchTerm: '',
    searchType: 'question',
    currentRound: 'all',
    activeTagFilter: null,
    activeStatusFilter: 'all',
    currentPage: 1,
    questionsPerPage: 10,
  },
  reducers: {
    addQuestion: (state, action) => {
      const newQuestion = {
        id: Date.now(),
        ...action.payload,
        favorite: false,
        review: false,
        hot: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.items.unshift(newQuestion);
      state.filteredItems = state.items;
    },
    updateQuestion: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex(q => q.id === id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },
    deleteQuestion: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(q => q.id !== id);
      state.filteredItems = state.items;
    },
    duplicateQuestion: (state, action) => {
      const id = action.payload;
      const question = state.items.find(q => q.id === id);
      if (question) {
        const duplicated = {
          ...question,
          id: Date.now(),
          question: `${question.question} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        state.items.unshift(duplicated);
        state.filteredItems = state.items;
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
    },
    setCurrentRound: (state, action) => {
      state.currentRound = action.payload;
      state.currentPage = 1;
    },
    setActiveTagFilter: (state, action) => {
      state.activeTagFilter = action.payload;
    },
    setActiveStatusFilter: (state, action) => {
      state.activeStatusFilter = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setQuestionsPerPage: (state, action) => {
      state.questionsPerPage = action.payload;
      state.currentPage = 1;
    },
    applyFilters: (state) => {
      let filtered = state.currentRound === 'all' 
        ? state.items 
        : state.items.filter(q => q.round === state.currentRound);

      if (state.activeStatusFilter !== 'all') {
        filtered = filtered.filter(q => q[state.activeStatusFilter] === true);
      }

      if (state.activeTagFilter) {
        filtered = filtered.filter(q => q.tags?.includes(state.activeTagFilter));
      }

      if (state.searchTerm) {
        filtered = filtered.filter(q => {
          switch (state.searchType) {
            case 'question':
              return q.question.toLowerCase().includes(state.searchTerm.toLowerCase());
            case 'answer':
              return q.answer.toLowerCase().includes(state.searchTerm.toLowerCase());
            case 'code':
              return q.code?.toLowerCase().includes(state.searchTerm.toLowerCase());
            case 'tags':
              return q.tags?.some(tag => tag.toLowerCase().includes(state.searchTerm.toLowerCase()));
            default:
              return false;
          }
        });
      }

      state.filteredItems = filtered;
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.searchTerm = '';
      state.activeTagFilter = null;
      state.activeStatusFilter = 'all';
      state.currentRound = 'all';
      state.filteredItems = state.items;
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(loadQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveQuestions.fulfilled, (state, action) => {
        // Questions saved successfully
      })
      .addCase(saveQuestions.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  setSearchTerm,
  setSearchType,
  setCurrentRound,
  setActiveTagFilter,
  setActiveStatusFilter,
  setCurrentPage,
  setQuestionsPerPage,
  applyFilters,
  resetFilters
} = questionsSlice.actions;

export default questionsSlice.reducer;
