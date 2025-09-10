import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, resetFilters, selectQuestionStats } from '../../store/slices/questionsSlice.js';
import StatsService from '../../services/statsService.js';

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
      <div className="flex flex-row gap-4 mb-4 w-full justify-center">
        <div 
          style={{ width: '9rem' }}
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          onClick={() => handleStatClick('total')}
        >
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Total Questions</div>
        </div>
        
        <div 
          style={{ width: '9rem' }}
          className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          onClick={() => handleStatClick('favorites')}
        >
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.favorites}</div>
          <div className="text-sm text-yellow-700 dark:text-yellow-300">⭐ Favorites</div>
        </div>
        
        <div 
          style={{ width: '9rem' }}
          className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          onClick={() => handleStatClick('review')}
        >
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.review}</div>
          <div className="text-sm text-green-700 dark:text-green-300">📌 Review</div>
        </div>
        
        <div 
          style={{ width: '9rem' }}
          className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          onClick={() => handleStatClick('hot')}
        >
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.hot}</div>
          <div className="text-sm text-red-700 dark:text-red-300">🔥 Hot</div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
