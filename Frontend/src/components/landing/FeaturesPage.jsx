import React from 'react';
import { 
  Bot, 
  Database, 
  GitFork, 
  BarChart3, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Workflow, 
  Layers, 
  FileText,
  Lock,
  Search,
  Sparkles
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

export function FeaturesPage({ onLaunchWorkspace }) {
  const { openRegisterModal } = useAuth();

  const AGENT_NODES = [
    {
      title: "Market Analyst Agent",
      role: "Vector 1",
      color: "#c084fc",
      desc: "Sweeps macroeconomic data, industry growth rates, total addressable market (TAM), and market sentiment."
    },
    {
      title: "Competitor Intelligence Agent",
      role: "Vector 2",
      color: "#38bdf8",
      desc: "Identifies direct & indirect rivals, feature matrix gaps, pricing models, and strategic moats."
    },
    {
      title: "Tech Specialist Agent",
      role: "Vector 3",
      color: "#34d399",
      desc: "Evaluates tech stack architecture, infrastructure constraints, feasibility risks, and emerging patents."
    },
    {
      title: "Quality Reviewer Agent",
      role: "Quality Gate",
      color: "#f472b6",
      desc: "Audits synthesized output against strict score benchmarks, checks consistency, and triggers improvement loops."
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }} className="animate-fade-in">
      {/* Page Header */}
      <section style={{ textAlign: 'center', padding: '3rem 1rem 2.5rem 1rem' }}>
        <Badge variant="purple" style={{ marginBottom: '0.75rem' }}>Platform Features & Deep Tech</Badge>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
          Next-Gen AI Swarm Capabilities
        </h1>
        <p style={{ maxWidth: '720px', margin: '0 auto', color: 'var(--text-sub)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Discover how SwarmAI combines multi-vector LangGraph parallel execution with in-memory RAG indexing and Mermaid diagram synthesis.
        </p>
      </section>

      {/* Feature 1: Agent Swarm Fan-Out */}
      <section className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px', marginBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <Badge variant="purple" style={{ marginBottom: '0.75rem' }}>LangGraph Engine</Badge>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              Parallel Multi-Agent Fan-Out
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Unlike single-prompt chat interfaces that process queries sequentially, SwarmAI splits your research objective into specialized vector tasks executed simultaneously across dedicated AI agents.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} style={{ color: '#c084fc' }} />
                <span>400% faster research completion via parallel threads</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} style={{ color: '#c084fc' }} />
                <span>Automated quality score routing with feedback loops</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} style={{ color: '#c084fc' }} />
                <span>Cross-vector synthesis into unified executive briefing</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {AGENT_NODES.map((node, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '14px',
                padding: '1.1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Bot size={18} style={{ color: node.color }} />
                  <span style={{ fontSize: '0.68rem', color: node.color, fontWeight: 700 }}>{node.role}</span>
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.3rem' }}>{node.title}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 2: 3-Tier RAG & Visual Mindmaps */}
      <section className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px', marginBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(6, 9, 19, 0.6)',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px',
            padding: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            color: '#38bdf8'
          }}>
            <div style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }}>// Automated Mermaid Mindmap Generator</div>
            <div style={{ color: '#c084fc' }}>graph TD</div>
            <div style={{ paddingLeft: '1rem', color: 'var(--text-main)' }}>Root["Document Scope"] --&gt; Analysis["Executive Summary"]</div>
            <div style={{ paddingLeft: '1rem', color: 'var(--text-main)' }}>Analysis --&gt; Market["Market Dynamics"]</div>
            <div style={{ paddingLeft: '1rem', color: 'var(--text-main)' }}>Analysis --&gt; Tech["Tech Stack Feasibility"]</div>
            <div style={{ paddingLeft: '1rem', color: '#34d399' }}>Tech --&gt; RAG["Vector Indexing (Memory)"]</div>
          </div>

          <div>
            <Badge variant="blue" style={{ marginBottom: '0.75rem' }}>Document RAG Hub</Badge>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              3-Tier Summaries & Visual Mindmaps
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Upload PDFs, Word files, or research notes. SwarmAI extracts 3-tier summaries (Executive, Technical, Bullet points) and generates live interactive Mermaid visual mindmaps and flowcharts.
            </p>

            <button 
              className="btn-primary" 
              onClick={openRegisterModal}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.9rem' }}
            >
              <span>Try Document Hub</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Feature 3: Interactive RAG Context Chat */}
      <section className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px', marginBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <Badge variant="purple" style={{ marginBottom: '0.75rem' }}>In-Memory Vector Search</Badge>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              Interactive PDF & Document RAG Chat
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Chat directly with your uploaded PDF, DOCX, or text files. The in-memory vector index instantly retrieves exact passage quotes, page references, and key findings.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} style={{ color: '#38bdf8' }} />
                <span>Zero database disk-locking for fast multi-turn Q&A</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} style={{ color: '#38bdf8' }} />
                <span>Page-level citation tracking and grounded responses</span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(6, 9, 19, 0.7)',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '0.85rem', borderRadius: '10px', fontSize: '0.85rem', color: '#ffffff' }}>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>User:</span> What are the top 3 financial risks outlined in Section 4?
            </div>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.85rem', borderRadius: '10px', fontSize: '0.85rem', color: '#ffffff' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>Document RAG Agent:</span> 1. Foreign exchange rate volatility (p. 42)<br />2. Supply chain lead time expansions (p. 47)<br />3. Regulatory compliance shifts (p. 51)
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4: Mermaid Process Flowchart Generator */}
      <section className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(6, 9, 19, 0.6)',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px',
            padding: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            color: '#34d399'
          }}>
            <div style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }}>// Automated Mermaid Flowchart Generator</div>
            <div style={{ color: '#f472b6' }}>graph LR</div>
            <div style={{ paddingLeft: '1rem', color: 'var(--text-main)' }}>Upload["PDF File"] --&gt; TextExtract["PyPDF Text Extraction"]</div>
            <div style={{ paddingLeft: '1rem', color: 'var(--text-main)' }}>TextExtract --&gt; Embeddings["Vector Embeddings"]</div>
            <div style={{ paddingLeft: '1rem', color: '#38bdf8' }}>Embeddings --&gt; Mindmap["Interactive Flowchart Visual"]</div>
          </div>

          <div>
            <Badge variant="purple" style={{ marginBottom: '0.75rem' }}>Mermaid Diagram Engine</Badge>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              Process Flowchart Diagram Generator
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Convert technical procedures, system architectures, and operational workflows into Mermaid `graph LR` visual flowcharts with live code editing and instant preview.
            </p>

            <button 
              className="btn-primary" 
              onClick={openRegisterModal}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.9rem' }}
            >
              <span>Explore Diagram Engine</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
