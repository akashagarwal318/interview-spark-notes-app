
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Download, X } from 'lucide-react';
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
import { setCurrentRound, setSearchTerm, setSearchScope, setFilters, setSelectedTags, resetFilters, fetchRounds, createRoundAsync, deleteRoundAsync, selectFilteredQuestions } from '../../store/slices/questionsSlice';
import ExportBuilder from '../modals/ExportBuilder.jsx';
import { useDebounce } from '../../hooks/useDebounce';

const SearchFilters = () => {
  const dispatch = useDispatch();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const { currentRound, searchTerm, searchScope, filters, items, selectedTags, rounds } = useSelector((state) => state.questions);
  // Use centralized memoized selector instead of duplicating filtering logic locally
  const filteredItems = useSelector(selectFilteredQuestions);
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

  // (Filtering logic centralized in selector selectFilteredQuestions)

  // Build unique tag list with dynamic question usage counts (case-insensitive)
  const allTags = React.useMemo(() => {
    const map = new Map(); // key: lower tag name -> { _id, name, color, count }
    items.forEach(q => {
      const seenInQuestion = new Set(); // avoid counting same tag twice within one question
      (q.tags || []).forEach(raw => {
        if (!raw) return;
        const name = typeof raw === 'string' ? raw : (raw.name || '');
        const clean = name.trim();
        if (!clean) return;
        const key = clean.toLowerCase();
        if (!map.has(key)) {
          map.set(key, { _id: key, name: clean, color: '#6B7280', count: 0 });
        }
        if (!seenInQuestion.has(key)) {
          map.get(key).count += 1;
          seenInQuestion.add(key);
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

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

  const [showExport, setShowExport] = useState(false);

  // Legacy direct export removed; unified builder for consistency

  return (
    <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
      {/* Search and Export Row - Responsive */}
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
        {/* Search bar - full width on mobile */}
        <div className="relative flex-1 order-1">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={`Search ${searchScope === 'all' ? 'all fields' : searchScope}...`}
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="pl-8 sm:pl-10 pr-8 sm:pr-10 h-8 sm:h-10 text-xs sm:text-sm border-gray-300 dark:border-gray-600"
          />
          <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
          {localSearchTerm && (
            <button
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onClick={(e) => handleClearSearch(e)}
              aria-label="Clear search"
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              type="button"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>

        {/* Dropdown and Export - together on mobile, on separate line */}
        <div className="flex gap-1 sm:gap-2 order-2">
          <Select value={searchScope} onValueChange={handleSearchScopeChange}>
            <SelectTrigger className="min-w-[120px] sm:min-w-[170px] h-8 sm:h-10 text-xs sm:text-sm border-gray-300 dark:border-gray-600">
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

          <Button
            variant="outline"
            className="px-3 sm:px-4 py-1 sm:py-2 h-8 sm:h-10 text-xs sm:text-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 flex-shrink-0"
            onClick={() => setShowExport(true)}
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="ml-1.5 sm:ml-2">Export</span>
          </Button>
        </div>

        <ExportBuilder open={showExport} onClose={() => setShowExport(false)} />
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

      {/* Round Filters - Collapsible */}
      <RoundFilters
        rounds={rounds}
        currentRound={currentRound}
        items={items}
        onChange={handleRoundChange}
        onDelete={(r) => dispatch(deleteRoundAsync(r))}
        showRoundInput={showRoundInput}
        setShowRoundInput={setShowRoundInput}
        newRoundName={newRoundName}
        setNewRoundName={setNewRoundName}
        onCreateRound={(slug) => {
          dispatch(createRoundAsync(newRoundName.trim()));
          // dispatch(setCurrentRound(slug));
        }}
      />

      {/* Filters on next line */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2">
        {[
          { key: 'favorite', label: 'Favorites', active: filters.favorite },
          { key: 'review', label: 'Review', active: filters.review },
          { key: 'hot', label: 'Hot List', active: filters.hot }
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => handleFilterToggle(filter.key)}
            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm transition-colors ${filter.active
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
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640); // 640px is Tailwind's sm breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Logic: 6 items for mobile, 10 for desktop (approx one line)
  const VISIBLE_COUNT = isMobile ? 6 : 10;
  const shouldCollapse = allTags.length > VISIBLE_COUNT;
  const visibleTags = (shouldCollapse && !expanded) ? allTags.slice(0, VISIBLE_COUNT) : allTags;
  const hiddenCount = allTags.length - VISIBLE_COUNT;
  // Pre-compute total counts if tags carry a count property; fallback to 1
  const totalTagCount = allTags.reduce((sum, t) => sum + (t.count || 0), 0) || allTags.length;

  // Derive per-tag count display (prefer provided count)
  const getTagCount = (tag) => tag.count ?? 0; // backend seed inserts count

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-1 sm:mb-2">
        <button
          onClick={onClear}
          className={`pl-2 sm:pl-3 pr-1.5 sm:pr-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs flex items-center transition-colors ${selectedTags.length === 0
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
        >
          <span className="mr-1">All Tags</span>
          <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0 sm:py-0.5 rounded-full ${selectedTags.length === 0 ? 'bg-white/20' : 'bg-black/10 dark:bg-white/10'}`}>{totalTagCount}</span>
        </button>
        {visibleTags.map(tag => (
          <button
            key={tag._id}
            onClick={() => onToggle(tag)}
            style={{
              backgroundColor: selectedTags.includes(tag._id) ? tag.color : undefined,
              color: selectedTags.includes(tag._id) ? 'white' : undefined
            }}
            className={`pl-2 sm:pl-3 pr-1.5 sm:pr-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs flex items-center transition-colors ${selectedTags.includes(tag._id)
              ? 'text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            <span className="mr-1">{tag.name}</span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0 sm:py-0.5 rounded-full ${selectedTags.includes(tag._id) ? 'bg-white/20' : 'bg-black/10 dark:bg-white/10'}`}>{getTagCount(tag)}</span>
          </button>
        ))}
        {shouldCollapse && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            +{allTags.length - VISIBLE_COUNT} more
          </button>
        )}
        {shouldCollapse && expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
};

// Collapsible round filter component
const RoundFilters = ({ rounds, currentRound, items, onChange, onDelete, showRoundInput, setShowRoundInput, newRoundName, setNewRoundName, onCreateRound }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640); // 640px is Tailwind's sm breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Logic: 6 items for mobile, 8 for desktop (strict single line)
  const VISIBLE_COUNT = isMobile ? 6 : 8;
  const shouldCollapse = rounds.length > VISIBLE_COUNT;
  const visibleRounds = (shouldCollapse && !expanded) ? rounds.slice(0, VISIBLE_COUNT) : rounds;
  const protectedRounds = ['technical', 'hr', 'telephonic', 'introduction', 'behavioral', 'system-design', 'coding'];

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
      {visibleRounds.map(r => {
        const count = items.filter(q => q.round === r).length;
        const isProtected = protectedRounds.includes(r);
        return (
          <div key={r} className="relative group">
            <button
              onClick={() => onChange(r)}
              className={`pl-2 sm:pl-3 pr-1.5 sm:pr-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm flex items-center transition-all ${currentRound === r
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              <span className="mr-1.5 sm:mr-2">{r.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')}</span>
              <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0 sm:py-0.5 rounded-full ${currentRound === r ? 'bg-white/20' : 'bg-black/10 dark:bg-white/10'}`}>{count}</span>
              {!isProtected && (
                <span
                  onClick={(e) => { e.stopPropagation(); if (confirm('Delete this round? Questions will be moved to technical.')) onDelete(r); }}
                  className="overflow-hidden w-0 group-hover:w-4 group-hover:ml-1 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-red-500 transition-all duration-200 flex justify-center text-xs"
                  title="Delete round"
                >✕</span>
              )}
            </button>
          </div>
        );
      })}

      {shouldCollapse && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
        >
          +{rounds.length - VISIBLE_COUNT} more
        </button>
      )}

      {shouldCollapse && expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
        >
          Show less
        </button>
      )}

      <button
        onClick={() => setShowRoundInput(v => !v)}
        className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
        title="Add custom round"
      >+ Round</button>

      {showRoundInput && (
        <form onSubmit={(e) => {
          e.preventDefault();
          const name = newRoundName.trim();
          if (!name) return;
          const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
          if (!rounds.includes(slug)) {
            onCreateRound(slug);
          }
          setNewRoundName('');
          setShowRoundInput(false);
        }} className="flex items-center gap-2">
          <input
            autoFocus
            value={newRoundName}
            onChange={(e) => setNewRoundName(e.target.value)}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-background text-sm"
            placeholder="Custom"
          />
          <button type="submit" className="text-sm px-2 py-1 bg-blue-600 text-white rounded">Add</button>
        </form>
      )}
    </div>
  );
};
