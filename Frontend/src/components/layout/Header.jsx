import React from 'react';
import { Sparkles, Upload, Search, Cpu, BarChart3, ToggleLeft, ToggleRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function Header({ 
  activeTab, 
  setActiveTab,
  onUploadClick, 
  searchTerm, 
  setSearchTerm,
  isDemoMode,
  setIsDemoMode
}) {

  const getTabTitle = () => {
    switch (activeTab) {
      case 'workspace':
        return { title: 'Multi-Agent Research Swarm', icon: Sparkles, badge: 'LangGraph 4.0' };
      case 'knowledge':
        return { title: 'Knowledge Base & RAG Hub', icon: Cpu, badge: 'ChromaDB + OpenAI' };
      case 'history':
        return { title: 'Research Reports Archive', icon: Search, badge: 'SQLite DB' };
      case 'analytics':
        return { title: 'Swarm Analytics & Telemetry', icon: BarChart3, badge: 'Real-Time' };
      default:
        return { title: 'InsightFlow Platform', icon: Sparkles, badge: 'Active' };
    }
  };

  const current = getTabTitle();
  const IconComponent = current.icon;

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (file && onImportWorkspace) {
      onImportWorkspace(file);
    }
  };

  return (
    <header className="header">
      <div className="header-title">
        <IconComponent size={20} style={{ color: '#c084fc' }} />
        <span>{current.title}</span>
        <Badge variant="purple">{current.badge}</Badge>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Mode Switcher Toggle */}
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          style={{
            background: isDemoMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${isDemoMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
            color: isDemoMode ? '#c084fc' : '#34d399',
            padding: '0.4rem 0.8rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
          title={isDemoMode ? "Currently running in Standalone Demo Mode" : "Currently connected to FastAPI backend"}
        >
          {isDemoMode ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
          <span>{isDemoMode ? 'Demo Mode (Offline)' : 'Live FastAPI API'}</span>
        </button>

        {/* Global Quick Search */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-glass)',
          borderRadius: '10px',
          padding: '0.4rem 0.75rem',
          width: '210px'
        }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              width: '100%'
            }}
          />
        </div>

        {/* Quick Upload Action */}
        <button 
          className="btn-primary" 
          onClick={onUploadClick}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
        >
          <Upload size={14} />
          <span>Upload</span>
        </button>
      </div>
    </header>
  );
}
