
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
      color: 'text-blue-600',
      icon: '📊',
      filterType: 'total'
    },
    { 
      label: 'Favorites', 
      value: stats.favorites, 
      color: 'text-yellow-600',
      icon: '⭐',
      filterType: 'favorites'
    },
    { 
      label: 'Review', 
      value: stats.review, 
      color: 'text-green-600',
      icon: '📌',
      filterType: 'review'
    },
    { 
      label: 'Hot List', 
      value: stats.hot, 
      color: 'text-red-600',
      icon: '🔥',
      filterType: 'hot'
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105"
          onClick={() => handleStatClick(item.filterType)}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className={`text-3xl font-bold ${item.color} mb-1`}>
              {item.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
