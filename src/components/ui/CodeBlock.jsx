
import React from 'react';
import AdvancedCodeEditor from './AdvancedCodeEditor';

const CodeBlock = ({ code, language = 'javascript' }) => {
  return (
    <AdvancedCodeEditor
      code={code}
      language={language}
      readOnly={true}
    />
  );
};

export default CodeBlock;
