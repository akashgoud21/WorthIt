import React from 'react';
import { X, CheckCircle, Clock, Server, Database, Shield, Cpu, RefreshCw } from 'lucide-react';
import { API_ROADMAP } from '../services/api';

export default function BackendRoadmapModal({ isOpen, onClose, backendStatus, onRefreshHealth }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--slate-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--slate-50)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Server size={20} color="var(--blue-600)" />
            <div>
              <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--slate-900)' }}>
                Backend API Architecture &amp; Roadmap
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                College Project Session Breakdown &amp; Active Integrations
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Live Status Box */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--slate-200)' }}>
          <div style={{
            backgroundColor: backendStatus?.isOnline ? 'var(--blue-50)' : 'var(--danger-bg)',
            border: `1px solid ${backendStatus?.isOnline ? 'var(--blue-200)' : 'var(--danger-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: backendStatus?.isOnline ? '#10b981' : '#ef4444'
                }} />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-900)' }}>
                  Spring Boot Backend: {backendStatus?.isOnline ? 'ONLINE (Port 8080)' : 'OFFLINE'}
                </span>
              </div>
              <button
                onClick={onRefreshHealth}
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', gap: '0.3rem' }}
              >
                <RefreshCw size={12} />
                <span>Re-check Health</span>
              </button>
            </div>

            {backendStatus?.data && (
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.74rem',
                backgroundColor: 'rgba(255,255,255,0.85)',
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--slate-800)',
                overflowX: 'auto'
              }}>
                <div><strong>Application:</strong> {backendStatus.data.application} (v{backendStatus.data.version})</div>
                <div><strong>Live Status:</strong> {backendStatus.data.status}</div>
                <div><strong>Message:</strong> {backendStatus.data.message}</div>
                <div><strong>Checked At:</strong> {backendStatus.data.timestamp}</div>
              </div>
            )}
          </div>
        </div>

        {/* Endpoint Roadmap List */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--slate-400)',
            marginBottom: '0.75rem'
          }}>
            REST Endpoints Registry &amp; Implementation Status
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {Object.entries(API_ROADMAP).map(([key, ep]) => {
              const isActive = ep.status === 'ACTIVE';
              return (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-200)',
                    backgroundColor: isActive ? 'var(--success-bg)' : '#ffffff',
                    borderColor: isActive ? 'var(--success-border)' : 'var(--slate-200)',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1 }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      padding: '0.2rem 0.45rem',
                      borderRadius: '4px',
                      backgroundColor: ep.method === 'GET' ? 'var(--blue-100)' : 'var(--slate-100)',
                      color: ep.method === 'GET' ? 'var(--blue-700)' : 'var(--slate-700)'
                    }}>
                      {ep.method}
                    </span>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      color: 'var(--slate-900)'
                    }}>
                      {ep.path}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                      {ep.session}
                    </span>
                    <span className={`badge ${isActive ? 'badge-active' : 'badge-pending'}`} style={{ fontSize: '0.7rem' }}>
                      {isActive ? 'Implemented' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.74rem',
            color: 'var(--success-text)',
            lineHeight: 1.4
          }}>
            <strong>Full Stack Active:</strong> All REST endpoints are fully implemented and communicating with Spring Boot and MySQL <code>worthit_db</code> with active JWT authentication and scheduled background tasks.
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid var(--slate-200)',
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: 'var(--slate-50)'
        }}>
          <button onClick={onClose} className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
            Close Inspection Modal
          </button>
        </div>
      </div>
    </div>
  );
}
