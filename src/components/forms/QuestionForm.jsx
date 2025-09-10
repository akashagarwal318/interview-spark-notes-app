import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
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
const AdvancedCodeEditor = lazy(() => import('../ui/AdvancedCodeEditor'));
import { createQuestionAsync, updateQuestionAsync, createRoundAsync } from '../../store/slices/questionsSlice';
import { setFormVisible } from '../../store/slices/uiSlice';

const QuestionForm = () => {
  const dispatch = useDispatch();
  const { isFormVisible, editingQuestion } = useSelector((state) => state.ui);
  const { currentRound, rounds } = useSelector((state) => state.questions);
  const [customRoundInput, setCustomRoundInput] = useState('');

  const [formData, setFormData] = useState({
    round: currentRound === 'all' ? 'technical' : currentRound,
    question: '',
    answer: '',
    code: '',
  tags: [],
  codeLanguage: 'javascript'
  });
  const [images, setImages] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize form when editing
  useEffect(() => {
    if (editingQuestion && typeof editingQuestion === 'object') {
      setFormData({
        round: editingQuestion.round || 'technical',
        question: editingQuestion.question || '',
        answer: editingQuestion.answer || '',
        code: editingQuestion.code || '',
  tags: Array.isArray(editingQuestion.tags) ? editingQuestion.tags : [],
  codeLanguage: editingQuestion.codeLanguage || 'javascript'
      });
  setImages(Array.isArray(editingQuestion.images) ? editingQuestion.images : []);
  setSelectedLanguage(editingQuestion.codeLanguage || 'javascript');
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
    if (!formData.round) {
      alert('Please select an interview round.');
      return;
    }
    // Ensure tags is always an array
  const tagsArr = Array.isArray(formData.tags)
    ? formData.tags
      .filter(tag => tag && (typeof tag === 'string' ? tag.trim() : tag.name && tag.name.trim()))
      .map(tag => (typeof tag === 'string' ? tag.trim() : tag.name.trim()))
    : (formData.tags || '').split(',').map(tag => tag.trim()).filter(tag => tag);

    // Process images to base64
    const processedImages = await Promise.all(
      images.map(file => {
        // If already processed (has data AND maybe mimeType) keep but ensure mimeType exists
        if (file.data) {
          if (!file.mimeType) {
            const match = file.data.match(/^data:(image\/[^;]+);base64,/);
            return Promise.resolve({ ...file, mimeType: match?.[1] || 'image/png' });
          }
          return Promise.resolve(file);
        }
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target?.result;
            const match = typeof dataUrl === 'string' ? dataUrl.match(/^data:(image\/[^;]+);base64,/) : null;
            resolve({
              name: file.name,
              data: dataUrl,
              size: file.size,
              mimeType: match?.[1] || file.type || 'image/png'
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    const questionData = {
      round: formData.round,
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      code: formData.code,
      codeLanguage: formData.codeLanguage,
      tags: tagsArr,
      images: processedImages,
      createdAt: editingQuestion?.createdAt || new Date().toISOString()
    };

    if (editingQuestion) {
      const id = editingQuestion._id || editingQuestion.id;
      dispatch(updateQuestionAsync({ id, data: questionData }));
    } else {
      dispatch(createQuestionAsync(questionData));
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
  tags: [],
  codeLanguage: 'javascript'
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

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: blob.type });
            setImages(prev => [...prev, file]);
          }
        }
      }
    }
  };

  useEffect(() => {
    const handleGlobalPaste = (e) => {
      if (isFormVisible && e.target.closest('[data-paste-area]')) {
        handlePaste(e);
      }
    };
    
    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
  }, [isFormVisible]);

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = Array.isArray(formData.tags)
        ? formData.tags
        : (formData.tags || '').split(',').map(t => t.trim());
      if (!currentTags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...currentTags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = Array.isArray(formData.tags)
      ? formData.tags
      : (formData.tags || '').split(',').map(t => t.trim());
    setFormData(prev => ({ ...prev, tags: currentTags.filter(tag => tag !== tagToRemove) }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name === 'tagInput') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isFormVisible) return null;

  const tags = Array.isArray(formData.tags) ? formData.tags : (formData.tags || '').split(',').map(t => t.trim()).filter(t => t);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex p-4 justify-center items-center overflow-y-auto">
      <Card style={{ width: '100%', maxWidth: '75vw', height: '85vh' }} className="overflow-y-auto animate-fade-in animate-scale-in shadow-2xl" data-paste-area>
        <CardHeader className="sticky top-0 bg-card z-10 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-foreground">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCancel} className="hover:bg-accent hover:text-accent-foreground">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="round">Interview Round</Label>
              <Select
                value={formData.round}
                onValueChange={(value) => {
                  if (value === '__custom__') {
                    setFormData(prev => ({ ...prev, round: '' }));
                  } else {
                    setFormData(prev => ({ ...prev, round: value }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue>{formData.round ? formData.round.charAt(0).toUpperCase() + formData.round.slice(1).replace('-', ' ') + ' Round' : 'Select round'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {rounds.map(r => (
                    <SelectItem key={r} value={r}>{r.replace('-', ' ')} Round</SelectItem>
                  ))}
                  <SelectItem value="__custom__">+ Custom Round...</SelectItem>
                </SelectContent>
              </Select>
              {formData.round === '' && (
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Enter custom round name"
                    value={customRoundInput}
                    onChange={(e) => setCustomRoundInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="secondary" onClick={() => {
                    const name = customRoundInput.trim();
                    if (!name) return;
                    // generate slug similar to slice logic
                    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');
                    if (!rounds.includes(slug)) {
                      dispatch(createRoundAsync(name));
                    }
                    setFormData(prev => ({ ...prev, round: slug }));
                    setCustomRoundInput('');
                  }}>Add</Button>
                </div>
              )}
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
                      {typeof tag === 'object' ? tag.name : tag}
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
            <Suspense fallback={<div className="text-xs text-muted-foreground">Loading editor...</div>}>
              <AdvancedCodeEditor
                code={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                language={selectedLanguage || formData.codeLanguage}
                onLanguageChange={(lang) => { setSelectedLanguage(lang); setFormData(prev => ({ ...prev, codeLanguage: lang })); }}
                placeholder="// Your code here..."
              />
            </Suspense>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images (Optional)</Label>
            <div 
              ref={dropRef}
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop images here, paste with Ctrl+V, or click to select
                </p>
                <p className="text-xs text-muted-foreground/70 mb-3">
                  Supports JPG, PNG, GIF, WebP formats
                </p>
                <Input
                  ref={fileInputRef}
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full max-w-xs mx-auto"
                />
              </div>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                      {image.data ? (
                        <img 
                          src={image.data} 
                          alt={image.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2">
                          <div className="text-center">
                            <ImageIcon className="h-6 w-6 mx-auto mb-1" />
                            <div className="truncate">{image.name?.substring(0, 12) || 'Image'}...</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-background border-t border-border -mx-6 px-6 py-4">
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
