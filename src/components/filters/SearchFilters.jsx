
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '../ui/popover';
import { Card, CardContent } from '../ui/card';
import { setCurrentRound, setSearchTerm, setSortBy, setFilters, setSelectedTags } from '../../store/slices/questionsSlice';

const SearchFilters = () => {
  const dispatch = useDispatch();
  const { currentRound, searchTerm, sortBy, filters, items, selectedTags } = useSelector((state) => state.questions);
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique tags from questions
  const allTags = [...new Set(items.flatMap(q => q.tags))].sort();

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleRoundChange = (value) => {
    dispatch(setCurrentRound(value));
  };

  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
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

  const clearAllFilters = () => {
    dispatch(setCurrentRound('all'));
    dispatch(setSearchTerm(''));
    dispatch(setFilters({ favorite: false, review: false, hot: false }));
    dispatch(setSelectedTags([]));
  };

  const activeFiltersCount = 
    (currentRound !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0) +
    Object.values(filters).filter(Boolean).length +
    selectedTags.length;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search questions, answers, or tags..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 h-9"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={currentRound} onValueChange={handleRoundChange}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Round" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rounds</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="telephonic">Telephonic</SelectItem>
                <SelectItem value="introduction">Introduction</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="system-design">System Design</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 h-9"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-9 px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground">Status:</span>
              {[
                { key: 'favorite', label: '⭐ Favorites' },
                { key: 'review', label: '📌 Review' },
                { key: 'hot', label: '🔥 Hot' }
              ].map(filter => (
                <Button
                  key={filter.key}
                  variant={filters[filter.key] ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle(filter.key)}
                  className="h-8"
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Tag Filters */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagToggle(tag)}
                      className="h-8"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {currentRound !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Round: {currentRound}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleRoundChange('all')} />
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchTerm}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => dispatch(setSearchTerm(''))} />
                </Badge>
              )}
              {Object.entries(filters).filter(([_, value]) => value).map(([key, _]) => (
                <Badge key={key} variant="secondary" className="gap-1">
                  {key === 'favorite' ? '⭐' : key === 'review' ? '📌' : '🔥'} {key}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterToggle(key)} />
                </Badge>
              ))}
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  Tag: {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleTagToggle(tag)} />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
