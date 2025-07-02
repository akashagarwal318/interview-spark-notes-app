
import React, { useState, useRef, useEffect } from 'react';
import { Code } from 'lucide-react';

const AdvancedCodeEditor = ({ 
  code = '', 
  onChange, 
  language = 'javascript', 
  readOnly = false, 
  placeholder = '// Your code here...' 
}) => {
  const [currentCode, setCurrentCode] = useState(code);
  const textareaRef = useRef(null);

  useEffect(() => {
    setCurrentCode(code);
  }, [code]);

  const handleChange = (e) => {
    const newCode = e.target.value;
    setCurrentCode(newCode);
    if (onChange) {
      onChange(e);
    }
  };

  const handleKeyDown = (e) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = currentCode.substring(0, start) + '  ' + currentCode.substring(end);
      setCurrentCode(newValue);
      
      // Reset cursor position
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
      
      if (onChange) {
        onChange({ target: { value: newValue } });
      }
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
            {language}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={currentCode}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          readOnly={readOnly}
          className="w-full h-48 p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-none outline-none resize-none"
          style={{
            lineHeight: '1.5',
            tabSize: 2,
            fontSize: '14px',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
          }}
        />
      </div>
    </div>
  );
};

export default AdvancedCodeEditor;
