
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Box
} from '@mui/material';
import {
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  Whatshot as WhatshotIcon
} from '@mui/icons-material';
import { setCurrentRound, setSearchTerm, setSortBy, setFilters } from '../../store/slices/questionsSlice';

const SearchFilters = () => {
  const dispatch = useDispatch();
  const { currentRound, searchTerm, sortBy, filters } = useSelector((state) => state.questions);

  const handleRoundChange = (event) => {
    dispatch(setCurrentRound(event.target.value));
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handleSortChange = (event) => {
    dispatch(setSortBy(event.target.value));
  };

  const handleFilterToggle = (filterType) => {
    dispatch(setFilters({ [filterType]: !filters[filterType] }));
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Search & Filters
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search questions..."
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by question, answer, or tags"
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Interview Round</InputLabel>
            <Select
              value={currentRound}
              label="Interview Round"
              onChange={handleRoundChange}
            >
              <MenuItem value="all">All Rounds</MenuItem>
              <MenuItem value="technical">Technical Round</MenuItem>
              <MenuItem value="hr">HR Round</MenuItem>
              <MenuItem value="telephonic">Telephonic Round</MenuItem>
              <MenuItem value="introduction">Introduction Round</MenuItem>
              <MenuItem value="behavioral">Behavioral Round</MenuItem>
              <MenuItem value="system-design">System Design Round</MenuItem>
              <MenuItem value="coding">Coding Round</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="alphabetical">Alphabetical</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Box>
            <Typography variant="body2" gutterBottom>
              Quick Filters
            </Typography>
            <ToggleButtonGroup
              orientation="vertical"
              size="small"
              sx={{ width: '100%' }}
            >
              <ToggleButton
                value="favorite"
                selected={filters.favorite}
                onChange={() => handleFilterToggle('favorite')}
                sx={{ justifyContent: 'flex-start' }}
              >
                <StarIcon sx={{ mr: 1 }} />
                Favorites
              </ToggleButton>
              <ToggleButton
                value="review"
                selected={filters.review}
                onChange={() => handleFilterToggle('review')}
                sx={{ justifyContent: 'flex-start' }}
              >
                <BookmarkIcon sx={{ mr: 1 }} />
                Review
              </ToggleButton>
              <ToggleButton
                value="hot"
                selected={filters.hot}
                onChange={() => handleFilterToggle('hot')}
                sx={{ justifyContent: 'flex-start' }}
              >
                <WhatshotIcon sx={{ mr: 1 }} />
                Hot
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchFilters;
