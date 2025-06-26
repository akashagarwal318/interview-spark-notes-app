
import React from 'react';

interface SearchFiltersProps {
  searchTerm: string;
  searchType: string;
  currentRound: string;
  activeTagFilter: string | null;
  activeStatusFilter: string;
  tags: string[];
  onSearchChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
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
  const rounds = [
    { id: 'technical', label: 'Technical' },
    { id: 'hr', label: 'HR Round' },
    { id: 'telephonic', label: 'Telephonic' },
    { id: 'introduction', label: 'Introduction' }
  ];

  const statusFilters = [
    { id: 'all', label: 'All', color: 'bg-gray-500' },
    { id: 'favorite', label: '⭐ Favorites', color: 'bg-yellow-500' },
    { id: 'review', label: '📌 Review', color: 'bg-green-500' },
    { id: 'hot', label: '🔥 Hot List', color: 'bg-red-500' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 shadow-sm">
      {/* Search Controls */}
      <div className="flex gap-4 flex-wrap items-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search your questions..."
        />
        <select
          value={searchType}
          onChange={(e) => onSearchTypeChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[150px]"
        >
          <option value="question">Search in Questions</option>
          <option value="answer">Search in Answers</option>
          <option value="code">Search in Code</option>
          <option value="tags">Search in Tags</option>
        </select>
      </div>

      {/* Round Selector */}
      <div className="flex gap-3 flex-wrap mb-4">
        {rounds.map(round => (
          <button
            key={round.id}
            onClick={() => onRoundChange(round.id)}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
              currentRound === round.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            {round.label}
          </button>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex gap-3 flex-wrap mb-4">
        {statusFilters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onStatusFilter(filter.id)}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
              activeStatusFilter === filter.id
                ? `${filter.color} text-white border-transparent`
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Tag Filters */}
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onTagFilter(null)}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              !activeTagFilter
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            All Tags
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagFilter(tag)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                activeTagFilter === tag
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
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
