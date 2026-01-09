import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage, setQuestionsPerPage } from '../../store/slices/questionsSlice.js';

const PaginationControls = ({ pagination, onPageChange }) => {
  const dispatch = useDispatch();
  const { questionsPerPage } = useSelector((state) => state.questions);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    if (onPageChange) {
      onPageChange(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuestionsPerPageChange = (event) => {
    dispatch(setQuestionsPerPage(parseInt(event.target.value)));
  };

  if (!pagination || pagination.totalQuestions === 0) return null;

  const { currentPage, totalPages, totalQuestions, hasNext, hasPrev } = pagination;

  // Generate page numbers for pagination - simplified on mobile
  const getPageNumbers = (isMobile = false) => {
    const pages = [];
    const maxPagesToShow = isMobile ? 3 : 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfMax = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(1, currentPage - halfMax);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * questionsPerPage + 1;
  const endItem = Math.min(currentPage * questionsPerPage, totalQuestions);

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
      {/* Results info */}
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        Showing {startItem} to {endItem} of {totalQuestions} questions
      </div>

      {/* Per page selector and Pagination - stacked on mobile */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
        {/* Per page selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="perPage" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Show:
          </label>
          <select
            id="perPage"
            value={questionsPerPage}
            onChange={handleQuestionsPerPageChange}
            className="px-2 sm:px-3 py-1.5 sm:py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[36px] sm:min-h-0"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">per page</span>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrev}
              className="px-3 sm:px-3 py-2 sm:py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[36px] sm:min-h-0 min-w-[44px] sm:min-w-0"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">‹</span>
            </button>

            {/* Page numbers - Desktop */}
            <div className="hidden sm:flex items-center gap-1">
              {getPageNumbers(false).map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-2 py-1 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm border rounded transition-colors ${page === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Page numbers - Mobile (simplified) */}
            <div className="flex sm:hidden items-center gap-1">
              {getPageNumbers(true).map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-1 text-gray-500 text-xs">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[36px] min-h-[36px] text-xs border rounded transition-colors ${page === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className="px-3 sm:px-3 py-2 sm:py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[36px] sm:min-h-0 min-w-[44px] sm:min-w-0"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">›</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginationControls;
