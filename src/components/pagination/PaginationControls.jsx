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

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      const halfMax = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(1, currentPage - halfMax);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Adjust if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      // Add first page and ellipsis if needed
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis and last page if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * questionsPerPage + 1;
  const endItem = Math.min(currentPage * questionsPerPage, totalQuestions);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
      {/* Results info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {startItem} to {endItem} of {totalQuestions} questions
      </div>

      {/* Per page selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="perPage" className="text-sm text-gray-600 dark:text-gray-400">
          Show:
        </label>
        <select
          id="perPage"
          value={questionsPerPage}
          onChange={handleQuestionsPerPageChange}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-sm text-gray-600 dark:text-gray-400">per page</span>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded transition-colors ${
                      page === currentPage
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

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNext}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;
