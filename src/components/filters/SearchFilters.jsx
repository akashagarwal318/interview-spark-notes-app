
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
import { setCurrentRound, setSelectedSubject, setSearchTerm, setSearchScope, setFilters, setSelectedTags, resetFilters, fetchRounds, createRoundAsync, deleteRoundAsync, createSubjectAsync, deleteSubjectAsync, selectFilteredQuestions } from '../../store/slices/questionsSlice';
import ExportBuilder from '../modals/ExportBuilder.jsx';
import { useDebounce } from '../../hooks/useDebounce';

const SearchFilters = () => {
  const dispatch = useDispatch();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const { currentRound, selectedSubject, searchTerm, searchScope, filters, items, selectedTags, rounds, subjects } = useSelector((state) => state.questions);
  // Use centralized memoized selector instead of duplicating filtering logic locally
  const filteredItems = useSelector(selectFilteredQuestions);
  /* filteredItems removed (duplicate) */
  const [showRoundInput, setShowRoundInput] = useState(false);
  const [newRoundName, setNewRoundName] = useState('');

  // Search Input Ref
  const searchInputRef = useRef(null);

  // Autocomplete State
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // Mobile Edit Mode State
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    // Only dispatch if the debounce has technically "caught up" to the local input state.
    // This prevents a race condition where selecting a suggestion updates local/redux instantly,
    // but the stale debounced value (from milliseconds ago) tries to revert Redux.
    if (debouncedSearchTerm !== searchTerm && localSearchTerm === debouncedSearchTerm) {
      dispatch(setSearchTerm(debouncedSearchTerm));
    }
  }, [debouncedSearchTerm, localSearchTerm, searchTerm, dispatch]);

  // Compute context-aware tags based on current round and subject
  const allTags = useMemo(() => {
    const map = new Map();
    // Filter items based on current round and subject for context-aware tags
    let relevantItems = items;
    if (currentRound !== 'all') {
      relevantItems = relevantItems.filter(q => q.round === currentRound);
    }
    // Filter by subject if one is selected (regardless of round)
    if (selectedSubject !== 'all') {
      relevantItems = relevantItems.filter(q => q.subject === selectedSubject);
    }

    relevantItems.forEach(q => {
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
  }, [items, currentRound, selectedSubject]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);

    // Autocomplete Logic
    // Only fetch suggestions if scope is 'question' (or 'all' if desired, but user asked for specific behavior)
    // User requested: "search functionality must only work after we select the question option"
    // So if scope !== 'question', do NOT show suggestions.
    if (searchScope === 'question' && value.trim().length > 1) {
      const lowerVal = value.toLowerCase();
      // Filter existing questions (UNLIMITED, show all matches)
      const matches = items
        .filter(q => q.question.toLowerCase().includes(lowerVal))
        .map(q => q.question);
      // .slice(0, 6); // REMOVED limit per user request

      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [items, searchScope]);

  // Hide suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
        // console.log('Click outside detected, closing suggestions');
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectSuggestion = (suggestion) => {
    // console.log('Selecting suggestion:', suggestion);
    setLocalSearchTerm(suggestion);
    dispatch(setSearchTerm(suggestion)); // Instant search
    setShowSuggestions(false);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

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
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowSuggestions(false);
                if (!localSearchTerm) searchInputRef.current?.blur();
              }
              if (e.key === 'Enter') {
                setShowSuggestions(false);
                dispatch(setSearchTerm(localSearchTerm)); // Force search on Enter
              }
            }}
            className="w-full pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {localSearchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {showSuggestions && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden max-h-60 overflow-y-auto"
            >
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur
                      selectSuggestion(suggestion);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
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
      {/* Rounds - Collapsible */}
      <RoundFilters
        rounds={rounds}
        currentRound={currentRound}
        items={items}
        onChange={(r) => handleRoundChange(r)}
        onDelete={(r) => dispatch(deleteRoundAsync(r))}
        showRoundInput={showRoundInput}
        setShowRoundInput={setShowRoundInput}
        newRoundName={newRoundName}
        setNewRoundName={setNewRoundName}
        onCreateRound={() => {
          if (newRoundName.trim()) {
            dispatch(createRoundAsync(newRoundName));
            setNewRoundName('');
            setShowRoundInput(false);
          }
        }}
        isDeleteMode={isDeleteMode} // Pass delete mode
        isMobile={isMobile} // Pass mobile state
      />
      {/* Subject Filters - Visible      {/* Subject filters */}
      <SubjectFilters
        selectedSubject={selectedSubject}
        onSelect={(subj) => dispatch(setSelectedSubject(subj))}
        items={items}
        currentRound={currentRound}
        subjects={subjects}
        onCreateSubject={(name) => dispatch(createSubjectAsync(name))}
        onDelete={(name) => dispatch(deleteSubjectAsync(name))}
        isDeleteMode={isDeleteMode} // Pass delete mode
        isMobile={isMobile}
      />

      {/* Status Filters */}
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
      {
        allTags.length > 0 && (
          <TagSelector
            allTags={allTags}
            selectedTags={selectedTags}
            onClear={() => dispatch(setSelectedTags([]))}
            onToggle={handleTagToggle}
            isDeleteMode={isDeleteMode} // Pass delete mode to Tags too if needed
          />
        )
      }

      {/* Mobile Edit Mode Toggle (Floating or near filters) */}
      <div className="sm:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsDeleteMode(!isDeleteMode)}
          className={`p-3 rounded-full shadow-lg transition-colors ${isDeleteMode ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'}`}
          title={isDeleteMode ? "Done Editing" : "Edit / Delete Items"}
        >
          {isDeleteMode ? (
            <span className="font-bold text-xs">DONE</span>
          ) : (
            <span className="text-lg">✎</span>
          )}
        </button>
      </div>
    </div>
  );
};

