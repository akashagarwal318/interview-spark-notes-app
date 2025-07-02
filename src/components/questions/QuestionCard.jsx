
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
    <div className="bg-gradient-to-r from-white via-purple-50/30 to-pink-50/30 dark:from-gray-800 dark:via-purple-900/20 dark:to-pink-900/20 border-3 border-gradient-to-r from-purple-200 to-pink-200 dark:border-purple-600 rounded-2xl mb-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-400 transform hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b-2 border-gradient-to-r from-purple-100 to-pink-100 dark:border-purple-700/50">
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            {question.question}
          </h3>
          <div className="flex items-center text-sm text-slate-600 dark:text-gray-400 space-x-6">
            <span className="capitalize bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold text-base px-3 py-1 rounded-full border-2 border-gradient-to-r from-blue-200 to-purple-200">
              {question.round?.replace('-', ' ') || 'General'}
            </span>
            <span className="text-slate-500 font-medium">{formatDate(question.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
          <button
            onClick={() => handleToggle('favorite')}
            className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
              question.favorite 
                ? 'text-amber-600 bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900/40 dark:to-yellow-900/40 shadow-xl border-3 border-amber-300 hover:shadow-2xl' 
                : 'text-gray-400 hover:text-amber-600 hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30 hover:shadow-lg border-2 border-gray-200 hover:border-amber-300'
            }`}
          >
            <Star className={`h-6 w-6 ${question.favorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={() => handleToggle('review')}
            className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
              question.review 
                ? 'text-emerald-600 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 dark:from-emerald-900/40 dark:to-green-900/40 shadow-xl border-3 border-emerald-300 hover:shadow-2xl' 
                : 'text-gray-400 hover:text-emerald-600 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 dark:hover:from-emerald-900/30 dark:hover:to-green-900/30 hover:shadow-lg border-2 border-gray-200 hover:border-emerald-300'
            }`}
          >
            <Bookmark className={`h-6 w-6 ${question.review ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={() => handleToggle('hot')}
            className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
              question.hot 
                ? 'text-rose-600 bg-gradient-to-br from-rose-100 via-red-100 to-pink-100 dark:from-rose-900/40 dark:to-red-900/40 shadow-xl border-3 border-rose-300 hover:shadow-2xl' 
                : 'text-gray-400 hover:text-rose-600 hover:bg-gradient-to-br hover:from-rose-50 hover:to-red-50 dark:hover:from-rose-900/30 dark:hover:to-red-900/30 hover:shadow-lg border-2 border-gray-200 hover:border-rose-300'
            }`}
          >
            <Flame className={`h-6 w-6 ${question.hot ? 'fill-current' : ''}`} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-4 rounded-2xl text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-purple-300 transform hover:scale-110 hover:-translate-y-1">
                <MoreVertical className="h-6 w-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-3 border-purple-200 dark:border-purple-700 z-50 shadow-2xl rounded-2xl">
              <DropdownMenuItem onClick={handleEdit} className="flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 rounded-xl mx-2 my-1">
                <Edit className="h-5 w-5 mr-3 text-blue-600" />
                <span className="text-blue-600 font-semibold">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/20 dark:hover:to-rose-900/20 rounded-xl mx-2 my-1">
                <Trash2 className="h-5 w-5 mr-3 text-red-600" />
                <span className="text-red-600 font-semibold">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-4 rounded-2xl text-gray-400 hover:text-indigo-600 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg border-2 border-gray-200 hover:border-indigo-300 ${
              expanded ? 'rotate-180 text-indigo-600 bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg border-indigo-300' : ''
            }`}
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 via-purple-50/50 to-pink-50/50 dark:from-gray-900/50 dark:via-purple-900/30 dark:to-pink-900/30">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Answer</h4>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/30 p-6 rounded-2xl border-l-4 border-blue-400 shadow-lg">
              {question.answer}
            </p>
          </div>

          {question.code && (
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">Code</h4>
              <div className="border-l-4 border-green-400 rounded-2xl overflow-hidden shadow-lg">
                <CodeBlock code={question.code} />
              </div>
            </div>
          )}

          {question.images && question.images.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">Images</h4>
              <div className="flex flex-wrap gap-4">
                {question.images.map((image, index) => (
                  <div
                    key={index}
                    className="w-24 h-24 rounded-2xl overflow-hidden cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-110 hover:-translate-y-1 border-3 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl"
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
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Tags</h4>
              <div className="flex flex-wrap gap-3">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full border-2 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
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
