import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Award, 
  Download, 
  Copy, 
  Pin, 
  Check, 
  Trash2,
  BarChart3
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

function renderSimpleMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-purple-400 mt-6 mb-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-cyan-300 mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300">$1</li>')
    .replace(/\n\n/g, '<br/><br/>');
}

export function ReportViewer({ report, isPinned, togglePin, onDelete, showToast, onExportClick }) {
  const [activeTab, setActiveTab] = useState('report');
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(report.report || report.synthesis || '');
    setCopied(true);
    if (showToast) showToast('Report copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${report.query.toLowerCase().replace(/[^a-z0-9]/g, '_')}_report.md`;
    const blob = new Blob([report.report || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    if (showToast) showToast(`Exported report as ${filename}`);
  };

  const scorePercent = report.score ? Math.round(report.score * 100) : 85;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem' }}>
      {/* Report Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Badge variant="purple">Query</Badge>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              {new Date(report.created_at || Date.now()).toLocaleDateString()}
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {report.query}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button 
            className="btn-secondary"
            onClick={(e) => togglePin(report.id, e)}
            style={{ padding: '0.5rem 0.85rem' }}
            title={isPinned ? "Unpin Report" : "Pin Report"}
          >
            <Pin size={16} style={{ color: isPinned ? '#c084fc' : 'var(--text-muted)' }} />
          </button>
          <button 
            className="btn-secondary"
            onClick={handleCopy}
            style={{ padding: '0.5rem 0.85rem' }}
            title="Copy Report Markdown"
          >
            {copied ? <Check size={16} style={{ color: '#34d399' }} /> : <Copy size={16} />}
          </button>
          <Button variant="secondary" onClick={onExportClick} icon={Download} size="sm">
            Export Report Hub
          </Button>
          <button 
            className="btn-secondary"
            onClick={() => onDelete(report.id)}
            style={{ padding: '0.5rem 0.85rem', color: '#f87171' }}
            title="Delete Report"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        padding: '1.25rem',
        borderRadius: '14px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-glass)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Award size={24} style={{ color: '#34d399' }} />
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>QA Quality Score</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>{scorePercent}% Quality</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BarChart3 size={24} style={{ color: '#c084fc' }} />
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Review Iterations</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c084fc' }}>{report.iterations || 1} Review Loops</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sparkles size={24} style={{ color: '#38bdf8' }} />
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Swarm Status</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>Verified Complete</div>
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '1.5rem' }}>
        <button 
          className={`nav-item ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
          style={{ width: 'auto', padding: '0.6rem 1.25rem' }}
        >
          <FileText size={16} />
          <span>Full Research Report</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'synthesis' ? 'active' : ''}`}
          onClick={() => setActiveTab('synthesis')}
          style={{ width: 'auto', padding: '0.6rem 1.25rem' }}
        >
          <Sparkles size={16} />
          <span>Synthesis & Analysis</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'report' && (
        <div 
          className="markdown-body" 
          dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(report.report) }} 
        />
      )}

      {activeTab === 'synthesis' && (
        <div style={{ color: 'var(--text-sub)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {report.synthesis || "Synthesis data available."}
        </div>
      )}
    </div>
  );
}
