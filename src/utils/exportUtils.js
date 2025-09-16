
export const exportToWord = (questions) => {
  const htmlContent = generateHTMLContent(questions);
  const blob = new Blob([htmlContent], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `interview-questions-${new Date().toISOString().split('T')[0]}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToPDF = async (questions) => {
  // For now, we'll create an HTML version and let the browser handle PDF conversion
  const htmlContent = generatePrintableHTML(questions);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then trigger print
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

// Advanced export with grouping, sorting and inclusion options
export const exportAdvanced = async (questions, options = {}) => {
  const { format='doc', groupBy='none', sortBy='newest', include = { answer:true, code:true, tags:true, images:true, meta:true } } = options;
  const sorter = (a,b) => {
    if (sortBy==='oldest') return new Date(a.createdAt)-new Date(b.createdAt);
    if (sortBy==='alphabetical') return (a.question||'').localeCompare(b.question||'');
    if (sortBy==='difficulty') return ['easy','medium','hard'].indexOf(a.difficulty||'medium') - ['easy','medium','hard'].indexOf(b.difficulty||'medium');
    return new Date(b.createdAt)-new Date(a.createdAt);
  };
  const grouped = (() => {
    if (groupBy==='none') return { All: [...questions].sort(sorter) };
    const map = {};
    const push = (k,q)=>{ (map[k]=map[k]||[]).push(q) };
    questions.forEach(q=>{
      if (groupBy==='round') push(q.round||'other', q);
      else if (groupBy==='difficulty') push(q.difficulty||'medium', q);
      else if (groupBy==='tag') {
        const tags = Array.isArray(q.tags) ? q.tags : [];
        if (tags.length===0) push('untagged', q);
        else tags.forEach(t=> push(typeof t==='string'? t : (t.name||'tag'), q));
      }
    });
    Object.keys(map).forEach(k=> map[k].sort(sorter));
    return map;
  })();

  const sectionHTML = (q) => `
    <div style="margin-bottom: 30px; page-break-inside: avoid;">
      <h3 style="color: #2563eb; margin-bottom: 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">${q.question}</h3>
      ${include.meta ? `<p style="margin: 5px 0; font-size: 12px; color: #6b7280;">
        <strong>Round:</strong> ${q.round?.replace('-', ' ').toUpperCase()} | 
        <strong>Difficulty:</strong> ${(q.difficulty||'medium').toUpperCase()} |
        <strong>Date:</strong> ${new Date(q.createdAt).toLocaleDateString()}
      </p>`: ''}
      ${include.answer ? `<div style="margin: 15px 0;"><h4 style=\"color:#374151;margin-bottom:8px;\">Answer:</h4><div style=\"line-height:1.6;color:#4b5563;\">${q.answer}</div></div>`:''}
      ${include.code && q.code ? `<div style=\"margin:15px 0;\"><h4 style=\"color:#374151;margin-bottom:8px;\">Code:</h4><pre style=\"background:#f9fafb;padding:15px;border-radius:6px;border:1px solid #e5e7eb;overflow-x:auto;font-size:12px;\"><code>${q.code}</code></pre></div>`:''}
      ${include.tags && q.tags?.length ? `<div style=\"margin:15px 0;\"><h4 style=\"color:#374151;margin-bottom:8px;\">Tags:</h4><p style=\"color:#6b7280;\">${q.tags.map(t=> typeof t==='string'? t : (t.name||'')).join(', ')}</p></div>`:''}
    </div>`;

  const html = `
  <html><head><meta charset="utf-8"><title>Export</title></head><body style="font-family:Arial,sans-serif;line-height:1.6;margin:40px;">
    <div class="header"><h1>Export</h1><p>${new Date().toLocaleString()}</p></div>
    ${Object.entries(grouped).map(([group,qs])=> `
      <h2 style="color:#1f2937;border-bottom:2px solid #e5e7eb;padding-bottom:6px;">${group}</h2>
      ${qs.map(sectionHTML).join('')}
    `).join('')}
  </body></html>`;

  if (format==='pdf') {
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close(); setTimeout(()=>w.print(), 400);
  } else if (format==='html') {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='export.html'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  } else {
    const blob = new Blob([html], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='export.doc'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }
};

const generateHTMLContent = (questions) => {
  const questionsHTML = questions.map(q => `
    <div style="margin-bottom: 30px; page-break-inside: avoid;">
      <h3 style="color: #2563eb; margin-bottom: 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
        ${q.question}
      </h3>
      <p style="margin: 5px 0; font-size: 12px; color: #6b7280;">
        <strong>Round:</strong> ${q.round?.replace('-', ' ').toUpperCase()} | 
        <strong>Date:</strong> ${new Date(q.createdAt).toLocaleDateString()}
      </p>
      <div style="margin: 15px 0;">
        <h4 style="color: #374151; margin-bottom: 8px;">Answer:</h4>
        <p style="line-height: 1.6; color: #4b5563;">${q.answer}</p>
      </div>
      ${q.code ? `
        <div style="margin: 15px 0;">
          <h4 style="color: #374151; margin-bottom: 8px;">Code:</h4>
          <pre style="background: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; overflow-x: auto; font-size: 12px;"><code>${q.code}</code></pre>
        </div>
      ` : ''}
      ${q.tags && q.tags.length > 0 ? `
        <div style="margin: 15px 0;">
          <h4 style="color: #374151; margin-bottom: 8px;">Tags:</h4>
          <p style="color: #6b7280;">${q.tags.join(', ')}</p>
        </div>
      ` : ''}
    </div>
  `).join('');

  return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>Interview Questions Export</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1 { color: #1f2937; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #374151; }
          .header { text-align: center; margin-bottom: 40px; }
          .summary { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚀 Interview Questions</h1>
          <p>Exported on ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Total Questions:</strong> ${questions.length}</p>
          <p><strong>Favorites:</strong> ${questions.filter(q => q.favorite).length}</p>
          <p><strong>For Review:</strong> ${questions.filter(q => q.review).length}</p>
          <p><strong>Hot Topics:</strong> ${questions.filter(q => q.hot).length}</p>
        </div>
        ${questionsHTML}
      </body>
    </html>
  `;
};

const generatePrintableHTML = (questions) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Interview Questions - PDF Export</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            margin: 20px;
            font-size: 14px;
          }
          h1 { 
            color: #1f2937; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 10px;
            text-align: center;
          }
          .question-block {
            margin-bottom: 25px;
            page-break-inside: avoid;
            border: 1px solid #e5e7eb;
            padding: 15px;
            border-radius: 8px;
          }
          .question-title {
            color: #2563eb;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .question-meta {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 10px;
          }
          .answer-section {
            margin: 10px 0;
          }
          .code-block {
            background: #f9fafb;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            overflow-x: auto;
            white-space: pre-wrap;
          }
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <button class="print-btn no-print" onclick="window.print()">Print as PDF</button>
        <h1>🚀 Interview Questions</h1>
        <div style="text-align: center; margin-bottom: 30px; color: #6b7280;">
          Exported on ${new Date().toLocaleDateString()} • Total: ${questions.length} questions
        </div>
        ${questions.map(q => `
          <div class="question-block">
            <div class="question-title">${q.question}</div>
            <div class="question-meta">
              Round: ${q.round?.replace('-', ' ').toUpperCase()} | 
              Date: ${new Date(q.createdAt).toLocaleDateString()}
              ${q.tags && q.tags.length > 0 ? ` | Tags: ${q.tags.join(', ')}` : ''}
            </div>
            <div class="answer-section">
              <strong>Answer:</strong><br>
              ${q.answer}
            </div>
            ${q.code ? `
              <div class="answer-section">
                <strong>Code:</strong><br>
                <div class="code-block">${q.code}</div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </body>
    </html>
  `;
};
