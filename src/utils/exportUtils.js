const ts = () => new Date().toISOString().replace(/[:.]/g, '-');

// ---------------------- Markdown Parser ----------------------
// A simple but effective parser that converts markdown to HTML

function parseMarkdown(text) {
  if (!text) return '';

  let html = String(text);

  // Escape HTML first (but we'll handle code blocks specially)
  const escapeHtml = (s) => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Extract code blocks first to protect them
  const codeBlocks = [];
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: lang || 'text', code: code.trim() });
    return `___CODEBLOCK_${idx}___`;
  });

  // Escape remaining HTML
  html = escapeHtml(html);

  // Restore code blocks with proper styling
  codeBlocks.forEach((block, idx) => {
    const escapedCode = escapeHtml(block.code);
    html = html.replace(`___CODEBLOCK_${idx}___`,
      `<pre class="code-block"><code class="language-${block.lang}">${escapedCode}</code></pre>`);
  });

  // Bold: **text** or __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ (but not inside words)
  html = html.replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '<em>$1</em>');
  html = html.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '<em>$1</em>');

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Headers: ## Header
  html = html.replace(/^### (.+)$/gm, '<h4 class="md-h4">$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^# (.+)$/gm, '<h2 class="md-h2">$1</h2>');

  // Unordered lists: - item or * item
  html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul class="md-ul">${match}</ul>`);

  // Ordered lists: 1. item
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ol-item">$1</li>');
  // Wrap consecutive ol-items
  html = html.replace(/(<li class="ol-item">.*<\/li>\n?)+/g, (match) => {
    return `<ol class="md-ol">${match.replace(/class="ol-item"/g, '')}</ol>`;
  });

  // Blockquotes: > text
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>');

  // Line breaks: preserve them
  html = html.replace(/\n/g, '<br>\n');

  // Clean up double <br> after block elements
  html = html.replace(/(<\/(?:pre|ul|ol|h[1-4]|blockquote)>)<br>\n/g, '$1\n');
  html = html.replace(/<br>\n(<(?:pre|ul|ol|h[1-4]|blockquote))/g, '\n$1');

  return html;
}

// ---------------------- Advanced export system ----------------------

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

// Helper: check if value is empty or "unnamed"
function isEmptyValue(val) {
  if (!val) return true;
  const s = String(val).toLowerCase().trim();
  // Check for empty, unnamed (any case), undefined, null, general
  return s === '' || s === 'unnamed' || s === 'undefined' || s === 'null' || s === 'general';
}

// Helper: format date like UI does
function formatDate(dateString) {
  try {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return '';
  }
}

// Core pipeline
export async function exportAdvanced(allQuestions, options) {
  const {
    selectedIds = [],
    includeTags = [],
    excludeTags = [],
    includeRounds = [],
    excludeRounds = [],
    searchText = '',
    limit = 0,
    include = { answer: true, code: true, tags: true, images: true, round: true, subject: true, date: true, flags: true },
    removePatterns = [],
    removeBlocks = [],
    format = 'docx',
    theme = 'light',
    fontSize = 14,
    syntaxHighlight = true,
    header = {},
    footer = {},
    watermark = '',
    toc = false,
    groupBy = 'none',
    splitBy = 'none',
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
  const { sorted } = sortAndGroup(qs, options);

  // 4) Render & Download
  if (splitBy !== 'none') {
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
        setTimeout(() => w.print(), 400);
      }
    } else if (format === 'docx') {
      const buf = await buildDocx(sorted, { header, footer, groupBy });
      const { saveAs } = await import('file-saver');
      saveAs(buf, `export-${ts()}.docx`);
    } else if (format === 'md') {
      const md = buildMarkdown(sorted);
      downloadBlob(`export-${ts()}.md`, 'text/markdown;charset=utf-8', md);
    } else {
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
  qs = qs.map(q => transformQuestion(q, { include: options?.include, removePatterns: options?.removePatterns, removeBlocks: options?.removeBlocks }));
  const { sorted } = sortAndGroup(qs, options);
  const { html } = buildHTMLDocument(sorted, options);
  return html;
}

function filterQuestions(questions, { selectedIds = [], includeTags = [], excludeTags = [], includeRounds = [], excludeRounds = [], searchText = '' } = {}) {
  const sel = new Set((selectedIds || []).map(String));
  const tIncl = new Set((includeTags || []).map(s => String(s).toLowerCase()));
  const tExcl = new Set((excludeTags || []).map(s => String(s).toLowerCase()));
  const rIncl = new Set((includeRounds || []).map(s => String(s).toLowerCase()));
  const rExcl = new Set((excludeRounds || []).map(s => String(s).toLowerCase()));
  const s = String(searchText || '').toLowerCase();
  return questions.filter(q => {
    if (sel.size && !sel.has(String(q._id))) return false;
    const tags = (q.tags || []).map(t => typeof t === 'string' ? t : (t.name || t._id || '')).map(s => String(s).toLowerCase());
    const round = String(q.round || '').toLowerCase();
    if (tIncl.size && !tags.some(t => tIncl.has(t))) return false;
    if (Array.from(tExcl).some(t => tags.includes(t))) return false;
    if (rIncl.size && !rIncl.has(round)) return false;
    if (rExcl.size && rExcl.has(round)) return false;
    if (s && !(`${q.question} ${q.answer} ${q.code} ${tags.join(' ')} ${q.company || ''} ${q.position || ''}`.toLowerCase().includes(s))) return false;
    return true;
  });
}

function transformQuestion(q, { include, removePatterns, removeBlocks }) {
  const clone = JSON.parse(JSON.stringify(q));

  if (!include?.answer) delete clone.answer;
  if (!include?.code) delete clone.code;
  if (!include?.tags) delete clone.tags;
  if (!include?.round) delete clone.round;
  if (!include?.images) delete clone.images;
  if (!include?.subject) delete clone.subject;
  if (!include?.date) delete clone.createdAt;
  if (!include?.flags) { delete clone.favorite; delete clone.review; delete clone.hot; }

  const applyRemovals = (text) => {
    if (!text) return text;
    let out = String(text);
    for (const blk of (removeBlocks || [])) {
      if (!blk?.start || !blk?.end) continue;
      const re = new RegExp(`${escapeRegExp(blk.start)}[\\s\\S]*?${escapeRegExp(blk.end)}`, 'g');
      out = out.replace(re, '');
    }
    for (const p of (removePatterns || [])) {
      try {
        const re = new RegExp(p, 'g');
        out = out.replace(re, '');
      } catch { }
    }
    return out;
  };
  if (clone.answer) clone.answer = applyRemovals(clone.answer);
  if (clone.code) clone.code = applyRemovals(clone.code);
  if (clone.notes) clone.notes = applyRemovals(clone.notes);
  return clone;
}

function sortAndGroup(qs, { sortBy = 'newest', groupBy = 'none' } = {}) {
  const arr = [...qs];
  const sorter = {
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    alphabetical: (a, b) => String(a.question).localeCompare(String(b.question)),
    difficulty: (a, b) => ({ easy: 1, medium: 2, hard: 3 }[a.difficulty || 'medium'] - ({ easy: 1, medium: 2, hard: 3 }[b.difficulty || 'medium']))
  }[sortBy] || (() => 0);
  arr.sort(sorter);
  const groups = groupBy === 'none' ? { All: arr } : groupByKey(arr, groupBy);
  return { sorted: arr, groups };
}

function groupByKey(arr, key) {
  const map = {};
  for (const q of arr) {
    let g = 'Other';
    if (key === 'round') g = q.round || 'Other';
    else if (key === 'tag') {
      const first = (q.tags && q.tags[0]) || '';
      g = typeof first === 'string' ? first : (first.name || first._id || 'Other');
    }
    else if (key === 'subject') g = q.subject || 'Other';
    else if (key === 'difficulty') g = q.difficulty || 'Other';
    map[g] = map[g] || [];
    map[g].push(q);
  }
  return map;
}

function buildMarkdown(qs) {
  const lines = [`# Interview Questions`, `Exported on ${new Date().toLocaleString()}`, ``];
  let i = 1;
  for (const q of qs) {
    lines.push(`## ${i}. ${q.question}`);
    const metaParts = [];
    if (!isEmptyValue(q.round)) metaParts.push(`Round: ${q.round}`);
    if (!isEmptyValue(q.subject)) metaParts.push(`Subject: ${q.subject}`);
    if (q.createdAt) metaParts.push(`Date: ${formatDate(q.createdAt)}`);
    if (metaParts.length) lines.push(`*${metaParts.join(' • ')}*`);
    if (q.tags?.length) lines.push(`Tags: ${q.tags.map(t => typeof t === 'string' ? t : t.name).join(', ')}`);
    lines.push('');
    if (q.answer) lines.push(q.answer, '');
    if (q.code) lines.push('```' + (q.codeLanguage || '') + '\n' + q.code + '\n```', '');
    if (q.notes) lines.push('> Notes: ' + q.notes, '');
    lines.push('---', '');
    i++;
  }
  return lines.join('\n');
}

