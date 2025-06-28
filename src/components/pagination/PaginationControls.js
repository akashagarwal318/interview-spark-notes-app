
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack
} from '@mui/material';
import { setCurrentPage, setQuestionsPerPage } from '../../store/slices/questionsSlice';

const PaginationControls = () => {
  const dispatch = useDispatch();
  const { 
    filteredItems, 
    currentPage, 
    questionsPerPage 
  } = useSelector((state) => state.questions);

  const totalPages = Math.ceil(filteredItems.length / questionsPerPage);

  const handlePageChange = (event, page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuestionsPerPageChange = (event) => {
    dispatch(setQuestionsPerPage(event.target.value));
  };

  if (filteredItems.length === 0) return null;

  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Stack spacing={2} alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Per Page</InputLabel>
            <Select
              value={questionsPerPage}
              label="Per Page"
              onChange={handleQuestionsPerPageChange}
            >
              <MenuItem value={5}>5 per page</MenuItem>
              <MenuItem value={10}>10 per page</MenuItem>
              <MenuItem value={15}>15 per page</MenuItem>
              <MenuItem value={20}>20 per page</MenuItem>
              <MenuItem value={25}>25 per page</MenuItem>
              <MenuItem value={50}>50 per page</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="body2" color="text.secondary">
            Showing {Math.min((currentPage - 1) * questionsPerPage + 1, filteredItems.length)} - {Math.min(currentPage * questionsPerPage, filteredItems.length)} of {filteredItems.length} questions
          </Typography>
        </Stack>

        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        )}
      </Stack>
    </Box>
  );
};

export default PaginationControls;
