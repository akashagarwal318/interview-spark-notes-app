
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
