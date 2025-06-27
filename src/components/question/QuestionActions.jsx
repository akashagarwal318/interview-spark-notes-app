
import React from 'react';

const QuestionActions = ({ question, onCopyToClipboard }) => {
  return (
    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onCopyToClipboard('answer')}
        className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        📋 Copy Answer
      </button>
      {question.code && (
        <button
          onClick={() => onCopyToClipboard('code')}
          className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          📋 Copy Code
        </button>
      )}
      <button
        onClick={() => onCopyToClipboard('full')}
        className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        📋 Copy All
      </button>
    </div>
  );
};

export default QuestionActions;
