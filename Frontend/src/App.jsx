import React, { useState, useEffect, useMemo, useRef } from 'react';
import mermaid from 'mermaid';
import { 
  Search, Plus, TrendingUp, Trash2, Download, 
  Compass, FileText, Database, Cpu, Award, 
  Terminal, Calendar, ChevronRight, Sparkles, 
  Layers, CheckCircle2, AlertCircle, Menu, Copy,
  Pin, Clock, Zap, ShieldCheck, UploadCloud, MessageSquare,
  File, Send, ArrowLeft, GitFork, Network, ListChecks
} from 'lucide-react';
import './App.css';

const API_BASE = "http://localhost:8000";

// Custom enhanced Markdown renderer
function renderMarkdown(md) {
  if (!md) return '';
  let html = md.trim();
  
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<div class="code-block-wrapper">
      <div class="code-block-header">
        <span>${lang || 'code'}</span>
      </div>
      <pre class="code-block-content"><code>${code.trim()}</code></pre>
    </div>`;
  });

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  html = html.replace(/^---$/gm, '<hr />');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/^>\s+(.*?)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li class="ol-item">$1</li>');
  
  html = html.replace(/\|(.+)\|/g, (match, content) => {
    const cols = content.split('|').map(c => `<td>${c.trim()}</td>`).join('');
    return `<tr>${cols}</tr>`;
  });
  
  const blocks = html.split(/\n\n+/);
  const formattedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (
      trimmed.startsWith('<h') || 
      trimmed.startsWith('<hr') || 
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('<li>') || 
      trimmed.startsWith('<li class="ol-item"') ||
      trimmed.startsWith('<tr>') || 
      trimmed.startsWith('<div class="code-block')
    ) {
      if (trimmed.startsWith('<li class="ol-item"')) {
        const items = trimmed.replace(/class="ol-item"/g, '');
        return `<ol>${items}</ol>`;
      }
      if (trimmed.startsWith('<li>')) {
        return `<ul>${trimmed}</ul>`;
      }
      if (trimmed.startsWith('<tr>')) {
        return `<table><tbody>${trimmed}</tbody></table>`;
      }
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
  });
  
  return formattedBlocks.join('\n');
}

// Robust Mermaid Diagram Renderer Component with Visual Fallback
function MermaidDiagram({ code, id, title }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!code) {
      setError(true);
      return;
    }
    let isMounted = true;
    try {
      mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
      const uniqueId = `mermaid-${id || 'id'}-${Math.floor(Math.random() * 1000000)}`;
      
      let cleanCode = code
        .replace(/```mermaid/g, '')
        .replace(/```/g, '')
        .trim();

      if (!cleanCode.startsWith('graph') && !cleanCode.startsWith('mindmap') && !cleanCode.startsWith('flowchart')) {
        cleanCode = `graph TD\n${cleanCode}`;
      }

      mermaid.render(uniqueId, cleanCode)
        .then((res) => {
          if (isMounted) {
            setSvg(res.svg);
            setError(false);
          }
        })
        .catch((err) => {
          console.error("Mermaid render error:", err);
          if (isMounted) setError(true);
        });
    } catch (e) {
      console.error(e);
      if (isMounted) setError(true);
    }
    return () => { isMounted = false; };
  }, [code, id]);

  const parsedNodes = useMemo(() => {
    if (!code) return [];
    const lines = code.split('\n');
    const nodes = [];
    lines.forEach(line => {
      const match = line.match(/(?:-->|==>|--|\s|\[)(\w+)?\[?"?([^"\]]{3,40})"?\]?/);
      if (match && match[2] && !match[2].includes('graph') && !match[2].includes('TD') && !match[2].includes('LR')) {
        nodes.push(match[2].trim());
      }
    });
    return [...new Set(nodes)];
  }, [code]);

  if (error || !svg) {
    const safeTitle = (title || 'Diagram').replace(/["\']/g, '');
    return (
      <div className="summary-tier-card" style={{ width: '100%' }}>
        <h4 style={{ color: '#c084fc', marginBottom: '1rem' }}>Visual Concept Hierarchy ({safeTitle})</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {parsedNodes.length > 0 ? (
            parsedNodes.map((node, i) => (
              <div key={i} className="meta-badge" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', backgroundColor: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#ffffff' }}>
                📌 {node}
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Concept structure generated for {safeTitle}.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mermaid-svg-container" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}

export default function App() {
  const [workspaceMode, setWorkspaceMode] = useState('swarm'); // 'swarm' | 'kb'
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docExplorerTab, setDocExplorerTab] = useState('summary'); // 'summary' | 'mindmap' | 'flowchart' | 'chat'

  const [searchQuery, setSearchQuery] = useState('');
  const [activeReport, setActiveReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('synthesis');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Document Chat State
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Welcome to Document AI Chat! Ask any question regarding your uploaded document.' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('pinned_reports');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatViewportRef = useRef(null);

  useEffect(() => {
    if (chatViewportRef.current) {
      chatViewportRef.current.scrollTo({
        top: chatViewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, isChatLoading]);

  useEffect(() => {
    if (selectedDoc) {
      setChatMessages([
        { sender: 'ai', text: `Welcome to Document AI Chat! Ask any question regarding "${selectedDoc.title}".` }
      ]);
    }
  }, [selectedDoc?.id]);

  const steps = [
    { label: "Deconstructing topic & extracting Document/Web research vectors", agent: "LangGraph Supervisor" },
    { label: "Executing parallel sweeps: Market, Competitor, Tech & Document QA", agent: "4-Agent Swarm" },
    { label: "Synthesizing cross-vector findings & analyst metrics", agent: "Synthesis Agent" },
    { label: "Drafting structured executive intelligence report", agent: "Report Writer Agent" },
    { label: "Executing QA review audit & refining data consistency", agent: "Quality Reviewer Agent" }
  ];

  useEffect(() => {
    try {
      localStorage.setItem('pinned_reports', JSON.stringify(pinnedIds));
    } catch (e) {
      console.error(e);
    }
  }, [pinnedIds]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/reports`);
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to FastAPI backend on port 8000.");
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/documents`);
      if (!res.ok) return;
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchDocuments();
  }, []);

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const togglePin = (id, e) => {
    e.stopPropagation();
    setPinnedIds(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(item => item !== id) : [...prev, id];
      showToast(exists ? "Report unpinned" : "Report pinned to top");
      return updated;
    });
  };

  const groupedHistory = useMemo(() => {
    let items = history;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.query.toLowerCase().includes(q) || 
        (item.synthesis && item.synthesis.toLowerCase().includes(q))
      );
    }

    const pinned = items.filter(i => pinnedIds.includes(i.id));
    const unpinned = items.filter(i => !pinnedIds.includes(i.id));

    const today = [];
    const earlier = [];
    const now = new Date();

    unpinned.forEach(item => {
      const d = new Date(item.created_at);
      const isToday = d.toDateString() === now.toDateString();
      if (isToday) today.push(item);
      else earlier.push(item);
    });

    return { pinned, today, earlier };
  }, [history, searchQuery, pinnedIds]);

  const stats = useMemo(() => {
    if (!history.length) return { count: 0, avgScore: 0 };
    const count = history.length;
    const totalScore = history.reduce((sum, item) => sum + (item.score || 0), 0);
    return {
      count,
      avgScore: (totalScore / count).toFixed(2)
    };
  }, [history]);

  const handleSubmit = async (searchTopic) => {
    const targetQuery = (typeof searchTopic === 'string' ? searchTopic : query).trim();
    if (!targetQuery || isLoading) return;

    setIsLoading(true);
    setError('');
    setActiveStep(0);
    setQuery(targetQuery);

    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4500);

    try {
      const res = await fetch(`${API_BASE}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: targetQuery })
      });

      if (!res.ok) throw new Error("Research workflow failed.");
      const newReport = await res.json();
      
      setHistory(prev => [newReport, ...prev]);
      setActiveReport(newReport);
      setActiveTab('synthesis');
      setQuery('');
      setWorkspaceMode('swarm');
      showToast("Multi-Agent Intelligence report compiled successfully!");
    } catch (err) {
      setError(err.message || "Execution error during research workflow.");
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setError('');
    showToast(`Uploading and generating document intelligence for ${file.name}...`);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Document processing failed.");
      }
      const newDoc = await res.json();

      setDocuments(prev => [newDoc, ...prev]);
      setSelectedDoc(newDoc);
      setWorkspaceMode('kb');
      setDocExplorerTab('summary');
      showToast(`Indexed "${newDoc.title}" with Instant Summaries, Mindmap & Flowchart!`);
    } catch (err) {
      setError(err.message || "Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async (docId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Delete this document from knowledge base?")) return;
    try {
      const res = await fetch(`${API_BASE}/documents/${docId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete document");
      setDocuments(prev => prev.filter(d => d.id !== docId));
      if (selectedDoc && selectedDoc.id === docId) setSelectedDoc(null);
      showToast("Document deleted from knowledge base.");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendChat = async () => {
    if (!chatQuestion.trim() || isChatLoading) return;
    const q = chatQuestion;
    setChatQuestion('');
    setChatMessages(prev => [...prev, { sender: 'user', text: q }]);
    setIsChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/document-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, doc_id: selectedDoc ? selectedDoc.id : null })
      });

      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.answer || "Document analysis complete.", sources: data.sources || [] }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Error querying documents: " + err.message }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm("Delete this research report?")) return;
    try {
      const res = await fetch(`${API_BASE}/reports/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed");
      
      setHistory(prev => prev.filter(r => r.id !== id));
      setPinnedIds(prev => prev.filter(pId => pId !== id));
      if (activeReport && activeReport.id === id) setActiveReport(null);
      showToast("Report deleted.");
    } catch (err) {
      alert("Error deleting report: " + err.message);
    }
  };

  const handleDeleteReportSidebar = (id, e) => {
    if (e) e.stopPropagation();
    handleDeleteReport(id);
  };

  const handleExport = (report) => {
    const content = `# Research Intelligence Report: ${report.query}
 
**QA Quality Rating:** ${(report.score * 100).toFixed(0)}%
**Refinement Iterations:** ${report.iterations}
**Generated Date:** ${new Date(report.created_at).toLocaleString()}
 
---
 
## Executive Synthesized Analysis
${report.synthesis}
 
---
 
## Detailed Intelligence Report
${report.report}
 
---
 
## Quality Review Audit Log
${report.review || "No review feedback logged."}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `insightflow_report_${report.query.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Report exported as Markdown file!");
  };

  const handleCopy = (report) => {
    const content = `# Research Intelligence Report: ${report.query}
 
**QA Quality Rating:** ${(report.score * 100).toFixed(0)}%
 
## Executive Synthesized Analysis
${report.synthesis}
 
## Detailed Intelligence Report
${report.report}
`;
    navigator.clipboard.writeText(content).then(() => {
      showToast("Copied full report to clipboard!");
    });
  };

  const sampleTopics = [
    { title: "Commercial Fusion Energy", desc: "Timelines, magnet innovations, & scaling hurdles.", icon: Compass },
    { title: "Post-Quantum Cryptography", desc: "NIST standards, lattice encryption & enterprise adoption.", icon: Sparkles },
    { title: "Autonomous Drone Delivery", desc: "FAA regulations, battery density & last-mile unit economics.", icon: Layers }
  ];

  return (
    <div className="app-container">
      <div className="ambient-glow orb-1"></div>
      <div className="ambient-glow orb-2"></div>
      <div className="ambient-glow orb-3"></div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="brand-icon-box">
              <Cpu size={20} />
            </div>
            <h1>InsightFlow</h1>
          </div>
          <span className="version-pill">v2.0 Enterprise</span>
        </div>

        <div className="sidebar-search-container">
          <Search className="search-icon-inside" size={15} />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search saved reports..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-shortcut-badge">/</span>
        </div>

        <div className="history-list">
          {groupedHistory.pinned.length > 0 && (
            <>
              <div className="history-section-header">
                <Pin size={11} />
                <span>Pinned Reports</span>
              </div>
              {groupedHistory.pinned.map(item => (
                <HistoryCard key={item.id} item={item} activeReport={activeReport} setActiveReport={setActiveReport} setActiveTab={setActiveTab} isPinned={true} togglePin={togglePin} setWorkspaceMode={setWorkspaceMode} setSelectedDoc={setSelectedDoc} onDeleteReport={handleDeleteReportSidebar} />
              ))}
            </>
          )}

          {groupedHistory.today.length > 0 && (
            <>
              <div className="history-section-header">
                <Clock size={11} />
                <span>Today</span>
              </div>
              {groupedHistory.today.map(item => (
                <HistoryCard key={item.id} item={item} activeReport={activeReport} setActiveReport={setActiveReport} setActiveTab={setActiveTab} isPinned={false} togglePin={togglePin} setWorkspaceMode={setWorkspaceMode} setSelectedDoc={setSelectedDoc} onDeleteReport={handleDeleteReportSidebar} />
              ))}
            </>
          )}

          {groupedHistory.earlier.length > 0 && (
            <>
              <div className="history-section-header">
                <Calendar size={11} />
                <span>Previous Runs</span>
              </div>
              {groupedHistory.earlier.map(item => (
                <HistoryCard key={item.id} item={item} activeReport={activeReport} setActiveReport={setActiveReport} setActiveTab={setActiveTab} isPinned={false} togglePin={togglePin} setWorkspaceMode={setWorkspaceMode} setSelectedDoc={setSelectedDoc} onDeleteReport={handleDeleteReportSidebar} />
              ))}
            </>
          )}

          {history.length === 0 && (
            <div className="history-empty">No research reports created yet</div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="footer-stats-grid">
            <div className="stat-box">
              <div className="stat-box-val">{stats.count}</div>
              <div className="stat-box-lbl">Total Runs</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-val">{documents.length}</div>
              <div className="stat-box-lbl">KB Documents</div>
            </div>
          </div>
          <button 
            className="new-btn-sidebar"
            onClick={() => { setActiveReport(null); setSelectedDoc(null); setQuery(''); setError(''); setWorkspaceMode('swarm'); }}
          >
            <Plus size={16} />
            <span>New Research Run</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="main-content">
        <header className="top-status-bar">
          <div className="top-bar-left">
            <button 
              className="sidebar-toggle-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu size={16} />
            </button>

            <div className="top-workspace-nav">
              <button 
                className={`nav-mode-btn ${workspaceMode === 'swarm' ? 'active' : ''}`}
                onClick={() => { setWorkspaceMode('swarm'); setSelectedDoc(null); }}
              >
                <Zap size={14} />
                <span>Swarm Workspace</span>
              </button>
              <button 
                className={`nav-mode-btn ${workspaceMode === 'kb' ? 'active' : ''}`}
                onClick={() => setWorkspaceMode('kb')}
              >
                <FileText size={14} />
                <span>Knowledge Base ({documents.length})</span>
              </button>
            </div>
          </div>
          
          <div className="top-bar-right">
            <span className="system-mode-tag">langgraph_supervisor_v2</span>
            <div className="swarm-status">
              <span className={`swarm-dot ${isLoading ? 'pulse' : ''}`}></span>
              <span>Engine: {isLoading ? `Processing (${elapsedTime}s)` : "Operational"}</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="alert-popup">
            <AlertCircle size={20} />
            <span style={{ fontWeight: 600 }}>{error}</span>
          </div>
        )}

        {/* WORKSPACE ROUTER */}
        {workspaceMode === 'kb' ? (
          selectedDoc ? (
            /* DOCUMENT EXPLORER DASHBOARD */
            <div className="doc-explorer-container">
              <div className="doc-explorer-header">
                <div className="doc-explorer-title-box">
                  <button className="action-btn action-btn-secondary" onClick={() => setSelectedDoc(null)}>
                    <ArrowLeft size={14} />
                    <span>Back to Knowledge Base</span>
                  </button>
                  <h3>{selectedDoc.title}</h3>
                </div>
                <span className="meta-badge">{selectedDoc.chunk_count} Vector Chunks</span>
              </div>

              <div className="doc-explorer-tabs">
                <button 
                  className={`doc-explorer-tab-btn ${docExplorerTab === 'summary' ? 'active' : ''}`}
                  onClick={() => setDocExplorerTab('summary')}
                >
                  <ListChecks size={15} />
                  <span>Instant Summaries</span>
                </button>
                <button 
                  className={`doc-explorer-tab-btn ${docExplorerTab === 'mindmap' ? 'active' : ''}`}
                  onClick={() => setDocExplorerTab('mindmap')}
                >
                  <GitFork size={15} />
                  <span>Concept Mindmap</span>
                </button>
                <button 
                  className={`doc-explorer-tab-btn ${docExplorerTab === 'flowchart' ? 'active' : ''}`}
                  onClick={() => setDocExplorerTab('flowchart')}
                >
                  <Network size={15} />
                  <span>Process Flowchart</span>
                </button>
                <button 
                  className={`doc-explorer-tab-btn ${docExplorerTab === 'chat' ? 'active' : ''}`}
                  onClick={() => setDocExplorerTab('chat')}
                >
                  <MessageSquare size={15} />
                  <span>AI Document Assistant</span>
                </button>
              </div>

              <div className="doc-explorer-content">
                {docExplorerTab === 'summary' && (
                  <div className="summary-tiers-grid">
                    <div className="summary-tier-card">
                      <h4>
                        <Sparkles size={16} />
                        <span>Short Executive Summary</span>
                      </h4>
                      <p className="summary-tier-text">{selectedDoc.short_summary || selectedDoc.summary}</p>
                    </div>

                    {selectedDoc.detailed_summary && (
                      <div className="summary-tier-card">
                        <h4>
                          <FileText size={16} />
                          <span>Detailed Technical Breakdown</span>
                        </h4>
                        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedDoc.detailed_summary) }} />
                      </div>
                    )}

                    {selectedDoc.bullet_summary && (
                      <div className="summary-tier-card">
                        <h4>
                          <ListChecks size={16} />
                          <span>Key Takeaways & Highlights</span>
                        </h4>
                        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedDoc.bullet_summary) }} />
                      </div>
                    )}
                  </div>
                )}

                {docExplorerTab === 'mindmap' && (
                  <div className="diagram-canvas-card">
                    <h4 style={{ marginBottom: '1rem', color: '#c084fc' }}>Visual Concept Mindmap</h4>
                    <MermaidDiagram 
                      code={selectedDoc.mindmap_code || `graph TD\n  Root["${selectedDoc.title}"] --> Topic1["Overview"]\n  Topic1 --> Sub1["Document Analysis"]`} 
                      id={`mindmap-${selectedDoc.id}`} 
                      title={selectedDoc.title}
                    />
                  </div>
                )}

                {docExplorerTab === 'flowchart' && (
                  <div className="diagram-canvas-card">
                    <h4 style={{ marginBottom: '1rem', color: '#67e8f9' }}>Process Flowchart & Structure</h4>
                    <MermaidDiagram 
                      code={selectedDoc.flowchart_code || `graph LR\n  Start["${selectedDoc.title}"] --> Step1["Process Scope"]\n  Step1 --> Step2["Key Output"]`} 
                      id={`flowchart-${selectedDoc.id}`} 
                      title={selectedDoc.title}
                    />
                  </div>
                )}

                {docExplorerTab === 'chat' && (
                  <div className="chat-container">
                    <div className="chat-messages-viewport" ref={chatViewportRef}>
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                          <div>{msg.text}</div>
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="chat-sources-box">
                              <strong>Sources from {selectedDoc.title}:</strong>
                              {msg.sources.map((s, i) => (
                                <div key={i} style={{ fontStyle: 'italic', marginTop: '0.2rem' }}>• {s}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="chat-bubble chat-bubble-ai">
                          <span className="typing-dot"></span> Analyzing question for {selectedDoc.title}...
                        </div>
                      )}
                    </div>

                    <div className="chat-input-bar">
                      <input 
                        type="text" 
                        placeholder={`Ask AI a question about "${selectedDoc.title}"...`}
                        value={chatQuestion}
                        onChange={(e) => setChatQuestion(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                      />
                      <button className="query-submit-btn" onClick={handleSendChat} disabled={!chatQuestion.trim() || isChatLoading}>
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* KNOWLEDGE BASE LISTING */
            <div className="kb-container">
              <div className="kb-header">
                <h2>Document Knowledge Base Hub</h2>
                <p>Upload PDF, DOCX, or TXT documents. Instant 3-tier summaries, visual concept mindmaps, process flowcharts, and AI document chat are generated automatically.</p>
              </div>

              <div 
                className={`dropzone-card ${isDragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf,.docx,.txt" 
                  className="file-input-hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="dropzone-icon-circle">
                  <UploadCloud size={32} />
                </div>
                <div className="dropzone-text">
                  <h4>{isUploading ? "Processing Document Intelligence & Generating Diagrams..." : "Drag & Drop Files Here or Click to Browse"}</h4>
                  <p>Supports PDF, DOCX, and TXT files up to 25MB</p>
                </div>
              </div>

              <div>
                <h3 className="docs-section-title">
                  <Database size={16} />
                  <span>Indexed Documents ({documents.length})</span>
                </h3>

                <div className="docs-grid">
                  {documents.length > 0 ? (
                    documents.map(doc => (
                      <div 
                        key={doc.id} 
                        className="doc-card"
                        onClick={() => { setSelectedDoc(doc); setDocExplorerTab('summary'); }}
                      >
                        <div className="doc-card-top">
                          <div className="doc-card-title-box">
                            <div className="doc-icon-badge">
                              <File size={16} />
                            </div>
                            <div>
                              <div className="doc-card-title">{doc.title}</div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{doc.filename}</span>
                            </div>
                          </div>
                          <button className="doc-delete-btn" onClick={(e) => handleDeleteDoc(doc.id, e)} title="Delete document">
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <p className="doc-card-summary">{doc.short_summary || doc.summary}</p>

                        <div className="doc-card-footer">
                          <span>{doc.chunk_count} Vector Chunks</span>
                          <span style={{ color: '#c084fc', fontWeight: 600 }}>Explore Diagrams & Chat →</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', padding: '1rem' }}>No documents uploaded yet. Drop a PDF/DOCX file above!</div>
                  )}
                </div>
              </div>
            </div>
          )
        ) : isLoading ? (
          /* SWARM EXECUTION LOADING SCREEN */
          <div className="loading-container">
            <div className="loading-spinner-box">
              <div className="loading-ring"></div>
              <div className="loading-ring-inner"></div>
              <div className="loading-core"></div>
            </div>
            <h3 className="loading-status-title">Executing Multi-Agent Swarm Intelligence</h3>
            <p className="loading-status-subtitle">"{query}"</p>

            <div className="swarm-network-visualizer">
              <svg className="swarm-nodes-svg" viewBox="0 0 500 130">
                <line x1="40" y1="35" x2="140" y2="65" className={`swarm-line ${activeStep >= 0 ? 'swarm-line-active' : ''}`} />
                <line x1="40" y1="95" x2="140" y2="65" className={`swarm-line ${activeStep >= 0 ? 'swarm-line-active' : ''}`} />

                <line x1="140" y1="65" x2="260" y2="20" className={`swarm-line ${activeStep >= 1 ? 'swarm-line-active' : ''}`} />
                <line x1="140" y1="65" x2="260" y2="50" className={`swarm-line ${activeStep >= 1 ? 'swarm-line-active' : ''}`} />
                <line x1="140" y1="65" x2="260" y2="80" className={`swarm-line ${activeStep >= 1 ? 'swarm-line-active' : ''}`} />
                <line x1="140" y1="65" x2="260" y2="110" className={`swarm-line ${activeStep >= 1 ? 'swarm-line-active' : ''}`} />

                <line x1="260" y1="20" x2="380" y2="65" className={`swarm-line ${activeStep >= 2 ? 'swarm-line-active' : ''}`} />
                <line x1="260" y1="50" x2="380" y2="65" className={`swarm-line ${activeStep >= 2 ? 'swarm-line-active' : ''}`} />
                <line x1="260" y1="80" x2="380" y2="65" className={`swarm-line ${activeStep >= 2 ? 'swarm-line-active' : ''}`} />
                <line x1="260" y1="110" x2="380" y2="65" className={`swarm-line ${activeStep >= 2 ? 'swarm-line-active' : ''}`} />

                <line x1="380" y1="65" x2="460" y2="65" className={`swarm-line ${activeStep >= 3 ? 'swarm-line-active' : ''}`} />

                <circle cx="40" cy="35" r="7" className="swarm-node-circle completed" />
                <circle cx="40" cy="95" r="7" className="swarm-node-circle completed" />

                <circle cx="140" cy="65" r="9" className={`swarm-node-circle ${activeStep === 0 ? 'active' : 'completed'}`} />

                <circle cx="260" cy="20" r="7" className={`swarm-node-circle ${activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : ''}`} />
                <circle cx="260" cy="50" r="7" className={`swarm-node-circle ${activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : ''}`} />
                <circle cx="260" cy="80" r="7" className={`swarm-node-circle ${activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : ''}`} />
                <circle cx="260" cy="110" r="7" className={`swarm-node-circle ${activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : ''}`} />

                <circle cx="380" cy="65" r="8" className={`swarm-node-circle ${activeStep === 2 ? 'active' : activeStep > 2 ? 'completed' : ''}`} />
                <circle cx="460" cy="65" r="8" className={`swarm-node-circle ${activeStep >= 3 ? 'active' : ''}`} />
              </svg>
            </div>

            <div className="steps-tracker">
              {steps.map((step, idx) => {
                let statusClass = "step-pending";
                let labelClass = "step-label-pending";
                
                if (idx < activeStep) {
                  statusClass = "step-completed";
                  labelClass = "step-label-completed";
                } else if (idx === activeStep) {
                  statusClass = "step-active";
                  labelClass = "step-label-active";
                }

                const isActive = idx === activeStep;
                const logMessages = [
                  "Formulating research vectors & ChromaDB document query context...",
                  "Executing parallel sweeps: Market, Competitor, Tech & Document QA...",
                  "Synthesizing cross-vector analyst metrics & evidence...",
                  "Formatting markdown structure & compiling evidence...",
                  "Running quality reviewer verification & audit loop..."
                ];

                return (
                  <div key={idx} className="step-row">
                    <div className={`step-indicator ${statusClass}`}>
                      {idx < activeStep ? <CheckCircle2 size={15} /> : idx + 1}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div className={`step-label ${labelClass}`}>{step.label}</div>
                      <div className="step-agent-badge">{step.agent}</div>
                      {isActive && (
                        <div className="step-log-text">
                          <span className="typing-dot"></span>
                          <span>{logMessages[idx]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeReport ? (
          /* REPORT DISPLAY WORKSPACE */
          <div className="report-container">
            <div className="report-header">
              <div className="report-header-left">
                <h2>{activeReport.query}</h2>
                <div className="report-badges-row">
                  <div className="meta-badge">
                    <Calendar size={13} />
                    <span>{new Date(activeReport.created_at).toLocaleString()}</span>
                  </div>
                  <div className="meta-badge">
                    <TrendingUp size={13} />
                    <span>Refinement Loops: {activeReport.iterations}</span>
                  </div>
                  <div className="meta-badge">
                    <ShieldCheck size={13} />
                    <span>Multi-Agent Swarm Verified</span>
                  </div>
                </div>
              </div>

              <div className="report-gauge-card">
                <div className="gauge-svg-container">
                  <svg width="58" height="58">
                    <circle className="gauge-circle-bg" cx="29" cy="29" r="25" />
                    <circle 
                      className={`gauge-circle-fg ${
                        activeReport.score >= 0.8 ? "gauge-circle-fg-high" : 
                        activeReport.score >= 0.6 ? "gauge-circle-fg-mid" : "gauge-circle-fg-low"
                      }`}
                      cx="29" cy="29" r="25" 
                      strokeDasharray={`${2 * Math.PI * 25}`}
                      strokeDashoffset={`${2 * Math.PI * 25 * (1 - (activeReport.score || 0))}`}
                    />
                  </svg>
                  <div className="gauge-text">
                    {(activeReport.score * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="gauge-info">
                  <span className="gauge-lbl">QA Rating</span>
                  <span className={`gauge-val-text ${
                    activeReport.score >= 0.8 ? "gauge-high" : 
                    activeReport.score >= 0.6 ? "gauge-mid" : "gauge-low"
                  }`}>
                    {activeReport.score >= 0.8 ? "High Quality" : activeReport.score >= 0.6 ? "Adequate" : "Low Quality"}
                  </span>
                </div>
              </div>
            </div>

            <div className="tab-navbar">
              <button 
                className={`tab-btn ${activeTab === 'synthesis' ? 'active' : ''}`}
                onClick={() => setActiveTab('synthesis')}
              >
                <Compass size={15} />
                <span>Executive Synthesis</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
                onClick={() => setActiveTab('report')}
              >
                <FileText size={15} />
                <span>Structured Intelligence Report</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
                onClick={() => setActiveTab('audit')}
              >
                <Award size={15} />
                <span>QA Audit & Iterations Log</span>
              </button>
            </div>

            <div className="report-content-scroller">
              <div className="report-card-body">
                {activeTab === 'synthesis' && (
                  <div className="markdown-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(activeReport.synthesis) }} />
                )}
                {activeTab === 'report' && (
                  <div className="markdown-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(activeReport.report) }} />
                )}
                {activeTab === 'audit' && (
                  <div className="audit-panel">
                    <div className="audit-metric-row">
                      <div className="audit-metric-card">
                        <Award size={20} style={{ color: 'var(--color-secondary)' }} />
                        <div className="audit-metric-val">{(activeReport.score * 100).toFixed(0)}%</div>
                        <div className="audit-metric-lbl">QA Precision Score</div>
                      </div>
                      <div className="audit-metric-card">
                        <TrendingUp size={20} style={{ color: 'var(--color-accent)' }} />
                        <div className="audit-metric-val">{activeReport.iterations}</div>
                        <div className="audit-metric-lbl">Refinement Loops</div>
                      </div>
                      <div className="audit-metric-card">
                        <Database size={20} style={{ color: 'var(--status-success)' }} />
                        <div className="audit-metric-val">4</div>
                        <div className="audit-metric-lbl">Parallel Agents</div>
                      </div>
                    </div>
                    
                    <div className="audit-feedback-block">
                      <h4>
                        <Terminal size={16} />
                        <span>Quality Reviewer Auditor Feedback</span>
                      </h4>
                      <p className="audit-feedback-text">
                        {activeReport.review || "The multi-agent workflow completed this report successfully, satisfying all accuracy and structure parameters."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="report-action-bar">
              <button className="action-btn action-btn-danger" onClick={() => handleDeleteReport(activeReport.id)}>
                <Trash2 size={14} />
                <span>Delete Run</span>
              </button>
              <button className="action-btn action-btn-secondary" onClick={() => handleCopy(activeReport)}>
                <Copy size={14} />
                <span>Copy Markdown</span>
              </button>
              <button className="action-btn action-btn-secondary" onClick={() => handleExport(activeReport)}>
                <Download size={14} />
                <span>Export Markdown</span>
              </button>
            </div>
          </div>
        ) : (
          /* IDLE WELCOME VIEW */
          <div className="welcome-container">
            <div className="welcome-logo-container">
              <div className="welcome-logo-glow"></div>
              <div className="welcome-logo-box">
                <Cpu size={32} />
              </div>
            </div>
            
            <div className="welcome-header">
              <h2>Autonomous Research Engine</h2>
              <p>State-of-the-art multi-agent swarm compiles comprehensive reports on market sizing, technological progress, and competitive intelligence.</p>
            </div>

            <div className="query-box">
              <Search size={20} style={{ color: 'var(--text-dim)' }} />
              <input 
                type="text" 
                placeholder="Enter a research topic (e.g., 'The future of electric aviation')..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
              />
              <button 
                className="query-submit-btn" 
                onClick={() => handleSubmit()}
                disabled={!query.trim()}
              >
                <span>Analyze Topic</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="preset-container">
              <h3 className="preset-title">Recommended Topics</h3>
              <div className="preset-grid">
                {sampleTopics.map((topic, idx) => {
                  const Icon = topic.icon;
                  return (
                    <button 
                      key={idx}
                      className="preset-card"
                      onClick={() => handleSubmit(topic.title)}
                    >
                      <Icon className="preset-card-icon" size={18} />
                      <h4>{topic.title}</h4>
                      <p>{topic.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {toastMessage && (
        <div className="copy-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

function HistoryCard({ item, activeReport, setActiveReport, setActiveTab, isPinned, togglePin, setWorkspaceMode, setSelectedDoc, onDeleteReport }) {
  const scoreVal = item.score || 0;
  const scorePercent = (scoreVal * 100).toFixed(0);
  const scoreClass = scoreVal >= 0.8 ? "score-high" : scoreVal >= 0.6 ? "score-mid" : "score-low";
  const isActive = activeReport && activeReport.id === item.id;
  const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => { setActiveReport(item); setSelectedDoc(null); setActiveTab('synthesis'); setWorkspaceMode('swarm'); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setActiveReport(item); setSelectedDoc(null); setActiveTab('synthesis'); setWorkspaceMode('swarm'); } }}
      className={`history-card ${isActive ? 'active' : ''}`}
    >
      <div className="history-card-header">
        <div className="history-card-title">{item.query}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <button className={`pin-btn ${isPinned ? 'pinned' : ''}`} onClick={(e) => togglePin(item.id, e)} title={isPinned ? "Unpin" : "Pin to top"}>
            <Pin size={12} />
          </button>
          {onDeleteReport && (
            <button className="history-delete-btn" onClick={(e) => onDeleteReport(item.id, e)} title="Delete report">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
      <div className="history-card-meta">
        <span>{dateStr}</span>
        <span className={`score-badge ${scoreClass}`}>{scorePercent}% QA</span>
      </div>
    </div>
  );
}
