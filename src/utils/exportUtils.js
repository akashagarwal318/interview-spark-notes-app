const ts = () => new Date().toISOString().replace(/[:.]/g, '-');

// ---------------------- Advanced export system ----------------------

// Presets & history (localStorage)
const LS_PRESETS = 'ia_export_presets_v1';
const LS_HISTORY = 'ia_export_history_v1';

export function saveExportPreset(name, options) {
  const all = JSON.parse(localStorage.getItem(LS_PRESETS) || '{}');
  all[name] = options;
  localStorage.setItem(LS_PRESETS, JSON.stringify(all));
}

export function listExportPresets() {
  return JSON.parse(localStorage.getItem(LS_PRESETS) || '{}');
}

export function deleteExportPreset(name) {
  const all = JSON.parse(localStorage.getItem(LS_PRESETS) || '{}');
  delete all[name];
  localStorage.setItem(LS_PRESETS, JSON.stringify(all));
}

function addExportHistory(entry) {
  const arr = JSON.parse(localStorage.getItem(LS_HISTORY) || '[]');
  arr.unshift({ ...entry, at: new Date().toISOString() });
  localStorage.setItem(LS_HISTORY, JSON.stringify(arr.slice(0, 20)));
}

export function listExportHistory() {
  return JSON.parse(localStorage.getItem(LS_HISTORY) || '[]');
}

// Core pipeline
export async function exportAdvanced(allQuestions, options) {
  const {
    // selection & filters
    selectedIds = [],
    includeTags = [],
    excludeTags = [],
    includeRounds = [],
    excludeRounds = [],
    searchText = '',
    limit = 0,
    // content controls
  include = { answer: true, code: true, tags: true, images: true, meta: true, notes: true, round: true },
    removePatterns = [], // array of regex strings, applied to code & answer & notes
    removeBlocks = [],   // [{ start:'BEGIN OMIT', end:'END OMIT' }]
    // formatting
    format = 'docx', // 'pdf' | 'docx' | 'md' | 'html'
  theme = 'light',
  fontSize = 14,
  syntaxHighlight = true,
  header = {},
  footer = {},
  watermark = '',
  toc = false,
    // grouping & batch
    groupBy = 'none', // none|round|tag|difficulty
    splitBy = 'none', // none|round|tag
  } = options || {};

  // 1) Select
  let qs = filterQuestions(allQuestions, { selectedIds, includeTags, excludeTags, includeRounds, excludeRounds, searchText });
  if (selectedIds && selectedIds.length) {
    const set = new Set(selectedIds.map(String));
    qs = qs.filter(q => set.has(String(q._id || q.id)));
  }
  if (limit && Number.isFinite(+limit)) qs = qs.slice(0, +limit);

  // 2) Transform
  qs = qs.map(q => transformQuestion(q, { include, removePatterns, removeBlocks }));

  // 3) Sort/Group
  const { sorted, groups } = sortAndGroup(qs, options);

  // 4) Render & Download
  if (splitBy !== 'none') {
    // Batch export (zip)
    const JSZip = (await import('jszip')).default;
    const { saveAs } = await import('file-saver');
    const zip = new JSZip();
    const grouped = groupByKey(sorted, splitBy);
    for (const [key, arr] of Object.entries(grouped)) {
      const { html } = buildHTMLDocument(arr, { theme, fontSize, syntaxHighlight, header, footer, watermark, toc, groupBy });
      if (format === 'md') {
        const md = buildMarkdown(arr);
        zip.file(safeFileName(`${key || 'export'}.md`), md);
      } else if (format === 'docx') {
        const buf = await buildDocx(arr, { header, footer });
        zip.file(safeFileName(`${key || 'export'}.docx`), buf);
      } else if (format === 'doc') {
        const { html } = buildHTMLDocument(arr, { theme, fontSize, syntaxHighlight, header, footer, watermark, toc, groupBy });
        zip.file(safeFileName(`${key || 'export'}.doc`), html);
      } else if (format === 'pdf') {
        // Render to HTML and store; generating PDFs inside zip is heavy client-side.
        zip.file(safeFileName(`${key || 'export'}.html`), html);
      } else {
        zip.file(safeFileName(`${key || 'export'}.html`), html);
      }
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `export-batch-${ts()}.zip`);
  } else {
    const { html } = buildHTMLDocument(sorted, { theme, fontSize, syntaxHighlight, header, footer, watermark, toc, groupBy });
  if (format === 'pdf') {
      try {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.top = '0';
        el.style.width = '816px';
        el.innerHTML = html;
        document.body.appendChild(el);
        const node = el.querySelector('.export-root') || el;
        const html2pdf = (await import('html2pdf.js')).default;
        await html2pdf().set({
          filename: `export-${ts()}.pdf`,
          margin: 10,
          pagebreak: { mode: ['css', 'legacy'] },
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
        }).from(node).save();
        document.body.removeChild(el);
      } catch (e) {
        const w = window.open('', '_blank');
        w.document.write(html);
        w.document.close();
        setTimeout(()=>w.print(), 400);
      }
    } else if (format === 'docx') {
      // Export as HTML .doc to preserve exact preview styling in Word
      downloadBlob(`export-${ts()}.doc`, 'application/msword', html);
    } else if (format === 'doc') {
      downloadBlob(`export-${ts()}.doc`, 'application/msword', html);
    } else if (format === 'md') {
      const md = buildMarkdown(sorted);
      downloadBlob(`export-${ts()}.md`, 'text/markdown;charset=utf-8', md);
    } else { // html
      downloadBlob(`export-${ts()}.html`, 'text/html;charset=utf-8', html);
    }
  }

  addExportHistory({ count: qs.length, format, groupBy, splitBy });
}