// HTML Document Builder - Matches QuestionCard UI exactly
function buildHTMLDocument(qs, { theme = 'light', fontSize = 14, header = {}, footer = {}, watermark = '', toc = false, groupBy = 'none' } = {}) {
  const groups = groupBy === 'none' ? { All: qs } : groupByKey(qs, groupBy);

  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#020817' : '#ffffff',
    cardBg: isDark ? '#0f172a' : '#ffffff',
    cardBorder: isDark ? '#1e293b' : '#e2e8f0',
    textMain: isDark ? '#f8fafc' : '#0f172a',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    primary: isDark ? '#3b82f6' : '#2563eb',
    codeBg: isDark ? '#1e293b' : '#f8fafc',
    answerBg: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    tagBg: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)',
    tagText: isDark ? '#60a5fa' : '#2563eb',
    tagBorder: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)',
  };

  const escHtml = (s) => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let tocHtml = '';
  if (toc) {
    tocHtml = `<h2 style="margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid ${colors.cardBorder}">Table of Contents</h2>
    <ol style="margin-bottom:2rem; padding-left:1.5rem; color:${colors.textMain}">` +
      qs.map((q, i) => `<li style="margin-bottom:0.25rem"><a href="#q${i + 1}" style="text-decoration:none; color:${colors.primary}">${escHtml(q.question)}</a></li>`).join('') +
      '</ol>';
  }

  let i = 1;
  const content = Object.entries(groups).map(([g, items]) => `
    <section class="group-section">
      ${groupBy !== 'none' ? `<h2 class="group-heading">${escHtml(String(g).toUpperCase())}</h2>` : ''}
      <div class="cards-container">
        ${items.map(q => {
    // Metadata - exactly like QuestionCard
    const metaParts = [];
    if (!isEmptyValue(q.round)) {
      metaParts.push(`<span class="meta-value capitalize">${escHtml(q.round.replace('-', ' '))}</span>`);
    }
    if (!isEmptyValue(q.subject)) {
      if (metaParts.length) metaParts.push('<span class="meta-sep">•</span>');
      metaParts.push(`<span class="meta-value capitalize">${escHtml(q.subject)}</span>`);
    }
    if (q.createdAt) {
      if (metaParts.length) metaParts.push('<span class="meta-sep">•</span>');
      metaParts.push(`<span class="meta-value">${formatDate(q.createdAt)}</span>`);
    }

    // Tags - styled as pills like UI
    let tagsHtml = '';
    if (q.tags && q.tags.length > 0) {
      tagsHtml = `
              <div class="section-block">
                <h4 class="section-label">Tags</h4>
                <div class="tags-list">
                  ${q.tags.map(t => {
        const name = typeof t === 'string' ? t : (t.name || t._id);
        const style = typeof t === 'object' && t.color
          ? `background-color:${t.color}20; color:${t.color}; border-color:${t.color}40;`
          : `background-color:${colors.tagBg}; color:${colors.tagText}; border-color:${colors.tagBorder};`;
        return `<span class="tag-pill" style="${style}">${escHtml(name)}</span>`;
      }).join('')}
                </div>
              </div>`;
    }

    // Flags - like the UI icons
    let flagsHtml = '';
    if (q.favorite || q.review || q.hot) {
      const flags = [];
      if (q.favorite) flags.push('<span class="flag-icon" style="color:#ca8a04" title="Favorite">⭐</span>');
      if (q.review) flags.push('<span class="flag-icon" style="color:#16a34a" title="Review">📌</span>');
      if (q.hot) flags.push('<span class="flag-icon" style="color:#dc2626" title="Hot">🔥</span>');
      flagsHtml = `<div class="flags-row">${flags.join(' ')}</div>`;
    }

    return `
            <article id="q${i++}" class="question-card">
              <div class="card-header">
                <div class="header-top">
                  <h3 class="question-title">${escHtml(q.question)}</h3>
                  ${flagsHtml}
                </div>
                <div class="card-meta">${metaParts.join('')}</div>
              </div>
              
              <div class="card-content">
                ${q.answer ? `
                  <div class="section-block">
                    <h4 class="section-label">Answer</h4>
                    <div class="answer-box">${parseMarkdown(q.answer)}</div>
                  </div>` : ''}

                ${q.code ? `
                  <div class="section-block">
                    <h4 class="section-label">Code</h4>
                    <pre class="code-block"><code>${escHtml(q.code)}</code></pre>
                  </div>` : ''}

                ${tagsHtml}
              </div>
            </article>
          `;
  }).join('')}
      </div>
    </section>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interview Questions Export</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: ${colors.bg};
      color: ${colors.textMain};
      line-height: 1.6;
      font-size: ${fontSize}px;
      padding: 2rem;
    }
    
    .export-root { max-width: 900px; margin: 0 auto; }
    .cards-container { display: flex; flex-direction: column; gap: 0.5rem; }
    .group-heading { font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 1rem; color: ${colors.textMain}; text-transform: uppercase; letter-spacing: 0.05em; }
    
    /* Question Card - exact match to QuestionCard.jsx */
    .question-card {
      background: ${colors.cardBg};
      border: 1px solid ${colors.cardBorder};
      border-radius: 0.5rem;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .question-card:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    
    /* Card Header */
    .card-header {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid ${colors.cardBorder};
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .question-title {
      font-size: 1.125rem;
      font-weight: 500;
      color: ${colors.textMain};
      margin-bottom: 0.125rem;
      line-height: 1.4;
      flex: 1;
    }
    .flags-row {
      display: flex;
      gap: 0.25rem;
      flex-shrink: 0;
    }
    .flag-icon {
      font-size: 1rem;
    }
    .card-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: ${colors.textMuted};
    }
    .meta-value { text-transform: capitalize; }
    .meta-sep { opacity: 0.4; }
    .capitalize { text-transform: capitalize; }
    
    /* Card Content */
    .card-content {
      padding: 0.5rem 0.75rem;
      background: ${colors.answerBg};
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    /* Section blocks */
    .section-block {}
    .section-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: ${colors.textMain};
      margin-bottom: 0.25rem;
    }
    
    /* Answer box - matches UI exactly */
    .answer-box {
      font-size: 0.875rem;
      line-height: 1.7;
      color: ${colors.textMain};
      opacity: 0.8;
      /* Preserve whitespace like UI does */
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 24rem;
      overflow-y: auto;
      border: 1px solid ${isDark ? '#27272a' : '#f4f4f5'};
      border-radius: 0.375rem;
      padding: 0.5rem 0.75rem;
      background: ${colors.cardBg};
    }
    
    /* Markdown rendered elements */
    .answer-box strong { font-weight: 600; }
    .answer-box em { font-style: italic; }
    .answer-box .inline-code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.8em;
      background: ${colors.codeBg};
      padding: 0.1em 0.3em;
      border-radius: 0.25rem;
      border: 1px solid ${colors.cardBorder};
    }
    .answer-box .md-ul, .answer-box .md-ol {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }
    .answer-box .md-ul li { list-style-type: disc; }
    .answer-box .md-ol li { list-style-type: decimal; }
    .answer-box .md-blockquote {
      border-left: 3px solid ${colors.primary};
      padding-left: 0.75rem;
      margin: 0.5rem 0;
      color: ${colors.textMuted};
      font-style: italic;
    }
    .answer-box .md-h2, .answer-box .md-h3, .answer-box .md-h4 {
      font-weight: 600;
      margin: 0.75rem 0 0.25rem;
    }
    .answer-box .md-h2 { font-size: 1.1em; }
    .answer-box .md-h3 { font-size: 1em; }
    .answer-box .md-h4 { font-size: 0.95em; }
    
    /* Code block */
    .code-block {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 0.85rem;
      background: ${colors.codeBg};
      border: 1px solid ${colors.cardBorder};
      border-radius: 0.375rem;
      padding: 0.75rem;
      overflow-x: auto;
      white-space: pre;
      line-height: 1.5;
    }
    .answer-box .code-block {
      margin: 0.5rem 0;
      white-space: pre-wrap;
    }
    
    /* Tags */
    .tags-list { display: flex; flex-wrap: wrap; gap: 0.25rem; }
    .tag-pill {
      display: inline-block;
      padding: 0.125rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 9999px;
      border: 1px solid;
    }
    
    /* Notes */
    .notes-text { font-size: 0.875rem; font-style: italic; opacity: 0.9; }
    
    /* Watermark */
    .wm-overlay { 
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); 
      font-size: 64px; color: rgba(0,0,0,0.04); pointer-events: none; z-index: 9999; 
      font-weight: bold; white-space: nowrap;
    }
    
    /* Print styles */
    @media print {
      @page { margin: 15mm; }
      body { padding: 0; background: white; color: black; }
      .question-card { break-inside: avoid; border-color: #ccc; }
      .wm-overlay { display: none; }
    }
  </style>
</head>
<body>
  ${watermark ? `<div class="wm-overlay">${escHtml(watermark)}</div>` : ''}
  <div class="export-root">
    ${tocHtml}
    ${content}
  </div>
</body>
</html>`;
  return { html };
}

