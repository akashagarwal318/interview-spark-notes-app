
import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Chip, 
  Select, 
  MenuItem, 
  FormControl,
  TextField,
  Stack,
  Tooltip
} from '@mui/material';
import { 
  Edit, 
  Star, 
  Delete,
  FileCopy,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

const QuestionHeader = ({
  question,
  isExpanded,
  isEditing,
  editingField,
  tempValues,
  roundOptions,
  onToggleExpand,
  onToggleEdit,
  onToggleStatus,
  onDelete,
  onDuplicate,
  onFieldEdit,
  onFieldSave,
  onTempValueChange,
  onKeyPress
}) => {
  return (
    <Box 
      sx={{ 
        p: 2, 
        cursor: 'pointer', 
        '&:hover': { bgcolor: 'action.hover' },
        transition: 'background-color 0.2s'
      }}
      onClick={onToggleExpand}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box sx={{ flex: 1 }}>
          {/* Round Badge */}
          <Box sx={{ mb: 1 }}>
            {editingField === 'round' ? (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={tempValues.round || ''}
                  onChange={(e) => onTempValueChange('round', e.target.value)}
                  onBlur={() => onFieldSave('round')}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                >
                  <MenuItem value="">Select Round</MenuItem>
                  {roundOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Chip
                label={roundOptions.find(opt => opt.value === question.round)?.label || question.round || 'No Round'}
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditing) onFieldEdit('round');
                }}
                sx={{ cursor: isEditing ? 'pointer' : 'default' }}
              />
            )}
          </Box>
          
          {/* Question Title */}
          {editingField === 'question' ? (
            <TextField
              fullWidth
              value={tempValues.question}
              onChange={(e) => onTempValueChange('question', e.target.value)}
              onBlur={() => onFieldSave('question')}
              onKeyDown={(e) => onKeyPress(e, 'question')}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              variant="standard"
              sx={{ fontSize: '1.125rem', fontWeight: 600 }}
            />
          ) : (
            <Typography 
              variant="h6"
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing) onFieldEdit('question');
              }}
              sx={{
                cursor: isEditing ? 'text' : 'default',
                '&:hover': isEditing ? { bgcolor: 'warning.50', p: 1, borderRadius: 1 } : {},
                transition: 'background-color 0.2s'
              }}
            >
              {question.question}
            </Typography>
          )}
        </Box>
        
        {/* Action Buttons */}
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
          <Tooltip title="Toggle Favorite">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus('favorite');
              }}
              color={question.favorite ? 'warning' : 'default'}
              size="small"
            >
              <Star />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Toggle Review">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus('review');
              }}
              color={question.review ? 'success' : 'default'}
              size="small"
            >
              <span style={{ fontSize: '14px' }}>📌</span>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Toggle Hot List">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus('hot');
              }}
              color={question.hot ? 'error' : 'default'}
              size="small"
            >
              <span style={{ fontSize: '14px' }}>🔥</span>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Toggle Edit Mode">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onToggleEdit();
              }}
              color={isEditing ? 'primary' : 'default'}
              size="small"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Duplicate Question">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              size="small"
            >
              <FileCopy />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete Question">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              size="small"
              color="error"
            >
              <Delete />
            </IconButton>
          </Tooltip>
          
          <IconButton size="small">
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default QuestionHeader;
