import React from 'react';
import { Cpu, CheckCircle2, Loader2, Network } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function SwarmMonitor({ steps, currentStepIndex, isGenerating }) {
  if (!isGenerating) return null;

  const currentStep = steps[currentStepIndex] || steps[0];
  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="glass-panel-glow animate-pulse-glow" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Network size={22} style={{ color: '#06b6d4' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>
            Parallel Agent Swarm Execution in Progress
          </h3>
        </div>
        <Badge variant="cyan">{progressPercent}% Completed</Badge>
      </div>

      {/* Progress Bar */}
      <div style={{ 
        width: '100%', 
        height: '6px', 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '9999px', 
        overflow: 'hidden',
        marginBottom: '1.5rem'
      }}>
        <div style={{ 
          width: `${progressPercent}%`, 
          height: '100%', 
          background: 'var(--gradient-brand)', 
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Steps List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          
          return (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: isCurrent ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isCurrent ? 'rgba(139, 92, 246, 0.4)' : 'transparent'}`,
                opacity: idx > currentStepIndex ? 0.5 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {isDone ? (
                  <CheckCircle2 size={18} style={{ color: '#34d399' }} />
                ) : isCurrent ? (
                  <Loader2 size={18} className="animate-spin" style={{ color: '#c084fc' }} />
                ) : (
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border-glass)' }} />
                )}
                <span style={{ fontSize: '0.9rem', fontWeight: isCurrent ? 600 : 400 }}>{step.label}</span>
              </div>
              <Badge variant={isCurrent ? 'purple' : isDone ? 'green' : 'cyan'}>{step.agent}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
