import React from 'react';
import { 
  FileText, 
  Terminal, 
  Cpu, 
  Database, 
  GitFork, 
  ShieldCheck, 
  Code2, 
  Layers, 
  ArrowRight,
  BookOpen,
  Server
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

export function DocsPage() {
  const { openRegisterModal } = useAuth();

  const ARCHITECTURE_PARTS = [
    {
      title: "FastAPI REST Server (`Backend/api.py`)",
      desc: "Serves endpoints for `/auth/register`, `/auth/login`, `/research`, `/documents`, `/upload`, and `/reports`."
    },
    {
      title: "LangGraph StateGraph (`Backend/graph.py`)",
      desc: "Orchestrates parallel research nodes: split -> {research1, research2, research3} -> synthesis -> report -> quality_check -> review_router."
    },
    {
      title: "SQLite Database & WAL Mode (`Backend/database/`)",
      desc: "Stores user accounts, hashed passwords (PBKDF2 HMAC SHA-256), research reports, and 3-tier document metadata."
    },
    {
      title: "In-Memory Vector Store (`InMemoryVectorStore`)",
      desc: "Lock-free document RAG indexing per document ID for multi-turn conversational Q&A without disk locks."
    }
  ];

  const API_ENDPOINTS = [
    { method: "POST", path: "/auth/register", desc: "Registers user, returns JWT Bearer access token" },
    { method: "POST", path: "/auth/login", desc: "Authenticates user against hashed password" },
    { method: "GET", path: "/auth/me", desc: "Returns currently authenticated user profile" },
    { method: "POST", path: "/research", desc: "Triggers multi-agent research swarm execution" },
    { method: "GET", path: "/reports", desc: "Fetches user's private research reports" },
    { method: "POST", path: "/upload", desc: "Indexes document, generates 3-tier summary & mindmaps" },
    { method: "GET", path: "/documents", desc: "Fetches user's private document knowledge index" }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }} className="animate-fade-in">
      {/* Header */}
      <section style={{ textAlign: 'center', padding: '3rem 1rem 2rem 1rem' }}>
        <Badge variant="purple" style={{ marginBottom: '0.75rem' }}>System Architecture & API Docs</Badge>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
          Platform Documentation
        </h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-sub)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Comprehensive architectural overview of LangGraph multi-agent orchestration, FastAPI backend endpoints, and document RAG pipelines.
        </p>
      </section>

      {/* Architecture Overview */}
      <section className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Layers size={22} style={{ color: '#c084fc' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            System Components & State Graph
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {ARCHITECTURE_PARTS.map((part, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: '14px',
              padding: '1.25rem'
            }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
                {part.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {part.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* API Reference Table */}
      <section className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Server size={22} style={{ color: '#38bdf8' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            REST API Reference
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {API_ENDPOINTS.map((ep, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              padding: '0.85rem 1.2rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  background: ep.method === 'POST' ? 'rgba(192, 132, 252, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                  color: ep.method === 'POST' ? '#c084fc' : '#38bdf8'
                }}>
                  {ep.method}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>
                  {ep.path}
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                {ep.desc}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
