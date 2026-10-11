import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Wrench, 
  Calendar, 
  IndianRupee,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

export default function ProductsView({ 
  products, 
  searchQuery, 
  setSearchQuery, 
  onOpenAddProduct,
  onOpenAddRepair,
  onSelectProductDetails 
}) {
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Categories list
  const categories = ['ALL', 'Electronics', 'Home Appliances', 'Computers & IT', 'Mobile Devices'];

  // Filter products by search query, status, and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'ALL' || p.status === selectedStatus;

    const matchesCategory = 
      selectedCategory === 'ALL' || p.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Session 3 Endpoint Pending Banner */}
      <div style={{
        padding: '0.75rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--pending-bg)',
        border: '1px solid var(--pending-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.76rem',
        color: 'var(--pending-text)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={16} />
          <span><strong>API Roadmap:</strong> Product data persistence (<code>GET /api/products</code> &amp; <code>POST /api/products</code>) is scheduled for <strong>Session 3</strong>.</span>
        </div>
        <span style={{ fontWeight: 600 }}>Active Preview Mode</span>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-base" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
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
              placeholder="Filter by product name, model, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.3rem', fontSize: '0.82rem' }}
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Products' },
              { id: 'ACTIVE', label: 'Active Coverage' },
              { id: 'EXPIRING_SOON', label: 'Expiring Soon' },
              { id: 'EXPIRED', label: 'Expired' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`btn ${selectedStatus === tab.id ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  fontSize: '0.76rem',
                  padding: '0.4rem 0.75rem',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Add Product Button */}
          <button
            onClick={onOpenAddProduct}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', gap: '0.4rem' }}
          >
            <PlusCircle size={16} />
            <span>Register Product</span>
          </button>
        </div>

        {/* Category Pill Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '1rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--slate-100)',
          overflowX: 'auto',
          fontSize: '0.76rem'
        }}>
          <span style={{ color: 'var(--slate-500)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Filter size={13} />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'var(--blue-100)' : 'transparent',
                color: selectedCategory === cat ? 'var(--blue-800)' : 'var(--slate-600)',
                border: `1px solid ${selectedCategory === cat ? 'var(--blue-300)' : 'var(--slate-200)'}`,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: selectedCategory === cat ? 600 : 500,
                cursor: 'pointer',
                fontSize: '0.74rem'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="card-base" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <Layers size={40} color="var(--slate-300)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--slate-700)', margin: 0 }}>
            No products found
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: '0.35rem' }}>
            Try adjusting your search terms or category filters.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredProducts.map((p) => {
            const isExpired = p.status === 'EXPIRED';
            const isExpiring = p.status === 'EXPIRING_SOON';
            const totalProductRepairs = p.repairs.reduce((sum, r) => sum + r.cost, 0);

            return (
              <div 
                key={p.id} 
                className="card-base"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderColor: isExpiring ? '#fde68a' : undefined
                }}
              >
                {/* Card Top Header */}
                <div style={{
                  padding: '1.1rem 1.25rem',
                  borderBottom: '1px solid var(--slate-100)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--blue-600)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {p.brand} · {p.category}
                    </div>
                    <h3 style={{
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      color: 'var(--slate-900)',
                      marginTop: '0.2rem',
                      lineHeight: 1.3
                    }}>
                      {p.name}
                    </h3>
                  </div>

                  <span className={`badge ${
                    isExpired ? 'badge-danger' : isExpiring ? 'badge-warning' : 'badge-active'
                  }`}>
                    {isExpired ? 'Expired' : isExpiring ? 'Expiring Soon' : 'Active'}
                  </span>
                </div>

                {/* Card Info Body */}
                <div style={{ padding: '1.1rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  
                  {/* Price & Purchase Date */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.78rem' }}>
                    <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.5rem 0.65rem', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ color: 'var(--slate-400)', fontSize: '0.7rem', display: 'block' }}>Purchase Price</span>
                      <strong style={{ color: 'var(--slate-800)', fontSize: '0.88rem' }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.5rem 0.65rem', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ color: 'var(--slate-400)', fontSize: '0.7rem', display: 'block' }}>Purchased On</span>
                      <span style={{ color: 'var(--slate-800)', fontWeight: 600 }}>
                        {p.purchaseDate}
                      </span>
                    </div>
                  </div>

                  {/* Warranty Expiry Details */}
                  <div style={{
                    padding: '0.65rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isExpiring ? '#fffbeb' : 'var(--blue-50)',
                    border: `1px solid ${isExpiring ? '#fef3c7' : 'var(--blue-100)'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                      <span style={{ color: 'var(--slate-600)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} color="var(--blue-600)" />
                        <span>Coverage Period:</span>
                      </span>
                      <strong style={{ color: 'var(--slate-800)' }}>
                        {p.warrantyPeriod} Months
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginTop: '0.35rem' }}>
                      <span style={{ color: 'var(--slate-600)' }}>Valid Till:</span>
                      <strong style={{ color: isExpired ? 'var(--danger-text)' : isExpiring ? 'var(--warning-text)' : 'var(--success-text)' }}>
                        {p.expiryDate}
                      </strong>
                    </div>
                  </div>

                  {/* Document & Repair Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FileText size={14} color="var(--slate-400)" />
                      <span>{p.invoiceFileName ? 'Invoice attached' : 'No document'}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Wrench size={14} color="var(--slate-400)" />
                      <span>{p.repairs.length} repairs (₹{totalProductRepairs.toLocaleString('en-IN')})</span>
                    </div>
                  </div>

                </div>

                {/* Card Action Footer */}
                <div style={{
                  padding: '0.75rem 1.25rem',
                  borderTop: '1px solid var(--slate-100)',
                  backgroundColor: 'var(--slate-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => onOpenAddRepair(p.id)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', gap: '0.3rem' }}
                  >
                    <Wrench size={13} />
                    <span>Log Repair</span>
                  </button>

                  <button
                    onClick={() => onSelectProductDetails(p)}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', color: 'var(--blue-600)', gap: '0.2rem' }}
                  >
                    <span>View Details</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
