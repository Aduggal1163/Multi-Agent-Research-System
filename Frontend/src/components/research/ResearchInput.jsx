import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

const SAMPLE_CHIPS = [
  "Commercial Fusion Energy",
  "Quantum Cryptography Standards",
  "LangGraph Multi-Agent Workflows",
  "Autonomous AI Agents in Healthcare"
];

export function ResearchInput({ onStartResearch, isGenerating }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onStartResearch(query);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <Sparkles size={22} style={{ color: '#c084fc' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
          Initiate Autonomous Multi-Agent Deep Research
        </h2>
      </div>

      <p style={{ color: 'var(--text-sub)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
        Deploy a 4-agent parallel swarm (Market Analyst, Competitor Analyst, Innovation Analyst, and Quality Reviewer) to fetch, synthesize, and audit comprehensive intelligence.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <input 
          type="text" 
          placeholder="Enter a research topic (e.g., 'Future of solid-state batteries in EVs')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isGenerating}
          style={{ 
            flex: 1, 
            background: 'rgba(255, 255, 255, 0.04)', 
            border: '1px solid var(--border-glass-glow)', 
            borderRadius: '14px', 
            padding: '0.85rem 1.25rem', 
            color: 'var(--text-main)', 
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <Button type="submit" loading={isGenerating} disabled={!query.trim() || isGenerating} icon={ArrowRight}>
          Launch Swarm
        </Button>
      </form>

      {/* Sample Query Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Try queries:</span>
        {SAMPLE_CHIPS.map((chip, idx) => (
          <button 
            key={idx}
            type="button"
            onClick={() => setQuery(chip)}
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid var(--border-glass)', 
              color: 'var(--text-sub)', 
              padding: '0.35rem 0.75rem', 
              borderRadius: '9999px', 
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
