
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchQuestions, 
  setOnlineStatus,
  setCurrentPage
} from '../store/slices/questionsSlice.js';
import { setTheme } from '../store/slices/uiSlice.js';
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
    items,
    pagination,
    loading,
    error,
    currentRound,
    searchTerm,
    questionsPerPage,
    sortBy,
    filters,
    selectedTags,
    isOnline
  } = useSelector((state) => state.questions);

  // Initialize data and theme
  useEffect(() => {
    // Set online status
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('interviewAssistantTheme') || 'light';
    dispatch(setTheme(savedTheme));
    
    // Initial data fetch
    fetchQuestionsData();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  // Fetch questions when filters change
  useEffect(() => {
    fetchQuestionsData();
  }, [
    pagination.currentPage,
    questionsPerPage,
    currentRound,
    searchTerm,
    sortBy,
    filters,
    selectedTags
  ]);

  const fetchQuestionsData = () => {
    const params = {
      page: pagination.currentPage,
      limit: questionsPerPage,
      round: currentRound,
      search: searchTerm,
      sortBy,
      ...filters,
      tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined
    };

    // Clean up undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '' || params[key] === 'all') {
        delete params[key];
      }
    });

    dispatch(fetchQuestions(params));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  // Loading state
  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
          {!isOnline && (
            <p className="text-sm text-yellow-600 mt-2">
              You're currently offline. Some features may be limited.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">📡</div>
          <h3 className="text-lg font-medium text-card-foreground mb-2">Connection Error</h3>
          <p className="text-muted-foreground mb-4">
            Unable to connect to the server. Please check your internet connection and try again.
          </p>
          <button
            onClick={fetchQuestionsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Offline indicator */}
        {!isOnline && (
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-yellow-600 dark:text-yellow-400 mr-3">⚠️</div>
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">You're offline</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Some features may be limited. Changes will be synced when you're back online.
                </p>
              </div>
            </div>
          </div>
        )}

        <QuickStats />
        <SearchFilters />

        {/* Error message */}
        {error && isOnline && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 dark:text-red-400 mr-3">❌</div>
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Error</h4>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          {items.length === 0 && !loading ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-card-foreground mb-2">No questions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || currentRound !== 'all' || filters.favorite || filters.review || filters.hot ? (
                  'Try adjusting your search terms or filters.'
                ) : (
                  'Add your first question to get started.'
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(question => (
                <QuestionCard key={question._id || question.id} question={question} />
              ))}
              
              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              )}
            </div>
          )}
        </div>

        <PaginationControls 
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      <QuestionForm />
      <ImageModal />
    </div>
  );
};

export default InterviewAssistant;
