
import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Edit, ViewList, Brightness4, Brightness7 } from '@mui/icons-material';

interface HeaderProps {
  onAddQuestion: () => void;
  onShowAll: () => void;
  onToggleTheme: () => void;
  currentTheme: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddQuestion, 
  onShowAll, 
  onToggleTheme, 
  currentTheme 
}) => {
  return (
    <AppBar position="static" elevation={0} sx={{ mb: 4, backgroundColor: 'transparent', color: 'inherit' }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>
          🚀 Interview Assistant
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={onAddQuestion}
            sx={{ minWidth: 'auto' }}
          >
            Add New Question
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ViewList />}
            onClick={onShowAll}
            sx={{ minWidth: 'auto' }}
          >
            All Questions
          </Button>
          
          <IconButton
            onClick={onToggleTheme}
            color="inherit"
            sx={{ 
              border: 1, 
              borderColor: 'divider',
              width: 44,
              height: 44
            }}
          >
            {currentTheme === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
