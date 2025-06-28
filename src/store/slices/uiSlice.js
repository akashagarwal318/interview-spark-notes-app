
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  isFormVisible: false,
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
    },
    setImageModal: (state, action) => {
      state.imageModal = action.payload;
    },
    resetFilters: (state) => {
      // This will be handled by questionsSlice
    }
  }
});

export const {
  setTheme,
  toggleTheme,
  setFormVisible,
  setImageModal,
  resetFilters
} = uiSlice.actions;

export default uiSlice.reducer;
