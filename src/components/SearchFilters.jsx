
import React from 'react';
import { Search, Filter, Tag, X } from 'lucide-react';

const SearchFilters = ({
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
    { value: 'all', label: 'All Rounds', color: 'bg-gray-500' },
    { value: 'technical', label: 'Technical', color: 'bg-blue-500' },
    { value: 'hr', label: 'HR', color: 'bg-green-500' },
    { value: 'telephonic', label: 'Telephonic', color: 'bg-purple-500' },
    { value: 'introduction', label: 'Introduction', color: 'bg-yellow-500' },
    { value: 'behavioral', label: 'Behavioral', color: 'bg-pink-500' },
    { value: 'system-design', label: 'System Design', color: 'bg-red-500' },
    { value: 'coding', label: 'Coding', color: 'bg-indigo-500' }
  ];

  const searchTypes = [
    { value: 'question', label: 'Question' },
    { value: 'answer', label: 'Answer' },
    { value: 'code', label: 'Code' },
    { value: 'tags', label: 'Tags' }
  ];

  const statusFilters = [
    { value: 'all', label: 'All Questions', icon: '📋' },
    { value: 'favorite', label: 'Favorites', icon: '⭐' },
    { value: 'review', label: 'Review', icon: '📌' },
    { value: 'hot', label: 'Hot List', icon: '🔥' }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search by ${searchType}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={searchType}
          onChange={(e) => onSearchTypeChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          {searchTypes.map(type => (
            <option key={type.value} value={type.value}>
              Search {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Round Filters */}
      <div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Interview Rounds
        </div>
        <div className="flex flex-wrap gap-2">
          {rounds.map(round => (
            <button
              key={round.value}
              onClick={() => onRoundChange(round.value)}
              className={`px-3 py-2 text-sm rounded-full transition-all ${
                currentRound === round.value
                  ? `${round.color} text-white shadow-lg transform scale-105`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {round.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Status Filter
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map(status => (
            <button
              key={status.value}
              onClick={() => onStatusFilter(status.value)}
              className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-2 ${
                activeStatusFilter === status.value
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{status.icon}</span>
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Filters */}
      {tags.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Filter by Tags
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => onTagFilter(activeTagFilter === tag ? null : tag)}
                className={`px-3 py-1 text-xs rounded-full transition-all flex items-center gap-1 ${
                  activeTagFilter === tag
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
                {activeTagFilter === tag && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(searchTerm || activeTagFilter || activeStatusFilter !== 'all' || currentRound !== 'all') && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Active filters:</span>
          
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {currentRound !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
              Round: {rounds.find(r => r.value === currentRound)?.label}
              <button
                onClick={() => onRoundChange('all')}
                className="hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {activeStatusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
              Status: {statusFilters.find(s => s.value === activeStatusFilter)?.label}
              <button
                onClick={() => onStatusFilter('all')}
                className="hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {activeTagFilter && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
              Tag: {activeTagFilter}
              <button
                onClick={() => onTagFilter(null)}
                className="hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
