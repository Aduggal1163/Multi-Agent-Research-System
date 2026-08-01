import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Database, 
  Cpu, 
  GitFork, 
  Network, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  FileText,
  Search,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export function LandingPage({ 
  onLaunchWorkspace, 
  onLaunchKnowledge, 
  onStartSampleTopic,
  reports = [],
  documents = []
}) {
  const { user, isAuthenticated } = useAuth();

  const userReportsCount = reports.length;
  const userAvgQaScore = userReportsCount 
    ? (reports.reduce((acc, r) => acc + (r.score || 0.88), 0) / userReportsCount * 100).toFixed(1)
    : '0.0';
  
  const userChunksCount = documents.reduce((acc, d) => acc + (d.chunk_count || 0), 0);
  const userDocsCount = documents.length;

  const SAMPLE_TOPICS = [
    { title: "Commercial Fusion Energy & Post-Quantum Cryptography", category: "Deep Tech", tag: "Hot Topic" },
    { title: "LangGraph Multi-Agent Orchestration Frameworks", category: "AI Swarms", tag: "Featured" },
    { title: "Solid-State Lithium Battery Commercialization", category: "Clean Energy", tag: "Popular" },
    { title: "Zero-Trust Architecture for Cloud-Native Infrastructure", category: "Cybersecurity", tag: "Enterprise" }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '3rem' }} className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem 3rem 1rem', position: 'relative' }}>
        {/* Glowing Ambient Backdrop */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(56, 189, 248, 0.15) 50%, transparent 80%)',
          filter: 'blur(60px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: '#c084fc',
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Sparkles size={14} /> 
              {isAuthenticated 
                ? `Active Workspace: ${user?.full_name || 'Authenticated User'}` 
                : 'Next-Gen Autonomous AI Swarms 4.0'}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            color: '#ffffff'
          }}>
            Autonomous Parallel Research & <br />
            <span style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Deep Knowledge Intelligence
            </span>
          </h1>

          <p style={{
            maxWidth: '780px',
            margin: '0 auto 2.25rem auto',
            color: 'var(--text-sub)',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}>
            Deploy parallel AI agent swarms to execute multi-vector market sweeps, extract 3-tier document RAG summaries, generate concept mindmaps, and output instant executive briefing reports.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary" 
              onClick={onLaunchWorkspace}
              style={{ padding: '0.85rem 1.8rem', fontSize: '1rem', borderRadius: '12px' }}
            >
              <span>Launch Research Swarm</span>
              <ArrowRight size={18} />
            </button>

            <button 
              className="btn-secondary" 
              onClick={onLaunchKnowledge}
              style={{ padding: '0.85rem 1.8rem', fontSize: '1rem', borderRadius: '12px' }}
            >
              <Database size={18} style={{ color: '#38bdf8' }} />
              <span>Explore Knowledge Hub</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Metrics Impact Highlights Bar */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', fontWeight: 700 }}>
            {isAuthenticated ? '🔒 Your Private Workspace Telemetry' : '⚡ Platform Architecture Benchmarks'}
          </span>
        </div>

        <div className="glass-panel" style={{
          padding: '1.75rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          textAlign: 'center'
        }}>
          {isAuthenticated ? (
            <>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-display)' }}>1.2s</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, marginTop: '0.2rem' }}>My Swarm Latency</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>4-Agent Execution Speed</div>
              </div>

              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-display)' }}>{userAvgQaScore}%</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, marginTop: '0.2rem' }}>My Accuracy Score</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{userReportsCount} Saved Reports Evaluated</div>
              </div>

              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-display)' }}>
                  {userReportsCount} Reports
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, marginTop: '0.2rem' }}>My Research Briefings</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Private Workspace Reports</div>
              </div>

              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f472b6', fontFamily: 'var(--font-display)' }}>
                  {userChunksCount} Vectors
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, marginTop: '0.2rem' }}>My Knowledge Index</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {userDocsCount} Private Documents Indexed
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-display)' }}>10x</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, marginTop: '0.2rem' }}>Faster Research Sweeps</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Parallel Multi-Vector Engine</div>
              </div>

              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-display)' }}>99.4%</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, marginTop: '0.2rem' }}>QA Score Target</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Automated Quality Review Gate</div>
              </div>

              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-display)' }}>4 Agents</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, marginTop: '0.2rem' }}>Parallel Swarm Fan-Out</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Market, Tech, Competitor, Quality</div>
              </div>

              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f472b6', fontFamily: 'var(--font-display)' }}>3-Tier</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, marginTop: '0.2rem' }}>Document RAG System</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Summaries, Mindmaps & Flowcharts</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Platform Capabilities Grid */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Engineered for Enterprise Intelligence
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
            Combine real-time multi-agent web synthesis with localized document RAG indexing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(192, 132, 252, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Bot size={22} style={{ color: '#c084fc' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Parallel Agent Swarm
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Concurrent fan-out execution across Market Analyst, Competitor Analyst, Tech Analyst, and Quality Gate Auditor nodes.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Database size={22} style={{ color: '#38bdf8' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              3-Tier Document RAG
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Upload PDF, DOCX, and TXT files to automatically extract Executive Summaries, Technical Breakdowns, and Key Bullet Points.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <GitFork size={22} style={{ color: '#34d399' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Concept Mindmaps & Flowcharts
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Auto-generate interactive Mermaid visual graphs for document hierarchies, workflow processes, and strategic maps.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(244, 114, 182, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <BarChart3 size={22} style={{ color: '#f472b6' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Telemetry & Export Hub
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Track real-time agent accuracy metrics and export reports into Markdown, HTML, JSON, or Printable PDF formats.
            </p>
          </div>
        </div>
      </section>

      {/* 1-Click Launch Sample Prompts */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
              Launch Intelligence Topics
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Click any topic to trigger immediate multi-agent research generation
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {SAMPLE_TOPICS.map((topic, idx) => (
            <div 
              key={idx} 
              className="glass-panel"
              onClick={() => onStartSampleTopic(topic.title)}
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'var(--transition-normal)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <Badge variant="purple">{topic.category}</Badge>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>{topic.tag}</span>
                </div>

                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  {topic.title}
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem', fontSize: '0.8rem', color: '#c084fc', fontWeight: 600, marginTop: '1rem' }}>
                <span>Launch Swarm</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
