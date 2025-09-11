
import React, { useEffect, useMemo, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchQuestions, 
  fetchRounds,
  setOnlineStatus,
  setCurrentPage,
  selectFilteredQuestions
} from '../store/slices/questionsSlice.js';
import { setTheme, collapseAllQuestions } from '../store/slices/uiSlice.js';
import { useDebounce } from '../hooks/useDebounce.js';
import Header from '../components/layout/Header.jsx';
const QuickStats = lazy(() => import('../components/stats/QuickStats.jsx'));
const SearchFilters = lazy(() => import('../components/filters/SearchFilters.jsx'));
const QuestionForm = lazy(() => import('../components/forms/QuestionForm.jsx'));
const QuestionCard = lazy(() => import('../components/questions/QuestionCard.jsx'));
const ImageModal = lazy(() => import('../components/modals/ImageModal.jsx'));
const PaginationControls = lazy(() => import('../components/pagination/PaginationControls.jsx'));

const InterviewAssistant = () => {
  const dispatch = useDispatch();
  const { 
    items,
    pagination,
    loading,
    error,
    currentRound,
    searchTerm,
    searchScope,
    questionsPerPage,
    filters,
    selectedTags,
    isOnline
  } = useSelector((state) => state.questions);
  const { expandedQuestionId } = useSelector(state => state.ui);
  
  // Get filtered questions using selector
  const filteredItems = useSelector(selectFilteredQuestions);
  
  // Debounce search term to avoid excessive re-renders, but API calls are not triggered by it.
  const debouncedSearchTerm = useDebounce(searchTerm, 50);

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
  dispatch(fetchRounds());
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  // Auto-collapse expanded question when contextual filters change
  useEffect(() => {
    if (expandedQuestionId) {
      dispatch(collapseAllQuestions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, searchTerm, searchScope, filters.favorite, filters.review, filters.hot, selectedTags, pagination.currentPage, questionsPerPage]);

  // Collapse on outside click or Escape key
  useEffect(() => {
    if (!expandedQuestionId) return;

    const handleClick = (e) => {
      // Ignore clicks inside fullscreen code modal
      if (e.target.closest('[data-code-fullscreen]')) return;
      const card = e.target.closest('[data-question-card]');
      if (!card || card.getAttribute('data-expanded') !== 'true') {
        dispatch(collapseAllQuestions());
      }
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        dispatch(collapseAllQuestions());
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [expandedQuestionId, dispatch]);

  const fetchQuestionsData = () => {
    // Fetch all questions for client-side filtering.
    // The 'search' parameter is removed to prevent API-side filtering conflicts.
    const params = {
      page: 1,
      limit: 1000 // Fetch a large set for client-side filtering
    };

    dispatch(fetchQuestions(params));
  };

  // Compute paginated items from filtered results
  const paginatedItems = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, pagination.currentPage, questionsPerPage]);

  // Compute pagination info for filtered results
  const paginationInfo = useMemo(() => {
    const totalFiltered = filteredItems.length;
    const totalPages = Math.ceil(totalFiltered / questionsPerPage);
    return {
      currentPage: pagination.currentPage,
      totalPages,
      totalQuestions: totalFiltered,
      hasNext: pagination.currentPage < totalPages,
      hasPrev: pagination.currentPage > 1
    };
  }, [filteredItems.length, pagination.currentPage, questionsPerPage]);

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

        <Suspense fallback={<div className="text-sm text-muted-foreground mb-4">Loading UI...</div>}>
          <QuickStats />
          <SearchFilters />
        </Suspense>

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
          {paginatedItems.length === 0 && !loading ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-card-foreground mb-2">No questions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || currentRound !== 'all' || filters.favorite || filters.review || filters.hot || selectedTags.length > 0 ? (
                  'Try adjusting your search terms or filters.'
                ) : (
                  'Add your first question to get started.'
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Suspense fallback={<div className="text-sm text-muted-foreground">Loading questions...</div>}>
                {paginatedItems.map(question => (
                  <QuestionCard key={question._id || question.id} question={question} />
                ))}
              </Suspense>
              
              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              )}
            </div>
          )}
        </div>

        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading pagination...</div>}>
          <PaginationControls 
            pagination={paginationInfo}
            onPageChange={handlePageChange}
          />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <QuestionForm />
        <ImageModal />
      </Suspense>
    </div>
  );
};

export default InterviewAssistant;