export function exportPreviewHTML(allQuestions, options) {
  let qs = filterQuestions(allQuestions, options);
  if (options?.limit && Number.isFinite(+options.limit)) qs = qs.slice(0, +options.limit);
  if (options?.selectedIds && options.selectedIds.length) {
    const set = new Set(options.selectedIds.map(String));
    qs = qs.filter(q => set.has(String(q._id || q.id)));
  }
  // apply include removals like real export
  qs = qs.map(q => transformQuestion(q, { include: options?.include, removePatterns: options?.removePatterns, removeBlocks: options?.removeBlocks }));
  const { sorted } = sortAndGroup(qs, options);
  const { html } = buildHTMLDocument(sorted, options);
  return html;
}

function filterQuestions(questions, { selectedIds = [], includeTags = [], excludeTags = [], includeRounds = [], excludeRounds = [], searchText = '' } = {}) {
  const sel = new Set((selectedIds||[]).map(String));
  const tIncl = new Set((includeTags||[]).map(s=>String(s).toLowerCase()));
  const tExcl = new Set((excludeTags||[]).map(s=>String(s).toLowerCase()));
  const rIncl = new Set((includeRounds||[]).map(s=>String(s).toLowerCase()));
  const rExcl = new Set((excludeRounds||[]).map(s=>String(s).toLowerCase()));
  const s = String(searchText||'').toLowerCase();
  return questions.filter(q => {
    if (sel.size && !sel.has(String(q._id))) return false;
    const tags = (q.tags||[]).map(t=> typeof t === 'string' ? t : (t.name||t._id||'')).map(s=>String(s).toLowerCase());
    const round = String(q.round||'').toLowerCase();
    if (tIncl.size && !tags.some(t=>tIncl.has(t))) return false;
    if (Array.from(tExcl).some(t=>tags.includes(t))) return false;
    if (rIncl.size && !rIncl.has(round)) return false;
    if (rExcl.size && rExcl.has(round)) return false;
    if (s && !(`${q.question} ${q.answer} ${q.code} ${tags.join(' ')} ${q.company||''} ${q.position||''}`.toLowerCase().includes(s))) return false;
    return true;
  });
}

function transformQuestion(q, { include, removePatterns, removeBlocks }) {
  const clone = JSON.parse(JSON.stringify(q));
  if (!include?.answer) clone.answer = '';
  if (!include?.code) clone.code = '';
  if (!include?.tags) clone.tags = [];
  if (!include?.round) clone.round = '';
  if (!include?.images) clone.images = [];
  if (!include?.meta) { delete clone.company; delete clone.position; }
  if (!include?.notes) clone.notes = '';

  const applyRemovals = (text) => {
    if (!text) return text;
    let out = String(text);
    // Remove blocks
    for (const blk of (removeBlocks||[])) {
      if (!blk?.start || !blk?.end) continue;
      const re = new RegExp(`${escapeRegExp(blk.start)}[\s\S]*?${escapeRegExp(blk.end)}`,'g');
      out = out.replace(re, '');
    }
    // Remove patterns (line-wise)
    for (const p of (removePatterns||[])) {
      try {
        const re = new RegExp(p, 'g');
        out = out.replace(re, '');
      } catch {}
    }
    return out;
  };
  clone.answer = applyRemovals(clone.answer);
  clone.code = applyRemovals(clone.code);
  clone.notes = applyRemovals(clone.notes);
  return clone;
}

