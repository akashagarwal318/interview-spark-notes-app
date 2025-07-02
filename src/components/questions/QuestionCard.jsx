
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Star, 
  Bookmark, 
  Flame, 
  ChevronDown, 
  Edit, 
  Trash2, 
  MoreVertical
} from 'lucide-react';
import { updateQuestion, deleteQuestion } from '../../store/slices/questionsSlice';
import { setImageModal, setEditingQuestion } from '../../store/slices/uiSlice';
import CodeBlock from '../ui/CodeBlock';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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

  const handleEdit = () => {
    dispatch(setEditingQuestion(question));
  };

  const handleImageClick = (imageSrc) => {
    dispatch(setImageModal({ isOpen: true, imageSrc }));
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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 hover:scale-[1.02] cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex-1 min-w-0" onClick={() => setExpanded(!expanded)}>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {question.question}
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
            <span className="capitalize">{question.round?.replace('-', ' ') || 'General'}</span>
            <span>{formatDate(question.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle('favorite');
            }}
            className={`p-2 rounded-md transition-all duration-200 hover:scale-110 ${
              question.favorite 
                ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' 
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
            }`}
          >
            <Star className={`h-4 w-4 transition-all duration-200 ${question.favorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle('review');
            }}
            className={`p-2 rounded-md transition-all duration-200 hover:scale-110 ${
              question.review 
                ? 'text-green-600 bg-green-50 dark:bg-green-900/20' 
                : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
          >
            <Bookmark className={`h-4 w-4 transition-all duration-200 ${question.review ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle('hot');
            }}
            className={`p-2 rounded-md transition-all duration-200 hover:scale-110 ${
              question.hot 
                ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <Flame className={`h-4 w-4 transition-all duration-200 ${question.hot ? 'fill-current' : ''}`} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
              <DropdownMenuItem onClick={handleEdit} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 transition-colors">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className={`p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110 ${
              expanded ? 'rotate-180' : ''
            }`}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content with Animation */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50 animate-fade-in">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Answer</h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {question.answer}
            </p>
          </div>

          {question.code && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Code</h4>
              <CodeBlock code={question.code} />
            </div>
          )}

          {question.images && question.images.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Images</h4>
              <div className="flex flex-wrap gap-2">
                {question.images.map((image, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700"
                    onClick={() => handleImageClick(image.data)}
                  >
                    <img
                      src={image.data}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {question.tags && question.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
