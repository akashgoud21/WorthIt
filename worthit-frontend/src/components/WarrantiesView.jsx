import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Bell, 
  AlertCircle,
  FileText,
  Info,
  Layers
} from 'lucide-react';

export default function WarrantiesView({ products, notifications, onOpenAddProduct }) {
  const [filter, setFilter] = useState('ALL');

  // Compute warranties list with calculated days remaining
  const today = new Date();
  const warranties = products.map((p) => {
    const expiry = new Date(p.expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      productId: p.id,
      productName: p.name,
      brand: p.brand,
      category: p.category,
      purchaseDate: p.purchaseDate,
      warrantyPeriod: p.warrantyPeriod,
      expiryDate: p.expiryDate,
      daysRemaining: diffDays,
      status: p.status,
      invoiceFileName: p.invoiceFileName,
    };
  });

  const filteredWarranties = warranties.filter((w) => {
    if (filter === 'ACTIVE') return w.status === 'ACTIVE';
    if (filter === 'EXPIRING_SOON') return w.status === 'EXPIRING_SOON';
    if (filter === 'EXPIRED') return w.status === 'EXPIRED';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Session 4 Notice & Scheduler info */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--pending-bg)',
        border: '1px solid var(--pending-border)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.65rem'
      }}>
        <Info size={18} color="var(--pending-text)" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div style={{ fontSize: '0.76rem', color: 'var(--pending-text)', lineHeight: 1.4 }}>
          <strong>Scheduled Background Notification Architecture:</strong> The Spring Boot backend includes a daily <code>@Scheduled</code> job in <code>NotificationScheduler</code> that inspects the MySQL <code>warranties</code> table, computes days remaining, updates the <code>WarrantyStatus</code> enum (ACTIVE → EXPIRING_SOON → EXPIRED), and generates notifications. <code>GET /api/warranties/expiring</code> is scheduled for <strong>Session 4</strong>.
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <button
          onClick={() => setFilter('ALL')}
          className="card-base"
          style={{
            padding: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            borderColor: filter === 'ALL' ? 'var(--blue-500)' : undefined
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', fontWeight: 600 }}>Total Warranties Tracked</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
            {warranties.length}
          </div>
        </button>

        <button
          onClick={() => setFilter('ACTIVE')}
          className="card-base"
          style={{
            padding: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            borderColor: filter === 'ACTIVE' ? 'var(--success-border)' : undefined
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--success-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={13} />
            <span>Active &amp; Covered</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-text)', marginTop: '0.25rem' }}>
            {warranties.filter(w => w.status === 'ACTIVE').length}
          </div>
        </button>

        <button
          onClick={() => setFilter('EXPIRING_SOON')}
          className="card-base"
          style={{
            padding: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            borderColor: filter === 'EXPIRING_SOON' ? '#fcd34d' : undefined
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--warning-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertTriangle size={13} />
            <span>Expiring (&lt; 30 Days)</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning-text)', marginTop: '0.25rem' }}>
            {warranties.filter(w => w.status === 'EXPIRING_SOON').length}
          </div>
        </button>

        <button
          onClick={() => setFilter('EXPIRED')}
          className="card-base"
          style={{
            padding: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            borderColor: filter === 'EXPIRED' ? 'var(--danger-border)' : undefined
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--danger-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={13} />
            <span>Expired Coverages</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger-text)', marginTop: '0.25rem' }}>
            {warranties.filter(w => w.status === 'EXPIRED').length}
          </div>
        </button>
      </div>

      {/* Warranty Ledger Table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '1.1rem 1.25rem',
          borderBottom: '1px solid var(--slate-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '0.98rem', margin: 0, color: 'var(--slate-900)' }}>
              Warranty Countdown Schedule
            </h3>
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
              Showing {filteredWarranties.length} tracked items
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.75rem 1.25rem' }}>Product &amp; Brand</th>
                <th style={{ padding: '0.75rem 1rem' }}>Purchase Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Duration</th>
                <th style={{ padding: '0.75rem 1rem' }}>Expiry Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Countdown</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredWarranties.map((w) => {
                const isExpired = w.status === 'EXPIRED';
                const isExpiring = w.status === 'EXPIRING_SOON';

                return (
                  <tr 
                    key={w.productId} 
                    style={{ borderBottom: '1px solid var(--slate-100)', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--slate-50)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                  >
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{w.productName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>{w.brand} · {w.category}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>
                      {w.purchaseDate}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-700)', fontWeight: 500 }}>
                      {w.warrantyPeriod} Months
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: isExpired ? 'var(--danger-text)' : isExpiring ? 'var(--warning-text)' : 'var(--slate-800)' }}>
                      {w.expiryDate}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {isExpired ? (
                        <span style={{ fontSize: '0.74rem', color: 'var(--danger-text)' }}>
                          Expired {Math.abs(w.daysRemaining)} days ago
                        </span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: isExpiring ? 'var(--warning-text)' : 'var(--blue-700)'
                          }}>
                            {w.daysRemaining} days left
                          </span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <span className={`badge ${
                        isExpired ? 'badge-danger' : isExpiring ? 'badge-warning' : 'badge-active'
                      }`}>
                        {isExpired ? 'Expired' : isExpiring ? 'Expiring Soon' : 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
