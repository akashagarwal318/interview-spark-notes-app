
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Stack
} from '@mui/material';
import { addQuestion } from '../../store/slices/questionsSlice';
import { setFormVisible } from '../../store/slices/uiSlice';

const QuestionForm = () => {
  const dispatch = useDispatch();
  const { isFormVisible } = useSelector((state) => state.ui);
  const { currentRound } = useSelector((state) => state.questions);

  const [formData, setFormData] = useState({
    round: currentRound === 'all' ? 'technical' : currentRound,
    question: '',
    answer: '',
    code: '',
    tags: ''
  });
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Please fill in both question and answer fields.');
      return;
    }

    const processedImages = await Promise.all(
      images.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              name: file.name,
              data: e.target?.result,
              size: file.size
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    const questionData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      images: processedImages
    };

    dispatch(addQuestion(questionData));
    dispatch(setFormVisible(false));
    
    // Reset form
    setFormData({
      round: currentRound === 'all' ? 'technical' : currentRound,
      question: '',
      answer: '',
      code: '',
      tags: ''
    });
    setImages([]);
  };

  const handleCancel = () => {
    dispatch(setFormVisible(false));
    setFormData({
      round: currentRound === 'all' ? 'technical' : currentRound,
      question: '',
      answer: '',
      code: '',
      tags: ''
    });
    setImages([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  if (!isFormVisible) return null;

  return (
    <Paper sx={{ p: 3, mb: 4, border: 1, borderColor: 'divider' }}>
      <Typography variant="h5" gutterBottom>
        Add New Question
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Interview Round</InputLabel>
            <Select
              value={formData.round}
              label="Interview Round"
              onChange={(e) => setFormData(prev => ({ ...prev, round: e.target.value }))}
            >
              <MenuItem value="technical">Technical Round</MenuItem>
              <MenuItem value="hr">HR Round</MenuItem>
              <MenuItem value="telephonic">Telephonic Round</MenuItem>
              <MenuItem value="introduction">Introduction Round</MenuItem>
              <MenuItem value="behavioral">Behavioral Round</MenuItem>
              <MenuItem value="system-design">System Design Round</MenuItem>
              <MenuItem value="coding">Coding Round</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            label="Question"
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
          />

          <TextField
            fullWidth
            required
            multiline
            rows={6}
            label="Answer"
            value={formData.answer}
            onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
          />

          <TextField
            fullWidth
            multiline
            rows={8}
            label="Code Snippet (optional)"
            placeholder="// Your code here..."
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            sx={{
              '& .MuiInputBase-input': {
                fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: '0.875rem'
              }
            }}
          />

          <TextField
            fullWidth
            label="Tags (comma-separated)"
            placeholder="React, JavaScript, Hooks"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          />

          <TextField
            fullWidth
            type="file"
            label="Images (optional)"
            InputLabelProps={{ shrink: true }}
            inputProps={{ multiple: true, accept: 'image/*' }}
            onChange={handleImageChange}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              💾 Save Question
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default QuestionForm;
