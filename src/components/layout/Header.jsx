
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box
} from '@mui/material';
import {
  Edit as EditIcon,
  ViewList as ViewListIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon
} from '@mui/icons-material';
import { setFormVisible, toggleTheme, resetFilters } from '../../store/slices/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);

  const handleAddQuestion = () => {
    dispatch(setFormVisible(true));
  };

  const handleShowAll = () => {
    dispatch(resetFilters());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        mb: 4, 
        backgroundColor: 'transparent', 
        color: 'inherit' 
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            fontSize: { xs: '1.5rem', md: '2rem' } 
          }}
        >
          🚀 Interview Assistant
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleAddQuestion}
            sx={{ minWidth: 'auto' }}
          >
            Add New Question
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ViewListIcon />}
            onClick={handleShowAll}
            sx={{ minWidth: 'auto' }}
          >
            All Questions
          </Button>
          
          <IconButton
            onClick={handleToggleTheme}
            color="inherit"
            sx={{ 
              border: 1, 
              borderColor: 'divider',
              width: 44,
              height: 44
            }}
          >
            {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
