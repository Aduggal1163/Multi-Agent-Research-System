import React, { useState } from 'react';
import { Check, Sparkles, Zap, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

export function PricingPage() {
  const { openRegisterModal, openLoginModal, isAuthenticated } = useAuth();
  const [annualBilling, setAnnualBilling] = useState(true);

  const PLANS = [
    {
      name: "Free Analyst",
      badge: "Free Forever",
      priceMonthly: 0,
      priceAnnual: 0,
      desc: "Perfect for exploring parallel AI research swarms and testing document RAG capabilities.",
      features: [
        "10 Multi-Agent Research Sweeps / mo",
        "4-Agent LangGraph Fan-Out Swarm",
        "Up to 5 Document RAG Uploads",
        "3-Tier Executive Summaries",
        "Export to Markdown & JSON",
        "Community Support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Pro Analyst",
      badge: "Most Popular",
      priceMonthly: 49,
      priceAnnual: 39,
      desc: "For analysts, strategy leads, and research teams needing unlimited agent sweeps & RAG depth.",
      features: [
        "Unlimited Multi-Agent Sweeps",
        "Parallel Swarm Engine with Quality Gate Loops",
        "Unlimited Document RAG Indexing",
        "Automated Mermaid Mindmaps & Flowcharts",
        "Interactive Document RAG Context Chat",
        "Export to PDF, HTML, Markdown & JSON",
        "Priority Agent Queueing",
        "Dedicated Email Support"
      ],
      cta: "Start 14-Day Free Trial",
      popular: true
    },
    {
      name: "Enterprise Swarm",
      badge: "Dedicated Infrastructure",
      priceMonthly: 199,
      priceAnnual: 159,
      desc: "Custom swarm orchestration, private database instances, custom agent node configurations.",
      features: [
        "Everything in Pro Analyst",
        "Custom LangGraph Agent Node Definitions",
        "Isolated Dedicated SQLite Database",
        "Custom RAG Chunking & Vector Models",
        "SAML / Single Sign-On (SSO)",
        "SOC2 & ISO Compliance Support",
        "99.9% SLA Guarantee",
        "Dedicated Account Executive"
      ],
      cta: "Contact Enterprise Sales",
      popular: false
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }} className="animate-fade-in">
      {/* Header */}
      <section style={{ textAlign: 'center', padding: '3rem 1rem 2rem 1rem' }}>
        <Badge variant="purple" style={{ marginBottom: '0.75rem' }}>Transparent Pricing</Badge>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
          Flexible Plans for Every Analyst
        </h1>
        <p style={{ maxWidth: '650px', margin: '0 auto 2rem auto', color: 'var(--text-sub)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Choose the ideal plan to scale your multi-agent research operations and document intelligence.
        </p>

        {/* Annual / Monthly Toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-glass)', padding: '0.35rem 0.5rem', borderRadius: '9999px' }}>
          <button 
            onClick={() => setAnnualBilling(false)}
            style={{
              background: !annualBilling ? 'var(--gradient-brand)' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Monthly Billing
          </button>
          <button 
            onClick={() => setAnnualBilling(true)}
            style={{
              background: annualBilling ? 'var(--gradient-brand)' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            Annual Billing
            <span style={{ fontSize: '0.68rem', background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '4rem' }}>
        {PLANS.map((plan, idx) => {
          const price = annualBilling ? plan.priceAnnual : plan.priceMonthly;
          return (
            <div 
              key={idx} 
              className="glass-panel"
              style={{
                padding: '2.25rem',
                borderRadius: '20px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: plan.popular ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid var(--border-glass)',
                boxShadow: plan.popular ? '0 0 30px rgba(139, 92, 246, 0.25)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                    {plan.name}
                  </h3>
                  <Badge variant={plan.popular ? 'purple' : 'blue'}>{plan.badge}</Badge>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '1.5rem', minHeight: '40px' }}>
                  {plan.desc}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '1.75rem' }}>
                  <span style={{ fontSize: '2.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
                    ${price}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>/ month</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      <Check size={16} style={{ color: '#34d399', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                className={plan.popular ? "btn-primary" : "btn-secondary"}
                onClick={openRegisterModal}
                style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', fontSize: '0.92rem', justifyContent: 'center' }}
              >
                <span>{plan.cta}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
