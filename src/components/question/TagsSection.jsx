
import React, { useState } from 'react';

const TagsSection = ({
  question,
  isEditing,
  editingField,
  tempValues,
  onFieldEdit,
  onFieldSave,
  onTempValueChange,
  onKeyPress
}) => {
  const [newTag, setNewTag] = useState('');
  
  const handleAddTag = () => {
    if (newTag.trim() && isEditing) {
      const currentTags = question.tags || [];
      const updatedTags = [...currentTags, newTag.trim()];
      onFieldSave('tags', updatedTags.join(', '));
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagIndex) => {
    if (isEditing) {
      const currentTags = question.tags || [];
      const updatedTags = currentTags.filter((_, index) => index !== tagIndex);
      onFieldSave('tags', updatedTags.join(', '));
    }
  };

  if (!question.tags || question.tags.length === 0) {
    return (
      <div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          🏷️ Tags
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Add tag and press Enter"
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            No tags added yet. {isEditing && "Click to add tags."}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
        🏷️ Tags
      </div>
      {editingField === 'tags' ? (
        <input
          type="text"
          value={tempValues.tags}
          onChange={(e) => onTempValueChange('tags', e.target.value)}
          onBlur={() => onFieldSave('tags')}
          onKeyDown={(e) => onKeyPress(e, 'tags')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          placeholder="React, JavaScript, Hooks"
          autoFocus
        />
      ) : (
        <div>
          <div 
            className={`flex flex-wrap gap-2 mb-2 ${isEditing ? 'cursor-text hover:bg-yellow-100 dark:hover:bg-yellow-900 p-2 rounded' : ''}`}
            onClick={() => onFieldEdit('tags')}
          >
            {question.tags.map((tag, index) => (
              <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium relative group">
                {tag}
                {isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(index);
                    }}
                    className="ml-2 text-blue-200 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Add new tag"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagsSection;
