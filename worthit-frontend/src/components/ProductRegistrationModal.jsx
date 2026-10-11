import React, { useState } from 'react';
import { X, Upload, FileText, Check, AlertCircle, Info, ShieldCheck, Loader2 } from 'lucide-react';
import { createProduct, uploadDocument } from '../services/api';

export default function ProductRegistrationModal({ isOpen, onClose, onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Electronics',
    purchaseDate: new Date().toISOString().split('T')[0],
    price: '',
    warrantyPeriod: '12',
    invoiceFileName: '',
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setFormData(prev => ({ ...prev, invoiceFileName: file.name }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.brand.trim()) errs.brand = 'Brand is required';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Please enter a valid purchase price';
    if (!formData.purchaseDate) errs.purchaseDate = 'Purchase date is required';
    if (!formData.warrantyPeriod || Number(formData.warrantyPeriod) <= 0) {
      errs.warrantyPeriod = 'Warranty period must be at least 1 month';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create product & auto-create warranty in Spring Boot / MySQL
      const created = await createProduct({
        name: formData.name.trim(),
        category: formData.category,
        brand: formData.brand.trim(),
        price: parseFloat(formData.price),
        purchaseDate: formData.purchaseDate,
        warrantyPeriod: formData.warrantyPeriod,
      });

      // 2. If invoice file uploaded, send multipart request with OCR processing
      if (uploadedFile && created.id) {
        try {
          await uploadDocument(uploadedFile, created.id, 'INVOICE');
        } catch (uploadErr) {
          console.warn('Document upload warning:', uploadErr);
        }
      }

      onAddProduct(created);
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to register product in MySQL.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
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
          <div>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', margin: 0 }}>
              Register New Product &amp; Warranty
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
              Add purchase details and upload invoice for automated warranty tracking
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Live MySQL Database Status Banner */}
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--success-bg)',
          borderBottom: '1px solid var(--success-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <Check size={16} color="var(--success-text)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.74rem', color: 'var(--success-text)', lineHeight: 1.4 }}>
            <strong>Direct MySQL Database Persistence:</strong> Automatically creates <code>products</code> and <code>warranties</code> rows, calculating the exact expiration countdown.
          </div>
        </div>

        {serverError && (
          <div style={{
            margin: '1rem 1.5rem 0 1.5rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--danger-text)',
            fontSize: '0.76rem'
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Row 1: Product Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Product Name *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSubmitting}
            />
            {errors.name && (
              <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.25rem' }}>
                {errors.name}
              </div>
            )}
          </div>

          {/* Row 2: Brand & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                Brand / Manufacturer *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sony, Apple, Samsung"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                disabled={isSubmitting}
              />
              {errors.brand && (
                <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.25rem' }}>
                  {errors.brand}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                Category
              </label>
              <select
                className="form-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isSubmitting}
              >
                <option value="Electronics">Electronics</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Computers & IT">Computers &amp; IT</option>
                <option value="Mobile Devices">Mobile Devices</option>
                <option value="Automotive & Vehicles">Automotive &amp; Vehicles</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 3: Purchase Date & Purchase Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                Purchase Date *
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                disabled={isSubmitting}
              />
              {errors.purchaseDate && (
                <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.25rem' }}>
                  {errors.purchaseDate}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                Purchase Price (₹ INR) *
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 29990"
                min="1"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={isSubmitting}
              />
              {errors.price && (
                <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.25rem' }}>
                  {errors.price}
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Warranty Duration */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Warranty Duration (Months) *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {['6', '12', '24', '36'].map((months) => (
                <button
                  type="button"
                  key={months}
                  disabled={isSubmitting}
                  onClick={() => setFormData({ ...formData, warrantyPeriod: months })}
                  className={`btn ${formData.warrantyPeriod === months ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                >
                  {months} Months
                </button>
              ))}
            </div>
            {errors.warrantyPeriod && (
              <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.25rem' }}>
                {errors.warrantyPeriod}
              </div>
            )}
          </div>

          {/* Row 5: Invoice File Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Invoice / Warranty Receipt (PDF or Image)
            </label>
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
              border: '2px dashed var(--blue-200)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--blue-50)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'border-color 0.2s',
              textAlign: 'center'
            }}>
              <Upload size={24} color="var(--blue-600)" style={{ marginBottom: '0.35rem' }} />
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--blue-900)' }}>
                {uploadedFile ? uploadedFile.name : 'Click to select or drag and drop invoice'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                {uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB selected` : 'Supports PDF, JPG, PNG up to 10MB (Stored in server uploads/ + OCR parsed)'}
              </div>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                disabled={isSubmitting}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '0.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--slate-100)'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', gap: '0.4rem' }}
            >
              {isSubmitting ? <Loader2 size={16} className="spin" /> : <ShieldCheck size={16} />}
              <span>{isSubmitting ? 'Saving to Database...' : 'Complete Registration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
