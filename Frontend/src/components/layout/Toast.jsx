import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function Toast({ toast }) {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      backgroundColor: isError ? 'rgba(239, 68, 68, 0.9)' : 'rgba(15, 23, 42, 0.95)',
      color: '#ffffff',
      border: `1px solid ${isError ? '#ef4444' : 'rgba(139, 92, 246, 0.5)'}`,
      boxShadow: isError ? '0 4px 20px rgba(239, 68, 68, 0.4)' : '0 4px 20px rgba(139, 92, 246, 0.4)',
      padding: '0.85rem 1.25rem',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
      zIndex: 9999,
      backdropFilter: 'blur(12px)',
      fontSize: '0.9rem',
      fontWeight: 500,
      animation: 'fadeIn 0.25s ease-out forwards'
    }}>
      <Icon size={18} style={{ color: isError ? '#ffffff' : '#34d399' }} />
      <span>{toast.message}</span>
    </div>
  );
}