// Subject Filter Component - Only visible when a specific round is selected
const SubjectFilters = ({ selectedSubject, onSelect, items, currentRound, subjects: reduxSubjects, onCreateSubject, onDelete, isDeleteMode, isMobile }) => {
  const [showInput, setShowInput] = React.useState(false);
  const [newSubjectName, setNewSubjectName] = React.useState('');

  // Don't show if "all" rounds is selected (subjects depend on round selection)
  if (currentRound === 'all') return null;

  // Compute subjects from items in this round
  const subjectsFromItems = new Set();
  items.filter(q => q.round === currentRound).forEach(q => {
    if (q.subject && q.subject.toLowerCase() !== 'unnamed') {
      subjectsFromItems.add(q.subject.toLowerCase());
    }
  });

  // Always include 'all' and currently selected subject (even if count becomes 0 temporarily)
  const relevantSubjects = [...subjectsFromItems];

  // Also include ALL subjects from Redux (to allow selecting/deleting empty subjects)
  if (reduxSubjects) {
    reduxSubjects.forEach(s => {
      if (!subjectsFromItems.has(s)) {
        // This subject 's' is NOT used in the current round.
        // Only show it if it is NOT used in any OTHER round either (global orphan).
        const isUsedElsewhere = items.some(q => q.round !== currentRound && q.subject === s);
        if (!isUsedElsewhere) {
          relevantSubjects.push(s);
        }
      }
    });
  }

  if (selectedSubject !== 'all' && !subjectsFromItems.has(selectedSubject) && !relevantSubjects.includes(selectedSubject)) {
    relevantSubjects.push(selectedSubject);
  }

  const allSubjects = ['all', ...relevantSubjects.sort()];

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2 items-center">
      {allSubjects.map(subject => {
        // Count items for this subject in current round
        const count = subject === 'all'
          ? items.filter(q => q.round === currentRound).length
          : items.filter(q => q.round === currentRound && q.subject === subject).length;

        // Show all subjects, even with 0 count, to ensure visibility immediately after creation
        // if (count === 0 && subject !== 'all') return null;

        return (
          <div key={subject} className="relative group">
            <button
              onClick={() => onSelect(subject)}
              className={`pl-2 sm:pl-3 pr-2 sm:pr-2.5 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm transition-colors flex items-center ${subject === 'all' && selectedSubject === 'all'
                  ? 'bg-blue-600 text-white'  // Blue for "All Subjects" like "All Tags"
                  : selectedSubject === subject
                    ? 'bg-gray-500 dark:bg-gray-600 text-white dark:ring-2 dark:ring-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {subject === 'all' ? 'All Subjects' : subject.toUpperCase()}
              {/* Container for Counter / Delete Button Swap */}
              <span className="ml-1.5 w-5 h-5 flex items-center justify-center relative">
                {/* Counter: Hidden on desktop hover OR mobile delete mode */}
                <span className={`text-[10px] sm:text-xs transition-opacity duration-200 ${subject !== 'all'
                  ? (isMobile && isDeleteMode ? 'opacity-0' : 'group-hover:opacity-0')
                  : ''
                  }`}>{count}</span>

                {/* Delete Button: Shown on desktop hover OR mobile delete mode */}
                {subject !== 'all' && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this subject? Questions will be moved to "unnamed".')) {
                        onDelete(subject);
                      }
                    }}
                    className={`absolute inset-0 transition-opacity duration-200 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-100/50 rounded-full flex items-center justify-center ${isMobile && isDeleteMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    title="Delete subject"
                  >✕</span>
                )}
              </span>
            </button>
          </div>
        );
      })}

      {/* Add Subject Button */}
      <button
        onClick={() => setShowInput(v => !v)}
        className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm bg-gray-200 dark:bg-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
        title="Add custom subject"
      >+ Subject</button>

      {showInput && (
        <form onSubmit={(e) => {
          e.preventDefault();
          const name = newSubjectName.trim().toLowerCase();
          if (!name) return;
          onCreateSubject(name);
          setNewSubjectName('');
          setShowInput(false);
        }} className="flex items-center gap-2">
          <input
            autoFocus
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onBlur={() => setTimeout(() => { if (!newSubjectName.trim()) setShowInput(false); }, 150)}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-background text-sm"
            placeholder="Subject name"
          />
          <button type="submit" className="text-sm px-2 py-1 bg-blue-600 text-white rounded">Add</button>
          <button type="button" onClick={() => { setShowInput(false); setNewSubjectName(''); }} className="text-sm px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded">✕</button>
        </form>
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
            className={`pl-2 sm:pl-3 pr-1.5 sm:pr-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs flex items-center transition-colors ${selectedTags.includes(tag._id)
              ? 'bg-gray-500 dark:bg-gray-600 text-white dark:ring-2 dark:ring-white'
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
const RoundFilters = ({ rounds, currentRound, items, onChange, onDelete, showRoundInput, setShowRoundInput, newRoundName, setNewRoundName, onCreateRound, isDeleteMode, isMobile: parentIsMobile }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [localIsMobile, setLocalIsMobile] = React.useState(false);

  // Use parent mobile state if provided, otherwise detect locally
  const isMobile = parentIsMobile !== undefined ? parentIsMobile : localIsMobile;

  // Detect mobile screen size (fallback if not passed)
  React.useEffect(() => {
    if (parentIsMobile !== undefined) return;
    const checkMobile = () => setLocalIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [parentIsMobile]);

  // Logic: 6 items for mobile, 8 for desktop (strict single line)
  const VISIBLE_COUNT = isMobile ? 6 : 8;
  const shouldCollapse = rounds.length > VISIBLE_COUNT;
  const visibleRounds = (shouldCollapse && !expanded) ? rounds.slice(0, VISIBLE_COUNT) : rounds;
  const protectedRounds = []; // All rounds are deletable now per user request

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
      {/* Explicit All Rounds Button for easier reset */}
      <button
        onClick={() => onChange('all')}
        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm transition-colors ${currentRound === 'all'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
      >
        All Rounds
      </button>

      {visibleRounds.map(r => {
        const count = items.filter(q => q.round === r).length;
        const isProtected = protectedRounds.includes(r);
        return (
          <div key={r} className="relative group">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onChange(r)}
              className={`pl-2 sm:pl-3 pr-2 sm:pr-2.5 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm flex items-center transition-all cursor-pointer select-none ${currentRound === r
                ? 'bg-gray-500 dark:bg-gray-600 text-white dark:ring-2 dark:ring-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              <span className="mr-1.5 sm:mr-2">{r.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')}</span>

              {/* Container for Counter / Delete Button Swap */}
              <span className="px-1.5 sm:px-2 py-0 sm:py-0.5 rounded-full w-5 h-5 flex items-center justify-center relative bg-black/10 dark:bg-white/10">
                {/* Counter: Hidden on desktop hover OR mobile delete mode */}
                <span className={`text-[10px] sm:text-xs transition-opacity duration-200 ${!isProtected
                  ? (isMobile && isDeleteMode ? 'opacity-0' : 'group-hover:opacity-0') // Logic: Hide if mobile edit mode OR desktop hover
                  : ''
                  }`}>{count}</span>

                {/* Delete Button: Shown on desktop hover OR mobile delete mode */}
                {!isProtected && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      // console.log('Delete clicked for:', r);
                      if (window.confirm('Delete this round? Questions will be moved to "unnamed".')) {
                        dispatch(deleteRoundAsync(r));
                      }
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    className={`absolute inset-0 transition-opacity duration-200 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-100/50 rounded-full flex items-center justify-center transform hover:scale-110 ${isMobile && isDeleteMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    title="Delete round"
                  >✕</span>
                )}
              </span>
            </div>
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
            onBlur={(e) => {
              // Delay to allow button click to register first
              setTimeout(() => {
                if (!newRoundName.trim()) setShowRoundInput(false);
              }, 150);
            }}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-background text-sm"
            placeholder="Custom"
          />
          <button type="submit" className="text-sm px-2 py-1 bg-blue-600 text-white rounded">Add</button>
          <button type="button" onClick={() => { setShowRoundInput(false); setNewRoundName(''); }} className="text-sm px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded">✕</button>
        </form>
      )}
    </div>
  );
};
