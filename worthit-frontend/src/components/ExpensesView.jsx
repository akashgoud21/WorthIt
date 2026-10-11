import React from 'react';
import { 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  IndianRupee, 
  Calendar,
  Layers,
  Info
} from 'lucide-react';

export default function ExpensesView({ products }) {
  // Aggregate repairs
  const allRepairs = products.flatMap(p => 
    p.repairs.map(r => ({
      ...r,
      productName: p.name,
      category: p.category,
      productPrice: p.price
    }))
  );

  const totalRepairSpend = allRepairs.reduce((s, r) => s + r.cost, 0);
  const totalDeviceValue = products.reduce((s, p) => s + p.price, 0);

  // Group by category
  const categoryMap = {};
  products.forEach(p => {
    if (!categoryMap[p.category]) categoryMap[p.category] = { spend: 0, count: 0, devicePrice: 0 };
    categoryMap[p.category].devicePrice += p.price;
    p.repairs.forEach(r => {
      categoryMap[p.category].spend += r.cost;
      categoryMap[p.category].count += 1;
    });
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Session 5 Analytics Notice */}
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
          <strong>Analytical Dashboard Endpoint:</strong> <code>GET /api/dashboard/summary</code> and monthly breakdown queries in <code>RepairRepository.sumMonthlyRepairCost()</code> are scheduled for <strong>Session 5</strong>. The analytics below reflect active preview calculations.
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600 }}>Total Spent on Repairs</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue-900)', marginTop: '0.4rem' }}>
            ₹{totalRepairSpend.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
            Across {allRepairs.length} service transactions
          </div>
        </div>

        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600 }}>Total Products Value</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.4rem' }}>
            ₹{totalDeviceValue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
            Initial acquisition investment
          </div>
        </div>

        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600 }}>Portfolio Maintenance Ratio</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success-text)', marginTop: '0.4rem' }}>
            {totalDeviceValue > 0 ? ((totalRepairSpend / totalDeviceValue) * 100).toFixed(1) : 0}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
            Healthy repair cost threshold (&lt; 20%)
          </div>
        </div>
      </div>

      {/* Category Expense Distribution */}
      <div className="card-base" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.98rem', margin: 0, color: 'var(--slate-900)', marginBottom: '1rem' }}>
          Expenditure by Device Category
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {Object.entries(categoryMap).map(([category, data]) => {
            const percentOfTotal = totalRepairSpend > 0 ? ((data.spend / totalRepairSpend) * 100).toFixed(0) : 0;

            return (
              <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{category}</span>
                  <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--slate-600)' }}>
                    <span>{data.count} repairs</span>
                    <strong style={{ color: 'var(--blue-700)' }}>₹{data.spend.toLocaleString('en-IN')} ({percentOfTotal}%)</strong>
                  </div>
                </div>

                <div style={{
                  height: '8px',
                  backgroundColor: 'var(--slate-100)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentOfTotal}%`,
                    height: '100%',
                    backgroundColor: 'var(--blue-600)',
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
