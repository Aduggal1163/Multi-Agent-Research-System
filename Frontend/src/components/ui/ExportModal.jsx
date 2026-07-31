import React from 'react';
import { X, FileText, Code, Printer, Download } from 'lucide-react';
import { Button } from './Button';

export function ExportModal({ report, onClose, showToast }) {
  if (!report) return null;

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    if (showToast) showToast(`Downloaded ${filename}`);
  };

  const handleExportMarkdown = () => {
    const filename = `${report.query.toLowerCase().replace(/[^a-z0-9]/g, '_')}_report.md`;
    downloadFile(report.report || report.synthesis || '', filename, 'text/markdown');
  };

  const handleExportHTML = () => {
    const filename = `${report.query.toLowerCase().replace(/[^a-z0-9]/g, '_')}_briefing.html`;
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${report.query} - Executive Briefing</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 3rem; background: #0f172a; color: #f8fafc; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #c084fc; border-bottom: 2px solid #a855f7; padding-bottom: 0.5rem; }
    h2 { color: #38bdf8; margin-top: 1.5rem; }
    .badge { background: #1e293b; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.8rem; color: #34d399; }
  </style>
</head>
<body>
  <span class="badge">QA Quality Score: ${Math.round((report.score || 0.85) * 100)}%</span>
  <h1>${report.query}</h1>
  <div>${(report.report || '').replace(/\n/g, '<br/>')}</div>
</body>
</html>`;
    downloadFile(htmlContent, filename, 'text/html');
  };

  const handleExportJSON = () => {
    const filename = `${report.query.toLowerCase().replace(/[^a-z0-9]/g, '_')}_data.json`;
    downloadFile(JSON.stringify(report, null, 2), filename, 'application/json');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(6, 9, 19, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="glass-panel" style={{ width: '480px', padding: '2rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
            Export Intelligence Briefing
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Choose a multi-format export package for "{report.query}":
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          <button 
            className="nav-item" 
            onClick={handleExportMarkdown}
            style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}
          >
            <FileText size={18} style={{ color: '#c084fc' }} />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Markdown Document (.md)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Raw Markdown formatting for GitHub/Notion</div>
            </div>
          </button>

          <button 
            className="nav-item" 
            onClick={handleExportHTML}
            style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}
          >
            <Code size={18} style={{ color: '#38bdf8' }} />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Standalone HTML Report (.html)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Self-contained web page briefing</div>
            </div>
          </button>

          <button 
            className="nav-item" 
            onClick={handleExportJSON}
            style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}
          >
            <Download size={18} style={{ color: '#34d399' }} />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Structured JSON Payload (.json)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Raw research metadata and QA scores</div>
            </div>
          </button>

          <button 
            className="nav-item" 
            onClick={handlePrint}
            style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}
          >
            <Printer size={18} style={{ color: '#f472b6' }} />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Print / Save as PDF</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Open system print dialog for physical export</div>
            </div>
          </button>
        </div>

        <Button variant="secondary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
          Close Export Hub
        </Button>
      </div>
    </div>
  );
}
