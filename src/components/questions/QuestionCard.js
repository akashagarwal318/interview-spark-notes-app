
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Box,
  Collapse,
  TextField,
  Stack,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as FileCopyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Whatshot as WhatshotIcon,
  WhatshotOutlined as WhatshotOutlinedIcon
} from '@mui/icons-material';
import {
  updateQuestion,
  deleteQuestion,
  duplicateQuestion
} from '../../store/slices/questionsSlice';
import {
  toggleQuestionExpanded,
  toggleQuestionEdit,
  setImageModal
} from '../../store/slices/uiSlice';

const QuestionCard = ({ question }) => {
  const dispatch = useDispatch();
  const { expandedQuestions, editingQuestions } = useSelector((state) => state.ui);
  
  const isExpanded = expandedQuestions.has(question.id);
  const isEditing = editingQuestions.has(question.id);
  
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({
    question: question.question,
    answer: question.answer,
    code: question.code || '',
    tags: question.tags?.join(', ') || '',
    round: question.round
  });

  const roundOptions = [
    { value: 'technical', label: 'Technical' },
    { value: 'hr', label: 'HR' },
    { value: 'telephonic', label: 'Telephonic' },
    { value: 'introduction', label: 'Introduction' },
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'system-design', label: 'System Design' },
    { value: 'coding', label: 'Coding' }
  ];

  const getRoundColor = (round) => {
    const colors = {
      technical: '#3b82f6',
      hr: '#10b981',
      telephonic: '#8b5cf6',
      introduction: '#f59e0b',
      behavioral: '#ec4899',
      'system-design': '#ef4444',
      coding: '#6366f1'
    };
    return colors[round] || '#6b7280';
  };

  const handleToggleExpand = () => {
    dispatch(toggleQuestionExpanded(question.id));
  };

  const handleToggleEdit = () => {
    dispatch(toggleQuestionEdit(question.id));
  };

  const handleToggleStatus = (status) => {
    dispatch(updateQuestion({ 
      id: question.id, 
      updates: { [status]: !question[status] } 
    }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      dispatch(deleteQuestion(question.id));
    }
  };

  const handleDuplicate = () => {
    dispatch(duplicateQuestion(question.id));
  };

  const handleFieldEdit = (field) => {
    if (isEditing) {
      setEditingField(field);
      setTempValues(prev => ({
        ...prev,
        [field]: field === 'tags' ? (question.tags?.join(', ') || '') : (question[field] || '')
      }));
    }
  };

  const handleFieldSave = (field) => {
    const value = field === 'tags' 
      ? tempValues[field].split(',').map(tag => tag.trim()).filter(tag => tag)
      : tempValues[field];
    
    dispatch(updateQuestion({ 
      id: question.id, 
      updates: { [field]: value } 
    }));
    setEditingField(null);
  };

  const handleTempValueChange = (field, value) => {
    setTempValues(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFieldSave(field);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const copyToClipboard = async (type) => {
    let textToCopy = '';
    switch (type) {
      case 'answer':
        textToCopy = question.answer;
        break;
      case 'code':
        textToCopy = question.code || '';
        break;
      case 'full':
        textToCopy = `Q: ${question.question}\n\nA: ${question.answer}`;
        if (question.code) {
          textToCopy += `\n\nCode:\n${question.code}`;
        }
        if (question.tags && question.tags.length > 0) {
          textToCopy += `\n\nTags: ${question.tags.join(', ')}`;
        }
        break;
      default:
        break;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleImageClick = (imageSrc) => {
    dispatch(setImageModal({ isOpen: true, imageSrc }));
  };

  return (
    <Card sx={{ mb: 2, border: 1, borderColor: 'divider' }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <Chip
              label={roundOptions.find(r => r.value === question.round)?.label || question.round}
              size="small"
              sx={{ 
                backgroundColor: getRoundColor(question.round),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            <Typography variant="h6" sx={{ flex: 1 }}>
              {editingField === 'question' ? (
                <TextField
                  fullWidth
                  value={tempValues.question}
                  onChange={(e) => handleTempValueChange('question', e.target.value)}
                  onBlur={() => handleFieldSave('question')}
                  onKeyDown={(e) => handleKeyPress(e, 'question')}
                  autoFocus
                />
              ) : (
                <Box
                  onClick={() => handleFieldEdit('question')}
                  sx={{ 
                    cursor: isEditing ? 'text' : 'default',
                    '&:hover': isEditing ? { backgroundColor: 'action.hover', p: 1, borderRadius: 1 } : {}
                  }}
                >
                  {question.question}
                </Box>
              )}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => handleToggleStatus('favorite')}
              color={question.favorite ? 'warning' : 'default'}
            >
              {question.favorite ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleToggleStatus('review')}
              color={question.review ? 'success' : 'default'}
            >
              {question.review ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleToggleStatus('hot')}
              color={question.hot ? 'error' : 'default'}
            >
              {question.hot ? <WhatshotIcon /> : <WhatshotOutlinedIcon />}
            </IconButton>
            <IconButton size="small" onClick={handleToggleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={handleDuplicate}>
              <FileCopyIcon />
            </IconButton>
            <IconButton size="small" onClick={handleDelete} color="error">
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={handleToggleExpand}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Expanded Content */}
        <Collapse in={isExpanded}>
          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            {/* Tags */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                🏷️ Tags
              </Typography>
              {editingField === 'tags' ? (
                <TextField
                  fullWidth
                  value={tempValues.tags}
                  onChange={(e) => handleTempValueChange('tags', e.target.value)}
                  onBlur={() => handleFieldSave('tags')}
                  onKeyDown={(e) => handleKeyPress(e, 'tags')}
                  placeholder="React, JavaScript, Hooks"
                  autoFocus
                />
              ) : (
                <Box
                  onClick={() => handleFieldEdit('tags')}
                  sx={{ 
                    cursor: isEditing ? 'text' : 'default',
                    '&:hover': isEditing ? { backgroundColor: 'action.hover', p: 1, borderRadius: 1 } : {}
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {question.tags?.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            {/* Answer */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                💡 Answer
              </Typography>
              {editingField === 'answer' ? (
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={tempValues.answer}
                  onChange={(e) => handleTempValueChange('answer', e.target.value)}
                  onBlur={() => handleFieldSave('answer')}
                  onKeyDown={(e) => handleKeyPress(e, 'answer')}
                  autoFocus
                />
              ) : (
                <Paper
                  onClick={() => handleFieldEdit('answer')}
                  sx={{ 
                    p: 2,
                    cursor: isEditing ? 'text' : 'default',
                    '&:hover': isEditing ? { backgroundColor: 'action.hover' } : {},
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {question.answer}
                </Paper>
              )}
            </Box>

            {/* Code */}
            {(question.code || editingField === 'code') && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  💻 Code
                </Typography>
                {editingField === 'code' ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    value={tempValues.code}
                    onChange={(e) => handleTempValueChange('code', e.target.value)}
                    onBlur={() => handleFieldSave('code')}
                    onKeyDown={(e) => handleKeyPress(e, 'code')}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        fontSize: '0.875rem'
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <Paper
                    onClick={() => handleFieldEdit('code')}
                    sx={{ 
                      p: 2,
                      backgroundColor: 'grey.900',
                      color: 'green.400',
                      cursor: isEditing ? 'text' : 'default',
                      '&:hover': isEditing ? { backgroundColor: 'grey.800' } : {},
                      fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: '0.875rem',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {question.code}
                  </Paper>
                )}
              </Box>
            )}

            {/* Images */}
            {question.images && question.images.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  🖼️ Images
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {question.images.map((image, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={image.data}
                      alt={image.name}
                      onClick={() => handleImageClick(image.data)}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 }
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Actions */}
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => copyToClipboard('answer')}
              >
                Copy Answer
              </Button>
              {question.code && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => copyToClipboard('code')}
                >
                  Copy Code
                </Button>
              )}
              <Button
                size="small"
                variant="outlined"
                onClick={() => copyToClipboard('full')}
              >
                Copy All
              </Button>
            </Stack>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
