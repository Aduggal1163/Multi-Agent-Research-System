import React, { useState } from 'react';
import { X, Code, Play } from 'lucide-react';
import { MermaidDiagram } from './MermaidDiagram';
import { Button } from '../ui/Button';

export function DiagramEditorModal({ initialCode = '', title = 'Mermaid Editor', onClose, onSave }) {
  const [code, setCode] = useState(initialCode);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(6, 9, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '1100px', height: '80vh', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Code size={20} style={{ color: '#c084fc' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
              Live Mermaid Diagram Editor - {title}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Split Screen Container */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.25rem', minHeight: 0 }}>
          {/* Code Editor Pane */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '0.5rem' }}>
              Mermaid.js Syntax:
            </label>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ 
                flex: 1,
                width: '100%',
                background: 'rgba(10, 15, 30, 0.9)',
                border: '1px solid var(--border-glass-glow)',
                borderRadius: '12px',
                padding: '1rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Live Preview Pane */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '0.5rem' }}>
              Live Rendered Diagram:
            </label>
            <div className="glass-panel" style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MermaidDiagram code={code} id="live-editor-preview" title={title} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { if (onSave) onSave(code); onClose(); }}>
            Save Diagram Code
          </Button>
        </div>
      </div>
    </div>
  );
}
