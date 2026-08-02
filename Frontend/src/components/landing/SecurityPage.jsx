import React from 'react';
import { ShieldCheck, Lock, Key, Server, EyeOff, CheckCircle2, Cpu, UserCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

export function SecurityPage() {
  const { openRegisterModal } = useAuth();

  const SECURITY_PILLARS = [
    {
      title: "Strict User Multi-Tenancy",
      icon: UserCheck,
      color: "#c084fc",
      desc: "Database queries filter rigidly by authenticated user_id. User A can never access or query User B's reports or uploaded documents."
    },
    {
      title: "PBKDF2 Password Encryption",
      icon: Key,
      color: "#38bdf8",
      desc: "User passwords are stored as PBKDF2 HMAC SHA-256 salted hashes with 100,000 iterations. Plaintext passwords are never persisted."
    },
    {
      title: "HS256 JSON Web Tokens (JWT)",
      icon: Lock,
      color: "#34d399",
      desc: "Stateless Bearer JWT authentication enforces session integrity and automatic 24-hour expiration across all REST endpoints."
    },
    {
      title: "Lock-Free In-Memory RAG Stores",
      icon: Server,
      color: "#f472b6",
      desc: "Document vector indexing operates via in-memory LangChain vector stores per document ID, eliminating SQLite file locks during heavy RAG chats."
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }} className="animate-fade-in">
      {/* Header */}
      <section style={{ textAlign: 'center', padding: '3rem 1rem 2rem 1rem' }}>
        <Badge variant="purple" style={{ marginBottom: '0.75rem' }}>Enterprise Security & Privacy</Badge>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
          Built with Zero Data Leakage
        </h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-sub)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Learn how SwarmAI protects your corporate intellectual property, research briefings, and uploaded documents.
        </p>
      </section>

      {/* Security Pillars Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
        {SECURITY_PILLARS.map((pillar, idx) => {
          const IconComp = pillar.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: '2rem', borderRadius: '18px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${pillar.color}18`, border: `1px solid ${pillar.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <IconComp size={22} style={{ color: pillar.color }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
                {pillar.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
