
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { store } from './store/index.js';
import InterviewAssistant from './pages/InterviewAssistant.jsx';

const AppContent = () => {
  const { theme } = useSelector((state) => state.ui);
  
  useEffect(() => {
    // Apply theme to document root
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InterviewAssistant />} />
      </Routes>
    </Router>
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
