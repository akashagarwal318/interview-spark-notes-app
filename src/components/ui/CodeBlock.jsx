
import React from 'react';
import AdvancedCodeEditor from './AdvancedCodeEditor';

const CodeBlock = ({ code, language = 'javascript' }) => {
  return (
    <div className="my-4">
      <AdvancedCodeEditor
        code={code || '// No code provided'}
        language={language}
        readOnly={true}
      />
    </div>
  );
};

export default CodeBlock;
