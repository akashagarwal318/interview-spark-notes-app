import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredQuestions } from '../../store/slices/questionsSlice.js';
import { exportAdvanced, exportPreviewHTML } from '../../utils/exportUtils.js';

const ExportBuilder = ({ open, onClose }) => {
  const filtered = useSelector(selectFilteredQuestions);
  const [opts,setOpts]=useState({
    format:'docx',
    sortBy:'newest',
    groupBy:'none',
    include:{ answer:true, code:true, tags:true, notes:true, meta:true, round:true },
    selectedIds:[],
    searchText:'',
    limit:0,
    watermark:''
  });
  const [useSelection, setUseSelection] = useState(false);
  const [preview,setPreview] = useState('');
  // auto preview
  useEffect(()=> {
    try { setPreview(exportPreviewHTML(filtered, opts)); } catch {/* ignore */}
  }, [filtered, opts.format, opts.sortBy, opts.groupBy, opts.include, opts.selectedIds, opts.limit, opts.watermark]);
  const totalFiltered = filtered.length;
  const selectedCount = (opts.selectedIds?.length && filtered.length) ? filtered.filter(q=> opts.selectedIds.includes(q._id||q.id)).length : totalFiltered;
  const effectiveCount = opts.limit && opts.limit > 0 ? Math.min(selectedCount, opts.limit) : selectedCount;
  const handleExport = async () => {
    await exportAdvanced(filtered, opts);
    onClose?.();
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 border border-border rounded-lg p-4 w-full max-w-4xl" onClick={e=>e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-3">Export</h3>
        <div className="grid grid-cols-4 gap-4 text-sm mb-4">
          <div>
            <label className="block mb-1 font-medium">Format</label>
            <select className="w-full border p-2 rounded" value={opts.format} onChange={e=>setOpts({...opts,format:e.target.value})}>
              <option value="docx">DOCX</option>
              <option value="pdf">PDF</option>
              <option value="md">Markdown</option>
              <option value="html">HTML</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Sort</label>
            <select className="w-full border p-2 rounded" value={opts.sortBy} onChange={e=>setOpts({...opts,sortBy:e.target.value})}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Group</label>
            <select className="w-full border p-2 rounded" value={opts.groupBy} onChange={e=>setOpts({...opts,groupBy:e.target.value})}>
              <option value="none">None</option>
              <option value="round">Round</option>
              <option value="tag">Tag</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Limit</label>
            <input type="number" min="0" className="w-full border p-2 rounded" value={opts.limit} onChange={e=>setOpts({...opts,limit:Number(e.target.value)||0})} />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4 border rounded p-2 overflow-auto max-h-72 bg-background">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="font-medium">Select Questions {useSelection ? `(${opts.selectedIds.length})` : `(all ${totalFiltered})`}</span>
              <div className="space-x-2">
                <label className="inline-flex items-center gap-1"><input type="checkbox" checked={useSelection} onChange={e=>{ setUseSelection(e.target.checked); if (!e.target.checked) setOpts(o=>({...o,selectedIds:[]})); }} /> Specific</label>
                <button className="underline disabled:opacity-50" disabled={!useSelection} onClick={()=>setOpts(o=>({...o,selectedIds:filtered.map(q=>q._id||q.id)}))}>All</button>
                <button className="underline disabled:opacity-50" disabled={!useSelection} onClick={()=>setOpts(o=>({...o,selectedIds:[]}))}>Clear</button>
              </div>
            </div>
            <ul className="space-y-1 text-xs">
              {filtered.map(q=> {
                const id = q._id || q.id;
                const checked = useSelection ? opts.selectedIds.includes(id) : true;
                return (
                  <li key={id} className="flex items-start gap-2">
                    <input type="checkbox" disabled={!useSelection} checked={checked} onChange={()=> {
                      if (!useSelection) return;
                      setOpts(o=> {
                        const set = new Set(o.selectedIds);
                        if (set.has(id)) set.delete(id); else set.add(id);
                        return { ...o, selectedIds: Array.from(set) };
                      });
                    }} />
                    <span className="flex-1 line-clamp-2">{q.question}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="col-span-2 border rounded p-2 text-xs space-y-1">
            <div className="font-medium mb-1">Include</div>
            {Object.keys(opts.include).map(k=> (
              <label key={k} className="flex items-center gap-2 capitalize">
                <input type="checkbox" checked={opts.include[k]} onChange={e=>setOpts({...opts,include:{...opts.include,[k]: e.target.checked}})} /> {k}
              </label>
            ))}
            <div className="mt-2">
              <label className="block mb-1 font-medium">Watermark</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                placeholder="Optional watermark text"
                value={opts.watermark}
                onChange={e=>setOpts({...opts, watermark:e.target.value})}
              />
            </div>
          </div>
          <div className="col-span-6 border rounded p-0 bg-white overflow-hidden">
            {preview ? <iframe title="preview" className="w-full h-72" srcDoc={preview} /> : <div className="p-3 text-sm text-muted-foreground">Loading preview...</div>}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-muted-foreground">{effectiveCount} of {totalFiltered} filtered will export • {opts.format.toUpperCase()}</div>
          <div className="space-x-2">
            <button onClick={onClose} className="px-3 py-2 rounded border text-sm">Cancel</button>
            <button onClick={handleExport} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">Export</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportBuilder;
