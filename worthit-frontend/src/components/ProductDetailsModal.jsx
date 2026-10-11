import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Receipt, 
  Wrench, 
  FileText, 
  Calendar, 
  IndianRupee,
  Building2,
  Trash2
} from 'lucide-react';

export default function ProductDetailsModal({ 
  product, 
  onClose, 
  onOpenAddRepair,
  onDeleteProduct 
}) {
  if (!product) return null;

  const isExpired = product.status === 'EXPIRED';
  const isExpiring = product.status === 'EXPIRING_SOON';
  const totalRepairsCost = product.repairs.reduce((s, r) => s + r.cost, 0);
  const ratio = product.price > 0 ? ((totalRepairsCost / product.price) * 100).toFixed(1) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--slate-200)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: 'var(--slate-50)'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--blue-600)', textTransform: 'uppercase' }}>
              {product.brand} · {product.category}
            </div>
            <h2 style={{ fontSize: '1.2rem', margin: '0.2rem 0 0 0', color: 'var(--slate-900)' }}>
              {product.name}
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Key Specs Matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem'
          }}>
            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>Purchase Price</span>
              <strong style={{ fontSize: '1rem', color: 'var(--slate-900)' }}>₹{product.price.toLocaleString('en-IN')}</strong>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>Purchase Date</span>
              <strong style={{ fontSize: '0.88rem', color: 'var(--slate-800)' }}>{product.purchaseDate}</strong>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>Warranty Expiry</span>
              <strong style={{ fontSize: '0.88rem', color: isExpired ? 'var(--danger-text)' : isExpiring ? 'var(--warning-text)' : 'var(--success-text)' }}>
                {product.expiryDate}
              </strong>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>Current Status</span>
              <span className={`badge ${isExpired ? 'badge-danger' : isExpiring ? 'badge-warning' : 'badge-active'}`} style={{ marginTop: '0.2rem' }}>
                {isExpired ? 'Expired' : isExpiring ? 'Expiring' : 'Active'}
              </span>
            </div>
          </div>

          {/* WorthIt Repair Ratio Analytics */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: Number(ratio) > 40 ? '#fef2f2' : 'var(--blue-50)',
            border: `1px solid ${Number(ratio) > 40 ? '#fecaca' : 'var(--blue-100)'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Receipt size={16} color={Number(ratio) > 40 ? 'var(--danger-text)' : 'var(--blue-600)'} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  Repair-versus-Replace Assessment
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: Number(ratio) > 40 ? 'var(--danger-text)' : 'var(--blue-700)' }}>
                {ratio}% of product cost
              </span>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', marginTop: '0.35rem' }}>
              Total repair expenditure: <strong>₹{totalRepairsCost.toLocaleString('en-IN')}</strong> across {product.repairs.length} service events.
              {Number(ratio) > 40 && ' Advisory: Cumulative repair costs are approaching replacement value.'}
            </div>
          </div>

          {/* Repairs List */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <h3 style={{ fontSize: '0.9rem', margin: 0, color: 'var(--slate-900)' }}>
                Service &amp; Repair History ({product.repairs.length})
              </h3>
              <button
                onClick={() => {
                  onClose();
                  onOpenAddRepair(product.id);
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', gap: '0.25rem' }}
              >
                <Wrench size={12} />
                <span>Add Record</span>
              </button>
            </div>

            {product.repairs.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', fontSize: '0.76rem', color: 'var(--slate-400)' }}>
                No repairs recorded for this product yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {product.repairs.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--slate-100)',
                      backgroundColor: 'var(--slate-50)',
                      fontSize: '0.76rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span style={{ color: 'var(--slate-900)' }}>{r.serviceCenter}</span>
                      <strong style={{ color: 'var(--blue-700)' }}>₹{r.cost.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ color: 'var(--slate-500)', fontSize: '0.7rem', marginTop: '0.15rem' }}>
                      {r.repairDate} · {r.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attached Documents */}
          <div>
            <h3 style={{ fontSize: '0.9rem', margin: 0, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              Attached Invoices &amp; Warranty Cards
            </h3>
            {product.documents?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {product.documents.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--slate-50)',
                      border: '1px solid var(--slate-100)',
                      fontSize: '0.76rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <FileText size={15} color="var(--blue-600)" />
                      <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{d.fileName}</span>
                      <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{d.type}</span>
                    </div>
                    <span style={{ color: 'var(--slate-400)', fontSize: '0.7rem' }}>{d.uploadedAt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.74rem', color: 'var(--slate-400)' }}>No files attached.</div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid var(--slate-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--slate-50)'
        }}>
          <button
            onClick={() => {
              if (confirm(`Remove ${product.name} from preview list?`)) {
                onDeleteProduct(product.id);
                onClose();
              }
            }}
            className="btn btn-ghost"
            style={{ color: 'var(--danger-text)', fontSize: '0.78rem', gap: '0.3rem' }}
          >
            <Trash2 size={14} />
            <span>Remove Product</span>
          </button>

          <button onClick={onClose} className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
