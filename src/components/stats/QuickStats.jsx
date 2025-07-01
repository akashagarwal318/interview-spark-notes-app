
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

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <div 
        className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-blue-400"
        onClick={() => handleStatClick('total')}
      >
        <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
          <div className="text-sm text-blue-100 font-medium">Total Questions</div>
        </div>
        <div className="absolute top-2 right-2 w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
      </div>
      
      <div 
        className="relative bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-xl cursor-pointer hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-amber-400"
        onClick={() => handleStatClick('favorites')}
      >
        <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="text-3xl font-bold text-white mb-1">{stats.favorites}</div>
          <div className="text-sm text-amber-100 font-medium">Favourites</div>
        </div>
        <div className="absolute top-2 right-2 w-3 h-3 bg-amber-300 rounded-full animate-pulse"></div>
      </div>
      
      <div 
        className="relative bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-xl cursor-pointer hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-emerald-400"
        onClick={() => handleStatClick('review')}
      >
        <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="text-3xl font-bold text-white mb-1">{stats.review}</div>
          <div className="text-sm text-emerald-100 font-medium">For Review</div>
        </div>
        <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-300 rounded-full animate-pulse"></div>
      </div>
      
      <div 
        className="relative bg-gradient-to-br from-rose-500 to-red-600 p-6 rounded-xl cursor-pointer hover:from-rose-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-rose-400"
        onClick={() => handleStatClick('hot')}
      >
        <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="text-3xl font-bold text-white mb-1">{stats.hot}</div>
          <div className="text-sm text-rose-100 font-medium">Hot List</div>
        </div>
        <div className="absolute top-2 right-2 w-3 h-3 bg-rose-300 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default QuickStats;
