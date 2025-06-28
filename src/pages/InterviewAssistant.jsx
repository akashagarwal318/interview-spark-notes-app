
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box } from '@mui/material';
import { loadQuestions, saveQuestions } from '../store/slices/questionsSlice';
import { setTheme } from '../store/slices/uiSlice';
import Header from '../components/layout/Header.jsx';
import QuickStats from '../components/stats/QuickStats.jsx';
import SearchFilters from '../components/filters/SearchFilters.jsx';
import QuestionForm from '../components/forms/QuestionForm';
import QuestionCard from '../components/questions/QuestionCard';
import ImageModal from '../components/modals/ImageModal';
import PaginationControls from '../components/pagination/PaginationControls';

const InterviewAssistant = () => {
  const dispatch = useDispatch();
  const { 
    filteredItems, 
    currentPage, 
    questionsPerPage, 
    loading,
    items 
  } = useSelector((state) => state.questions);

  // Initialize data and theme
  useEffect(() => {
    dispatch(loadQuestions());
    
    const savedTheme = localStorage.getItem('interviewAssistantTheme') || 'light';
    dispatch(setTheme(savedTheme));
  }, [dispatch]);

  // Save questions whenever they change
  useEffect(() => {
    if (items.length > 0) {
      dispatch(saveQuestions(items));
    }
  }, [filteredItems, dispatch, items]);

  // Pagination
  const paginatedQuestions = filteredItems.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Header />
      <QuickStats />
      <SearchFilters />
      <QuestionForm />

      <Box sx={{ mb: 4 }}>
        {filteredItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h3" sx={{ fontSize: '4rem', mb: 2, opacity: 0.5 }}>
              🔍
            </Typography>
            <Typography variant="h5" gutterBottom>
              No questions found
            </Typography>
            <Typography color="text.secondary">
              Try adjusting your search terms or add a new question.
            </Typography>
          </Box>
        ) : (
          paginatedQuestions.map(question => (
            <QuestionCard key={question.id} question={question} />
          ))
        )}
      </Box>

      <PaginationControls />
      <ImageModal />
    </Container>
  );
};

export default InterviewAssistant;
