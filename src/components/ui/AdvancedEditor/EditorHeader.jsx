import React from 'react';
import { Code, Upload, Download, Check, Copy, Maximize2 } from 'lucide-react';
import { Button } from '../button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';

const EditorHeader = ({
  languages,
  currentLanguage,
  onLanguageChange,
  onUpload,
  onFormat,
  onDownload,
  onCopy,
  copied,
  onFullscreen,
  readOnly
}) => (
  <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/80 backdrop-blur rounded-t-lg sticky top-0 z-10">
    <div className="flex items-center gap-2">
      <Code className="h-5 w-5 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={onLanguageChange} disabled={readOnly}>
        <SelectTrigger className="h-8 w-40 text-sm border-none bg-transparent">
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
            onChange={onUpload}
            className="hidden"
            id="code-upload"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => document.getElementById('code-upload')?.click()}
            className="h-8 w-8 p-0"
            title="Upload file"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onFormat}
            className="h-8 w-8 p-0 text-sm"
            title="Format code"
          >
            {'{}'}
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onDownload}
        className="h-8 w-8 p-0"
        title="Download"
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onCopy}
        className="h-8 w-8 p-0"
        title="Copy"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onFullscreen}
        className="h-8 w-8 p-0"
        title="Fullscreen"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default EditorHeader;
