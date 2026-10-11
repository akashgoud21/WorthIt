import React, { useState } from 'react';
import { 
  Wrench, 
  Receipt, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  IndianRupee, 
  Building2,
  Info,
  X
} from 'lucide-react';

import { createRepair } from '../services/api';

export default function RepairsView({ 
  products, 
  onAddRepair, 
  isAddRepairOpen, 
  setIsAddRepairOpen,
  preselectedProductId 
}) {
  const [formData, setFormData] = useState({
    productId: preselectedProductId || (products[0]?.id || ''),
    serviceCenter: '',
    cost: '',
    repairDate: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Flatten all repairs with product details
  const allRepairs = products.flatMap(p => 
    (p.repairs || []).map(r => ({
      ...r,
      productId: p.id,
      productName: p.name,
      productBrand: p.brand,
      productPrice: p.price,
    }))
  ).sort((a, b) => new Date(b.repairDate) - new Date(a.repairDate));

  const totalSpent = allRepairs.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = {};
    if (!formData.productId) errs.productId = 'Please select a product';
    if (!formData.serviceCenter.trim()) errs.serviceCenter = 'Service center is required';
    if (!formData.cost || Number(formData.cost) <= 0) errs.cost = 'Please enter a valid positive repair cost';
    if (!formData.repairDate) errs.repairDate = 'Repair date is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const savedRepair = await createRepair({
        productId: Number(formData.productId),
        cost: parseFloat(formData.cost),
        serviceCenter: formData.serviceCenter.trim(),
        repairDate: formData.repairDate,
        description: formData.description.trim() || 'General maintenance and servicing',
      });

      onAddRepair(Number(formData.productId), savedRepair);
      setIsAddRepairOpen(false);
      setFormData({
        productId: products[0]?.id || '',
        serviceCenter: '',
        cost: '',
        repairDate: new Date().toISOString().split('T')[0],
        description: '',
      });
    } catch (err) {
      setServerError(err.message || 'Failed to record repair in MySQL database.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Live Repair Engine Notice */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--success-bg)',
        border: '1px solid var(--success-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem'
      }}>
        <CheckCircle2 size={18} color="var(--success-text)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.76rem', color: 'var(--success-text)', lineHeight: 1.4 }}>
          <strong>Repair Analytics &amp; WorthIt Engine:</strong> Powered by <code>POST /api/repairs</code> and MySQL <code>repairs</code> table. Computes lifetime spend against purchase cost to drive repair-vs-replace recommendations.
        </div>
      </div>

      {/* Top Banner: Total Repair Spend & WorthIt Decision Engine */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>
              Lifetime Repair Expenditures
            </span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--blue-50)',
              color: 'var(--blue-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Receipt size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.5rem' }}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
            Across {allRepairs.length} logged repair &amp; service maintenance sessions
          </div>
        </div>

        {/* The "WorthIt" Repair-vs-Replace Analysis Highlight */}
        <div className="card-base" style={{ padding: '1.25rem', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#16a34a" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>
              WorthIt Repair-vs-Replace Engine
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#14532d', marginTop: '0.45rem', lineHeight: 1.45 }}>
            Automated intelligence analyzes the cumulative cost of repairs against original purchase price. If total repair cost exceeds <strong>50%</strong> of the device price, WorthIt issues an advisory recommending product replacement over further servicing.
          </p>
        </div>
      </div>

      {/* Products Repair Index Ledger */}
      <div className="card-base" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--slate-900)' }}>
              Device Health &amp; Repair Ratio
            </h3>
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
              Cost ratio calculation per registered product
            </div>
          </div>

          <button
            onClick={() => setIsAddRepairOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', gap: '0.4rem' }}
          >
            <PlusCircle size={15} />
            <span>Log Repair Record</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {products.map((p) => {
            const productRepairsSum = p.repairs.reduce((s, r) => s + r.cost, 0);
            const ratio = p.price > 0 ? ((productRepairsSum / p.price) * 100).toFixed(1) : 0;
            const isHigh = Number(ratio) >= 40;

            return (
              <div
                key={p.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isHigh ? 'var(--danger-border)' : 'var(--slate-200)'}`,
                  backgroundColor: isHigh ? 'var(--danger-bg)' : 'var(--slate-50)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)' }}>{p.name}</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                      Original Price: ₹{p.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className={`badge ${isHigh ? 'badge-danger' : 'badge-active'}`} style={{ fontSize: '0.68rem' }}>
                    {ratio}% of price
                  </span>
                </div>

                <div style={{
                  height: '6px',
                  backgroundColor: 'var(--slate-200)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  marginTop: '0.2rem'
                }}>
                  <div style={{
                    width: `${Math.min(Number(ratio), 100)}%`,
                    height: '100%',
                    backgroundColor: isHigh ? 'var(--danger-text)' : 'var(--blue-600)',
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                  <span>Repairs: {p.repairs.length} logged</span>
                  <strong>Spent: ₹{productRepairsSum.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Repair History Log Table */}
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
              Complete Repair History Log
            </h3>
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
              Showing {allRepairs.length} records
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-500)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.75rem 1.25rem' }}>Product</th>
                <th style={{ padding: '0.75rem 1rem' }}>Service Center</th>
                <th style={{ padding: '0.75rem 1rem' }}>Repair Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Work Description</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {allRepairs.map((r) => (
                <tr 
                  key={r.id}
                  style={{ borderBottom: '1px solid var(--slate-100)', transition: 'background-color 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--slate-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{r.productName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>{r.productBrand}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-700)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={13} color="var(--slate-400)" />
                      <span>{r.serviceCenter}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>
                    {r.repairDate}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)', maxWidth: '300px' }}>
                    {r.description}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontWeight: 700, color: 'var(--blue-700)' }}>
                    ₹{r.cost.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Repair Modal */}
      {isAddRepairOpen && (
        <div className="modal-overlay" onClick={() => setIsAddRepairOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--slate-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--slate-50)'
            }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--slate-900)' }}>
                  Log Repair &amp; Maintenance Record
                </h2>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                  Record service cost and workshop details
                </div>
              </div>
              <button onClick={() => setIsAddRepairOpen(false)} className="btn btn-ghost" style={{ padding: '0.35rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Select Product *
                </label>
                <select
                  className="form-input"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
                  ))}
                </select>
                {errors.productId && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem' }}>{errors.productId}</div>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Service Center / Workshop *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Official Brand Care Hub, Local Workshop"
                  value={formData.serviceCenter}
                  onChange={(e) => setFormData({ ...formData, serviceCenter: e.target.value })}
                />
                {errors.serviceCenter && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem' }}>{errors.serviceCenter}</div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Repair Cost (₹) *
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 3500"
                    min="1"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  />
                  {errors.cost && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem' }}>{errors.cost}</div>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Service Date *
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.repairDate}
                    onChange={(e) => setFormData({ ...formData, repairDate: e.target.value })}
                  />
                  {errors.repairDate && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem' }}>{errors.repairDate}</div>}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Work Description
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Detail parts replaced, labor, or diagnostic findings..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                marginTop: '0.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--slate-100)'
              }}>
                <button type="button" onClick={() => setIsAddRepairOpen(false)} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem', gap: '0.4rem' }}>
                  <Wrench size={15} />
                  <span>Save Repair Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
