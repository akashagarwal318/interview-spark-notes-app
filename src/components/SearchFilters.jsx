
import React from 'react';
import { 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Chip, 
  Paper,
  Typography,
  InputAdornment,
  Stack
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';

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
    { value: 'all', label: 'All Rounds', color: '#6b7280' },
    { value: 'technical', label: 'Technical', color: '#3b82f6' },
    { value: 'hr', label: 'HR', color: '#10b981' },
    { value: 'telephonic', label: 'Telephonic', color: '#8b5cf6' },
    { value: 'introduction', label: 'Introduction', color: '#f59e0b' },
    { value: 'behavioral', label: 'Behavioral', color: '#ec4899' },
    { value: 'system-design', label: 'System Design', color: '#ef4444' },
    { value: 'coding', label: 'Coding', color: '#6366f1' }
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
    <Box sx={{ mb: 3 }}>
      {/* Search Bar */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search by ${searchType}...`}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Search Type</InputLabel>
          <Select
            value={searchType}
            label="Search Type"
            onChange={(e) => onSearchTypeChange(e.target.value)}
          >
            {searchTypes.map(type => (
              <MenuItem key={type.value} value={type.value}>
                Search {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Round Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
        {rounds.map(round => (
          <Chip
            key={round.value}
            label={round.label}
            onClick={() => onRoundChange(round.value)}
            variant={currentRound === round.value ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: currentRound === round.value ? round.color : 'transparent',
              color: currentRound === round.value ? 'white' : 'inherit',
              '&:hover': {
                backgroundColor: currentRound === round.value ? round.color : 'action.hover',
              }
            }}
          />
        ))}
      </Stack>

      {/* Status Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
        {statusFilters.map(status => (
          <Chip
            key={status.value}
            icon={<span>{status.icon}</span>}
            label={status.label}
            onClick={() => onStatusFilter(status.value)}
            variant={activeStatusFilter === status.value ? 'filled' : 'outlined'}
            color={activeStatusFilter === status.value ? 'primary' : 'default'}
          />
        ))}
      </Stack>

      {/* Tag Filters */}
      {tags.length > 0 && (
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            mb: 2, 
            flexWrap: 'wrap', 
            gap: 1,
            maxHeight: 128,
            overflow: 'auto'
          }}
        >
          {tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => onTagFilter(activeTagFilter === tag ? null : tag)}
              onDelete={activeTagFilter === tag ? () => onTagFilter(null) : undefined}
              variant={activeTagFilter === tag ? 'filled' : 'outlined'}
              color={activeTagFilter === tag ? 'secondary' : 'default'}
              size="small"
            />
          ))}
        </Stack>
      )}

      {/* Active Filters Summary */}
      {(searchTerm || activeTagFilter || activeStatusFilter !== 'all' || currentRound !== 'all') && (
        <Paper sx={{ p: 2, bgcolor: 'primary.50', border: 1, borderColor: 'primary.200' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" fontWeight="medium" color="primary.700">
              Active filters:
            </Typography>
            
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                onDelete={() => onSearchChange('')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            
            {currentRound !== 'all' && (
              <Chip
                label={`Round: ${rounds.find(r => r.value === currentRound)?.label}`}
                onDelete={() => onRoundChange('all')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            
            {activeStatusFilter !== 'all' && (
              <Chip
                label={`Status: ${statusFilters.find(s => s.value === activeStatusFilter)?.label}`}
                onDelete={() => onStatusFilter('all')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            
            {activeTagFilter && (
              <Chip
                label={`Tag: ${activeTagFilter}`}
                onDelete={() => onTagFilter(null)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default SearchFilters;
