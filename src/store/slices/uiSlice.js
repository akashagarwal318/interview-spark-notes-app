
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  isFormVisible: false,
  editingQuestion: null,
  imageModal: {
    isOpen: false,
    imageSrc: ''
  },
  expandedQuestionId: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
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
      if (!action.payload) {
        state.editingQuestion = null;
      }
    },
    setEditingQuestion: (state, action) => {
      state.editingQuestion = action.payload;
      state.isFormVisible = true;
    },
    setImageModal: (state, action) => {
      state.imageModal = action.payload;
    },
    setExpandedQuestionId: (state, action) => {
      state.expandedQuestionId = action.payload;
    },
    collapseAllQuestions: (state) => {
      state.expandedQuestionId = null;
    }
  }
});

export const {
  setTheme,
  toggleTheme,
  setFormVisible,
  setEditingQuestion,
  setImageModal,
  setExpandedQuestionId,
  collapseAllQuestions
} = uiSlice.actions;

export default uiSlice.reducer;
