
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Star, 
  Bookmark, 
  Flame, 
  ChevronDown, 
  Edit, 
  Trash2, 
  MoreVertical
} from 'lucide-react';
import { updateQuestionAsync, deleteQuestionAsync } from '../../store/slices/questionsSlice';
import { setImageModal, setEditingQuestion, setExpandedQuestionId } from '../../store/slices/uiSlice';
import CodeBlock from '../ui/CodeBlock';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const QuestionCard = ({ question }) => {
  const dispatch = useDispatch();
  const { expandedQuestionId } = useSelector((state) => state.ui);
  const expanded = expandedQuestionId === (question._id || question.id);

  const handleToggle = (field) => {
    dispatch(updateQuestionAsync({
      id: question._id || question.id,
      data: { [field]: !question[field] }
    }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      dispatch(deleteQuestionAsync(question._id || question.id));
    }
  };

  const handleEdit = () => {
    dispatch(setEditingQuestion(question));
  };

  const handleImageClick = (imageSrc) => {
    dispatch(setImageModal({ isOpen: true, imageSrc }));
  };

  const handleCardClick = (e) => {
    // Don't expand if clicking on buttons or interactive elements
    if (e.target.closest('button') || e.target.closest('[role="button"]')) {
      return;
    }
    dispatch(setExpandedQuestionId(expanded ? null : (question._id || question.id)));
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Recently added';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently added';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Recently added';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg mb-4 transition-all hover:shadow-md hover:border-primary/20 cursor-pointer"
         onClick={handleCardClick}>
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-border">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-card-foreground mb-1 leading-snug hover:text-primary transition-colors">
            {question.question}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <span className="capitalize">{question.round?.replace('-', ' ') || 'General'}</span>
            <span>{formatDate(question.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
          <button
            onClick={(e) => {e.stopPropagation(); handleToggle('favorite');}}
            className={`p-2 rounded-md transition-all hover:scale-110 ${
              question.favorite 
                ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' 
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
            }`}
          >
            <Star className={`h-4 w-4 ${question.favorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {e.stopPropagation(); handleToggle('review');}}
            className={`p-2 rounded-md transition-all hover:scale-110 ${
              question.review 
                ? 'text-green-600 bg-green-50 dark:bg-green-900/20' 
                : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${question.review ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {e.stopPropagation(); handleToggle('hot');}}
            className={`p-2 rounded-md transition-all hover:scale-110 ${
              question.hot 
                ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <Flame className={`h-4 w-4 ${question.hot ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {e.stopPropagation(); handleEdit();}}
            className="p-2 rounded-md text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:scale-110"
            title="Edit question"
          >
            <Edit className="h-4 w-4" />
          </button>

          <button
            onClick={(e) => {e.stopPropagation(); handleDelete();}}
            className="p-2 rounded-md text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all hover:scale-110"
            title="Delete question"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 space-y-4 bg-muted/50 animate-accordion-down">
          <div>
            <h4 className="font-medium text-card-foreground mb-2 text-sm">Answer</h4>
            <pre className="text-card-foreground/80 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {question.answer}
            </pre>
          </div>

          {question.code && (
            <div>
              <h4 className="font-medium text-card-foreground mb-2 text-sm">Code</h4>
              <CodeBlock code={question.code} />
            </div>
          )}

          {question.images && question.images.length > 0 && (
            <div>
              <h4 className="font-medium text-card-foreground mb-2 text-sm">Images</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {question.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={(e) => {e.stopPropagation(); handleImageClick(image.data);}}
                  >
                    <div className="aspect-video rounded-md overflow-hidden border border-border shadow-sm hover:shadow-md transition-all bg-muted">
                      <img
                        src={image.data}
                        alt={image.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black/50 px-2 py-1 rounded">
                        Click to enlarge
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {question.tags && question.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-card-foreground mb-2 text-sm">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {question.tags.map((tag) => (
                  <span
                    key={tag._id || tag.name || tag}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded border border-primary/20"
                    style={tag.color ? { backgroundColor: `${tag.color}20`, borderColor: `${tag.color}40`, color: tag.color } : {}}
                  >
                    {tag.name || tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
