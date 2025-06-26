
import React from 'react';

interface SearchFiltersProps {
  searchTerm: string;
  searchType: string;
  currentRound: string;
  activeTagFilter: string | null;
  activeStatusFilter: string;
  tags: string[];
  onSearchChange: (term: string) => void;
  onSearchTypeChange: (type: string) => void;
  onRoundChange: (round: string) => void;
  onTagFilter: (tag: string | null) => void;
  onStatusFilter: (status: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  searchType,
  currentRound,
  activeTagFilter,
  activeStatusFilter,
  tags,
  onSearchChange,
  onSearchTypeChange,
  onRoundChange,
  onTagFilter,
  onStatusFilter
}) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search your questions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={searchType}
          onChange={(e) => onSearchTypeChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="question">Search in Questions</option>
          <option value="answer">Search in Answers</option>
          <option value="code">Search in Code</option>
          <option value="tags">Search in Tags</option>
        </select>
      </div>

      {/* Round Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onRoundChange('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentRound === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
          }`}
        >
          🌟 All Rounds
        </button>
        <button
          onClick={() => onRoundChange('technical')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentRound === 'technical'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900'
          }`}
        >
          Technical
        </button>
        <button
          onClick={() => onRoundChange('hr')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentRound === 'hr'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900'
          }`}
        >
          HR Round
        </button>
        <button
          onClick={() => onRoundChange('telephonic')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentRound === 'telephonic'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-900'
          }`}
        >
          Telephonic
        </button>
        <button
          onClick={() => onRoundChange('introduction')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentRound === 'introduction'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
          }`}
        >
          Introduction
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onStatusFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeStatusFilter === 'all'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onStatusFilter('favorite')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeStatusFilter === 'favorite'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-900'
          }`}
        >
          ⭐ Favorites
        </button>
        <button
          onClick={() => onStatusFilter('review')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeStatusFilter === 'review'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900'
          }`}
        >
          📌 Review
        </button>
        <button
          onClick={() => onStatusFilter('hot')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeStatusFilter === 'hot'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900'
          }`}
        >
          🔥 Hot List
        </button>
      </div>

      {/* Tag Filters */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTagFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !activeTagFilter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900'
            }`}
          >
            All Tags
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagFilter(tag === activeTagFilter ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeTagFilter === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
