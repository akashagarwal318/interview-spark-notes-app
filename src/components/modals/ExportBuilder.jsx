import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredQuestions } from '../../store/slices/questionsSlice.js';
import { exportAdvanced } from '../../utils/exportUtils.js';

const ExportBuilder = ({ open, onClose }) => {
  const filtered = useSelector(selectFilteredQuestions);
  const [opts,setOpts]=useState({
    format:'doc',
    groupBy:'none', // none|round|tag|difficulty
    sortBy:'newest', // newest|oldest|alphabetical|difficulty
    include:{ answer:true, code:true, tags:true, images:true, meta:true },
  });
  const count = filtered.length;
  const handleExport = async () => {
    await exportAdvanced(filtered, opts);
    onClose?.();
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 border border-border rounded-lg p-4 w-full max-w-xl" onClick={e=>e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-3">Export Builder</h3>
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <label className="block mb-1">Format</label>
            <select className="w-full border p-2 rounded" value={opts.format} onChange={e=>setOpts({...opts,format:e.target.value})}>
              <option value="doc">Word (.doc)</option>
              <option value="pdf">PDF (print)</option>
              <option value="html">HTML</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Group by</label>
            <select className="w-full border p-2 rounded" value={opts.groupBy} onChange={e=>setOpts({...opts,groupBy:e.target.value})}>
              <option value="none">None</option>
              <option value="round">Round</option>
              <option value="tag">Tag</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Sort by</label>
            <select className="w-full border p-2 rounded" value={opts.sortBy} onChange={e=>setOpts({...opts,sortBy:e.target.value})}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Include</label>
            <div className="space-y-1">
              {Object.keys(opts.include).map(k=> (
                <label key={k} className="flex items-center gap-2">
                  <input type="checkbox" checked={opts.include[k]} onChange={e=>setOpts({...opts,include:{...opts.include,[k]: e.target.checked}})} /> {k}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Ready to export {count} questions</div>
          <div className="space-x-2">
            <button onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
            <button onClick={handleExport} className="px-3 py-2 rounded bg-blue-600 text-white">Export</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportBuilder;
