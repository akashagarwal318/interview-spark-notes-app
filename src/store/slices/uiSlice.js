
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',
    isFormVisible: false,
    expandedQuestions: new Set(),
    editingQuestions: new Set(),
    imageModal: {
      isOpen: false,
      imageSrc: ''
    }
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('interviewAssistantTheme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('interviewAssistantTheme', state.theme);
    },
    setFormVisible: (state, action) => {
      state.isFormVisible = action.payload;
    },
    toggleQuestionExpanded: (state, action) => {
      const id = action.payload;
      if (state.expandedQuestions.has(id)) {
        state.expandedQuestions.delete(id);
      } else {
        state.expandedQuestions.add(id);
      }
    },
    toggleQuestionEdit: (state, action) => {
      const id = action.payload;
      if (state.editingQuestions.has(id)) {
        state.editingQuestions.delete(id);
      } else {
        state.editingQuestions.add(id);
      }
    },
    setImageModal: (state, action) => {
      state.imageModal = action.payload;
    },
    clearExpandedQuestions: (state) => {
      state.expandedQuestions = new Set();
    },
    clearEditingQuestions: (state) => {
      state.editingQuestions = new Set();
    }
  }
});

export const {
  setTheme,
  toggleTheme,
  setFormVisible,
  toggleQuestionExpanded,
  toggleQuestionEdit,
  setImageModal,
  clearExpandedQuestions,
  clearEditingQuestions
} = uiSlice.actions;

export default uiSlice.reducer;
