
import React from 'react';

interface Stats {
  total: number;
  favorites: number;
  review: number;
  hot: number;
}

interface QuickStatsProps {
  stats: Stats;
}

const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  return (
    <div className="flex gap-4 mb-6 flex-wrap justify-center md:justify-start">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center min-w-[120px] shadow-sm">
        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-xs text-gray-500 mt-1">Total Questions</div>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center min-w-[120px] shadow-sm">
        <div className="text-2xl font-bold text-yellow-600">{stats.favorites}</div>
        <div className="text-xs text-gray-500 mt-1">⭐ Favorites</div>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center min-w-[120px] shadow-sm">
        <div className="text-2xl font-bold text-green-600">{stats.review}</div>
        <div className="text-xs text-gray-500 mt-1">📌 Review</div>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center min-w-[120px] shadow-sm">
        <div className="text-2xl font-bold text-red-600">{stats.hot}</div>
        <div className="text-xs text-gray-500 mt-1">🔥 Hot List</div>
      </div>
    </div>
  );
};

export default QuickStats;
