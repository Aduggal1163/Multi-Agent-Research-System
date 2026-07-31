import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Database, 
  FolderKanban, 
  Activity, 
  Upload, 
  Search, 
  Home
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export function NavbarDock({ 
  activeTab, 
  setActiveTab, 
  documentsCount = 0, 
  reportsCount = 0,
  searchTerm,
  setSearchTerm,
  onUploadClick,
  onNewResearch
}) {
  return (
    <header style={{
      height: '75px',
      padding: '0 2rem',
      background: 'rgba(6, 9, 19, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-glass)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Brand Title Logo */}
      <div 
        onClick={() => setActiveTab('landing')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'var(--gradient-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
        }}>
          <Bot size={22} style={{ color: '#ffffff' }} />
        </div>
        <div>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.25rem', 
            fontWeight: 800, 
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            InsightFlow
          </span>
          <span style={{ fontSize: '0.68rem', display: 'block', color: 'var(--text-dim)', fontWeight: 600, marginTop: '-3px' }}>
            Multi-Agent AI Platform
          </span>
        </div>
      </div>

      {/* Center Navigation Dock Pills */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '0.35rem 0.5rem',
        borderRadius: '9999px',
        border: '1px solid var(--border-glass)'
      }}>
        <button 
          className={`nav-item ${activeTab === 'landing' ? 'active' : ''}`}
          onClick={() => setActiveTab('landing')}
          style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          <Home size={15} style={{ color: '#c084fc' }} />
          <span>Home</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'workspace' ? 'active' : ''}`}
          onClick={() => setActiveTab('workspace')}
          style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          <Sparkles size={15} style={{ color: '#c084fc' }} />
          <span>Research Swarm</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'knowledge' ? 'active' : ''}`}
          onClick={() => setActiveTab('knowledge')}
          style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          <Database size={15} style={{ color: '#38bdf8' }} />
          <span>Knowledge Hub</span>
          {documentsCount > 0 && (
            <span style={{
              background: 'rgba(56, 189, 248, 0.2)',
              color: '#38bdf8',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.1rem 0.45rem',
              borderRadius: '9999px'
            }}>
              {documentsCount}
            </span>
          )}
        </button>

        <button 
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          <FolderKanban size={15} style={{ color: '#f472b6' }} />
          <span>Report Archive</span>
          {reportsCount > 0 && (
            <span style={{
              background: 'rgba(244, 114, 182, 0.2)',
              color: '#f472b6',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.1rem 0.45rem',
              borderRadius: '9999px'
            }}>
              {reportsCount}
            </span>
          )}
        </button>

        <button 
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
          style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          <Activity size={15} style={{ color: '#34d399' }} />
          <span>Analytics</span>
        </button>
      </nav>

      {/* Right Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Search Input */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-glass)',
          borderRadius: '9999px',
          padding: '0.4rem 0.85rem',
          width: '180px'
        }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search..."
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

        {/* Upload Button */}
        <button 
          className="btn-primary" 
          onClick={onUploadClick}
          style={{ padding: '0.45rem 0.95rem', borderRadius: '9999px', fontSize: '0.82rem' }}
        >
          <Upload size={14} />
          <span>Upload</span>
        </button>
      </div>
    </header>
  );
}