// DOCX Builder with proper markdown support and grouping
async function buildDocx(qs, { header = {}, footer = {}, groupBy = 'none' } = {}) {
  const docx = await import('docx');
  const { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType, Footer: DFooter, Header: DHeader } = docx;
  const children = [];
  let i = 1;

  // Group questions if groupBy is set
  const groups = groupBy === 'none' ? { All: qs } : groupByKey(qs, groupBy);

  for (const [groupName, groupQuestions] of Object.entries(groups)) {
    // Add group heading if groupBy is enabled
    if (groupBy !== 'none') {
      children.push(new Paragraph({
        children: [new TextRun({ text: String(groupName).toUpperCase(), bold: true, size: 32, color: '2563EB' })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        border: { bottom: { color: '2563EB', space: 1, style: 'single', size: 12 } }
      }));
    }

    for (const q of groupQuestions) {
      if (i > 1) {
        children.push(new Paragraph({ spacing: { before: 300 } }));
      }

      // Title
      children.push(new Paragraph({
        children: [new TextRun({ text: `${i}. ${q.question}`, bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      }));

      // Metadata row
      const metaRuns = [];
      if (!isEmptyValue(q.round)) {
        metaRuns.push(new TextRun({ text: q.round.replace('-', ' '), size: 20, color: '666666' }));
      }
      if (!isEmptyValue(q.subject)) {
        if (metaRuns.length) metaRuns.push(new TextRun({ text: ' • ', size: 20, color: 'AAAAAA' }));
        metaRuns.push(new TextRun({ text: q.subject, size: 20, color: '666666' }));
      }
      if (q.createdAt) {
        if (metaRuns.length) metaRuns.push(new TextRun({ text: ' • ', size: 20, color: 'AAAAAA' }));
        metaRuns.push(new TextRun({ text: formatDate(q.createdAt), size: 20, color: '666666' }));
      }
      if (metaRuns.length) {
        children.push(new Paragraph({ children: metaRuns, spacing: { after: 150 } }));
      }

      // Answer - parse markdown for DOCX
      if (q.answer) {
        children.push(new Paragraph({
          children: [new TextRun({ text: 'Answer', bold: true, size: 20 })],
          spacing: { before: 100, after: 50 }
        }));

        // Parse markdown into DOCX runs
        const answerParagraphs = parseMarkdownToDocx(q.answer, docx);
        children.push(...answerParagraphs);
      }

      // Code - preserve line breaks
      if (q.code) {
        children.push(new Paragraph({
          children: [new TextRun({ text: 'Code', bold: true, size: 20 })],
          spacing: { before: 150, after: 50 }
        }));

        // Split code by lines and create proper formatting
        const codeLines = q.code.split(/\r?\n/);
        const codeRuns = [];
        codeLines.forEach((line, idx) => {
          if (idx > 0) {
            codeRuns.push(new TextRun({ text: '', break: 1 })); // Line break
          }
          codeRuns.push(new TextRun({ text: line, font: 'Consolas', size: 18 }));
        });

        children.push(new Paragraph({
          children: codeRuns,
          spacing: { after: 100 },
          shading: { fill: 'F8FAFC' }
        }));
      }

      // Tags
      if (q.tags && q.tags.length > 0) {
        const tagText = q.tags.map(t => typeof t === 'string' ? t : (t.name || t._id)).join(', ');
        children.push(new Paragraph({
          children: [
            new TextRun({ text: 'Tags: ', bold: true, size: 20 }),
            new TextRun({ text: tagText, size: 20, color: '2563EB' })
          ],
          spacing: { before: 100 }
        }));
      }

      // Flags (⭐📌🔥)
      if (q.favorite || q.review || q.hot) {
        const flagParts = [];
        if (q.favorite) flagParts.push('⭐ Favorite');
        if (q.review) flagParts.push('📌 Review');
        if (q.hot) flagParts.push('🔥 Hot');
        children.push(new Paragraph({
          children: [
            new TextRun({ text: 'Flags: ', bold: true, size: 20 }),
            new TextRun({ text: flagParts.join('  '), size: 20, color: '666666' })
          ],
          spacing: { before: 100 }
        }));
      }

      // Separator
      children.push(new Paragraph({
        border: { bottom: { color: 'E5E7EB', space: 1, style: 'single', size: 6 } },
        spacing: { before: 200, after: 100 }
      }));

      i++;
    }
  }

  const doc = new Document({
    sections: [{
      headers: header?.text || header?.project ? { default: new DHeader({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun(header.project || ''), new TextRun('  '), new TextRun(header.text || '')] })] }) } : {},
      footers: footer?.text ? { default: new DFooter({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(footer.text)] })] }) } : {},
      properties: {},
      children
    }]
  });
  return await Packer.toBlob(doc);
}

