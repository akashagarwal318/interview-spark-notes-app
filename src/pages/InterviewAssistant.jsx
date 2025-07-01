
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6 shadow-lg"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-25 to-pink-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <QuickStats />
        <SearchFilters />

        <div className="mb-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl border-2 border-slate-200 dark:border-gray-700 shadow-xl">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">No questions found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Try adjusting your search terms or add a new question to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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