function sortAndGroup(qs, { sortBy = 'newest', groupBy = 'none' } = {}) {
  const arr = [...qs];
  const sorter = {
    newest: (a,b)=> new Date(b.createdAt)-new Date(a.createdAt),
    oldest: (a,b)=> new Date(a.createdAt)-new Date(b.createdAt),
    alphabetical: (a,b)=> String(a.question).localeCompare(String(b.question)),
    difficulty: (a,b)=> ({easy:1,medium:2,hard:3}[a.difficulty||'medium'] - ({easy:1,medium:2,hard:3}[b.difficulty||'medium']))
  }[sortBy] || ((a,b)=>0);
  arr.sort(sorter);
  const groups = groupBy==='none' ? { All: arr } : groupByKey(arr, groupBy);
  return { sorted: arr, groups };
}

function groupByKey(arr, key) {
  const map = {};
  for (const q of arr) {
    let g = 'Other';
    if (key === 'round') g = q.round || 'Other';
    else if (key === 'tag') {
      const first = (q.tags&&q.tags[0]) || '';
      g = typeof first === 'string' ? first : (first.name || first._id || 'Other');
    }
    else if (key === 'difficulty') g = q.difficulty || 'Other';
    map[g] = map[g] || [];
    map[g].push(q);
  }
  return map;
}

function buildMarkdown(qs) {
  const lines = [`# Interview Questions`, `Exported on ${new Date().toLocaleString()}`, ``];
  let i=1;
  for (const q of qs) {
    lines.push(`## ${i}. ${q.question}`);
    lines.push(`- Round: ${q.round || ''}`);
    lines.push(`- Date: ${q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ''}`);
    if (q.tags?.length) lines.push(`- Tags: ${q.tags.join(', ')}`);
    lines.push('');
    if (q.answer) lines.push(q.answer, '');
    if (q.code) lines.push('```'+(q.codeLanguage||'')+'\n'+q.code+'\n```','');
    if (q.notes) lines.push('> Notes: '+q.notes, '');
    i++;
  }
  return lines.join('\n');
}

function buildHeaderFooterCSS({ header, footer, watermark }) {
  const wm = watermark ? `/* Watermark overlay added via DOM for better renderer support */` : '';
  const hdr = header?.text || header?.project ? `
    @page { margin: 1in; }
    header { position: running(header); }
    footer { position: running(footer); }
    .page-header { font-size: 12px; color: #666; display: flex; justify-content: space-between; align-items: center; }
    .page-footer { font-size: 12px; color: #666; display: flex; justify-content: space-between; align-items: center; }
  ` : '';
  return wm + hdr;
}

