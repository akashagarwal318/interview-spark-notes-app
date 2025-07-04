
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Upload, Code, ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import AdvancedCodeEditor from '../ui/AdvancedCodeEditor';
import { addQuestion, updateQuestion } from '../../store/slices/questionsSlice';
import { setFormVisible } from '../../store/slices/uiSlice';

const QuestionForm = () => {
  const dispatch = useDispatch();
  const { isFormVisible, editingQuestion } = useSelector((state) => state.ui);
  const { currentRound } = useSelector((state) => state.questions);

  const [formData, setFormData] = useState({
    round: currentRound === 'all' ? 'technical' : currentRound,
    question: '',
    answer: '',
    code: '',
    tags: ''
  });
  const [images, setImages] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const dropRef = useRef(null);

  // Initialize form when editing
  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        round: editingQuestion.round || 'technical',
        question: editingQuestion.question || '',
        answer: editingQuestion.answer || '',
        code: editingQuestion.code || '',
        tags: editingQuestion.tags ? editingQuestion.tags.join(', ') : ''
      });
      setImages(editingQuestion.images || []);
    } else {
      resetForm();
    }
  }, [editingQuestion, currentRound]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Please fill in both question and answer fields.');
      return;
    }

    const processedImages = await Promise.all(
      images.map(file => {
        if (file.data) return Promise.resolve(file); // Already processed
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
      images: processedImages,
      createdAt: editingQuestion?.createdAt || new Date().toISOString()
    };

    if (editingQuestion) {
      dispatch(updateQuestion({ ...questionData, id: editingQuestion.id }));
    } else {
      dispatch(addQuestion(questionData));
    }
    
    dispatch(setFormVisible(false));
    resetForm();
  };

  const handleCancel = () => {
    dispatch(setFormVisible(false));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      round: currentRound === 'all' ? 'technical' : currentRound,
      question: '',
      answer: '',
      code: '',
      tags: ''
    });
    setImages([]);
    setTagInput('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      setImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
      if (!currentTags.includes(tagInput.trim())) {
        const newTags = [...currentTags, tagInput.trim()];
        setFormData(prev => ({ ...prev, tags: newTags.join(', ') }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = formData.tags.split(',').map(t => t.trim());
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    setFormData(prev => ({ ...prev, tags: newTags.join(', ') }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name === 'tagInput') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isFormVisible) return null;

  const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in animate-scale-in">
        <CardHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="round">Interview Round</Label>
              <Select 
                value={formData.round} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, round: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Round</SelectItem>
                  <SelectItem value="hr">HR Round</SelectItem>
                  <SelectItem value="telephonic">Telephonic Round</SelectItem>
                  <SelectItem value="introduction">Introduction Round</SelectItem>
                  <SelectItem value="behavioral">Behavioral Round</SelectItem>
                  <SelectItem value="system-design">System Design Round</SelectItem>
                  <SelectItem value="coding">Coding Round</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  name="tagInput"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)} 
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              placeholder="Enter your interview question..."
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer *</Label>
            <Textarea
              id="answer"
              placeholder="Enter the answer or key points... (Supports bullets: • Use Alt+8 or copy-paste formatted text)"
              value={formData.answer}
              onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
              rows={6}
              className="resize-none font-mono text-sm leading-relaxed"
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code Snippet (Optional)</Label>
            <AdvancedCodeEditor
              code={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              language={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              placeholder="// Your code here..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images (Optional)</Label>
            <div 
              ref={dropRef}
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drag & drop images here, or click to select
                </p>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 dark:border-gray-700">
                      {image.data ? (
                        <img 
                          src={image.data} 
                          alt={image.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-1">
                          {image.name?.substring(0, 8)}...
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-gray-900 border-t -mx-6 px-6 py-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {editingQuestion ? 'Update Question' : '💾 Save Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionForm;
