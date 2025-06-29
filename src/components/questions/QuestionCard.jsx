
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
import { Button } from '../ui/button';
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 leading-relaxed">
            {question.question}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {question.round?.replace('-', ' ').charAt(0).toUpperCase() + question.round?.replace('-', ' ').slice(1) || 'General'} • {formatDate(question.createdAt)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => handleToggle('favorite')}
            className={`p-2 rounded-full transition-colors ${
              question.favorite 
                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
            }`}
            title="Add to Favorites"
          >
            <Star className={`h-5 w-5 ${question.favorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={() => handleToggle('review')}
            className={`p-2 rounded-full transition-colors ${
              question.review 
                ? 'text-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
            title="Mark for Review"
          >
            <Bookmark className={`h-5 w-5 ${question.review ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={() => handleToggle('hot')}
            className={`p-2 rounded-full transition-colors ${
              question.hot 
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
            title="Add to Hot List"
          >
            <Flame className={`h-5 w-5 ${question.hot ? 'fill-current' : ''}`} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <DropdownMenuItem onClick={handleEdit} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-2 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all ${
              expanded ? 'rotate-180' : ''
            }`}
            title="Expand/Collapse"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Answer</h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {question.answer}
            </p>
          </div>

          {question.code && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Code</h4>
              <CodeBlock code={question.code} />
            </div>
          )}

          {question.images && question.images.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Images</h4>
              <div className="flex flex-wrap gap-3">
                {question.images.map((image, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-200 dark:border-gray-700"
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
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-700"
                  >
                    {tag}
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
