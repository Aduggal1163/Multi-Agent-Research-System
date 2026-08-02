import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Database, 
  FolderKanban, 
  Activity, 
  Upload, 
  Search, 
  Home,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export function NavbarDock({ 
  activeTab, 
  setActiveTab, 
  documentsCount = 0, 
  reportsCount = 0,
  searchTerm,
  setSearchTerm,
  onUploadClick,
  onNewResearch
}) {
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getUserInitials = (name = '') => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  const handleProtectedTabClick = (targetTab) => {
    if (!isAuthenticated && targetTab !== 'landing') {
      openLoginModal();
      return;
    }
    setActiveTab(targetTab);
  };

  const handleProtectedUploadClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    onUploadClick();
  };

  return (
    <header style={{
      height: '75px',
      padding: '0 2rem',
      background: 'rgba(6, 9, 19, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-glass)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Brand Title Logo */}
      <div 
        onClick={() => setActiveTab('landing')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'var(--gradient-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
        }}>
          <Bot size={22} style={{ color: '#ffffff' }} />
        </div>
        <div>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.25rem', 
            fontWeight: 800, 
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            SwarmAI
          </span>
          <span style={{ fontSize: '0.68rem', display: 'block', color: 'var(--text-dim)', fontWeight: 600, marginTop: '-3px' }}>
            Autonomous Multi-Agent Platform
          </span>
        </div>
      </div>

      {/* Center Navigation Dock Pills */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '0.35rem 0.5rem',
        borderRadius: '9999px',
        border: '1px solid var(--border-glass)'
      }}>
        {isAuthenticated ? (
          <>
            <button 
              className={`nav-item ${activeTab === 'landing' ? 'active' : ''}`}
              onClick={() => setActiveTab('landing')}
              style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <Home size={15} style={{ color: '#c084fc' }} />
              <span>Home</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'workspace' ? 'active' : ''}`}
              onClick={() => handleProtectedTabClick('workspace')}
              style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <Sparkles size={15} style={{ color: '#c084fc' }} />
              <span>Research Swarm</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'knowledge' ? 'active' : ''}`}
              onClick={() => handleProtectedTabClick('knowledge')}
              style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <Database size={15} style={{ color: '#38bdf8' }} />
              <span>Knowledge Hub</span>
              {documentsCount > 0 && (
                <span style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px'
                }}>
                  {documentsCount}
                </span>
              )}
            </button>

            <button 
              className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleProtectedTabClick('history')}
              style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <FolderKanban size={15} style={{ color: '#f472b6' }} />
              <span>Report Archive</span>
              {reportsCount > 0 && (
                <span style={{
                  background: 'rgba(244, 114, 182, 0.2)',
                  color: '#f472b6',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px'
                }}>
                  {reportsCount}
                </span>
              )}
            </button>

            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => handleProtectedTabClick('analytics')}
              style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <Activity size={15} style={{ color: '#34d399' }} />
              <span>Analytics</span>
            </button>
          </>
        ) : (
          <>
            <button 
              className={`nav-item ${activeTab === 'landing' ? 'active' : ''}`}
              onClick={() => setActiveTab('landing')}
              style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <Home size={15} style={{ color: '#c084fc' }} />
              <span>Home</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
              style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <Sparkles size={15} style={{ color: '#38bdf8' }} />
              <span>Features</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
              style={{ width: 'auto', borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <ShieldCheck size={15} style={{ color: '#c084fc' }} />
              <span>Security</span>
            </button>
          </>
        )}
      </nav>

      {/* Right Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {isAuthenticated && (
          <>
            {/* Search Input */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              borderRadius: '9999px',
              padding: '0.4rem 0.85rem',
              width: '170px'
            }}>
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  outline: 'none', 
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  width: '100%'
                }}
              />
            </div>

            {/* Upload Button */}
            <button 
              className="btn-primary" 
              onClick={handleProtectedUploadClick}
              style={{ padding: '0.45rem 0.95rem', borderRadius: '9999px', fontSize: '0.82rem' }}
            >
              <Upload size={14} />
              <span>Upload</span>
            </button>
          </>
        )}

        {/* Auth User Profile or Sign In Button */}
        {isAuthenticated ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass-glow)',
                borderRadius: '9999px',
                padding: '0.3rem 0.65rem 0.3rem 0.35rem',
                cursor: 'pointer',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.75rem'
              }}>
                {getUserInitials(user.full_name)}
              </div>
              <span>{user.full_name.split(' ')[0]}</span>
              <ChevronDown size={14} style={{ color: 'var(--text-dim)' }} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="glass-panel animate-fade-in" style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '220px',
                padding: '0.75rem',
                borderRadius: '14px',
                boxShadow: 'var(--shadow-glow)',
                zIndex: 2000
              }}>
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>{user.full_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{user.email}</div>
                  <div style={{ fontSize: '0.7rem', color: '#c084fc', marginTop: '0.25rem', fontWeight: 600 }}>{user.role || 'Enterprise Analyst'}</div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    setActiveTab('landing');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              className="btn-secondary" 
              onClick={openLoginModal}
              style={{ padding: '0.45rem 0.95rem', borderRadius: '9999px', fontSize: '0.82rem' }}
            >
              <User size={14} />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
