
import React, { useState } from 'react';
import QuestionHeader from './question/QuestionHeader';
import TagsSection from './question/TagsSection';
import CodeEditor from './question/CodeEditor';
import ImageGallery from './question/ImageGallery';
import QuestionActions from './question/QuestionActions';

const QuestionCard = ({
  question,
  isExpanded,
  isEditing,
  onToggleExpand,
  onToggleEdit,
  onToggleStatus,
  onDelete,
  onDuplicate,
  onSave,
  onImageClick,
  onRemoveImage,
  onAddImage
}) => {
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({
    question: question.question,
    answer: question.answer,
    code: question.code || '',
    tags: question.tags?.join(', ') || '',
    round: question.round
  });

  const roundOptions = [
    { value: 'technical', label: 'Technical' },
    { value: 'hr', label: 'HR' },
    { value: 'telephonic', label: 'Telephonic' },
    { value: 'introduction', label: 'Introduction' },
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'system-design', label: 'System Design' },
    { value: 'coding', label: 'Coding' }
  ];

  const handleFieldEdit = (field) => {
    if (isEditing) {
      setEditingField(field);
      setTempValues(prev => ({
        ...prev,
        [field]: field === 'tags' ? (question.tags?.join(', ') || '') : (question[field] || '')
      }));
    }
  };

  const handleFieldSave = (field) => {
    onSave(field, tempValues[field]);
    setEditingField(null);
  };

  const handleTempValueChange = (field, value) => {
    setTempValues(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFieldSave(field);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const copyToClipboard = async (type) => {
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
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <QuestionHeader
        question={question}
        isExpanded={isExpanded}
        isEditing={isEditing}
        editingField={editingField}
        tempValues={tempValues}
        roundOptions={roundOptions}
        onToggleExpand={onToggleExpand}
        onToggleEdit={onToggleEdit}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onFieldEdit={handleFieldEdit}
        onFieldSave={handleFieldSave}
        onTempValueChange={handleTempValueChange}
        onKeyPress={handleKeyPress}
      />

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="p-4 sm:p-6 space-y-6">
            <TagsSection
              question={question}
              isEditing={isEditing}
              editingField={editingField}
              tempValues={tempValues}
              onFieldEdit={handleFieldEdit}
              onFieldSave={handleFieldSave}
              onTempValueChange={handleTempValueChange}
              onKeyPress={handleKeyPress}
            />

            {/* Answer Section */}
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                💡 Answer
              </div>
              {editingField === 'answer' ? (
                <textarea
                  value={tempValues.answer}
                  onChange={(e) => handleTempValueChange('answer', e.target.value)}
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

            <CodeEditor
              question={question}
              isEditing={isEditing}
              editingField={editingField}
              tempValues={tempValues}
              onFieldEdit={handleFieldEdit}
              onFieldSave={handleFieldSave}
              onTempValueChange={handleTempValueChange}
              onKeyPress={handleKeyPress}
            />

            <ImageGallery
              question={question}
              isEditing={isEditing}
              onImageClick={onImageClick}
              onRemoveImage={onRemoveImage}
              onAddImage={onAddImage}
            />

            <QuestionActions
              question={question}
              onCopyToClipboard={copyToClipboard}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
