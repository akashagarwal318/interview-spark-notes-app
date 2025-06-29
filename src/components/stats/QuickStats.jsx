
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, resetFilters } from '../../store/slices/questionsSlice';

const QuickStats = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.questions);

  const stats = {
    total: items.length,
    favorites: items.filter(q => q.favorite).length,
    review: items.filter(q => q.review).length,
    hot: items.filter(q => q.hot).length
  };

  const handleStatClick = (filterType) => {
    if (filterType === 'total') {
      dispatch(resetFilters());
    } else {
      dispatch(resetFilters());
      dispatch(setFilters({ [filterType === 'favorites' ? 'favorite' : filterType]: true }));
    }
  };

  const statItems = [
    { 
      label: 'Total Questions', 
      value: stats.total, 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      filterType: 'total'
    },
    { 
      label: '⭐ Favorites', 
      value: stats.favorites, 
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      filterType: 'favorites'
    },
    { 
      label: '📌 Review', 
      value: stats.review, 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      filterType: 'review'
    },
    { 
      label: '🔥 Hot List', 
      value: stats.hot, 
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      filterType: 'hot'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className={`${item.bgColor} rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md border border-gray-100 dark:border-gray-700`}
          onClick={() => handleStatClick(item.filterType)}
        >
          <div className="text-center">
            <div className={`text-3xl font-bold ${item.color} mb-1`}>
              {item.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
