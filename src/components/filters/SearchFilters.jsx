
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { setCurrentRound, setSearchTerm, setFilters, setSelectedTags, resetFilters } from '../../store/slices/questionsSlice';

const SearchFilters = () => {
  const dispatch = useDispatch();
  const { currentRound, searchTerm, filters, items, selectedTags } = useSelector((state) => state.questions);

  // Get all unique tags from questions
  const allTags = [...new Set(items.flatMap(q => q.tags || []))].filter(Boolean).sort();

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleRoundChange = (value) => {
    dispatch(setCurrentRound(value));
  };

  const handleFilterToggle = (filterType) => {
    dispatch(setFilters({ [filterType]: !filters[filterType] }));
  };

  const handleTagToggle = (tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    dispatch(setSelectedTags(newSelectedTags));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
      {/* Search Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search your questions..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-12 py-3 text-base border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600"
          />
        </div>
        <Select defaultValue="questions">
          <SelectTrigger className="w-48 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <SelectItem value="questions">Search in Questions</SelectItem>
            <SelectItem value="answers">Search in Answers</SelectItem>
            <SelectItem value="code">Search in Code</SelectItem>
            <SelectItem value="tags">Search in Tags</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Round Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { key: 'all', label: 'Technical', active: currentRound === 'technical' || currentRound === 'all' },
          { key: 'hr', label: 'HR Round', active: currentRound === 'hr' },
          { key: 'telephonic', label: 'Telephonic', active: currentRound === 'telephonic' },
          { key: 'introduction', label: 'Introduction', active: currentRound === 'introduction' }
        ].map(round => (
          <button
            key={round.key}
            onClick={() => handleRoundChange(round.key === 'all' ? 'technical' : round.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              round.active && round.key !== 'all'
                ? 'bg-blue-600 text-white'
                : round.key === 'all' && (currentRound === 'technical' || currentRound === 'all')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {round.label}
          </button>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 rounded-full text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors"
        >
          All
        </button>
        {[
          { key: 'favorite', label: '⭐ Favorites', active: filters.favorite },
          { key: 'review', label: '📌 Review', active: filters.review },
          { key: 'hot', label: '🔥 Hot List', active: filters.hot }
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => handleFilterToggle(filter.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter.active
                ? filter.key === 'favorite' ? 'bg-yellow-600 text-white' 
                : filter.key === 'review' ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tags:</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => dispatch(setSelectedTags([]))}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTags.length === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Tags
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
