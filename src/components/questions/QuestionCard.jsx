import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Button,
  Collapse,
  Stack,
  Avatar
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Whatshot as WhatshotIcon,
  WhatshotOutlined as WhatshotOutlinedIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { updateQuestion, deleteQuestion } from '../../store/slices/questionsSlice';
import { setImageModal } from '../../store/slices/uiSlice';

const QuestionCard = ({ question }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (field) => {
    dispatch(updateQuestion({
      id: question.id,
      [field]: !question[field]
    }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      dispatch(deleteQuestion(question.id));
    }
  };

  const handleImageClick = (imageSrc) => {
    dispatch(setImageModal({ isOpen: true, imageSrc }));
  };

  const getRoundColor = (round) => {
    const colors = {
      'technical': 'primary',
      'hr': 'secondary',
      'telephonic': 'success',
      'introduction': 'info',
      'behavioral': 'warning',
      'system-design': 'error',
      'coding': 'default'
    };
    return colors[round] || 'default';
  };

  return (
    <Card sx={{ mb: 2, border: 1, borderColor: 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Chip
            label={question.round.replace('-', ' ').toUpperCase()}
            color={getRoundColor(question.round)}
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(question.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          {question.question}
        </Typography>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography variant="body2" color="text.secondary" paragraph>
            {question.answer}
          </Typography>

          {question.code && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Code:
              </Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.875rem',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}
              >
                {question.code}
              </Box>
            </Box>
          )}

          {question.images && question.images.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Images:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {question.images.map((image, index) => (
                  <Avatar
                    key={index}
                    src={image.data}
                    alt={image.name}
                    sx={{ width: 60, height: 60, cursor: 'pointer' }}
                    onClick={() => handleImageClick(image.data)}
                  >
                    <ImageIcon />
                  </Avatar>
                ))}
              </Stack>
            </Box>
          )}
        </Collapse>

        {question.tags && question.tags.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            {question.tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" size="small" />
            ))}
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Box>
          <IconButton
            onClick={() => handleToggle('favorite')}
            color={question.favorite ? 'warning' : 'default'}
          >
            {question.favorite ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
          <IconButton
            onClick={() => handleToggle('review')}
            color={question.review ? 'success' : 'default'}
          >
            {question.review ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
          <IconButton
            onClick={() => handleToggle('hot')}
            color={question.hot ? 'error' : 'default'}
          >
            {question.hot ? <WhatshotIcon /> : <WhatshotOutlinedIcon />}
          </IconButton>
        </Box>

        <Box>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
          <Button
            onClick={() => setExpanded(!expanded)}
            endIcon={<ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default QuestionCard;
