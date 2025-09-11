import React from 'react';

const CodeView = ({ code, highlightSyntax, fullscreen }) => {
  const displayCode = code.endsWith('\n') ? code : code + '\n';
  const lines = displayCode.split('\n');
  return (
    <div className={`flex ${fullscreen ? 'min-h-0' : ''}`}>        
      <div className="flex flex-col text-xs text-gray-400 pr-2 select-none flex-shrink-0">
        {lines.map((_, index) => (
          <div key={index} className="leading-5 text-right min-w-[2.25rem] px-1">
            {index + 1}
          </div>
        ))}
      </div>
      <pre className="text-sm font-mono flex-1 overflow-x-auto pb-6">
        <code
          dangerouslySetInnerHTML={{ __html: highlightSyntax(displayCode) }}
          className="leading-5"
        />
      </pre>
    </div>
  );
};

export default CodeView;
