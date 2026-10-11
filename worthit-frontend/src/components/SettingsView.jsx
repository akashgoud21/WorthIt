import React from 'react';
import { 
  Settings, 
  User, 
  Server, 
  Database, 
  Code2, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Info,
  Terminal
} from 'lucide-react';

export default function SettingsView({ currentUser, backendStatus, onRefreshHealth, onOpenRoadmap }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Account Profile Card */}
      <div className="card-base" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: 'var(--blue-100)',
            color: 'var(--blue-700)',
            fontWeight: 800,
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {currentUser?.avatar || 'AV'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--slate-900)' }}>
              {currentUser?.name}
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
              {currentUser?.email} · Joined {currentUser?.joinedDate}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', display: 'block' }}>Account Type</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-800)' }}>Standard User</span>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', display: 'block' }}>Security Status</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success-text)' }}>BCrypt Hash Protected</span>
          </div>
        </div>
      </div>

      {/* Backend & Database Connection Inspector */}
      <div className="card-base" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--slate-900)' }}>
              Backend &amp; Database Architecture
            </h3>
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
              Spring Boot 3.3.5 &amp; MySQL 8.0 connection status
            </div>
          </div>

          <button
            onClick={onRefreshHealth}
            className="btn btn-outline"
            style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', gap: '0.3rem' }}
          >
            <RefreshCw size={13} />
            <span>Test Connection</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-100)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>REST API Host</span>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-800)', marginTop: '0.2rem' }}>
              http://localhost:8080
            </div>
            <div style={{ fontSize: '0.7rem', color: backendStatus?.isOnline ? 'var(--success-text)' : 'var(--danger-text)', marginTop: '0.2rem' }}>
              {backendStatus?.isOnline ? '● Connected & Responding' : '● Unreachable'}
            </div>
          </div>

          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-100)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>Database</span>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-800)', marginTop: '0.2rem' }}>
              MySQL 8.0 (worthit_db)
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--success-text)', marginTop: '0.2rem' }}>
              ● 7 JPA Tables Initialized
            </div>
          </div>

          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-100)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>Active Endpoints</span>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-800)', marginTop: '0.2rem' }}>
              GET /api/health
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--blue-600)', marginTop: '0.2rem' }}>
              Session 1 Baseline
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onOpenRoadmap}
            className="btn btn-outline"
            style={{ fontSize: '0.76rem', color: 'var(--blue-600)' }}
          >
            Inspect Complete 5-Session API Matrix
          </button>
        </div>
      </div>

      {/* College Project Tech Stack Specifications */}
      <div className="card-base" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.98rem', margin: 0, color: 'var(--slate-900)', marginBottom: '0.65rem' }}>
          Technology Stack
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.78rem' }}>
          <div><strong>Frontend:</strong> React 19 + Vite 6 + Vanilla CSS</div>
          <div><strong>Backend:</strong> Java 21 / Spring Boot 3.3.5</div>
          <div><strong>ORM:</strong> Spring Data JPA &amp; Hibernate</div>
          <div><strong>Database:</strong> MySQL 8.0 (InnoDB, UTF-8)</div>
          <div><strong>Build System:</strong> Maven 3.9 &amp; npm</div>
        </div>
      </div>

    </div>
  );
}
