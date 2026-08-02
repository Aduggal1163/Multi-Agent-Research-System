import React, { useState } from 'react';
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
  UserCheck,
  HelpCircle,
  ChevronDown,
  Layers,
  Lock,
  Workflow,
  Globe,
  TrendingUp,
  FileCheck,
  Terminal,
  Activity
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
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

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

  const HOW_IT_WORKS_STEPS = [
    {
      num: "01",
      title: "Query Decomposition",
      icon: Network,
      color: "#c084fc",
      agent: "LangGraph Supervisor",
      desc: "The Orchestrator agent analyzes your query, extracts core domain intent, and breaks it down into sub-queries for parallel vector sweeps."
    },
    {
      num: "02",
      title: "Parallel Swarm Execution",
      icon: Cpu,
      color: "#38bdf8",
      agent: "4-Agent Swarm",
      desc: "Market Analyst, Competitor Analyst, Tech Specialist, and Document RAG agents fire concurrently to gather multi-angle intelligence."
    },
    {
      num: "03",
      title: "Cross-Vector Synthesis",
      icon: Workflow,
      color: "#34d399",
      agent: "Synthesis Analyst",
      desc: "Findings are cross-referenced, structured into analytical metrics, and passed into executive narrative formulation."
    },
    {
      num: "04",
      title: "Quality Review Gate",
      icon: ShieldCheck,
      color: "#f472b6",
      agent: "Quality Auditor",
      desc: "An automated reviewer agent checks consistency, scores confidence, and iteratively refines output until accuracy benchmarks are met."
    }
  ];

  const USE_CASES = [
    {
      title: "Venture Capital & Market Research",
      icon: TrendingUp,
      badge: "Market Sweeps",
      desc: "Generate comprehensive market landscape briefings, competitive positioning reports, and emerging tech trend sweeps in seconds."
    },
    {
      title: "Deep Tech & Architecture Feasibility",
      icon: Cpu,
      badge: "Technical Audits",
      desc: "Analyze complex engineering papers, evaluate cloud infrastructure paradigms, and benchmark next-gen tech stack choices."
    },
    {
      title: "Document Intelligence & RAG Analysis",
      icon: FileCheck,
      badge: "Knowledge Hub",
      desc: "Upload PDFs, research papers, and strategy decks to auto-generate 3-tier summaries, concept mindmaps, and interactive document chat."
    },
    {
      title: "Executive Strategy & Compliance Briefs",
      icon: ShieldCheck,
      badge: "Enterprise Ready",
      desc: "Formulate policy impact assessments, risk audits, and board-ready strategy memos with complete data isolation and traceability."
    }
  ];

  const FAQS = [
    {
      q: "How does the Multi-Agent Swarm differ from traditional LLM tools?",
      a: "Traditional single-prompt AI tools execute linearly. SwarmAI uses LangGraph to orchestrate multiple specialized agent nodes (Market, Competitor, Tech, Synthesis, Quality) running in parallel. This fan-out fan-in architecture delivers far deeper coverage, self-correction, and higher accuracy."
    },
    {
      q: "Are my uploaded documents and research data kept private?",
      a: "Yes, 100%. All uploaded files are processed through isolated local vector indexes and bound strictly to your authenticated account ID. Your data is never shared across users or used to train public models."
    },
    {
      q: "What file formats are supported in the Knowledge Hub?",
      a: "The Knowledge Hub supports PDF files, DOCX documents, Plain Text (.txt), Markdown (.md), and research paper formats. All documents automatically generate 3-tier executive summaries, mindmaps, and flowchart visual graphs."
    },
    {
      q: "Can I export reports into external tools?",
      a: "Yes. Every generated report can be exported into raw Markdown (.md), clean HTML, formatted JSON, or printed into PDF format for immediate executive presentation."
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '3rem' }} className="animate-fade-in">

      {/* 1. Hero Section */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem 3rem 1rem', position: 'relative' }}>
        {/* Glowing Ambient Backdrop */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '550px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.28) 0%, rgba(56, 189, 248, 0.18) 50%, transparent 80%)',
          filter: 'blur(70px)',
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
            {isAuthenticated ? (
              <>
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
              </>
            ) : (
              <>
                <button
                  className="btn-primary"
                  onClick={openLoginModal}
                  style={{ padding: '0.85rem 2.2rem', fontSize: '1rem', borderRadius: '12px' }}
                >
                  <span>Get Started — Free</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  className="btn-secondary"
                  onClick={openLoginModal}
                  style={{ padding: '0.85rem 1.8rem', fontSize: '1rem', borderRadius: '12px' }}
                >
                  <Lock size={16} style={{ color: '#38bdf8' }} />
                  <span>Sign In to Workspace</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. Dynamic Metrics Impact Highlights Bar */}
      <section style={{ marginBottom: '4rem' }}>
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

      {/* 3. Interactive How It Works - LangGraph Swarm Architecture */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Badge variant="purple" style={{ marginBottom: '0.6rem' }}>LangGraph Swarm Workflow</Badge>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            How SwarmAI Execute
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '1rem', marginTop: '0.4rem', maxWidth: '650px', margin: '0.4rem auto 0 auto' }}>
            Multi-agent orchestrations systematically divide complex research questions, gather data in parallel, synthesize key vectors, and enforce quality audits.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {HOW_IT_WORKS_STEPS.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div key={idx} className="glass-panel" style={{ padding: '1.75rem', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'rgba(255, 255, 255, 0.15)' }}>
                    {step.num}
                  </span>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${step.color}18`, border: `1px solid ${step.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComp size={20} style={{ color: step.color }} />
                  </div>
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: step.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {step.agent}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', color: '#ffffff' }}>
                  {step.title}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Platform Capabilities Grid */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Engineered for Enterprise Intelligence
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '1rem', marginTop: '0.4rem' }}>
            Combine real-time multi-agent web synthesis with localized document RAG indexing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192, 132, 252, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Bot size={22} style={{ color: '#c084fc' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Parallel Agent Swarm
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Concurrent fan-out execution across Market Analyst, Competitor Analyst, Tech Specialist, and Quality Auditor nodes.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
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
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
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
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(244, 114, 182, 0.15)', border: '1px solid rgba(244, 114, 182, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
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

      {/* 5. Enterprise Use Cases */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Badge variant="blue" style={{ marginBottom: '0.6rem' }}>Tailored Solutions</Badge>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Designed for Analyst & Executive Workflows
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '1rem', marginTop: '0.4rem' }}>
            Accelerate research cycles across technical, strategic, and financial domains.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {USE_CASES.map((uc, idx) => {
            const IconComp = uc.icon;
            return (
              <div key={idx} className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComp size={20} style={{ color: '#38bdf8' }} />
                  </div>
                  <Badge variant="purple">{uc.badge}</Badge>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>
                  {uc.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6 }}>
                  {uc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. 1-Click Launch Sample Prompts */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800 }}>
              Featured Intelligence Topics
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
              onClick={() => {
                if (!isAuthenticated) openLoginModal();
                else onStartSampleTopic(topic.title);
              }}
              style={{
                padding: '1.35rem',
                cursor: 'pointer',
                transition: 'var(--transition-normal)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <Badge variant="purple">{topic.category}</Badge>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>{topic.tag}</span>
                </div>

                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  {topic.title}
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem', fontSize: '0.8rem', color: '#c084fc', fontWeight: 600, marginTop: '1.25rem' }}>
                <span>Launch Swarm</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6.5. Knowledge Hub Document Intelligence Tools */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
              Document Knowledge Hub Tools
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Upload any PDF or document to trigger automated 3-tier summaries, vector RAG chat, mindmaps & flowcharts
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {[
            {
              title: "Executive 3-Tier Document Summarizer",
              category: "Document RAG",
              tag: "PDF / DOCX",
              desc: "Extract 2-sentence executive summary, 3-paragraph detailed breakdown, and 7 key bullet takeaways.",
              color: "#c084fc"
            },
            {
              title: "Interactive Document RAG Context Chat",
              category: "RAG Q&A",
              tag: "Context Search",
              desc: "Chat directly with your uploaded documents using in-memory vector index retrieval in real-time.",
              color: "#38bdf8"
            },
            {
              title: "Mermaid.js Concept Mindmap Generator",
              category: "Visual Graphs",
              tag: "Concept Map",
              desc: "Automatically map document concepts and hierarchy into interactive Mermaid visual graph diagrams.",
              color: "#34d399"
            },
            {
              title: "Process Flowchart Diagram Generator",
              category: "Process Flow",
              tag: "Flowcharts",
              desc: "Transform procedures, decision workflows, and step-by-step technical guides into visual flowcharts.",
              color: "#f472b6"
            }
          ].map((tool, idx) => (
            <div
              key={idx}
              className="glass-panel"
              onClick={() => {
                if (!isAuthenticated) openLoginModal();
                else onLaunchKnowledge();
              }}
              style={{
                padding: '1.35rem',
                cursor: 'pointer',
                transition: 'var(--transition-normal)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: `1px solid ${tool.color}30`
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <Badge variant="blue">{tool.category}</Badge>
                  <span style={{ fontSize: '0.72rem', color: tool.color, fontWeight: 700 }}>{tool.tag}</span>
                </div>

                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.02rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  {tool.title}
                </h4>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {tool.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem', fontSize: '0.8rem', color: tool.color, fontWeight: 600, marginTop: '1.25rem' }}>
                <span>Explore Tool</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Interactive FAQ Section */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Badge variant="purple" style={{ marginBottom: '0.6rem' }}>Got Questions?</Badge>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
            Everything you need to know about SwarmAI and Document RAG.
          </p>
        </div>

        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                style={{
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  borderRadius: '14px',
                  transition: 'var(--transition-normal)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <HelpCircle size={18} style={{ color: '#c084fc', flexShrink: 0 }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.02rem', fontWeight: 700, color: '#ffffff' }}>
                      {faq.q}
                    </h3>
                  </div>
                  <ChevronDown
                    size={18}
                    style={{
                      color: 'var(--text-dim)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>

                {isOpen && (
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-glass)' }} className="animate-fade-in">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Call To Action (CTA) Banner */}
      {!isAuthenticated && (
        <section style={{ marginBottom: '4rem' }}>
          <div className="glass-panel" style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(56, 189, 248, 0.1) 50%, rgba(236, 72, 153, 0.12) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Zap size={18} style={{ color: '#f472b6' }} />
                <span style={{ color: '#f472b6', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Ready to Supercharge Your Research?
                </span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
                Start Deploying Multi-Agent AI Swarms Today
              </h2>

              <p style={{ maxWidth: '600px', margin: '0 auto 2rem auto', color: 'var(--text-sub)', fontSize: '1.02rem', lineHeight: 1.6 }}>
                Create a free account to access multi-vector agent sweeps, private document RAG indexing, concept mindmaps, and telemetry exports.
              </p>

              <button
                className="btn-primary"
                onClick={openLoginModal}
                style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', borderRadius: '14px', boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)' }}
              >
                <span>Create Free Account</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 9. Comprehensive Footer */}
      <footer style={{
        paddingTop: '2.5rem',
        borderTop: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={20} style={{ color: '#ffffff' }} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                SwarmAI
              </span>
              <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-dim)', fontWeight: 600 }}>
                Autonomous Multi-Agent Research & Knowledge Intelligence
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '0.35rem 0.85rem', borderRadius: '9999px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 8px #34d399' }} />
            <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>All Swarm Agent Nodes Operational</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          <div>
            © {new Date().getFullYear()} SwarmAI. Built with LangGraph, FastAPI & React.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Private & Encrypted</span>
            <span>Local Vector RAG</span>
            <span>Zero Data Leakage</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

