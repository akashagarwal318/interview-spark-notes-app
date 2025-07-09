import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Download, Upload, Code, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './select';

const AdvancedCodeEditor = ({ 
  code = '', 
  onChange, 
  language = 'javascript',
  onLanguageChange,
  placeholder = '// Start coding...',
  readOnly = false 
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const textareaRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: 'js', comment: '//' },
    { value: 'typescript', label: 'TypeScript', ext: 'ts', comment: '//' },
    { value: 'react', label: 'React/JSX', ext: 'jsx', comment: '//' },
    { value: 'html', label: 'HTML', ext: 'html', comment: '<!--' },
    { value: 'css', label: 'CSS', ext: 'css', comment: '/*' },
    { value: 'python', label: 'Python', ext: 'py', comment: '#' },
    { value: 'java', label: 'Java', ext: 'java', comment: '//' },
    { value: 'cpp', label: 'C++', ext: 'cpp', comment: '//' },
    { value: 'c', label: 'C', ext: 'c', comment: '//' },
    { value: 'json', label: 'JSON', ext: 'json', comment: '' },
    { value: 'sql', label: 'SQL', ext: 'sql', comment: '--' },
    { value: 'bash', label: 'Bash', ext: 'sh', comment: '#' },
  ];

  // Use the correct label for the language dropdown
  const getCurrentLanguage = () => languages.find(lang => lang.value === currentLanguage) || languages[0];

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
    const ext = getCurrentLanguage().ext;
    element.download = `code.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLanguageChange = (newLanguage) => {
    setCurrentLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
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

  // Improved highlightSyntax: fixes style tag injection bug, avoids double-highlighting, and only highlights code
  // Language-aware syntax highlighting
  const highlightSyntax = (code) => {
    if (!code) return '';
    // Escape HTML
    let html = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Get current language
    const lang = languages.find(l => l.value === currentLanguage) || languages[0];

    // --- Comments ---
    if (lang.value === 'python' || lang.value === 'bash') {
      html = html.replace(/(#.*$)/gm, '<span style="color:#10b981">$1</span>');
    } else if (lang.value === 'sql') {
      html = html.replace(/(--.*$)/gm, '<span style="color:#10b981">$1</span>');
    } else if (lang.value === 'html') {
      html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/gm, '<span style="color:#10b981">$1</span>');
    } else {
      // C-like (// and /* */)
      html = html.replace(/(\/\/.*$)/gm, '<span style="color:#10b981">$1</span>');
      html = html.replace(/(\/\*[\s\S]*?\*\/)/gm, '<span style="color:#10b981">$1</span>');
    }

    // --- Strings ---
    if (lang.value === 'sql') {
      html = html.replace(/('[^']*')/g, '<span style="color:#ea580c">$1</span>');
    } else if (lang.value === 'python') {
      html = html.replace(/(['"]{3}[\s\S]*?['"]{3}|(['"])(?:\\.|(?!\2)[^\\])*\2)/g, '<span style="color:#ea580c">$1</span>');
    } else {
      html = html.replace(/(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, '<span style="color:#ea580c">$&</span>');
    }

    // --- Numbers ---
    html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span style="color:#dc2626">$1</span>');

    // --- Keywords ---
    const keywordMap = {
      javascript: 'function|const|let|var|if|else|for|while|return|class|import|export|from|default|async|await|try|catch|finally|typeof|instanceof|new|this|extends|super|switch|case|break|continue|do|throw',
      typescript: 'function|const|let|var|if|else|for|while|return|class|import|export|from|default|async|await|try|catch|finally|typeof|instanceof|new|this|extends|super|switch|case|break|continue|do|throw|interface|implements|type|enum',
      react: 'function|const|let|var|if|else|for|while|return|class|import|export|from|default|async|await|try|catch|finally|typeof|instanceof|new|this|extends|super|switch|case|break|continue|do|throw|useState|useEffect|useRef|useContext|useReducer|useCallback|useMemo|useLayoutEffect|useImperativeHandle',
      python: 'def|class|if|else|elif|for|while|return|import|from|as|try|except|finally|with|lambda|and|or|not|in|is|pass|break|continue|yield|global|nonlocal|assert|del|raise',
      java: 'public|private|protected|static|void|int|float|double|char|boolean|if|else|for|while|return|class|import|package|new|this|extends|implements|interface|throws|throw|try|catch|finally|switch|case|break|continue|do|enum|super',
      cpp: 'int|float|double|char|bool|if|else|for|while|return|class|public|private|protected|virtual|override|include|define|namespace|using|new|delete|this|try|catch|throw|switch|case|break|continue|do|struct|union|enum|template|typename|const|static',
      c: 'int|float|double|char|if|else|for|while|return|void|struct|union|enum|typedef|sizeof|include|define|switch|case|break|continue|do|static|const',
      html: '',
      css: '',
      json: '',
      sql: 'SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|JOIN|ON|AS|AND|OR|NOT|NULL|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|CHECK|DEFAULT|INDEX|VIEW|TRIGGER|PROCEDURE|FUNCTION|DATABASE|ORDER|BY|GROUP|HAVING|DISTINCT|LIMIT|OFFSET|IN|IS|LIKE|BETWEEN|EXISTS',
      bash: 'if|then|else|elif|fi|for|while|do|done|in|case|esac|function|select|until|break|continue|return|exit|export|readonly|declare|typeset|local|let|eval|exec|set|unset|source|trap|true|false',
    };
    const keywordRegex = keywordMap[lang.value];
    if (keywordRegex) {
      html = html.replace(new RegExp(`\\b(${keywordRegex})\\b`, 'g'), '<span style="color:#3b82f6;font-weight:600">$1</span>');
    }

    // --- Booleans/null ---
    html = html.replace(/\b(true|false|null|undefined|None|True|False)\b/g, '<span style="color:#8b5cf6">$1</span>');

    // --- HTML/JSX tags ---
    if (lang.value === 'html' || lang.value === 'react') {
      html = html.replace(/(&lt;\/?[\w\-]+.*?&gt;)/g, '<span style="color:#dc2626">$1</span>');
    }

    // --- CSS properties ---
    if (lang.value === 'css') {
      html = html.replace(/([a-zA-Z\-]+)(\s*:\s*)/g, '<span style="color:#dc2626">$1</span>$2');
    }

    return html;
  };

  return (
    <div className={`relative bg-muted rounded-lg border border-border ${isFullscreen ? 'fixed inset-0 z-50' : 'h-64'}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card rounded-t-lg">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          <Select value={currentLanguage} onValueChange={handleLanguageChange} disabled={readOnly}>
            <SelectTrigger className="h-7 w-32 text-xs border-none bg-transparent">
              <SelectValue>{languages.find(l => l.value === currentLanguage)?.label || 'JavaScript'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            <div className="flex">
              <div className="flex flex-col text-xs text-gray-400 pr-2 select-none">
                {code.split('\n').map((_, index) => (
                  <div key={index} className="leading-5 text-right min-w-[2rem]">
                    {index + 1}
                  </div>
                ))}
              </div>
              <pre className="text-sm font-mono flex-1 overflow-x-auto">
                <code 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightSyntax(code) 
                  }}
                  className="leading-5"
                />
              </pre>
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={code}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-full p-3 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground"
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
