
import { configureStore } from '@reduxjs/toolkit';
import questionsReducer from './slices/questionsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
