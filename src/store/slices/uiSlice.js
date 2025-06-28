
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  isFormVisible: false,
  editingQuestion: null,
  imageModal: {
    isOpen: false,
    imageSrc: ''
  }
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
    }
  }
});

export const {
  setTheme,
  toggleTheme,
  setFormVisible,
  setEditingQuestion,
  setImageModal
} = uiSlice.actions;

export default uiSlice.reducer;
