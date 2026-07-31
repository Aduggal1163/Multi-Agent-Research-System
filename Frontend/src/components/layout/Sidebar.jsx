import React from 'react';
import { 
  Bot, 
  Search, 
  FolderKanban, 
  FileText, 
  Pin, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Database,
  Sparkles
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed, 
  pinnedReports = [], 
  setActiveReport, 
  documentsCount = 0,
  reportsCount = 0,
  onNewResearch
}) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-title">
          <Bot size={24} style={{ color: '#c084fc', flexShrink: 0 }} />
          {!collapsed && <span>InsightFlow</span>}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            padding: '0.3rem',
            borderRadius: '6px'
          }}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="sidebar-nav">
        <button 
          className="btn-primary" 
          onClick={onNewResearch}
          style={{ 
            width: '100%', 
            marginBottom: '0.75rem',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0.75rem' : '0.7rem 1.2rem'
          }}
        >
          <Plus size={18} />
          {!collapsed && <span>New Research</span>}
        </button>

        <button 
          className={`nav-item ${activeTab === 'workspace' ? 'active' : ''}`}
          onClick={() => setActiveTab('workspace')}
          title="Multi-Agent Workspace"
        >
          <Sparkles size={18} style={{ color: '#c084fc' }} />
          {!collapsed && <span>Research Swarm</span>}
        </button>

        <button 
          className={`nav-item ${activeTab === 'knowledge' ? 'active' : ''}`}
          onClick={() => setActiveTab('knowledge')}
          title="Document Knowledge Base"
        >
          <Database size={18} style={{ color: '#38bdf8' }} />
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span>Knowledge Base</span>
              <Badge variant="cyan">{documentsCount}</Badge>
            </div>
          )}
        </button>

        <button 
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          title="Research Reports Archive"
        >
          <FolderKanban size={18} style={{ color: '#f472b6' }} />
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span>Report Archive</span>
              <Badge variant="purple">{reportsCount}</Badge>
            </div>
          )}
        </button>

        <button 
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
          title="Swarm Performance Analytics"
        >
          <Activity size={18} style={{ color: '#34d399' }} />
          {!collapsed && <span>Analytics Hub</span>}
        </button>

        {/* Pinned Reports Quick List */}
        {!collapsed && pinnedReports.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: 'var(--text-dim)', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.6rem',
              paddingLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Pin size={12} />
              <span>Pinned Reports</span>
            </div>
            {pinnedReports.map(item => (
              <div 
                key={item.id} 
                className="nav-item"
                onClick={() => {
                  setActiveReport(item);
                  setActiveTab('workspace');
                }}
                style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
              >
                <FileText size={15} style={{ color: '#c084fc', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.query}
                </span>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Sidebar Footer - System Health Badge */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem',
            padding: '0.6rem 0.8rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-glass)'
          }}>
            <Activity size={16} style={{ color: '#34d399' }} />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-sub)' }}>FastAPI Swarm Engine</div>
              <div style={{ fontSize: '0.7rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span>
                Connected (Port 8000)
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
