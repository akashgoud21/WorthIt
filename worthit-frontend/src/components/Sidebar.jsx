import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShieldCheck, 
  FileText, 
  Wrench, 
  Receipt, 
  Settings, 
  Shield, 
  ExternalLink,
  Activity,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  unreadCount, 
  backendStatus,
  mobileOpen,
  setMobileOpen,
  onOpenRoadmap
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'warranties', label: 'Warranties', icon: ShieldCheck, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'repairs', label: 'Repairs', icon: Wrench },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            zIndex: 90,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      <aside style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--slate-200)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        transform: mobileOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.25s ease-in-out',
        boxShadow: 'var(--shadow-sm)'
      }}
      className={mobileOpen ? '' : 'sidebar-desktop-only'}
      >
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--slate-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 8px -2px rgba(37, 99, 235, 0.4)'
            }}>
              <Shield size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--blue-900)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}>
                Worth<span style={{ color: 'var(--blue-600)' }}>It</span>
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--slate-400)',
                fontWeight: 500
              }}>
                Smart Warranty & Care
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="btn btn-ghost"
            style={{ padding: '0.35rem', display: 'none' }}
            id="sidebar-mobile-close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{
          flex: 1,
          padding: '1.25rem 0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: 'var(--slate-400)',
            padding: '0 0.65rem 0.4rem 0.65rem'
          }}>
            Main Menu
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--blue-50)' : 'transparent',
                  color: isActive ? 'var(--blue-700)' : 'var(--slate-600)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease-in-out',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--slate-50)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={19} color={isActive ? 'var(--blue-600)' : 'var(--slate-500)'} strokeWidth={isActive ? 2.2 : 1.9} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    backgroundColor: 'var(--warning-text)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    right: '0',
                    width: '3.5px',
                    height: '60%',
                    backgroundColor: 'var(--blue-600)',
                    borderRadius: '4px 0 0 4px'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Backend Connection Status Footer */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--slate-100)',
          backgroundColor: 'var(--slate-50)'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--slate-200)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: backendStatus?.isOnline ? '#10b981' : '#ef4444',
                  boxShadow: backendStatus?.isOnline ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : '0 0 0 2px rgba(239, 68, 68, 0.2)'
                }} />
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: backendStatus?.isOnline ? 'var(--success-text)' : 'var(--danger-text)'
                }}>
                  {backendStatus?.isOnline ? 'Spring Boot 8080' : 'Backend Offline'}
                </span>
              </div>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: 'var(--blue-50)',
                color: 'var(--blue-700)',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
                fontWeight: 600
              }}>
                MySQL UP
              </span>
            </div>

            <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', lineHeight: 1.3 }}>
              {backendStatus?.isOnline ? 'Session 1 Active · /api/health' : 'Check backend terminal'}
            </div>

            <button
              onClick={onOpenRoadmap}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                background: 'none',
                border: 'none',
                color: 'var(--blue-600)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                paddingTop: '0.2rem'
              }}
            >
              <Activity size={12} />
              <span>Inspect API Endpoints</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
