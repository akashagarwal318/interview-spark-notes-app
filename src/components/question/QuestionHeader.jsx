
import React from 'react';
import { Edit, Star, Bookmark } from 'lucide-react';

const QuestionHeader = ({
  question,
  isExpanded,
  isEditing,
  editingField,
  tempValues,
  roundOptions,
  onToggleExpand,
  onToggleEdit,
  onToggleStatus,
  onDelete,
  onDuplicate,
  onFieldEdit,
  onFieldSave,
  onTempValueChange,
  onKeyPress
}) => {
  return (
    <div 
      className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      onClick={onToggleExpand}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {/* Round Badge */}
          <div className="mb-2">
            {editingField === 'round' ? (
              <select
                value={tempValues.round || ''}
                onChange={(e) => onTempValueChange('round', e.target.value)}
                onBlur={() => onFieldSave('round')}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full border border-blue-300 dark:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              >
                <option value="">Select Round</option>
                {roundOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <span 
                className={`inline-block px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium ${isEditing ? 'cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditing) onFieldEdit('round');
                }}
              >
                {roundOptions.find(opt => opt.value === question.round)?.label || question.round || 'No Round'}
              </span>
            )}
          </div>
          
          {/* Question Title */}
          {editingField === 'question' ? (
            <input
              type="text"
              value={tempValues.question}
              onChange={(e) => onTempValueChange('question', e.target.value)}
              onBlur={() => onFieldSave('question')}
              onKeyDown={(e) => onKeyPress(e, 'question')}
              className="w-full text-lg font-semibold bg-transparent border-b-2 border-blue-500 outline-none text-gray-900 dark:text-white"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <h3 
              className={`text-lg font-semibold text-gray-900 dark:text-white ${isEditing ? 'cursor-text hover:bg-yellow-100 dark:hover:bg-yellow-900 px-2 py-1 rounded' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing) onFieldEdit('question');
              }}
            >
              {question.question}
            </h3>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus('favorite');
            }}
            className={`p-2 rounded-lg transition-colors ${
              question.favorite 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900'
            }`}
            title="Toggle Favorite"
          >
            <Star size={16} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus('review');
            }}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
              question.review 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900'
            }`}
            title="Toggle Review"
          >
            <span className="text-sm">📌</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus('hot');
            }}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
              question.hot 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900'
            }`}
            title="Toggle Hot List"
          >
            <span className="text-sm">🔥</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleEdit();
            }}
            className={`p-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900'
            }`}
            title="Toggle Edit Mode"
          >
            <Edit size={16} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-600 transition-colors flex items-center justify-center"
            title="Duplicate Question"
          >
            <span className="text-sm">📄</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 transition-colors flex items-center justify-center"
            title="Delete Question"
          >
            <span className="text-sm">🗑️</span>
          </button>
          
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
