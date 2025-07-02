
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
        className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 rounded-2xl cursor-pointer hover:from-blue-600 hover:via-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl border-2 border-blue-400 hover:border-blue-300 group"
        onClick={() => handleStatClick('total')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-sm"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg animate-pulse group-hover:scale-110 transition-transform duration-300"></div>
        <div className="relative z-10">
          <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{stats.total}</div>
          <div className="text-sm text-blue-100 font-semibold tracking-wide uppercase">Total Questions</div>
        </div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-blue-300 rounded-full animate-bounce opacity-60"></div>
      </div>
      
      <div 
        className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 p-6 rounded-2xl cursor-pointer hover:from-amber-600 hover:via-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl border-2 border-amber-400 hover:border-amber-300 group"
        onClick={() => handleStatClick('favorites')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-sm"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg animate-pulse group-hover:scale-110 transition-transform duration-300"></div>
        <div className="relative z-10">
          <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{stats.favorites}</div>
          <div className="text-sm text-amber-100 font-semibold tracking-wide uppercase">Favourites</div>
        </div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-amber-300 rounded-full animate-bounce opacity-60"></div>
      </div>
      
      <div 
        className="relative bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 p-6 rounded-2xl cursor-pointer hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl border-2 border-emerald-400 hover:border-emerald-300 group"
        onClick={() => handleStatClick('review')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-sm"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full shadow-lg animate-pulse group-hover:scale-110 transition-transform duration-300"></div>
        <div className="relative z-10">
          <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{stats.review}</div>
          <div className="text-sm text-emerald-100 font-semibold tracking-wide uppercase">For Review</div>
        </div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-emerald-300 rounded-full animate-bounce opacity-60"></div>
      </div>
      
      <div 
        className="relative bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 p-6 rounded-2xl cursor-pointer hover:from-rose-600 hover:via-pink-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl border-2 border-rose-400 hover:border-rose-300 group"
        onClick={() => handleStatClick('hot')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-sm"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full shadow-lg animate-pulse group-hover:scale-110 transition-transform duration-300"></div>
        <div className="relative z-10">
          <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{stats.hot}</div>
          <div className="text-sm text-rose-100 font-semibold tracking-wide uppercase">Hot List</div>
        </div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-rose-300 rounded-full animate-bounce opacity-60"></div>
      </div>
    </div>
  );
};

export default QuickStats;
