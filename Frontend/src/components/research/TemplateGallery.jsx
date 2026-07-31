import React from 'react';
import { Sparkles, ArrowRight, Zap, ShieldCheck, Cpu, Battery } from 'lucide-react';
import { Badge } from '../ui/Badge';

const TEMPLATES = [
  {
    title: "Commercial Fusion Energy & Quantum Cryptography",
    category: "Deep Tech",
    icon: Zap,
    description: "Evaluates pilot fusion reactor grid delivery timelines (Commonwealth Fusion, Helion Energy) and lattice-based PQC telemetry security.",
    color: "#c084fc"
  },
  {
    title: "LangGraph Stateful AI Agent Frameworks",
    category: "AI & ML",
    icon: Cpu,
    description: "Compares LangGraph cyclic graph orchestrators against AutoGen and CrewAI for production enterprise multi-agent workflows.",
    color: "#38bdf8"
  },
  {
    title: "Solid-State Battery Manufacturing & EV Grid Impact",
    category: "Clean Tech",
    icon: Battery,
    description: "Analyzes solid-state lithium-metal anode scaling, cost-per-kWh benchmarks, and EV fleet integration timelines.",
    color: "#34d399"
  },
  {
    title: "Zero-Trust Cloud Infrastructure Architecture",
    category: "Cybersecurity",
    icon: ShieldCheck,
    description: "Assesses microsegmentation, eBPF network observability, and IAM role-based policy enforcement across Kubernetes clusters.",
    color: "#f472b6"
  }
];

export function TemplateGallery({ onSelectTemplate }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Sparkles size={18} style={{ color: '#c084fc' }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>
          Featured Intelligence Launch Templates
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {TEMPLATES.map((tmpl, idx) => {
          const IconComp = tmpl.icon;

          return (
            <div 
              key={idx}
              className="glass-panel"
              onClick={() => onSelectTemplate(tmpl.title)}
              style={{ 
                padding: '1.25rem', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'var(--transition-normal)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <Badge variant="purple">{tmpl.category}</Badge>
                  <IconComp size={20} style={{ color: tmpl.color }} />
                </div>

                <h4 style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '1rem', 
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  marginBottom: '0.5rem'
                }}>
                  {tmpl.title}
                </h4>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {tmpl.description}
                </p>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-end', 
                marginTop: '1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: tmpl.color,
                gap: '0.3rem'
              }}>
                <span>Launch Template</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
