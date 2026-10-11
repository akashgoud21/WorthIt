import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  Clock, 
  Info,
  X
} from 'lucide-react';

import { uploadDocument } from '../services/api';

export default function DocumentsView({ products, onAddDocument }) {
  const [selectedType, setSelectedType] = useState('ALL');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    productId: products[0]?.id || '',
    type: 'INVOICE',
    fileName: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState('');

  // Flatten all documents
  const allDocs = products.flatMap(p => 
    (p.documents || []).map(d => ({
      ...d,
      productId: p.id,
      productName: p.name,
      productBrand: p.brand,
      price: p.price,
      purchaseDate: p.purchaseDate,
      warrantyMonths: p.warrantyPeriod,
    }))
  );

  const filteredDocs = allDocs.filter(d => 
    selectedType === 'ALL' ? true : d.type === selectedType
  );

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');
    setOcrSuccessMsg('');
    if (!uploadData.productId || !selectedFile) return;

    setUploading(true);
    try {
      const res = await uploadDocument(selectedFile, Number(uploadData.productId), uploadData.type);
      
      onAddDocument(Number(uploadData.productId), {
        id: res.id || Date.now(),
        fileName: res.fileName || selectedFile.name,
        fileUrl: res.fileUrl,
        type: res.type || uploadData.type,
        uploadedAt: res.uploadedAt || new Date().toISOString().split('T')[0],
        extractedData: res.extractedData,
      });

      if (res.extractedData) {
        setOcrSuccessMsg(`Document uploaded! OCR Extracted Data: ${res.extractedData}`);
      }
      setIsUploadOpen(false);
      setSelectedFile(null);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload document to server');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Live OCR Engine Notice */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--success-bg)',
        border: '1px solid var(--success-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem'
      }}>
        <Sparkles size={18} color="var(--success-text)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.76rem', color: 'var(--success-text)', lineHeight: 1.4 }}>
          <strong>Optical Character Recognition (OCR) Engine Active:</strong> <code>POST /api/documents/upload</code> saves files to <code>uploads/</code> and automatically parses price, purchase date, and warranty terms into the MySQL database.
        </div>
      </div>

      {ocrSuccessMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--blue-50)',
          border: '1px solid var(--blue-200)',
          color: 'var(--blue-800)',
          fontSize: '0.78rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} color="var(--blue-600)" />
          <span>{ocrSuccessMsg}</span>
        </div>
      )}

      {/* Filter and Upload Header */}
      <div className="card-base" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--slate-900)' }}>
              Document &amp; Invoice Vault
            </h2>
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
              Digital repository of purchase receipts and warranty certificates
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['ALL', 'INVOICE', 'WARRANTY'].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`btn ${selectedType === t ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  {t === 'ALL' ? 'All Files' : t === 'INVOICE' ? 'Invoices' : 'Warranty Cards'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.78rem', gap: '0.35rem' }}
            >
              <Upload size={15} />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: doc.type === 'INVOICE' ? 'var(--blue-50)' : '#f5f3ff',
                color: doc.type === 'INVOICE' ? 'var(--blue-600)' : '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={22} />
              </div>

              <span className={`badge ${doc.type === 'INVOICE' ? 'badge-blue' : 'badge-pending'}`} style={{ fontSize: '0.68rem' }}>
                {doc.type}
              </span>
            </div>

            <div style={{ marginTop: '0.85rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--slate-900)', wordBreak: 'break-all' }}>
                {doc.fileName}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                For {doc.productName}
              </div>
            </div>

            {/* OCR Extracted Data Pill */}
            <div style={{
              margin: '0.85rem 0',
              padding: '0.6rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--slate-50)',
              border: '1px solid var(--slate-100)',
              fontSize: '0.72rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--blue-700)', fontWeight: 600, marginBottom: '0.25rem' }}>
                <Sparkles size={12} />
                <span>OCR Extracted Metadata</span>
              </div>
              <div style={{ color: 'var(--slate-600)', lineHeight: 1.35 }}>
                Amount: <strong>₹{doc.price?.toLocaleString('en-IN')}</strong> · Date: <strong>{doc.purchaseDate}</strong>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--slate-100)',
              fontSize: '0.72rem',
              color: 'var(--slate-400)'
            }}>
              <span>Uploaded {doc.uploadedAt}</span>
              <button
                onClick={() => alert(`Previewing invoice document: ${doc.fileName}\n(Simulated file view)`)}
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem', gap: '0.3rem' }}
              >
                <Eye size={12} />
                <span>Inspect</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
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
                  Upload Document or Invoice
                </h2>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                  Attach warranty certificate or bill
                </div>
              </div>
              <button onClick={() => setIsUploadOpen(false)} className="btn btn-ghost" style={{ padding: '0.35rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Target Product *
                </label>
                <select
                  className="form-input"
                  value={uploadData.productId}
                  onChange={(e) => setUploadData({ ...uploadData, productId: e.target.value })}
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Document Type *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setUploadData({ ...uploadData, type: 'INVOICE' })}
                    className={`btn ${uploadData.type === 'INVOICE' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  >
                    Purchase Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadData({ ...uploadData, type: 'WARRANTY' })}
                    className={`btn ${uploadData.type === 'WARRANTY' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  >
                    Warranty Card
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Select File *
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="form-input"
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
                <button type="button" onClick={() => setIsUploadOpen(false)} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button type="submit" disabled={!selectedFile} className="btn btn-primary" style={{ fontSize: '0.85rem', gap: '0.4rem' }}>
                  <Upload size={15} />
                  <span>Attach Document</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
