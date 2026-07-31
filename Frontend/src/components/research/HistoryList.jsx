import React from 'react';
import { FileText, Pin, Trash2, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function HistoryList({ 
  history, 
  activeReport, 
  setActiveReport, 
  pinnedIds, 
  togglePin, 
  onDelete, 
  searchTerm = '' 
}) {
  const filtered = history.filter(item => 
    item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.report && item.report.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pinnedItems = filtered.filter(i => pinnedIds.includes(i.id));
  const otherItems = filtered.filter(i => !pinnedIds.includes(i.id));
  const sortedList = [...pinnedItems, ...otherItems];

  if (sortedList.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <FileText size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <h3>No research reports found</h3>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {searchTerm ? `No reports matching '${searchTerm}'` : 'Initiate a new research swarm to generate reports.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
      {sortedList.map(item => {
        const isPinned = pinnedIds.includes(item.id);
        const isActive = activeReport?.id === item.id;
        const scorePercent = item.score ? Math.round(item.score * 100) : 85;

        return (
          <div 
            key={item.id}
            className={`glass-panel ${isActive ? 'glass-panel-glow' : ''}`}
            onClick={() => setActiveReport(item)}
            style={{ 
              padding: '1.25rem', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <Badge variant={isPinned ? 'purple' : 'cyan'}>
                  {scorePercent}% QA Score
                </Badge>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button 
                    onClick={(e) => togglePin(item.id, e)}
                    style={{ background: 'transparent', border: 'none', color: isPinned ? '#c084fc' : 'var(--text-dim)', cursor: 'pointer' }}
                  >
                    <Pin size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h4 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.05rem', 
                fontWeight: 700, 
                color: 'var(--text-main)',
                marginBottom: '0.6rem',
                lineHeight: 1.4
              }}>
                {item.query}
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
                {item.synthesis || item.report?.slice(0, 150)}
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
              <span>{new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#c084fc', fontWeight: 600 }}>
                View Report <ArrowRight size={12} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
