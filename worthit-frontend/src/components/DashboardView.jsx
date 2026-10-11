import React from 'react';
import { 
  Package, 
  ShieldCheck, 
  AlertTriangle, 
  Receipt, 
  PlusCircle, 
  Wrench, 
  FileText, 
  ArrowUpRight, 
  ArrowRight,
  Clock, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Info
} from 'lucide-react';

export default function DashboardView({ 
  products, 
  notifications, 
  onOpenAddProduct, 
  onOpenAddRepair, 
  setActiveTab,
  onOpenRoadmap,
  backendStatus 
}) {
  // Compute dashboard metrics dynamically
  const totalProducts = products.length;
  const activeWarranties = products.filter(p => p.status === 'ACTIVE').length;
  const expiringWarranties = products.filter(p => p.status === 'EXPIRING_SOON').length;
  
  const allRepairs = products.flatMap(p => p.repairs.map(r => ({ ...r, productName: p.name, productPrice: p.price })));
  const totalRepairExpenses = allRepairs.reduce((sum, r) => sum + r.cost, 0);
  const totalPurchaseValue = products.reduce((sum, p) => sum + p.price, 0);

  // Overall Repair Ratio (%)
  const overallRepairRatio = totalPurchaseValue > 0 
    ? ((totalRepairExpenses / totalPurchaseValue) * 100).toFixed(1) 
    : 0;

  // Products expiring soon (< 30 days)
  const expiringSoonProducts = products.filter(p => p.status === 'EXPIRING_SOON');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Backend API Status Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--slate-200)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.9rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: backendStatus?.isOnline ? '#10b981' : '#ef4444',
            boxShadow: backendStatus?.isOnline ? '0 0 0 3px rgba(16, 185, 129, 0.25)' : '0 0 0 3px rgba(239, 68, 68, 0.25)'
          }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              {backendStatus?.isOnline ? 'Backend Connected: Spring Boot 3.3.5 & MySQL 8.0' : 'Backend Disconnected'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>
              Live REST API &amp; MySQL Connected · Auth, Products, Warranties, OCR Invoices, Repairs, Expenses &amp; Scheduled Expiry Alerts Active
            </div>
          </div>
        </div>

        <button
          onClick={onOpenRoadmap}
          className="btn btn-outline"
          style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
        >
          View API Status Matrix
        </button>
      </div>

      {/* Required 4 Dashboard Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1rem'
      }}>
        {/* Card 1: Total Products */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>
              Total Products
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--blue-50)',
              color: 'var(--blue-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.5rem' }}>
            {totalProducts}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.74rem', color: 'var(--slate-500)' }}>
            <span>Portfolio value:</span>
            <strong style={{ color: 'var(--slate-800)' }}>₹{totalPurchaseValue.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Card 2: Active Warranties */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>
              Active Warranties
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--success-text)', marginTop: '0.5rem' }}>
            {activeWarranties}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.74rem', color: 'var(--slate-500)' }}>
            <CheckCircle2 size={13} color="var(--success-text)" />
            <span>Under full manufacturer coverage</span>
          </div>
        </div>

        {/* Card 3: Expiring Warranties */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>
              Expiring Warranties
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--warning-text)', marginTop: '0.5rem' }}>
            {expiringWarranties}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.74rem', color: 'var(--slate-500)' }}>
            <Clock size={13} color="var(--warning-text)" />
            <span>Expiring within next 30 days</span>
          </div>
        </div>

        {/* Card 4: Total Repair Expenses */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>
              Total Repair Expenses
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--blue-50)',
              color: 'var(--blue-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Receipt size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--blue-900)', marginTop: '0.5rem' }}>
            ₹{totalRepairExpenses.toLocaleString('en-IN')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.74rem', color: 'var(--slate-500)' }}>
            <span>WorthIt Index:</span>
            <strong style={{ color: Number(overallRepairRatio) > 40 ? 'var(--danger-text)' : 'var(--success-text)' }}>
              {overallRepairRatio}% of price
            </strong>
          </div>
        </div>
      </div>

      {/* Expiring Soon Action Alert Bar */}
      {expiringSoonProducts.length > 0 && (
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '1.1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#92400e' }}>
                Action Required: {expiringSoonProducts.length} product warranty expiring soon
              </div>
              <div style={{ fontSize: '0.76rem', color: '#b45309', marginTop: '0.15rem' }}>
                {expiringSoonProducts.map(p => `${p.name} (Expires ${p.expiryDate})`).join(', ')}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('warranties')}
            className="btn btn-outline"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#fcd34d',
              color: '#92400e',
              fontSize: '0.78rem',
              gap: '0.35rem'
            }}
          >
            <span>Inspect Expiries</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Grid: Recent Products & Quick Actions / Repair Feed */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* Left: Registered Products Overview */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--slate-100)'
          }}>
            <div>
              <h2 style={{ fontSize: '1rem', margin: 0, color: 'var(--slate-900)' }}>
                Registered Products
              </h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                Warranty status &amp; purchase ledger
              </div>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="btn btn-ghost"
              style={{ fontSize: '0.76rem', gap: '0.3rem', color: 'var(--blue-600)' }}
            >
              <span>View All</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {products.slice(0, 4).map((p) => {
              const isExpired = p.status === 'EXPIRED';
              const isExpiring = p.status === 'EXPIRING_SOON';
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-100)',
                    backgroundColor: 'var(--slate-50)',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      color: 'var(--slate-900)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
                      {p.brand} · ₹{p.price.toLocaleString('en-IN')} · Expires {p.expiryDate}
                    </div>
                  </div>

                  <span className={`badge ${
                    isExpired ? 'badge-danger' : isExpiring ? 'badge-warning' : 'badge-active'
                  }`}>
                    {isExpired ? 'Expired' : isExpiring ? 'Expiring' : 'Active'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Action Hub & Recent Repair Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Quick Action Tiles */}
          <div className="card-base" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', margin: 0, color: 'var(--slate-900)', marginBottom: '0.85rem' }}>
              Quick Operations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                onClick={onOpenAddProduct}
                className="btn btn-primary"
                style={{
                  padding: '0.75rem',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  height: 'auto',
                  textAlign: 'center'
                }}
              >
                <PlusCircle size={22} />
                <span style={{ fontSize: '0.78rem' }}>Register Product</span>
              </button>

              <button
                onClick={onOpenAddRepair}
                className="btn btn-outline"
                style={{
                  padding: '0.75rem',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  height: 'auto',
                  textAlign: 'center',
                  borderColor: 'var(--blue-200)',
                  backgroundColor: 'var(--blue-50)',
                  color: 'var(--blue-800)'
                }}
              >
                <Wrench size={22} color="var(--blue-600)" />
                <span style={{ fontSize: '0.78rem' }}>Log Repair Expense</span>
              </button>
            </div>
          </div>

          {/* Repair Activity Snippet */}
          <div className="card-base" style={{ padding: '1.25rem', flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <div>
                <h3 style={{ fontSize: '0.92rem', margin: 0, color: 'var(--slate-900)' }}>
                  Recent Repair History
                </h3>
                <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                  Maintenance spend tracker
                </div>
              </div>
              <button
                onClick={() => setActiveTab('repairs')}
                className="btn btn-ghost"
                style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem', color: 'var(--blue-600)' }}
              >
                All Repairs
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {allRepairs.slice(0, 2).map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-100)',
                    backgroundColor: 'var(--slate-50)',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--slate-800)' }}>
                    <span>{r.productName}</span>
                    <span style={{ color: 'var(--blue-700)' }}>₹{r.cost.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
                    {r.serviceCenter} · {r.repairDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
