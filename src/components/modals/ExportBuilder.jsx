import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredQuestions } from '../../store/slices/questionsSlice.js';
import { exportAdvanced, exportPreviewHTML } from '../../utils/exportUtils.js';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const ExportBuilder = ({ open, onClose }) => {
  const filtered = useSelector(selectFilteredQuestions);
  const [opts, setOpts] = useState({
    format: 'docx',
    sortBy: 'newest',
    groupBy: 'none',
    include: {
      answer: true,
      code: true,
      tags: true,
      subject: true,
      round: true,
      date: true,
      images: true,
      flags: true
    },
    selectedIds: [],
    searchText: '',
    limit: 0,
    watermark: ''
  });
  const [useSelection, setUseSelection] = useState(false);
  const [preview, setPreview] = useState('');
  const [showOptions, setShowOptions] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Ref for preview iframe to preserve scroll position
  const iframeRef = useRef(null);
  const scrollPosRef = useRef(0);

  // Auto preview - generate HTML when options change
  useEffect(() => {
    try { setPreview(exportPreviewHTML(filtered, opts)); } catch {/* ignore */ }
  }, [filtered, opts]);

  // Write to iframe without resetting scroll
  useEffect(() => {
    if (!iframeRef.current || !preview || !showPreview) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Save current scroll position
    scrollPosRef.current = doc.documentElement?.scrollTop || doc.body?.scrollTop || 0;

    // Write new content
    doc.open();
    doc.write(preview);
    doc.close();

    // Restore scroll position after a short delay
    setTimeout(() => {
      if (doc.documentElement) doc.documentElement.scrollTop = scrollPosRef.current;
      if (doc.body) doc.body.scrollTop = scrollPosRef.current;
    }, 10);
  }, [preview, showPreview]);

  const totalFiltered = filtered.length;
  const selectedCount = (opts.selectedIds?.length && filtered.length) ? filtered.filter(q => opts.selectedIds.includes(q._id || q.id)).length : totalFiltered;
  const effectiveCount = opts.limit && opts.limit > 0 ? Math.min(selectedCount, opts.limit) : selectedCount;

  const handleExport = async () => {
    await exportAdvanced(filtered, opts);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border flex-shrink-0">
          <h3 className="text-base sm:text-lg font-semibold">Export Questions</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {/* Format Options - Always visible, 2x2 grid on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-sm">
            <div>
              <label className="block mb-1 font-medium text-xs sm:text-sm">Format</label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 p-1.5 sm:p-2 rounded bg-white dark:bg-gray-800 text-sm"
                value={opts.format}
                onChange={e => setOpts({ ...opts, format: e.target.value })}
              >
                <option value="docx">DOCX</option>
                <option value="pdf">PDF</option>
                <option value="md">Markdown</option>
                <option value="html">HTML</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-xs sm:text-sm">Sort</label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 p-1.5 sm:p-2 rounded bg-white dark:bg-gray-800 text-sm"
                value={opts.sortBy}
                onChange={e => setOpts({ ...opts, sortBy: e.target.value })}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-xs sm:text-sm">Group</label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 p-1.5 sm:p-2 rounded bg-white dark:bg-gray-800 text-sm"
                value={opts.groupBy}
                onChange={e => setOpts({ ...opts, groupBy: e.target.value })}
              >
                <option value="none">None</option>
                <option value="round">Round</option>
                <option value="subject">Subject</option>
                <option value="tag">Tag</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-xs sm:text-sm">Limit</label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 dark:border-gray-600 p-1.5 sm:p-2 rounded bg-white dark:bg-gray-800 text-sm"
                value={opts.limit}
                onChange={e => setOpts({ ...opts, limit: Number(e.target.value) || 0 })}
                placeholder="0 = all"
              />
            </div>
          </div>

          {/* Include Options - Collapsible on mobile */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 text-left"
              onClick={() => setShowOptions(!showOptions)}
            >
              <span className="font-medium text-sm">Include Fields</span>
              {showOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showOptions && (
              <div className="p-2 sm:p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'answer', label: 'Answer' },
                  { key: 'code', label: 'Code' },
                  { key: 'tags', label: 'Tags' },
                  { key: 'subject', label: 'Subject' },
                  { key: 'round', label: 'Round' },
                  { key: 'date', label: 'Date' },
                  { key: 'images', label: 'Images' },
                  { key: 'flags', label: 'Flags (⭐📌🔥)' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={opts.include[item.key]}
                      onChange={e => setOpts({ ...opts, include: { ...opts.include, [item.key]: e.target.checked } })}
                      className="rounded"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Watermark */}
          <div>
            <label className="block mb-1 font-medium text-xs sm:text-sm">Watermark (optional)</label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 p-1.5 sm:p-2 rounded bg-white dark:bg-gray-800 text-sm"
              placeholder="e.g. CONFIDENTIAL"
              value={opts.watermark}
              onChange={e => setOpts({ ...opts, watermark: e.target.value })}
            />
          </div>

          {/* Question Selection - Collapsible */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 text-left"
              onClick={() => setShowQuestions(!showQuestions)}
            >
              <span className="font-medium text-sm">
                Select Questions {useSelection ? `(${opts.selectedIds.length})` : `(all ${totalFiltered})`}
              </span>
              {showQuestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showQuestions && (
              <div className="p-2 sm:p-3">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useSelection}
                      onChange={e => {
                        setUseSelection(e.target.checked);
                        if (!e.target.checked) setOpts(o => ({ ...o, selectedIds: [] }));
                      }}
                    />
                    Select specific questions
                  </label>
                  <div className="space-x-2">
                    <button
                      className="text-blue-600 underline disabled:opacity-50"
                      disabled={!useSelection}
                      onClick={() => setOpts(o => ({ ...o, selectedIds: filtered.map(q => q._id || q.id) }))}
                    >All</button>
                    <button
                      className="text-blue-600 underline disabled:opacity-50"
                      disabled={!useSelection}
                      onClick={() => setOpts(o => ({ ...o, selectedIds: [] }))}
                    >Clear</button>
                  </div>
                </div>
                <ul className="space-y-1 max-h-40 overflow-y-auto text-xs">
                  {filtered.map(q => {
                    const id = q._id || q.id;
                    const checked = useSelection ? opts.selectedIds.includes(id) : true;
                    return (
                      <li key={id} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          disabled={!useSelection}
                          checked={checked}
                          onChange={() => {
                            if (!useSelection) return;
                            setOpts(o => {
                              const set = new Set(o.selectedIds);
                              if (set.has(id)) set.delete(id); else set.add(id);
                              return { ...o, selectedIds: Array.from(set) };
                            });
                          }}
                          className="mt-0.5"
                        />
                        <span className="flex-1 line-clamp-1">{q.question}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Preview - Collapsible, hidden by default on mobile */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 text-left"
              onClick={() => setShowPreview(!showPreview)}
            >
              <span className="font-medium text-sm">Preview</span>
              {showPreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showPreview && (
              <div className="p-2 sm:p-3">
                {preview ? (
                  <iframe
                    ref={iframeRef}
                    title="preview"
                    className="w-full h-48 sm:h-72 border border-gray-200 dark:border-gray-700 rounded bg-white"
                  />
                ) : (
                  <div className="p-3 text-sm text-muted-foreground">Loading preview...</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-t border-border flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-xs sm:text-sm text-muted-foreground">
            {effectiveCount} of {totalFiltered} • {opts.format.toUpperCase()}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 sm:py-2 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportBuilder;
