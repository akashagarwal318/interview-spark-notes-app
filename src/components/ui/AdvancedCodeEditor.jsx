
import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Download, Upload, Code, Maximize2, Minimize2, Palette } from 'lucide-react';
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
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: 'js' },
    { value: 'typescript', label: 'TypeScript', ext: 'ts' },
    { value: 'react', label: 'React/JSX', ext: 'jsx' },
    { value: 'html', label: 'HTML', ext: 'html' },
    { value: 'css', label: 'CSS', ext: 'css' },
    { value: 'json', label: 'JSON', ext: 'json' },
    { value: 'python', label: 'Python', ext: 'py' },
    { value: 'java', label: 'Java', ext: 'java' },
    { value: 'cpp', label: 'C++', ext: 'cpp' },
    { value: 'sql', label: 'SQL', ext: 'sql' }
  ];

  const getLanguageConfig = (lang) => {
    const configs = {
      javascript: {
        keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch', 'finally', 'new', 'this', 'super', 'extends', 'static', 'typeof', 'instanceof'],
        builtins: ['console', 'document', 'window', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Date', 'Math', 'JSON', 'Promise', 'setTimeout', 'setInterval'],
        operators: ['===', '!==', '==', '!=', '<=', '>=', '<', '>', '&&', '||', '!', '+', '-', '*', '/', '%', '=', '+=', '-=', '*=', '/='],
        brackets: ['{', '}', '[', ']', '(', ')']
      },
      typescript: {
        keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch', 'finally', 'new', 'this', 'super', 'extends', 'static', 'typeof', 'instanceof', 'interface', 'type', 'enum', 'namespace', 'module', 'declare', 'abstract', 'implements', 'private', 'public', 'protected', 'readonly'],
        builtins: ['console', 'document', 'window', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Date', 'Math', 'JSON', 'Promise', 'setTimeout', 'setInterval'],
        operators: ['===', '!==', '==', '!=', '<=', '>=', '<', '>', '&&', '||', '!', '+', '-', '*', '/', '%', '=', '+=', '-=', '*=', '/=', '=>'],
        brackets: ['{', '}', '[', ']', '(', ')']
      },
      react: {
        keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch', 'finally', 'new', 'this', 'super', 'extends', 'static', 'typeof', 'instanceof', 'component'],
        builtins: ['React', 'useState', 'useEffect', 'useContext', 'useReducer', 'useMemo', 'useCallback', 'useRef', 'Component', 'PureComponent', 'Fragment'],
        operators: ['===', '!==', '==', '!=', '<=', '>=', '<', '>', '&&', '||', '!', '+', '-', '*', '/', '%', '=', '+=', '-=', '*=', '/=', '=>'],
        brackets: ['{', '}', '[', ']', '(', ')', '<', '>']
      },
      html: {
        keywords: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'select', 'option', 'textarea'],
        builtins: ['DOCTYPE', 'meta', 'link', 'script', 'style', 'title'],
        operators: ['='],
        brackets: ['<', '>', '{', '}', '[', ']', '(', ')']
      },
      css: {
        keywords: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top', 'right', 'bottom', 'left', 'font', 'text', 'line-height', 'vertical-align', 'z-index', 'opacity', 'visibility', 'overflow', 'float', 'clear'],
        builtins: ['px', 'em', 'rem', '%', 'vh', 'vw', 'auto', 'none', 'block', 'inline', 'flex', 'grid', 'absolute', 'relative', 'fixed', 'sticky'],
        operators: [':'],
        brackets: ['{', '}', '[', ']', '(', ')']
      }
    };
    return configs[lang] || configs.javascript;
  };

  const highlightSyntax = (code, lang) => {
    if (!code) return '';
    
    const config = getLanguageConfig(lang);
    let highlighted = code;

    // Escape HTML
    highlighted = highlighted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Language-specific highlighting
    if (lang === 'html') {
      // HTML tags
      highlighted = highlighted.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^<>]*>/g, '<span class="text-blue-600 dark:text-blue-400 font-semibold">&lt;$1&gt;</span>');
      // HTML attributes
      highlighted = highlighted.replace(/(\w+)=(["'])((?:(?!\2)[^\\]|\\.)*)(\2)/g, '<span class="text-green-600 dark:text-green-400">$1</span>=<span class="text-orange-600 dark:text-orange-400">$2$3$4</span>');
    } else if (lang === 'css') {
      // CSS selectors
      highlighted = highlighted.replace(/^([.#]?[a-zA-Z][a-zA-Z0-9_-]*)\s*{/gm, '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span> {');
      // CSS properties
      highlighted = highlighted.replace(/([a-zA-Z-]+)\s*:/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>:');
      // CSS values
      highlighted = highlighted.replace(/:\s*([^;{}]+);/g, ': <span class="text-green-600 dark:text-green-400">$1</span>;');
    } else {
      // Comments
      highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-gray-500 dark:text-gray-400 italic">$1</span>');
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/gm, '<span class="text-gray-500 dark:text-gray-400 italic">$1</span>');
      
      // Keywords
      const keywordPattern = '\\b(' + config.keywords.join('|') + ')\\b';
      highlighted = highlighted.replace(new RegExp(keywordPattern, 'g'), '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>');
      
      // Built-ins
      const builtinPattern = '\\b(' + config.builtins.join('|') + ')\\b';
      highlighted = highlighted.replace(new RegExp(builtinPattern, 'g'), '<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>');
      
      // Strings
      highlighted = highlighted.replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-600 dark:text-green-400">$1$2$3</span>');
      
      // Numbers
      highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-red-600 dark:text-red-400">$1</span>');
      
      // Operators
      const operatorPattern = '(' + config.operators.map(op => op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')';
      highlighted = highlighted.replace(new RegExp(operatorPattern, 'g'), '<span class="text-yellow-600 dark:text-yellow-400 font-semibold">$1</span>');
      
      // Brackets
      highlighted = highlighted.replace(/([{}[\]();,.])/g, '<span class="text-gray-600 dark:text-gray-400 font-semibold">$1</span>');
      
      // JSX/React specific
      if (lang === 'react') {
        // JSX tags
        highlighted = highlighted.replace(/&lt;(\/?[A-Z][a-zA-Z0-9]*)/g, '<span class="text-red-600 dark:text-red-400 font-semibold">&lt;$1</span>');
        // Props
        highlighted = highlighted.replace(/([a-zA-Z][a-zA-Z0-9]*)(=)/g, '<span class="text-cyan-600 dark:text-cyan-400">$1</span>$2');
      }
    }

    return highlighted;
  };

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
    const selectedLang = languages.find(l => l.value === currentLanguage);
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code.${selectedLang?.ext || 'txt'}`;
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
          // Auto-detect language from file extension
          const ext = file.name.split('.').pop()?.toLowerCase();
          const detectedLang = languages.find(l => l.ext === ext);
          if (detectedLang) {
            setCurrentLanguage(detectedLang.value);
          }
          onChange({ target: { value: content } });
        }
      };
      reader.readAsText(file);
    }
  };

  const formatCode = () => {
    if (!code || !onChange) return;
    
    let formatted = code;
    
    // Basic formatting based on language
    if (currentLanguage === 'json') {
      try {
        formatted = JSON.stringify(JSON.parse(code), null, 2);
      } catch (e) {
        // If not valid JSON, do basic formatting
        formatted = basicFormat(code);
      }
    } else {
      formatted = basicFormat(code);
    }
    
    onChange({ target: { value: formatted } });
  };

  const basicFormat = (code) => {
    const lines = code.split('\n');
    let indentLevel = 0;
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Decrease indent for closing brackets
      if (trimmed.match(/^[}\])]/) || trimmed.includes('}') && !trimmed.includes('{')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indented = '  '.repeat(indentLevel) + trimmed;
      
      // Increase indent for opening brackets
      if (trimmed.match(/[{\[(]$/) || (trimmed.includes('{') && !trimmed.includes('}'))) {
        indentLevel++;
      }
      
      return indented;
    });
    
    return formatted.join('\n');
  };

  const insertBracketPair = (openBracket, closeBracket) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const selectedText = value.substring(start, end);
    
    const newValue = value.substring(0, start) + openBracket + selectedText + closeBracket + value.substring(end);
    
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + openBracket.length + selectedText.length;
      textarea.focus();
    }, 0);
  };

  const handleKeyDown = (e) => {
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    // Auto bracket completion
    const bracketPairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`'
    };

    if (bracketPairs[e.key] && !readOnly) {
      e.preventDefault();
      const pair = bracketPairs[e.key];
      const selectedText = value.substring(start, end);
      const newValue = value.substring(0, start) + e.key + selectedText + pair + value.substring(end);
      
      if (onChange) {
        onChange({ target: { value: newValue } });
      }
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + selectedText.length;
      }, 0);
      return;
    }

    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const spaces = '  ';
      const newValue = value.substring(0, start) + spaces + value.substring(end);
      
      if (onChange) {
        onChange({ target: { value: newValue } });
      }
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
    
    // Enter key with auto-indentation
    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const indent = currentLine.match(/^\s*/)?.[0] || '';
      
      // Add extra indent for opening braces
      const extraIndent = currentLine.trim().endsWith('{') || currentLine.trim().endsWith('[') || currentLine.trim().endsWith('(') ? '  ' : '';
      const newValue = value.substring(0, start) + '\n' + indent + extraIndent + value.substring(start);
      
      if (onChange) {
        onChange({ target: { value: newValue } });
      }
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + extraIndent.length;
      }, 0);
    }
  };

  const getLineNumbers = () => {
    const lines = code.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  };

  const syncScroll = () => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  return (
    <div className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50' : 'h-96'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 rounded-t-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-blue-400" />
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:border-blue-400 focus:outline-none"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
          >
            {showLineNumbers ? 'Hide' : 'Show'} Lines
          </button>
        </div>
        
        <div className="flex items-center gap-1">
          {!readOnly && (
            <>
              <input
                type="file"
                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.sql"
                onChange={handleFileUpload}
                className="hidden"
                id="code-upload"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById('code-upload')?.click()}
                className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
                title="Upload file"
              >
                <Upload className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={formatCode}
                className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
                title="Format code"
              >
                <Palette className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
            title="Download"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
            title="Copy"
          >
            {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="relative flex overflow-hidden rounded-b-xl" style={{ height: isFullscreen ? 'calc(100vh - 60px)' : '340px' }}>
        {/* Line Numbers */}
        {showLineNumbers && (
          <div className="bg-gray-800 text-gray-400 text-sm font-mono leading-6 p-4 pr-2 border-r border-gray-600 select-none min-w-[3rem] text-right">
            {getLineNumbers().map(num => (
              <div key={num} className="h-6">{num}</div>
            ))}
          </div>
        )}
        
        {/* Code Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Syntax Highlighting Layer */}
          <pre
            ref={highlightRef}
            className="absolute inset-0 p-4 font-mono text-sm leading-6 text-transparent whitespace-pre-wrap break-words overflow-auto pointer-events-none"
            style={{ 
              color: 'transparent',
              caretColor: 'transparent'
            }}
          >
            <code 
              dangerouslySetInnerHTML={{ 
                __html: highlightSyntax(code, currentLanguage) 
              }}
            />
          </pre>
          
          {/* Input Layer */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            placeholder={placeholder}
            readOnly={readOnly}
            className="absolute inset-0 p-4 bg-transparent text-transparent caret-white font-mono text-sm leading-6 whitespace-pre-wrap break-words overflow-auto resize-none border-none outline-none selection:bg-blue-600/30"
            style={{ 
              color: 'transparent',
              caretColor: '#ffffff'
            }}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedCodeEditor;