// Parse markdown to DOCX paragraphs - preserving empty lines
function parseMarkdownToDocx(text, docx) {
  const { Paragraph, TextRun } = docx;
  const paragraphs = [];

  if (!text) return paragraphs;

  // Split by single newline to preserve empty lines
  const lines = text.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line - add spacing paragraph
    if (!line.trim()) {
      paragraphs.push(new Paragraph({ spacing: { before: 100, after: 100 } }));
      i++;
      continue;
    }

    // Check for code block start
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```

      // Create code block with line breaks
      const codeRuns = [];
      codeLines.forEach((codeLine, idx) => {
        if (idx > 0) codeRuns.push(new TextRun({ break: 1 }));
        codeRuns.push(new TextRun({ text: codeLine, font: 'Consolas', size: 18 }));
      });

      paragraphs.push(new Paragraph({
        children: codeRuns,
        shading: { fill: 'F8FAFC' },
        spacing: { before: 50, after: 50 }
      }));
      continue;
    }

    // Check for list item
    const listMatch = line.match(/^(?:[-*]|\d+\.)\s+(.+)/);
    if (listMatch) {
      paragraphs.push(new Paragraph({
        children: parseInlineMarkdown(listMatch[1], docx),
        bullet: { level: 0 },
        spacing: { before: 30, after: 30 }
      }));
      i++;
      continue;
    }

    // Regular line with inline formatting
    paragraphs.push(new Paragraph({
      children: parseInlineMarkdown(line, docx),
      spacing: { before: 50, after: 50 }
    }));
    i++;
  }

  return paragraphs;
}


// Parse inline markdown (bold, italic, code)
function parseInlineMarkdown(text, docx) {
  const { TextRun } = docx;
  const runs = [];

  if (!text) return runs;

  // Regex to match **bold**, *italic*, `code`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      runs.push(new TextRun({ text: text.slice(lastIndex, match.index), size: 22 }));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      // Bold
      runs.push(new TextRun({ text: token.slice(2, -2), bold: true, size: 22 }));
    } else if (token.startsWith('*') && token.endsWith('*')) {
      // Italic
      runs.push(new TextRun({ text: token.slice(1, -1), italics: true, size: 22 }));
    } else if (token.startsWith('`') && token.endsWith('`')) {
      // Inline code
      runs.push(new TextRun({ text: token.slice(1, -1), font: 'Consolas', size: 20, shading: { fill: 'F1F5F9' } }));
    }

    lastIndex = match.index + token.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIndex), size: 22 }));
  }

  // If no runs added, add the whole text
  if (runs.length === 0) {
    runs.push(new TextRun({ text, size: 22 }));
  }

  return runs;
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
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function safeFileName(s) { return String(s || 'export').replace(/[^a-z0-9._-]+/gi, '_'); }
