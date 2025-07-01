
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
    <div className="bg-gradient-to-r from-white to-slate-50 dark:from-gray-800 dark:to-gray-850 border-2 border-slate-200 dark:border-gray-600 rounded-xl mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-gray-700">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 leading-snug">
            {question.question}
          </h3>
          <div className="flex items-center text-sm text-slate-600 dark:text-gray-400 space-x-4">
            <span className="capitalize bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-medium">
              {question.round?.replace('-', ' ') || 'General'}
            </span>
            <span className="text-slate-500">{formatDate(question.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
          <button
            onClick={() => handleToggle('favorite')}
            className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
              question.favorite 
                ? 'text-amber-600 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 shadow-md border-2 border-amber-300' 
                : 'text-gray-400 hover:text-amber-600 hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 dark:hover:from-amber-900/20 dark:hover:to-yellow-900/20 hover:shadow-md'
            }`}
          >
            <Star className={`h-5 w-5 ${question.favorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={() => handleToggle('review')}
            className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
              question.review 
                ? 'text-emerald-600 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 shadow-md border-2 border-emerald-300' 
                : 'text-gray-400 hover:text-emerald-600 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 dark:hover:from-emerald-900/20 dark:hover:to-green-900/20 hover:shadow-md'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${question.review ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={() => handleToggle('hot')}
            className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
              question.hot 
                ? 'text-rose-600 bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30 shadow-md border-2 border-rose-300' 
                : 'text-gray-400 hover:text-rose-600 hover:bg-gradient-to-br hover:from-rose-50 hover:to-red-50 dark:hover:from-rose-900/20 dark:hover:to-red-900/20 hover:shadow-md'
            }`}
          >
            <Flame className={`h-5 w-5 ${question.hot ? 'fill-current' : ''}`} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-3 rounded-xl text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 hover:shadow-md">
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 z-50 shadow-xl rounded-xl">
              <DropdownMenuItem onClick={handleEdit} className="flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 rounded-lg mx-1 my-1">
                <Edit className="h-4 w-4 mr-3 text-blue-600" />
                <span className="text-blue-600 font-medium">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/20 dark:hover:to-rose-900/20 rounded-lg mx-1 my-1">
                <Trash2 className="h-4 w-4 mr-3 text-red-600" />
                <span className="text-red-600 font-medium">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-3 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300 transform hover:scale-110 hover:shadow-md ${
              expanded ? 'rotate-180 text-indigo-600 bg-gradient-to-br from-indigo-100 to-purple-100' : ''
            }`}
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Answer</h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-400 shadow-sm">
              {question.answer}
            </p>
          </div>

          {question.code && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-base bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Code</h4>
              <div className="border-l-4 border-green-400 rounded-lg overflow-hidden shadow-sm">
                <CodeBlock code={question.code} />
              </div>
            </div>
          )}

          {question.images && question.images.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-base bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Images</h4>
              <div className="flex flex-wrap gap-3">
                {question.images.map((image, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 border-2 border-purple-200 dark:border-purple-700 shadow-md hover:shadow-lg"
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
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-base bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full border border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
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
