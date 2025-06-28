
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './button';

const CodeBlock = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Simple syntax highlighting for common patterns
  const highlightCode = (code) => {
    return code
      .replace(/(\/\/.*$)/gm, '<span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/gm, '<span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|from|default)\b/g, '<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>')
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-orange-600 dark:text-orange-400">$1$2$3</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-red-600 dark:text-red-400">$1</span>')
      .replace(/([{}[\]();,.])/g, '<span class="text-gray-600 dark:text-gray-400">$1</span>');
  };

  return (
    <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg border">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-100 dark:bg-gray-800 rounded-t-lg">
        <span className="text-sm font-medium text-muted-foreground">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm">
          <code 
            dangerouslySetInnerHTML={{ 
              __html: highlightCode(code) 
            }}
            className="font-mono"
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
