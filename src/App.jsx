import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { store } from './store';
import { lightTheme, darkTheme } from './theme/theme';
import InterviewAssistant from './pages/InterviewAssistant.jsx';

const AppContent = () => {
  const { theme } = useSelector((state) => state.ui);
  
  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<InterviewAssistant />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
