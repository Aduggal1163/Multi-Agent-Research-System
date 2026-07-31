import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  ListChecks, 
  GitFork, 
  Network, 
  MessageSquare, 
  Trash2, 
  ArrowLeft,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';
import { MermaidDiagram } from './MermaidDiagram';
import { DocumentChat } from './DocumentChat';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

function renderMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/^# (.*$)/gim, '<h3 class="font-bold text-white mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h4 class="font-bold text-purple-400 mt-4 mb-2">$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, '<br/>');
}

export function DocumentExplorer({ 
  documents = [], 
  selectedDoc, 
  setSelectedDoc, 
  onDeleteDocument,
  onOpenDiagramEditor
}) {
  const [docExplorerTab, setDocExplorerTab] = useState('summary');
  const [formatFilter, setFormatFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  const getFileExt = (filename = '') => {
    const match = filename.match(/\.([a-z0-9]+)$/i);
    return match ? `.${match[1].toLowerCase()}` : '';
  };

  const getExtBadgeVariant = (ext) => {
    switch (ext) {
      case '.pdf': return 'red';
      case '.docx': return 'cyan';
      case '.txt': return 'green';
      case '.md': return 'purple';
      default: return 'purple';
    }
  };

  // Filter documents by extension
  const filteredDocs = documents.filter(doc => {
    if (formatFilter === 'ALL') return true;
    return getFileExt(doc.filename) === formatFilter.toLowerCase();
  });

  // Sort documents
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
    if (sortBy === 'oldest') return new Date(a.created_at || Date.now()) - new Date(b.created_at || Date.now());
    if (sortBy === 'title') return (a.title || a.filename).localeCompare(b.title || b.filename);
    if (sortBy === 'chunks') return (b.chunk_count || 1) - (a.chunk_count || 1);
    return 0;
  });

  if (!selectedDoc) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800 }}>
            Indexed Knowledge Documents
          </h3>

          {/* Filter Pills & Sort Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Extension Filter Pills */}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.25rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              {['ALL', '.PDF', '.DOCX', '.TXT', '.MD'].map((ext) => (
                <button
                  key={ext}
                  onClick={() => setFormatFilter(ext)}
                  style={{
                    background: formatFilter === ext ? 'var(--gradient-brand)' : 'transparent',
                    color: formatFilter === ext ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '7px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {ext} {ext !== 'ALL' && `(${documents.filter(d => getFileExt(d.filename) === ext.toLowerCase()).length})`}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="newest" style={{ background: '#0b0f1d' }}>Sort: Newest First</option>
              <option value="oldest" style={{ background: '#0b0f1d' }}>Sort: Oldest First</option>
              <option value="title" style={{ background: '#0b0f1d' }}>Sort: Title (A - Z)</option>
              <option value="chunks" style={{ background: '#0b0f1d' }}>Sort: Chunk Count</option>
            </select>
          </div>
        </div>

        {sortedDocs.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h4>No documents matching '{formatFilter}'</h4>
            <p style={{ fontSize: '0.88rem', marginTop: '0.5rem' }}>
              Upload PDF, DOCX, or TXT files above to extract instant summaries, mindmaps, and enable RAG chat.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {sortedDocs.map(doc => {
              const ext = getFileExt(doc.filename);
              const badgeVariant = getExtBadgeVariant(ext);

              return (
                <div 
                  key={doc.id}
                  className="glass-panel"
                  onClick={() => setSelectedDoc(doc)}
                  style={{ 
                    padding: '1.25rem', 
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Badge variant={badgeVariant}>{ext.toUpperCase() || 'FILE'}</Badge>
                        <Badge variant="cyan">{doc.chunk_count || 1} Chunks</Badge>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id); }}
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}
                        title="Delete Document"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h4 style={{ 
                      fontFamily: 'var(--font-display)', 
                      fontSize: '1.05rem', 
                      fontWeight: 700, 
                      color: 'var(--text-main)',
                      marginBottom: '0.5rem'
                    }}>
                      {doc.title || doc.filename}
                    </h4>

                    <p style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--text-muted)', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.5
                    }}>
                      {doc.short_summary || doc.summary || 'Click to view 3-tier summaries, mindmaps, and chat.'}
                    </p>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginTop: '1.25rem', 
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-glass)',
                    fontSize: '0.78rem',
                    color: 'var(--text-dim)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} /> {new Date(doc.created_at || Date.now()).toLocaleDateString()}
                    </span>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>Explore & Chat →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Detail Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button 
            className="btn-secondary" 
            onClick={() => setSelectedDoc(null)}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
              {selectedDoc.title || selectedDoc.filename}
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Source: {selectedDoc.filename} • {selectedDoc.chunk_count || 1} Vector Chunks
            </span>
          </div>
        </div>

        <button 
          className="btn-secondary" 
          onClick={() => onDeleteDocument(selectedDoc.id)}
          style={{ color: '#f87171', padding: '0.45rem 0.75rem' }}
        >
          <Trash2 size={15} /> Delete
        </button>
      </div>

      {/* Detail Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
        <button 
          className={`nav-item ${docExplorerTab === 'summary' ? 'active' : ''}`}
          onClick={() => setDocExplorerTab('summary')}
          style={{ width: 'auto', padding: '0.5rem 1rem' }}
        >
          <Sparkles size={15} style={{ color: '#c084fc' }} />
          <span>3-Tier Summary</span>
        </button>

        <button 
          className={`nav-item ${docExplorerTab === 'mindmap' ? 'active' : ''}`}
          onClick={() => setDocExplorerTab('mindmap')}
          style={{ width: 'auto', padding: '0.5rem 1rem' }}
        >
          <GitFork size={15} style={{ color: '#c084fc' }} />
          <span>Concept Mindmap</span>
        </button>

        <button 
          className={`nav-item ${docExplorerTab === 'flowchart' ? 'active' : ''}`}
          onClick={() => setDocExplorerTab('flowchart')}
          style={{ width: 'auto', padding: '0.5rem 1rem' }}
        >
          <Network size={15} style={{ color: '#38bdf8' }} />
          <span>Process Flowchart</span>
        </button>

        <button 
          className={`nav-item ${docExplorerTab === 'chat' ? 'active' : ''}`}
          onClick={() => setDocExplorerTab('chat')}
          style={{ width: 'auto', padding: '0.5rem 1rem' }}
        >
          <MessageSquare size={15} style={{ color: '#f472b6' }} />
          <span>AI Document Assistant</span>
        </button>
      </div>

      {/* Tab Viewport */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {docExplorerTab === 'summary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '900px' }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                <Sparkles size={16} /> Short Executive Summary
              </h4>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {selectedDoc.short_summary || selectedDoc.summary}
              </p>
            </div>

            {selectedDoc.detailed_summary && (
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  <FileText size={16} /> Detailed Technical Breakdown
                </h4>
                <div 
                  className="markdown-body" 
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedDoc.detailed_summary) }} 
                />
              </div>
            )}

            {selectedDoc.bullet_summary && (
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  <ListChecks size={16} /> Key Takeaways & Highlights
                </h4>
                <div 
                  className="markdown-body" 
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedDoc.bullet_summary) }} 
                />
              </div>
            )}
          </div>
        )}

        {docExplorerTab === 'mindmap' && (
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ color: '#c084fc' }}>Visual Concept Mindmap</h4>
              {onOpenDiagramEditor && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => onOpenDiagramEditor(
                    selectedDoc.mindmap_code || `graph TD\n  Root["${selectedDoc.title}"] --> Topic1["Overview"]`, 
                    "Concept Mindmap"
                  )}
                >
                  Edit in Live Editor
                </Button>
              )}
            </div>
            <MermaidDiagram 
              code={selectedDoc.mindmap_code || `graph TD\n  Root["${selectedDoc.title}"] --> Topic1["Overview"]`} 
              id={`mindmap-${selectedDoc.id}`} 
              title={selectedDoc.title}
            />
          </div>
        )}

        {docExplorerTab === 'flowchart' && (
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ color: '#38bdf8' }}>Process Flowchart & Structure</h4>
              {onOpenDiagramEditor && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => onOpenDiagramEditor(
                    selectedDoc.flowchart_code || `graph LR\n  Start["${selectedDoc.title}"] --> Step1["Process Scope"]`, 
                    "Process Flowchart"
                  )}
                >
                  Edit in Live Editor
                </Button>
              )}
            </div>
            <MermaidDiagram 
              code={selectedDoc.flowchart_code || `graph LR\n  Start["${selectedDoc.title}"] --> Step1["Process Scope"]`} 
              id={`flowchart-${selectedDoc.id}`} 
              title={selectedDoc.title}
            />
          </div>
        )}

        {docExplorerTab === 'chat' && (
          <DocumentChat selectedDoc={selectedDoc} />
        )}
      </div>
    </div>
  );
}
