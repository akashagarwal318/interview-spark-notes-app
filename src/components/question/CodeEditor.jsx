
import React from 'react';

const CodeEditor = ({
  question,
  isEditing,
  editingField,
  tempValues,
  onFieldEdit,
  onFieldSave,
  onTempValueChange,
  onKeyPress
}) => {
  if (!question.code) return null;

  // Simple syntax highlighting for JavaScript/JSX
  const highlightCode = (code) => {
    return code
      .replace(/(\b(?:const|let|var|function|class|if|else|for|while|return|import|export|from|default)\b)/g, '<span style="color: #569cd6;">$1</span>')
      .replace(/(\b(?:true|false|null|undefined)\b)/g, '<span style="color: #569cd6;">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span style="color: #6a9955;">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a9955;">$1</span>')
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span style="color: #ce9178;">$1$2$1</span>')
      .replace(/(\b\d+\.?\d*\b)/g, '<span style="color: #b5cea8;">$1</span>');
  };

  return (
    <div>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
        💻 Code
      </div>
      {editingField === 'code' ? (
        <textarea
          value={tempValues.code}
          onChange={(e) => onTempValueChange('code', e.target.value)}
          onBlur={() => onFieldSave('code')}
          onKeyDown={(e) => onKeyPress(e, 'code')}
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-900 text-green-400 focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
          style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
          autoFocus
        />
      ) : (
        <div 
          className={`relative bg-gray-900 rounded-lg overflow-hidden ${isEditing ? 'cursor-text' : ''}`}
          onClick={() => onFieldEdit('code')}
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs text-gray-400">Code Editor</span>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre 
              className="text-green-400 font-mono text-sm whitespace-pre-wrap"
              style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
              dangerouslySetInnerHTML={{ 
                __html: highlightCode(question.code || '') 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
