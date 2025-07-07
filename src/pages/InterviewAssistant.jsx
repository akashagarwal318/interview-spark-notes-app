
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadQuestions, saveQuestions } from '../store/slices/questionsSlice';
import { setTheme } from '../store/slices/uiSlice';
import Header from '../components/layout/Header.jsx';
import QuickStats from '../components/stats/QuickStats.jsx';
import SearchFilters from '../components/filters/SearchFilters.jsx';
import QuestionForm from '../components/forms/QuestionForm.jsx';
import QuestionCard from '../components/questions/QuestionCard.jsx';
import ImageModal from '../components/modals/ImageModal.jsx';
import PaginationControls from '../components/pagination/PaginationControls.jsx';

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
  }, [items, dispatch]);

  // Pagination
  const paginatedQuestions = filteredItems.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <QuickStats />
        <SearchFilters />

        <div className="mb-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-card-foreground mb-2">No questions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or add a new question to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedQuestions.map(question => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          )}
        </div>

        <PaginationControls />
      </div>

      <QuestionForm />
      <ImageModal />
    </div>
  );
};

export default InterviewAssistant;
