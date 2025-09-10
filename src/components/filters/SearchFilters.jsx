
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Download, FileText, FileDown, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { setCurrentRound, setSearchTerm, setSearchScope, setFilters, setSelectedTags, resetFilters, fetchRounds, createRoundAsync, deleteRoundAsync } from '../../store/slices/questionsSlice';
import { exportToWord, exportToPDF } from '../../utils/exportUtils';
import { useDebounce } from '../../hooks/useDebounce';
import { extractCodeBlocks } from '../../utils/codeUtils';

const SearchFilters = () => {
  const dispatch = useDispatch();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const { currentRound, searchTerm, searchScope, filters, items, selectedTags, rounds } = useSelector((state) => state.questions);
  const [showRoundInput, setShowRoundInput] = useState(false);
  const [newRoundName, setNewRoundName] = useState('');
  
  const searchInputRef = useRef(null);

  // Fetch persisted rounds once on mount
  useEffect(() => { dispatch(fetchRounds()); }, [dispatch]);
  
  // Debounce search term with a longer delay to prevent excessive API calls
  // Instant search when scope is 'code', debounced otherwise
  const debouncedSearchTerm = useDebounce(localSearchTerm, searchScope === 'code' ? 0 : 800);
  
  // Initialize local search term from Redux state
  useEffect(() => {
    if (searchTerm !== localSearchTerm) {
      setLocalSearchTerm(searchTerm);
    }
  }, [searchTerm]);
  
  // Update Redux search term when debounced value changes (skip stale reapply after clear)
  useEffect(() => {
    // If user cleared input, force immediate clear and ignore pending debounce
    if (localSearchTerm === '') {
      if (searchTerm !== '') dispatch(setSearchTerm(''));
      return;
    }
    // Normal debounce flow
    if (debouncedSearchTerm !== searchTerm) {
      dispatch(setSearchTerm(debouncedSearchTerm));
    }
  }, [debouncedSearchTerm, localSearchTerm, searchTerm, dispatch]);
  
  // Compute filtered items client-side for export functionality
  const filteredItems = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    const hasSearch = lowerSearch.length > 0;
    return items.filter(item => {
      // Scope specific check
      const q = (item.question || '').toLowerCase();
      const a = (item.answer || '').toLowerCase();
      const codeField = (item.code || '').toLowerCase();
      const codeBlocks = item.answer ? extractCodeBlocks(item.answer).map(b => b.code.toLowerCase()) : [];
      const matchCode = codeField.includes(lowerSearch) || codeBlocks.some(c => c.includes(lowerSearch));

      if (hasSearch) {
        switch (searchScope) {
          case 'question':
            if (!q.includes(lowerSearch)) return false;
            break;
          case 'answer':
            if (!a.includes(lowerSearch)) return false;
            break;
          case 'code':
            if (!matchCode) return false;
            break;
          case 'all':
          default:
            if (!(q.includes(lowerSearch) || a.includes(lowerSearch) || matchCode)) return false;
        }
      }

      if (currentRound !== 'all' && item.round !== currentRound) return false;
      if (filters.favorite && !item.favorite) return false;
      if (filters.review && !item.review) return false;
      if (filters.hot && !item.hot) return false;
      if (selectedTags.length) {
        const itemTags = (item.tags || []).map(t => (typeof t === 'string' ? t : t._id));
        if (!selectedTags.some(t => itemTags.includes(t))) return false;
      }
      return true;
    });
  }, [items, searchTerm, searchScope, currentRound, filters.favorite, filters.review, filters.hot, selectedTags]);

  // Get all unique tags from questions
  const allTags = [...new Map(
    items.flatMap(q => q.tags || [])
      .filter(Boolean)
      .map(tag => typeof tag === 'string' ? { _id: tag, name: tag, color: '#6B7280' } : tag)
      .map(tag => [tag._id, tag])
  ).values()].sort((a, b) => a.name.localeCompare(b.name));

  const handleSearchChange = useCallback((e) => {
    setLocalSearchTerm(e.target.value);
  }, []);

  const handleSearchScopeChange = useCallback((value) => {
    dispatch(setSearchScope(value));
  }, [dispatch]);

  // Clear search handler that forces immediate redux update without waiting for debounce
  const handleClearSearch = useCallback((e) => {
    if (e) {
      e.preventDefault(); // Prevent form submission
      e.stopPropagation(); // Prevent event bubbling
    }
    setLocalSearchTerm('');
    // Force immediate update to redux (bypass debounce)
    dispatch(setSearchTerm(''));
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [dispatch]);

  const handleRoundChange = (value) => {
    dispatch(setCurrentRound(value));
  };

  const handleFilterToggle = (filterType) => {
    dispatch(setFilters({ [filterType]: !filters[filterType] }));
  };

  const handleTagToggle = (tag) => {
    const tagId = typeof tag === 'string' ? tag : tag._id;
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(t => t !== tagId)
      : [...selectedTags, tagId];
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
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={`Search ${searchScope === 'all' ? 'all fields' : searchScope}...`}
              value={localSearchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-10 h-10 border-gray-300 dark:border-gray-600"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {localSearchTerm && (
              <button
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onClick={(e) => handleClearSearch(e)}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Select value={searchScope} onValueChange={handleSearchScopeChange}>
            <SelectTrigger className="min-w-[170px] h-10 border-gray-300 dark:border-gray-600">
              <SelectValue>
                {(() => {
                  switch (searchScope) {
                    case 'all': return 'All Fields';
                    case 'question': return 'Question';
                    case 'answer': return 'Answer';
                    case 'code': return 'Code';
                    default: return 'Scope';
                  }
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="question">Question</SelectItem>
              <SelectItem value="answer">Answer</SelectItem>
              <SelectItem value="code">Code</SelectItem>
            </SelectContent>
          </Select>
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
        
      </div>

      {/* Search Results Info */}
      {(searchTerm || currentRound !== 'all' || filters.favorite || filters.review || filters.hot || selectedTags.length > 0) && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredItems.length === items.length ? (
            `Showing all ${items.length} questions`
          ) : (
            `Found ${filteredItems.length} of ${items.length} questions`
          )}
          {searchTerm && (
            <span className="ml-2">
              for "<span className="font-medium">{searchTerm}</span>" in {searchScope === 'all' ? 'all fields' : searchScope}
            </span>
          )}
        </div>
      )}

      {/* Filter Tabs */}
<div className="flex flex-wrap gap-2 items-center">
  {rounds.map(r => {
    const count = items.filter(q => q.round === r).length;
    const isProtected = ['technical','hr','telephonic','introduction','behavioral','system-design','coding'].includes(r);
    return (
      <div key={r} className="relative group">
        <button
          onClick={() => handleRoundChange(r)}
          className={`pl-3 pr-2 py-1 rounded-full text-sm flex items-center gap-2 transition-colors ${
            currentRound === r
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <span>{r.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${currentRound === r ? 'bg-white/20' : 'bg-black/10 dark:bg-white/10'}`}>{count}</span>
          {!isProtected && (
            <span
              onClick={(e) => { e.stopPropagation(); if (confirm('Delete this round? Questions will be moved to technical.')) dispatch(deleteRoundAsync(r)); }}
              className="ml-1 text-xs opacity-0 group-hover:opacity-100 cursor-pointer hover:text-red-500"
              title="Delete round"
            >✕</span>
          )}
        </button>
      </div>
    );
  })}
  <button
    onClick={() => setShowRoundInput(v => !v)}
    className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
    title="Add custom round"
  >+ Round</button>
  {showRoundInput && (
    <form onSubmit={(e) => {
      e.preventDefault();
      const name = newRoundName.trim();
      if (!name) return;
      const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');
      if (!rounds.includes(slug)) {
        dispatch(createRoundAsync(name));
      }
      setNewRoundName('');
      setShowRoundInput(false);
      dispatch(setCurrentRound(slug));
    }} className="flex items-center gap-2">
      <input
        autoFocus
        value={newRoundName}
        onChange={(e)=>setNewRoundName(e.target.value)}
        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-background text-sm"
        placeholder="Custom"
      />
      <button type="submit" className="text-sm px-2 py-1 bg-blue-600 text-white rounded">Add</button>
    </form>
  )}
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
        <TagSelector 
          allTags={allTags} 
          selectedTags={selectedTags} 
          onClear={() => dispatch(setSelectedTags([]))}
          onToggle={handleTagToggle}
        />
      )}
    </div>
  );
};

export default SearchFilters;

// Collapsible tag selector component (defined after export to avoid re-render issues)
const TagSelector = ({ allTags, selectedTags, onToggle, onClear }) => {
  const [expanded, setExpanded] = React.useState(false);
  const VISIBLE_COUNT = 10; // tags to show when collapsed
  const visibleTags = expanded ? allTags : allTags.slice(0, VISIBLE_COUNT);
  const hiddenCount = allTags.length - VISIBLE_COUNT;

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={onClear}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            selectedTags.length === 0
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All Tags
        </button>
        {visibleTags.map(tag => (
          <button
            key={tag._id}
            onClick={() => onToggle(tag)}
            style={{ 
              backgroundColor: selectedTags.includes(tag._id) ? tag.color : undefined,
              color: selectedTags.includes(tag._id) ? 'white' : undefined 
            }}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              selectedTags.includes(tag._id)
                ? 'text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {tag.name}
          </button>
        ))}
        {!expanded && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="px-3 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            +{hiddenCount} more
          </button>
        )}
        {expanded && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(false)}
            className="px-3 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
};