function buildHTMLDocument(qs, { theme='light', fontSize=14, syntaxHighlight=true, header={}, footer={}, watermark='', toc=false, groupBy='none' }={}) {
  const groups = groupBy==='none' ? { All: qs } : groupByKey(qs, groupBy);
  const headerFooterCSS = buildHeaderFooterCSS({ header, footer, watermark });
  const themeBg = theme==='dark' ? '#0f172a' : '#ffffff';
  const themeFg = theme==='dark' ? '#e2e8f0' : '#111827';
  const codeBg = theme==='dark' ? '#0b1220' : '#f9fafb';
  const linkColor = '#2563eb';
  let tocHtml = '';
  if (toc) {
    tocHtml = '<h2>Table of Contents</h2><ol>' + qs.map((q,i)=> `<li><a href="#q${i+1}">${escapeHtml(q.question)}</a></li>`).join('') + '</ol><hr/>';
  }
  let i=1;
  const content = Object.entries(groups).map(([g, items]) => `
    <section>
      ${groupBy!=='none' ? `<h2>${escapeHtml(String(g).toUpperCase())}</h2>` : ''}
      ${items.map(q=> `
        <article id="q${i++}" style="page-break-inside: avoid;">
          <h3 style="color:${linkColor}">${escapeHtml(q.question)}</h3>
          <div class="meta">Round: ${escapeHtml(q.round||'')} • Date: ${q.createdAt? new Date(q.createdAt).toLocaleDateString():''} ${q.tags?.length? ' • Tags: '+(q.tags||[]).map(t=> escapeHtml(typeof t==='string'? t : (t.name||t._id||''))).join(', '):''}</div>
          ${q.answer? `<div class="answer"><strong>Answer:</strong><div>${q.answer}</div></div>`:''}
          ${q.code? `<div class="code"><strong>Code:</strong><pre><code>${escapeHtml(q.code)}</code></pre></div>`:''}
          ${q.notes? `<div class="notes"><em>Notes:</em> ${escapeHtml(q.notes)}</div>`:''}
        </article>
      `).join('')}
    </section>
  `).join('');

  const html = `
  <!DOCTYPE html>
  <html><head><meta charset="utf-8" />
    <title>Export</title>
    <style>
      ${headerFooterCSS}
      body { background:${themeBg}; color:${themeFg}; font-family: Arial, sans-serif; line-height:1.6; font-size:${fontSize}px; margin:32px; }
      h1,h2,h3 { color:${theme==='dark'?'#93c5fd':'#1f2937'} }
      .meta { font-size: 12px; color: ${theme==='dark'?'#94a3b8':'#6b7280'} }
      pre { background:${codeBg}; padding:12px; border-radius:6px; border:1px solid ${theme==='dark'?'#1f2937':'#e5e7eb'}; overflow:auto; white-space: pre-wrap; }
      a { color:${linkColor}; text-decoration:none; }
      header.page-header, footer.page-footer { position: fixed; left: 40px; right: 40px; }
      header.page-header { top: 20px; }
      footer.page-footer { bottom: 20px; }
      .export-root { position: relative; z-index: 1; }
      .wm-overlay { position: fixed; top:50%; left:50%; transform: translate(-50%, -50%) rotate(-30deg); font-size:64px; color: rgba(0,0,0,0.06); pointer-events:none; z-index:0; white-space: pre-wrap; text-align:center; }
      @media print {
        .no-print { display:none; }
      }
    </style>
  </head>
  <body>
    ${watermark ? `<div class="wm-overlay">${escapeHtml(watermark)}</div>` : ''}
    ${header?.text || header?.project || header?.showDate ? `<header class="page-header"><div class="page-header"> <span>${escapeHtml(header.project||'')}</span> <span>${escapeHtml(header.text||'')}</span> <span>${header.showDate? new Date().toLocaleDateString():''}</span></div></header>`: ''}
    <div class="export-root">${tocHtml}${content}</div>
    ${footer?.text || footer?.showPageNumbers ? `<footer class="page-footer"><div class="page-footer"> <span>${escapeHtml(footer.text||'')}</span> <span></span> <span>${footer.showPageNumbers? 'Page [page] of [toPage]':''}</span></div></footer>`: ''}
  </body></html>`;
  return { html };
}

async function buildDocx(qs, { header = {}, footer = {} } = {}) {
  const docx = await import('docx');
  const { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType, Footer: DFooter, Header: DHeader } = docx;
  const children = [];
  let i=1;
  for (const q of qs) {
    children.push(new Paragraph({ text: `${i}. ${q.question}`, heading: HeadingLevel.HEADING_2 }));
    const meta = `Round: ${q.round||''} • Date: ${q.createdAt? new Date(q.createdAt).toLocaleDateString():''} ${q.tags?.length? ' • Tags: '+q.tags.join(', '):''}`;
    children.push(new Paragraph({ text: meta }));
    if (q.answer) {
      children.push(new Paragraph({ text: 'Answer:', heading: HeadingLevel.HEADING_3 }));
      children.push(new Paragraph(q.answer.replace(/\n/g,'\n')));
    }
    if (q.code) {
      children.push(new Paragraph({ text: 'Code:', heading: HeadingLevel.HEADING_3 }));
      children.push(new Paragraph({ children:[ new TextRun({ text: q.code, font: 'Consolas' }) ] }));
    }
    if (q.notes) {
      children.push(new Paragraph({ text: `Notes: ${q.notes}` }));
    }
    children.push(new Paragraph(''));
    i++;
  }
  const doc = new Document({
    sections: [{
      headers: header?.text || header?.project ? { default: new DHeader({ children: [ new Paragraph({ alignment: AlignmentType.RIGHT, children: [ new TextRun(header.project||''), new TextRun({ text: '  ' }), new TextRun(header.text||'') ] }) ] }) } : {},
      footers: footer?.text ? { default: new DFooter({ children: [ new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun(footer.text) ] }) ] }) } : {},
      properties: {},
      children
    }]
  });
  const buffer = await Packer.toBlob(doc);
  return buffer;
}

function downloadBlob(filename, mime, data) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

function escapeHtml(s) {
  return String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function cssEscape(s) { return String(s||'').replace(/['"\\]/g, ''); }
function safeFileName(s) { return String(s||'export').replace(/[^a-z0-9._-]+/gi,'_'); }

