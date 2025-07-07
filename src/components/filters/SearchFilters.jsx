
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Download, FileText, FileDown } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { setCurrentRound, setSearchTerm, setFilters, setSelectedTags, resetFilters } from '../../store/slices/questionsSlice';
import { exportToWord, exportToPDF } from '../../utils/exportUtils';

const SearchFilters = () => {
  const dispatch = useDispatch();
  const { currentRound, searchTerm, filters, items, selectedTags, filteredItems } = useSelector((state) => state.questions);

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

  const handleExportWord = () => {
    if (filteredItems.length === 0) {
      alert('No questions to export');
      return;
    }
    exportToWord(filteredItems);
  };

  const handleExportPDF = () => {
    if (filteredItems.length === 0) {
      alert('No questions to export');
      return;
    }
    exportToPDF(filteredItems);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search and Export Row */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 h-10 border-gray-300 dark:border-gray-600"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="px-4 py-2 h-10 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border border-border z-50">
            <DropdownMenuItem onClick={handleExportWord} className="flex items-center px-4 py-2 hover:bg-accent">
              <FileText className="h-4 w-4 mr-2" />
              Export as Word
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPDF} className="flex items-center px-4 py-2 hover:bg-accent">
              <FileDown className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          onClick={handleResetFilters}
          variant="outline"
          className="px-4 py-2 h-10 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
        >
          Show All
        </Button>
      </div>

      {/* Filter Tabs */}
<div className="flex flex-wrap gap-2">
  {[
    { key: 'technical', label: 'Technical', active: currentRound === 'technical' },
    { key: 'hr', label: 'HR Round', active: currentRound === 'hr' },
    { key: 'telephonic', label: 'Telephonic', active: currentRound === 'telephonic' },
    { key: 'introduction', label: 'Introduction', active: currentRound === 'introduction' }
  ].map(round => (
    <button
      key={round.key}
      onClick={() => handleRoundChange(round.key)}
      className={`px-3 py-1 rounded-full text-sm transition-colors ${
        round.active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {round.label}
    </button>
  ))}
</div>

{/* Filters on next line */}
<div className="flex flex-wrap gap-2 mt-2">
  {[
    { key: 'favorite', label: 'Favorites', active: filters.favorite },
    { key: 'review', label: 'Review', active: filters.review },
    { key: 'hot', label: 'Hot List', active: filters.hot }
  ].map(filter => (
    <button
      key={filter.key}
      onClick={() => handleFilterToggle(filter.key)}
      className={`px-3 py-1 rounded-full text-sm transition-colors ${
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
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => dispatch(setSelectedTags([]))}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
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
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
