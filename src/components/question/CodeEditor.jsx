
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

  // Enhanced syntax highlighting for JavaScript/JSX
  const highlightCode = (code) => {
    return code
      // Keywords
      .replace(/(\b(?:const|let|var|function|class|if|else|for|while|return|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|namespace|public|private|protected|static|readonly|abstract)\b)/g, '<span style="color: #569cd6; font-weight: bold;">$1</span>')
      // Built-in values
      .replace(/(\b(?:true|false|null|undefined|NaN|Infinity)\b)/g, '<span style="color: #4fc1ff; font-weight: bold;">$1</span>')
      // Numbers
      .replace(/(\b\d+\.?\d*\b)/g, '<span style="color: #b5cea8; font-weight: bold;">$1</span>')
      // Strings
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span style="color: #ce9178;">$1$2$1</span>')
      // Comments
      .replace(/(\/\/.*$)/gm, '<span style="color: #6a9955; font-style: italic;">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a9955; font-style: italic;">$1</span>')
      // Functions
      .replace(/(\b\w+)(?=\s*\()/g, '<span style="color: #dcdcaa; font-weight: bold;">$1</span>')
      // Variables (simple detection)
      .replace(/(\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)(?=\s*[=:])/g, '<span style="color: #9cdcfe;">$1</span>')
      // JSX tags
      .replace(/(<\/?[a-zA-Z][a-zA-Z0-9]*[^>]*>)/g, '<span style="color: #92c5f7;">$1</span>')
      // Operators
      .replace(/([+\-*/%=<>!&|^~?:])/g, '<span style="color: #d4d4d4;">$1</span>')
      // Brackets
      .replace(/([(){}[\]])/g, '<span style="color: #ffd700; font-weight: bold;">$1</span>');
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
          style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", "Consolas", "Courier New", monospace' }}
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
              className="text-sm whitespace-pre-wrap leading-relaxed"
              style={{ 
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", "Consolas", "Courier New", monospace',
                lineHeight: '1.6'
              }}
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
