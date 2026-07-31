import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { AlertTriangle, Check, Copy } from 'lucide-react';
import { Button } from '../ui/Button';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0b0f1d',
    primaryColor: '#8b5cf6',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#a855f7',
    lineColor: '#38bdf8',
    secondaryColor: '#ec4899',
    tertiaryColor: '#1e293b'
  },
  securityLevel: 'loose'
});

export function MermaidDiagram({ code, id, title = 'Diagram' }) {
  const containerRef = useRef(null);
  const [renderError, setRenderError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setRenderError(null);

    const renderChart = async () => {
      if (!code || !containerRef.current) return;
      
      const cleanCode = code
        .replace(/```mermaid/g, '')
        .replace(/```/g, '')
        .trim();

      if (!cleanCode) return;

      try {
        const uniqueId = `mermaid-svg-${id}-${Math.random().toString(36).substr(2, 5)}`;
        const { svg } = await mermaid.render(uniqueId, cleanCode);
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.warn('Mermaid render error:', err);
        if (isMounted) {
          setRenderError(err.message || 'Diagram syntax rendering issue');
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [code, id]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button 
          onClick={handleCopyCode} 
          className="btn-secondary" 
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
        >
          {copied ? <Check size={14} style={{ color: '#34d399' }} /> : <Copy size={14} />}
          <span>Copy Mermaid Syntax</span>
        </button>
      </div>

      {renderError ? (
        <div style={{ 
          padding: '1.25rem', 
          borderRadius: '12px', 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <AlertTriangle size={16} />
            <span>Mermaid Render Notice</span>
          </div>
          <p style={{ color: 'var(--text-sub)', marginBottom: '0.75rem' }}>
            Diagram is rendered as raw code due to format constraints:
          </p>
          <pre style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.75rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.8rem' }}>
            {code}
          </pre>
        </div>
      ) : (
        <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', width: '100%', overflowX: 'auto', padding: '1rem 0' }} />
      )}
    </div>
  );
}
