
import React from 'react';
import AdvancedCodeEditor from './AdvancedCodeEditor';

const CodeBlock = ({ code, language = 'javascript', searchTerm = '', isMatch = false, maxHeight = '20rem' }) => {
  // Handle empty code
  if (!code || code.trim() === '') {
    return null;
  }
  
  return (
    <div className="relative bg-muted/40 rounded-md border border-border">
      {isMatch && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-xs text-white font-medium px-2 py-0.5 rounded-bl z-10">
          Match
        </div>
      )}
      <div className="overflow-auto rounded-md" style={{ maxHeight }}>
        <AdvancedCodeEditor
          code={code}
          language={language}
          readOnly={true}
          maxHeight={maxHeight}
        />
      </div>
    </div>
  );
};

export default CodeBlock;
