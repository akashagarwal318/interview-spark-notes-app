
import React, { useState } from 'react';
import { Edit, Star, Bookmark } from 'lucide-react';

interface Question {
  id: number;
  round: string;
  question: string;
  answer: string;
  code?: string;
  tags?: string[];
  favorite: boolean;
  review: boolean;
  hot: boolean;
  images?: Array<{ name: string; data: string; size: number }>;
}

interface QuestionCardProps {
  question: Question;
  isExpanded: boolean;
  isEditing: boolean;
  onToggleExpand: () => void;
  onToggleEdit: () => void;
  onToggleStatus: (status: 'favorite' | 'review' | 'hot') => void;
  onDelete: () => void;
  onSave: (field: string, value: string) => void;
  onImageClick: (imageSrc: string) => void;
  onRemoveImage: (imageIndex: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isExpanded,
  isEditing,
  onToggleExpand,
  onToggleEdit,
  onToggleStatus,
  onDelete,
  onSave,
  onImageClick,
  onRemoveImage
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<{
    question: string;
    answer: string;
    code: string;
    tags: string;
  }>({
    question: question.question,
    answer: question.answer,
    code: question.code || '',
    tags: question.tags?.join(', ') || ''
  });

  const handleFieldEdit = (field: string) => {
    if (isEditing) {
      setEditingField(field);
      setTempValues(prev => ({
        ...prev,
        [field]: field === 'tags' ? (question.tags?.join(', ') || '') : (question[field as keyof Question] as string || '')
      }));
    }
  };

  const handleFieldSave = (field: string) => {
    onSave(field, tempValues[field as keyof typeof tempValues]);
    setEditingField(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFieldSave(field);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const copyToClipboard = async (type: string) => {
    let textToCopy = '';
    switch (type) {
      case 'answer':
        textToCopy = question.answer;
        break;
      case 'code':
        textToCopy = question.code || '';
        break;
      case 'full':
        textToCopy = `Q: ${question.question}\n\nA: ${question.answer}`;
        if (question.code) {
          textToCopy += `\n\nCode:\n${question.code}`;
        }
        if (question.tags && question.tags.length > 0) {
          textToCopy += `\n\nTags: ${question.tags.join(', ')}`;
        }
        break;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={onToggleExpand}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            {editingField === 'question' ? (
              <input
                type="text"
                value={tempValues.question}
                onChange={(e) => setTempValues(prev => ({ ...prev, question: e.target.value }))}
                onBlur={() => handleFieldSave('question')}
                onKeyDown={(e) => handleKeyPress(e, 'question')}
                className="w-full text-lg font-semibold bg-transparent border-b-2 border-blue-500 outline-none text-gray-900 dark:text-white"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <h3 
                className={`text-lg font-semibold text-gray-900 dark:text-white ${isEditing ? 'cursor-text hover:bg-yellow-100 dark:hover:bg-yellow-900 px-2 py-1 rounded' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFieldEdit('question');
                }}
              >
                {question.question}
              </h3>
            )}
          </div>
          
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
              className={`p-2 rounded-lg transition-colors ${
                question.review 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900'
              }`}
              title="Toggle Review"
            >
              📌
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus('hot');
              }}
              className={`p-2 rounded-lg transition-colors ${
                question.hot 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900'
              }`}
              title="Toggle Hot List"
            >
              🔥
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
                onDelete();
              }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 transition-colors"
              title="Delete Question"
            >
              🗑️
            </button>
            
            <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="p-6 space-y-6">
            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  🏷️ Tags
                </div>
                {editingField === 'tags' ? (
                  <input
                    type="text"
                    value={tempValues.tags}
                    onChange={(e) => setTempValues(prev => ({ ...prev, tags: e.target.value }))}
                    onBlur={() => handleFieldSave('tags')}
                    onKeyDown={(e) => handleKeyPress(e, 'tags')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="React, JavaScript, Hooks"
                    autoFocus
                  />
                ) : (
                  <div 
                    className={`flex flex-wrap gap-2 ${isEditing ? 'cursor-text hover:bg-yellow-100 dark:hover:bg-yellow-900 p-2 rounded' : ''}`}
                    onClick={() => handleFieldEdit('tags')}
                  >
                    {question.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Answer */}
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                💡 Answer
              </div>
              {editingField === 'answer' ? (
                <textarea
                  value={tempValues.answer}
                  onChange={(e) => setTempValues(prev => ({ ...prev, answer: e.target.value }))}
                  onBlur={() => handleFieldSave('answer')}
                  onKeyDown={(e) => handleKeyPress(e, 'answer')}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
                  autoFocus
                />
              ) : (
                <div 
                  className={`whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed ${isEditing ? 'cursor-text hover:bg-yellow-100 dark:hover:bg-yellow-900 p-2 rounded' : ''}`}
                  onClick={() => handleFieldEdit('answer')}
                >
                  {question.answer}
                </div>
              )}
            </div>

            {/* Code */}
            {question.code && (
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  💻 Code
                </div>
                {editingField === 'code' ? (
                  <textarea
                    value={tempValues.code}
                    onChange={(e) => setTempValues(prev => ({ ...prev, code: e.target.value }))}
                    onBlur={() => handleFieldSave('code')}
                    onKeyDown={(e) => handleKeyPress(e, 'code')}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-900 text-green-400 focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
                    autoFocus
                  />
                ) : (
                  <div 
                    className={`relative bg-gray-900 rounded-lg overflow-hidden ${isEditing ? 'cursor-text' : ''}`}
                    onClick={() => handleFieldEdit('code')}
                  >
                    {/* Terminal Header */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="ml-2 text-xs text-gray-400">Code Editor</span>
                    </div>
                    <pre className="p-4 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                      <code>{question.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Images */}
            {question.images && question.images.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  📷 Images
                </div>
                <div className="flex flex-wrap gap-3">
                  {question.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.data}
                        alt={image.name}
                        className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 dark:border-gray-700"
                        onClick={() => onImageClick(image.data)}
                      />
                      {isEditing && (
                        <button
                          onClick={() => onRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Copy Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => copyToClipboard('answer')}
                className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                📋 Copy Answer
              </button>
              {question.code && (
                <button
                  onClick={() => copyToClipboard('code')}
                  className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  📋 Copy Code
                </button>
              )}
              <button
                onClick={() => copyToClipboard('full')}
                className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                📋 Copy All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
