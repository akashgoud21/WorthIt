import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  PlusCircle, 
  User, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setMobileOpen,
  searchQuery,
  setSearchQuery,
  notifications,
  onMarkNotificationRead,
  onOpenAddProduct,
  currentUser,
  onOpenAuth,
  onLogout,
  backendStatus
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'products': return 'My Registered Products';
      case 'warranties': return 'Warranty Tracking';
      case 'documents': return 'Invoices & Documents';
      case 'repairs': return 'Repair History & Analysis';
      case 'expenses': return 'Expense Analytics';
      case 'settings': return 'System & Settings';
      default: return 'WorthIt Dashboard';
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--slate-200)',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      boxShadow: 'var(--shadow-xs)'
    }}>
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setMobileOpen(true)}
          className="btn btn-outline"
          style={{ padding: '0.5rem', display: 'none' }}
          id="navbar-hamburger"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--slate-900)',
            margin: 0,
            lineHeight: 1.2
          }}>
            {getPageTitle()}
          </h1>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }} className="hide-on-mobile">
            WorthIt Smart Warranty, Repair &amp; Expense Management
          </div>
        </div>
      </div>

      {/* Middle: Search Box */}
      <div style={{
        flex: 1,
        maxWidth: '380px',
        position: 'relative'
      }} className="hide-on-mobile">
        <Search 
          size={16} 
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--slate-400)'
          }}
        />
        <input
          type="text"
          placeholder="Search products, brands, models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{
            paddingLeft: '2.3rem',
            paddingTop: '0.45rem',
            paddingBottom: '0.45rem',
            backgroundColor: 'var(--slate-50)',
            borderColor: 'var(--slate-200)',
            fontSize: '0.82rem'
          }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Quick Add Product Button */}
        <button
          onClick={onOpenAddProduct}
          className="btn btn-primary"
          style={{
            padding: '0.45rem 0.9rem',
            fontSize: '0.82rem',
            gap: '0.4rem'
          }}
        >
          <PlusCircle size={16} />
          <span className="hide-on-mobile">Add Product</span>
        </button>

        {/* Notifications Bell Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-outline"
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              borderColor: showNotifications ? 'var(--blue-400)' : 'var(--slate-200)'
            }}
            aria-label="View notifications"
          >
            <Bell size={18} color="var(--slate-600)" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--warning-text)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 2px #ffffff'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              width: '340px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--slate-200)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 50,
              overflow: 'hidden',
              animation: 'fadeIn 0.15s ease'
            }}>
              <div style={{
                padding: '0.85rem 1rem',
                borderBottom: '1px solid var(--slate-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--slate-50)'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--slate-900)' }}>
                  Warranty Notifications
                </div>
                <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                  {unreadCount} Unread
                </span>
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.82rem' }}>
                    No notifications at this time
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid var(--slate-100)',
                        backgroundColor: n.isRead ? '#ffffff' : 'var(--blue-50)',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                        <div style={{
                          marginTop: '2px',
                          color: n.type === 'WARRANTY_EXPIRING' ? 'var(--warning-text)' : 'var(--blue-600)'
                        }}>
                          {n.type === 'WARRANTY_EXPIRING' ? <AlertTriangle size={16} /> : <Clock size={16} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                            {n.productName}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', marginTop: '0.15rem' }}>
                            {n.message}
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '0.4rem',
                            fontSize: '0.68rem',
                            color: 'var(--slate-400)'
                          }}>
                            <span>{n.sentAt}</span>
                            {!n.isRead && (
                              <button
                                onClick={() => onMarkNotificationRead(n.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--blue-600)',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  fontSize: '0.7rem',
                                  padding: 0
                                }}
                              >
                                Mark as Read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={{
                padding: '0.6rem 1rem',
                backgroundColor: 'var(--slate-50)',
                borderTop: '1px solid var(--slate-100)',
                fontSize: '0.7rem',
                color: 'var(--slate-500)',
                textAlign: 'center'
              }}>
                Auto-triggered daily by <code>@Scheduled</code> backend daemon
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              background: 'none',
              border: '1px solid var(--slate-200)',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.65rem',
              cursor: 'pointer',
              backgroundColor: '#ffffff'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--blue-100)',
              color: 'var(--blue-700)',
              fontWeight: 700,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {currentUser?.avatar || 'AV'}
            </div>
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--slate-700)'
            }} className="hide-on-mobile">
              {currentUser?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown size={14} color="var(--slate-400)" className="hide-on-mobile" />
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              width: '220px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--slate-200)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 50,
              overflow: 'hidden',
              animation: 'fadeIn 0.15s ease'
            }}>
              <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--slate-100)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--slate-900)' }}>
                  {currentUser?.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', wordBreak: 'break-all' }}>
                  {currentUser?.email}
                </div>
              </div>

              <div style={{ padding: '0.4rem' }}>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAuth('login');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--slate-700)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--slate-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <User size={15} color="var(--slate-500)" />
                  <span>Switch / Login Account</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAuth('register');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--slate-700)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--slate-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Sparkles size={15} color="var(--blue-500)" />
                  <span>Register New User</span>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--slate-100)', margin: '0.3rem 0' }} />

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--danger-text)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
