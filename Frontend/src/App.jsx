import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, TrendingUp, Trash2, Download, 
  Compass, FileText, Database, Cpu, Award, 
  Terminal, Calendar, ChevronRight, Sparkles, 
  Layers, CheckCircle2, AlertCircle, Menu, Copy
} from 'lucide-react';
import './App.css';

const API_BASE = "http://localhost:8000";

// Lightweight custom Markdown renderer
function renderMarkdown(md) {
  if (!md) return '';
  let html = md;
  
  // Escape HTML entities to prevent raw HTML injection
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // Horizontal Rule
  html = html.replace(/^---$/gm, '<hr />');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Lists
  html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>');
  
  // Tables (basic formatting helper)
  html = html.replace(/\|(.+)\|/g, (match, content) => {
    const cols = content.split('|').map(c => `<td>${c.trim()}</td>`).join('');
    return `<tr>${cols}</tr>`;
  });
  
  // Handle paragraphs and list groups
  const blocks = html.split(/\n\n+/);
  const formattedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<hr') || trimmed.startsWith('<li>') || trimmed.startsWith('<tr>') || trimmed.startsWith('<ul>')) {
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

export default function App() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReport, setActiveReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('synthesis');
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const steps = [
    { label: "Deconstructing topic and formulating questions", agent: "Splitter Agent" },
    { label: "Conducting parallel intelligence web sweeps", agent: "Market, Competitor & Innovation Agents" },
    { label: "Synthesizing market findings & analyst data", agent: "Synthesis Agent" },
    { label: "Drafting structured markdown report", agent: "Report Writer Agent" },
    { label: "Running quality reviews & refining content", agent: "Quality Checker Agent" }
  ];

  // Fetch history on load
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/reports`);
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend server. Please verify the API is running.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filtered history list
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    return history.filter(item => 
      item.query.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.synthesis.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  // Statistics summaries
  const stats = useMemo(() => {
    if (!history.length) return { count: 0, avgScore: 0 };
    const count = history.length;
    const totalScore = history.reduce((sum, item) => sum + (item.score || 0), 0);
    return {
      count,
      avgScore: (totalScore / count).toFixed(2)
    };
  }, [history]);

  // Submit new research
  const handleSubmit = async (searchTopic) => {
    const targetQuery = searchTopic || query;
    if (!targetQuery.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setActiveStep(0);
    setQuery(targetQuery);

    // Dynamic loader simulation step timing
    const stepInterval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4500);

    try {
      const res = await fetch(`${API_BASE}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: targetQuery })
      });

      if (!res.ok) throw new Error("Research execution failed. Try another topic.");
      const newReport = await res.json();
      
      // Update local state
      setHistory(prev => [newReport, ...prev]);
      setActiveReport(newReport);
      setActiveTab('synthesis');
      setQuery('');
    } catch (err) {
      setError(err.message || "An unexpected error occurred during report generation.");
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  // Delete current report
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this research report?")) return;
    try {
      const res = await fetch(`${API_BASE}/reports/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed");
      
      setHistory(prev => prev.filter(r => r.id !== id));
      setActiveReport(null);
    } catch (err) {
      alert("Error deleting report: " + err.message);
    }
  };

  // Export report to markdown
  const handleExport = (report) => {
    const content = `# Research Report: ${report.query}
 
**Quality Score:** ${(report.score * 100).toFixed(0)}%
**Refinement Iterations:** ${report.iterations}
**Date:** ${new Date(report.created_at).toLocaleDateString()}
 
---
 
## Executive Synthesized Analysis
${report.synthesis}
 
---
 
## Detailed Report
${report.report}
 
---
 
## Quality Reviewer Audit Log
${report.review || "No review feedback logged."}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `research_report_${report.query.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy report to clipboard
  const handleCopy = (report) => {
    const content = `# Research Report: ${report.query}
 
**Quality Score:** ${(report.score * 100).toFixed(0)}%
**Refinement Iterations:** ${report.iterations}
**Date:** ${new Date(report.created_at).toLocaleDateString()}
 
---
 
## Executive Synthesized Analysis
${report.synthesis}
 
---
 
## Detailed Report
${report.report}
`;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const sampleTopics = [
    { title: "Commercial Fusion Energy", desc: "Timeline, players, and technical hurdles.", icon: Compass },
    { title: "Quantum Cryptography Standards", desc: "Post-quantum algorithms & market adoption.", icon: Sparkles },
    { title: "Autonomous Drone Delivery", desc: "Regulation, logistics, and last-mile economics.", icon: Layers }
  ];

  return (
    <div className="app-container">
      {/* Visual Ambient drift blobs */}
      <div className="ambient-glow orb-1"></div>
      <div className="ambient-glow orb-2"></div>
      <div className="ambient-glow orb-3"></div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Cpu className="brand-icon" size={20} />
          <h1>InsightFlow</h1>
        </div>

        <div className="sidebar-search-container">
          <Search className="search-icon-inside" size={15} />
          <input 
            type="text" 
            placeholder="Search reports history..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Saved Runs */}
        <div className="history-list">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => {
              const scorePercent = (item.score * 100).toFixed(0);
              const scoreClass = item.score >= 0.8 ? "score-high" : item.score >= 0.6 ? "score-mid" : "score-low";
              const isActive = activeReport && activeReport.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveReport(item); setActiveTab('synthesis'); }}
                  className={`history-card ${isActive ? 'active' : ''}`}
                >
                  <div className="history-card-title">{item.query}</div>
                  <div className="history-card-meta">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <span className={`score-badge ${scoreClass}`}>{scorePercent}% QA</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="history-empty">No reports saved yet</div>
          )}
        </div>

        {/* Sidebar Footer Stats */}
        <div className="sidebar-footer">
          <div className="footer-stats-grid">
            <div className="stat-box">
              <div className="stat-box-val">{stats.count}</div>
              <div className="stat-box-lbl">Total Runs</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-val">{(stats.avgScore * 100).toFixed(0)}%</div>
              <div className="stat-box-lbl">Avg QA Score</div>
            </div>
          </div>
          <button 
            className="new-btn-sidebar"
            onClick={() => { setActiveReport(null); setQuery(''); setError(''); }}
          >
            <Plus size={16} />
            <span>New Research Run</span>
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <main className="main-content">
        {/* Top Status and collapse Header bar */}
        <header className="top-status-bar">
          <button 
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={16} />
          </button>
          
          <div className="top-bar-right">
            <span className="system-mode-tag">insight_swarm_v1.0</span>
            <div className="swarm-status">
              <span className={`swarm-dot ${isLoading ? 'pulse' : ''}`}></span>
              <span>Swarm Core: {isLoading ? "Processing" : "Standby"}</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="alert-popup">
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{error}</span>
          </div>
        )}

        {/* LOADING SCREEN */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner-box">
              <div className="loading-ring"></div>
              <div className="loading-ring-inner"></div>
              <div className="loading-core"></div>
            </div>
            <h3 className="loading-status-title">Assembling Intelligence Report</h3>
            <p className="loading-status-subtitle">"{query}"</p>

            {/* Neural Connection SVG map */}
            <div className="swarm-network-visualizer">
              <svg className="swarm-nodes-svg" viewBox="0 0 420 100">
                {/* Connection lines from Splitter to parallel research nodes */}
                <line x1="50" y1="50" x2="160" y2="20" className={`swarm-line ${activeStep >= 1 ? 'swarm-line-active' : ''}`} />
                <line x1="50" y1="50" x2="160" y2="50" className={`swarm-line ${activeStep >= 1 ? 'swarm-line-active' : ''}`} />
                <line x1="50" y1="50" x2="160" y2="80" className={`swarm-line ${activeStep >= 1 ? 'swarm-line-active' : ''}`} />
                
                {/* Connection lines from research nodes to synthesis node */}
                <line x1="160" y1="20" x2="270" y2="50" className={`swarm-line ${activeStep >= 2 ? 'swarm-line-active' : ''}`} />
                <line x1="160" y1="50" x2="270" y2="50" className={`swarm-line ${activeStep >= 2 ? 'swarm-line-active' : ''}`} />
                <line x1="160" y1="80" x2="270" y2="50" className={`swarm-line ${activeStep >= 2 ? 'swarm-line-active' : ''}`} />
                
                {/* Connection line from synthesis to report output node */}
                <line x1="270" y1="50" x2="370" y2="50" className={`swarm-line ${activeStep >= 3 ? 'swarm-line-active' : ''}`} />

                {/* Pulse Rings */}
                {activeStep === 0 && <circle cx="50" cy="50" r="10" className="swarm-node-pulse" />}
                {activeStep === 1 && (
                  <>
                    <circle cx="160" cy="20" r="10" className="swarm-node-pulse" />
                    <circle cx="160" cy="50" r="10" className="swarm-node-pulse" />
                    <circle cx="160" cy="80" r="10" className="swarm-node-pulse" />
                  </>
                )}
                {activeStep === 2 && <circle cx="270" cy="50" r="10" className="swarm-node-pulse" />}
                {activeStep >= 3 && <circle cx="370" cy="50" r="10" className="swarm-node-pulse" />}

                {/* Node Circles */}
                <circle cx="50" cy="50" r="8" className={`swarm-node-circle ${activeStep === 0 ? 'active' : activeStep > 0 ? 'completed' : ''}`} />
                <circle cx="160" cy="20" r="8" className={`swarm-node-circle ${activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : ''}`} />
                <circle cx="160" cy="50" r="8" className={`swarm-node-circle ${activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : ''}`} />
                <circle cx="160" cy="80" r="8" className={`swarm-node-circle ${activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : ''}`} />
                <circle cx="270" cy="50" r="8" className={`swarm-node-circle ${activeStep === 2 ? 'active' : activeStep > 2 ? 'completed' : ''}`} />
                <circle cx="370" cy="50" r="8" className={`swarm-node-circle ${activeStep >= 3 ? 'active' : ''}`} />
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
                  "Formulating semantic graph & query parameters...",
                  "Executing parallel web crawls & intelligence sweeps...",
                  "Synthesizing key insights, comparing analyst data...",
                  "Formatting sections & compiling detailed markdown report...",
                  "Reviewing accuracy logs & executing audit revisions..."
                ];

                return (
                  <div key={idx} className={`step-row ${idx < activeStep ? 'step-completed-next' : ''}`}>
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
            {/* Header */}
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
                    <span>Iterations: {activeReport.iterations}</span>
                  </div>
                </div>
              </div>

              {/* QA Rating Gauge */}
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

            {/* Navigation Tabs */}
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
                <span>Structured Report</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
                onClick={() => setActiveTab('audit')}
              >
                <Award size={15} />
                <span>QA Review Log</span>
              </button>
            </div>

            {/* Content Viewport */}
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
                        <div className="audit-metric-lbl">Reliability Rating</div>
                      </div>
                      <div className="audit-metric-card">
                        <TrendingUp size={20} style={{ color: 'var(--color-accent)' }} />
                        <div className="audit-metric-val">{activeReport.iterations}</div>
                        <div className="audit-metric-lbl">Loop Iterations</div>
                      </div>
                      <div className="audit-metric-card">
                        <Database size={20} style={{ color: 'var(--status-success)' }} />
                        <div className="audit-metric-val">5</div>
                        <div className="audit-metric-lbl">Sub-Agents Consulted</div>
                      </div>
                    </div>
                    
                    <div className="audit-feedback-block">
                      <h4>
                        <Terminal size={16} />
                        <span>Quality Reviewer Comments</span>
                      </h4>
                      <p className="audit-feedback-text">
                        {activeReport.review || "The multi-agent workflow completed this report successfully, satisfying all accuracy and structure parameters."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="report-action-bar">
              <button className="action-btn action-btn-danger" onClick={() => handleDelete(activeReport.id)}>
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
          /* IDLE / WELCOME STATE */
          <div className="welcome-container">
            <div className="welcome-logo-container">
              <div className="welcome-logo-glow"></div>
              <Cpu className="welcome-logo" />
            </div>
            
            <div className="welcome-header">
              <h2>Autonomous Research Engine</h2>
              <p>State-of-the-art multi-agent swarm compiles comprehensive reports on market sizing, technological progress, and competitive intelligence.</p>
            </div>

            {/* Prompt bar */}
            <div className="query-box">
              <Search className="query-icon-input" size={20} />
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

            {/* Suggestion list */}
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

      {/* Copy notification toast overlay */}
      {copied && (
        <div className="copy-toast">
          <CheckCircle2 size={16} style={{ strokeWidth: 3 }} />
          <span>Report copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}
