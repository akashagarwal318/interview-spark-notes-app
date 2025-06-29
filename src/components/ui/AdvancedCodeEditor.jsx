
import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Download, Upload, Code, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './button';

const AdvancedCodeEditor = ({ 
  code = '', 
  onChange, 
  language = 'javascript',
  placeholder = '// Start coding...',
  readOnly = false 
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code.${language === 'javascript' ? 'js' : language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (onChange && typeof content === 'string') {
          onChange({ target: { value: content } });
        }
      };
      reader.readAsText(file);
    }
  };

  const formatCode = () => {
    if (!code || !onChange) return;
    
    // Simple formatting - add proper indentation
    const lines = code.split('\n');
    let indentLevel = 0;
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.includes('}') && !trimmed.includes('{')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indented = '  '.repeat(indentLevel) + trimmed;
      
      if (trimmed.includes('{') && !trimmed.includes('}')) {
        indentLevel++;
      }
      
      return indented;
    }).join('\n');
    
    onChange({ target: { value: formatted } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      
      if (onChange) {
        onChange({ target: { value: newValue } });
      }
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const value = e.target.value;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const indent = currentLine.match(/^\s*/)?.[0] || '';
      
      // Add extra indent for opening braces
      const extraIndent = currentLine.trim().endsWith('{') ? '  ' : '';
      const newValue = value.substring(0, start) + '\n' + indent + extraIndent + value.substring(start);
      
      if (onChange) {
        onChange({ target: { value: newValue } });
      }
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1 + indent.length + extraIndent.length;
      }, 0);
    }
  };

  const highlightSyntax = (code) => {
    return code
      .replace(/(\/\/.*$)/gm, '<span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/gm, '<span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|from|default|async|await|try|catch|finally)\b/g, '<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>')
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-orange-600 dark:text-orange-400">$1$2$3</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-red-600 dark:text-red-400">$1</span>')
      .replace(/([{}[\]();,.])/g, '<span class="text-gray-600 dark:text-gray-400">$1</span>');
  };

  return (
    <div className={`relative bg-gray-50 dark:bg-gray-900 rounded-lg border ${isFullscreen ? 'fixed inset-0 z-50' : 'h-64'}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-100 dark:bg-gray-800 rounded-t-lg">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Code className="h-4 w-4" />
          {language}
        </span>
        <div className="flex items-center gap-1">
          {!readOnly && (
            <>
              <input
                type="file"
                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css"
                onChange={handleFileUpload}
                className="hidden"
                id="code-upload"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById('code-upload')?.click()}
                className="h-7 w-7 p-0"
                title="Upload file"
              >
                <Upload className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={formatCode}
                className="h-7 w-7 p-0 text-xs"
                title="Format code"
              >
                {'{}'}
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 w-7 p-0"
            title="Download"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0"
            title="Copy"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-7 w-7 p-0"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
        </div>
      </div>
      
      <div className="relative flex-1 overflow-hidden">
        {readOnly ? (
          <div className="p-3 overflow-auto h-full">
            <pre className="text-sm font-mono">
              <code 
                dangerouslySetInnerHTML={{ 
                  __html: highlightSyntax(code) 
                }}
              />
            </pre>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={code}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-full p-3 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
            style={{ 
              minHeight: isFullscreen ? 'calc(100vh - 60px)' : '200px',
              tabSize: 2
            }}
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
};

export default AdvancedCodeEditor;
