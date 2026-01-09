import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, resetFilters, selectQuestionStats } from '../../store/slices/questionsSlice.js';

const QuickStats = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectQuestionStats);

  const handleStatClick = (filterType) => {
    if (filterType === 'total') {
      dispatch(resetFilters());
    } else {
      dispatch(resetFilters());
      const filterMap = {
        favorites: 'favorite',
        review: 'review',
        hot: 'hot'
      };
      dispatch(setFilters({ [filterMap[filterType]]: true }));
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-2 sm:mb-4 w-full max-w-xl sm:max-w-none px-2 sm:px-0">
        <div
          className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-center"
          onClick={() => handleStatClick('total')}
        >
          <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
          <div className="text-[10px] sm:text-sm text-blue-700 dark:text-blue-300 leading-tight">Total</div>
        </div>

        <div
          className="bg-yellow-50 dark:bg-yellow-900/20 p-2 sm:p-3 rounded-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors text-center"
          onClick={() => handleStatClick('favorites')}
        >
          <div className="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.favorites}</div>
          <div className="text-[10px] sm:text-sm text-yellow-700 dark:text-yellow-300 leading-tight">⭐ Favorites</div>
        </div>

        <div
          className="bg-green-50 dark:bg-green-900/20 p-2 sm:p-3 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-center"
          onClick={() => handleStatClick('review')}
        >
          <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{stats.review}</div>
          <div className="text-[10px] sm:text-sm text-green-700 dark:text-green-300 leading-tight">📌 Review</div>
        </div>

        <div
          className="bg-red-50 dark:bg-red-900/20 p-2 sm:p-3 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-center"
          onClick={() => handleStatClick('hot')}
        >
          <div className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">{stats.hot}</div>
          <div className="text-[10px] sm:text-sm text-red-700 dark:text-red-300 leading-tight">🔥 Hot</div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
